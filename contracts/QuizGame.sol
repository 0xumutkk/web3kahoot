// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface IWorldID {
    function verifyProof(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external view returns (bool);
}

contract QuizGame is ReentrancyGuard, Ownable {
    using ECDSA for bytes32;

    IWorldID public worldId;
    IERC20 public usdcToken;
    
    uint256 public constant ENTRY_FEE = 1e6; // 1 USDC (6 decimals)
    uint256 public constant PLATFORM_FEE_PERCENT = 10; // 10%
    uint256 public constant MIN_PLAYERS = 2;
    uint256 public constant MAX_PLAYERS = 50;
    uint256 public constant QUIZ_DURATION = 300; // 5 minutes
    
    struct Player {
        address playerAddress;
        uint256 score;
        uint256 finishTime;
        bool hasSubmitted;
        bool hasWithdrawn;
    }
    
    struct Game {
        uint256 gameId;
        uint256 startTime;
        uint256 endTime;
        uint256 totalPrizePool;
        uint256 playerCount;
        bool isActive;
        bool isFinished;
        mapping(address => Player) players;
        address[] playerAddresses;
    }
    
    mapping(uint256 => Game) public games;
    mapping(uint256 => mapping(address => bool)) public nullifierHashes;
    
    uint256 public currentGameId;
    uint256 public platformFeeBalance;
    
    event GameStarted(uint256 indexed gameId, uint256 startTime);
    event PlayerJoined(uint256 indexed gameId, address indexed player);
    event AnswerSubmitted(uint256 indexed gameId, address indexed player, uint256 score, uint256 finishTime);
    event GameFinished(uint256 indexed gameId, address[] winners, uint256[] prizes);
    event PrizeWithdrawn(uint256 indexed gameId, address indexed player, uint256 amount);
    
    constructor(address _worldId, address _usdcToken) Ownable(msg.sender) {
        worldId = IWorldID(_worldId);
        usdcToken = IERC20(_usdcToken);
    }
    
    modifier gameExists(uint256 gameId) {
        require(games[gameId].gameId != 0, "Game does not exist");
        _;
    }
    
    modifier gameActive(uint256 gameId) {
        require(games[gameId].isActive && !games[gameId].isFinished, "Game is not active");
        _;
    }
    
    function startNewGame() external onlyOwner {
        currentGameId++;
        Game storage game = games[currentGameId];
        game.gameId = currentGameId;
        game.startTime = block.timestamp;
        game.endTime = block.timestamp + QUIZ_DURATION;
        game.isActive = true;
        
        emit GameStarted(currentGameId, game.startTime);
    }
    
    function enterGame(
        uint256 gameId,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external gameExists(gameId) gameActive(gameId) nonReentrant {
        Game storage game = games[gameId];
        
        require(game.playerCount < MAX_PLAYERS, "Game is full");
        require(game.players[msg.sender].playerAddress == address(0), "Already joined");
        require(!nullifierHashes[gameId][msg.sender], "Already verified");
        
        // Verify World ID proof
        require(
            worldId.verifyProof(msg.sender, root, nullifierHash, proof),
            "Invalid World ID proof"
        );
        
        // Transfer entry fee
        require(
            usdcToken.transferFrom(msg.sender, address(this), ENTRY_FEE),
            "Entry fee transfer failed"
        );
        
        // Add player to game
        game.players[msg.sender] = Player({
            playerAddress: msg.sender,
            score: 0,
            finishTime: 0,
            hasSubmitted: false,
            hasWithdrawn: false
        });
        
        game.playerAddresses.push(msg.sender);
        game.playerCount++;
        game.totalPrizePool += ENTRY_FEE;
        
        nullifierHashes[gameId][msg.sender] = true;
        
        emit PlayerJoined(gameId, msg.sender);
    }
    
    function submitAnswers(
        uint256 gameId,
        uint256 score,
        uint256 finishTime,
        bytes calldata signature
    ) external gameExists(gameId) gameActive(gameId) {
        Game storage game = games[gameId];
        Player storage player = game.players[msg.sender];
        
        require(player.playerAddress != address(0), "Not a player");
        require(!player.hasSubmitted, "Already submitted");
        require(block.timestamp <= game.endTime, "Game ended");
        
        // Verify signature from backend
        bytes32 messageHash = keccak256(abi.encodePacked(gameId, msg.sender, score, finishTime));
        address signer = ECDSA.recover(messageHash, signature);
        require(signer == owner(), "Invalid signature");
        
        player.score = score;
        player.finishTime = finishTime;
        player.hasSubmitted = true;
        
        emit AnswerSubmitted(gameId, msg.sender, score, finishTime);
    }
    
    function finishGame(uint256 gameId) external onlyOwner gameExists(gameId) {
        Game storage game = games[gameId];
        require(game.isActive && !game.isFinished, "Game already finished");
        require(block.timestamp > game.endTime, "Game still active");
        require(game.playerCount >= MIN_PLAYERS, "Not enough players");
        
        game.isActive = false;
        game.isFinished = true;
        
        // Calculate platform fee
        uint256 platformFee = (game.totalPrizePool * PLATFORM_FEE_PERCENT) / 100;
        uint256 prizePool = game.totalPrizePool - platformFee;
        platformFeeBalance += platformFee;
        
        // Sort players by score and time
        address[] memory sortedPlayers = _sortPlayers(gameId);
        
        // Calculate prizes
        uint256[] memory prizes = new uint256[](3);
        address[] memory winners = new address[](3);
        
        if (sortedPlayers.length >= 1) {
            winners[0] = sortedPlayers[0];
            prizes[0] = (prizePool * 50) / 100; // 50%
        }
        
        if (sortedPlayers.length >= 2) {
            winners[1] = sortedPlayers[1];
            prizes[1] = (prizePool * 30) / 100; // 30%
        }
        
        if (sortedPlayers.length >= 3) {
            winners[2] = sortedPlayers[2];
            prizes[2] = (prizePool * 20) / 100; // 20%
        }
        
        // Distribute prizes
        for (uint256 i = 0; i < 3; i++) {
            if (winners[i] != address(0) && prizes[i] > 0) {
                game.players[winners[i]].hasWithdrawn = true;
                usdcToken.transfer(winners[i], prizes[i]);
                emit PrizeWithdrawn(gameId, winners[i], prizes[i]);
            }
        }
        
        emit GameFinished(gameId, winners, prizes);
    }
    
    function withdrawPlatformFees() external onlyOwner {
        require(platformFeeBalance > 0, "No fees to withdraw");
        uint256 amount = platformFeeBalance;
        platformFeeBalance = 0;
        usdcToken.transfer(owner(), amount);
    }
    
    function _sortPlayers(uint256 gameId) internal view returns (address[] memory) {
        Game storage game = games[gameId];
        address[] memory players = game.playerAddresses;
        
        // Simple bubble sort (for small arrays)
        for (uint256 i = 0; i < players.length; i++) {
            for (uint256 j = i + 1; j < players.length; j++) {
                Player memory player1 = game.players[players[i]];
                Player memory player2 = game.players[players[j]];
                
                if (player1.score < player2.score || 
                    (player1.score == player2.score && player1.finishTime > player2.finishTime)) {
                    address temp = players[i];
                    players[i] = players[j];
                    players[j] = temp;
                }
            }
        }
        
        return players;
    }
    
    function getGameInfo(uint256 gameId) external view gameExists(gameId) returns (
        uint256 startTime,
        uint256 endTime,
        uint256 totalPrizePool,
        uint256 playerCount,
        bool isActive,
        bool isFinished
    ) {
        Game storage game = games[gameId];
        return (
            game.startTime,
            game.endTime,
            game.totalPrizePool,
            game.playerCount,
            game.isActive,
            game.isFinished
        );
    }
    
    function getPlayerInfo(uint256 gameId, address player) external view gameExists(gameId) returns (
        uint256 score,
        uint256 finishTime,
        bool hasSubmitted,
        bool hasWithdrawn
    ) {
        Player storage playerInfo = games[gameId].players[player];
        return (
            playerInfo.score,
            playerInfo.finishTime,
            playerInfo.hasSubmitted,
            playerInfo.hasWithdrawn
        );
    }
    
    function getPlayerAddresses(uint256 gameId) external view gameExists(gameId) returns (address[] memory) {
        return games[gameId].playerAddresses;
    }
}
