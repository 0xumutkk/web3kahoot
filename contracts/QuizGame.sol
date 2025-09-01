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
    
    uint256 public constant ENTRY_FEE = 0.002 ether; // 0.002 ETH entry fee
    uint256 public constant PLATFORM_FEE_PERCENT = 10; // 10%
    uint256 public constant MIN_PLAYERS = 2; // Test için 2 kişi yeterli
    uint256 public constant MAX_PLAYERS = 20; // Maksimum 20 kişi
    uint256 public constant QUIZ_DURATION = 300; // 5 minutes
    uint256 public constant ROOM_WAIT_TIME = 300; // 5 dakika bekleme süresi
    
    // Quiz types
    enum QuizType { TEXT, IMAGE_REVEAL }
    
    struct Player {
        address playerAddress;
        uint256 score;
        uint256 finishTime;
        bool hasSubmitted;
        bool hasWithdrawn;
        QuizType preferredQuizType; // Player's preferred quiz type
    }
    
    struct Category {
        uint256 categoryId;
        string name;
        bool isActive;
        uint256 questionCount;
        bool supportsImageReveal; // Whether this category supports IMAGE_REVEAL
    }
    
    struct Game {
        uint256 gameId;
        uint256 categoryId;
        QuizType quizType; // The quiz type for this game
        uint256 startTime;
        uint256 endTime;
        uint256 totalPrizePool;
        uint256 playerCount;
        bool isActive;
        bool isFinished;
        bool isStarted;
        mapping(address => Player) players;
        address[] playerAddresses;
    }
    
    mapping(uint256 => Game) public games;
    mapping(uint256 => Category) public categories;
    mapping(uint256 => mapping(address => bool)) public nullifierHashes;
    
    uint256 public currentGameId;
    uint256 public currentCategoryId;
    uint256 public platformFeeBalance;
    
    event GameStarted(uint256 indexed gameId, uint256 startTime, QuizType quizType);
    event QuizStarted(uint256 indexed gameId, uint256 startTime);
    event PlayerJoined(uint256 indexed gameId, address indexed player, QuizType preferredQuizType);
    event AnswerSubmitted(uint256 indexed gameId, address indexed player, uint256 score, uint256 finishTime);
    event GameFinished(uint256 indexed gameId, address[] winners, uint256[] prizes);
    event PrizeWithdrawn(uint256 indexed gameId, address indexed player, uint256 amount);
    
    constructor(address _worldId) Ownable(msg.sender) {
        worldId = IWorldID(_worldId);
        
        // Initialize categories with IMAGE_REVEAL support
        _addCategory("Technology", 10, true);
        _addCategory("Science", 10, true);
        _addCategory("History", 10, true);
        _addCategory("Geography", 10, true);
        _addCategory("Entertainment", 10, true);
        _addCategory("Gaming", 10, true);
        _addCategory("Art & Design", 10, true);
        _addCategory("Sports", 10, true);
    }
    
    modifier gameExists(uint256 gameId) {
        require(games[gameId].gameId != 0, "Game does not exist");
        _;
    }
    
    modifier gameActive(uint256 gameId) {
        require(games[gameId].isActive && !games[gameId].isFinished, "Game is not active");
        _;
    }
    
    function _addCategory(string memory name, uint256 questionCount, bool supportsImageReveal) internal {
        currentCategoryId++;
        categories[currentCategoryId] = Category({
            categoryId: currentCategoryId,
            name: name,
            isActive: true,
            questionCount: questionCount,
            supportsImageReveal: supportsImageReveal
        });
    }
    
    function startNewGame(uint256 categoryId, QuizType quizType) external onlyOwner {
        require(categories[categoryId].isActive, "Category not active");
        require(
            quizType == QuizType.TEXT || 
            (quizType == QuizType.IMAGE_REVEAL && categories[categoryId].supportsImageReveal),
            "Quiz type not supported for this category"
        );
        
        currentGameId++;
        Game storage game = games[currentGameId];
        game.gameId = currentGameId;
        game.categoryId = categoryId;
        game.quizType = quizType;
        game.startTime = block.timestamp;
        game.endTime = block.timestamp + ROOM_WAIT_TIME; // Başlangıçta bekleme süresi
        game.isActive = true;
        game.isStarted = false;
        
        emit GameStarted(currentGameId, game.startTime, quizType);
    }
    
    function enterGame(
        uint256 gameId,
        QuizType preferredQuizType,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external payable gameExists(gameId) gameActive(gameId) nonReentrant {
        Game storage game = games[gameId];
        
        require(!game.isStarted, "Game already started");
        require(game.playerCount < MAX_PLAYERS, "Game is full");
        require(game.players[msg.sender].playerAddress == address(0), "Already joined");
        require(!nullifierHashes[gameId][msg.sender], "Already verified");
        
        // Verify World ID proof (bypass for local testing)
        // require(
        //     worldId.verifyProof(msg.sender, root, nullifierHash, proof),
        //     "Invalid World ID proof"
        // );
        
        // Transfer entry fee in ETH
        require(msg.value == ENTRY_FEE, "Incorrect entry fee amount");
        
        // Add player to game
        game.players[msg.sender] = Player({
            playerAddress: msg.sender,
            score: 0,
            finishTime: 0,
            hasSubmitted: false,
            hasWithdrawn: false,
            preferredQuizType: preferredQuizType
        });
        
        game.playerAddresses.push(msg.sender);
        game.playerCount++;
        game.totalPrizePool += ENTRY_FEE;
        
        nullifierHashes[gameId][msg.sender] = true;
        
        emit PlayerJoined(gameId, msg.sender, preferredQuizType);
        
        // Check if enough players joined to start the game
        if (game.playerCount >= MIN_PLAYERS) {
            _startQuiz(gameId);
        }
    }
    
    function _startQuiz(uint256 gameId) internal {
        Game storage game = games[gameId];
        game.isStarted = true;
        game.startTime = block.timestamp;
        game.endTime = block.timestamp + QUIZ_DURATION;
        
        emit QuizStarted(gameId, game.startTime);
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
        
        // Distribute prizes in ETH
        for (uint256 i = 0; i < 3; i++) {
            if (winners[i] != address(0) && prizes[i] > 0) {
                game.players[winners[i]].hasWithdrawn = true;
                payable(winners[i]).transfer(prizes[i]);
                emit PrizeWithdrawn(gameId, winners[i], prizes[i]);
            }
        }
        
        emit GameFinished(gameId, winners, prizes);
    }
    
    function withdrawPlatformFees() external onlyOwner {
        require(platformFeeBalance > 0, "No fees to withdraw");
        uint256 amount = platformFeeBalance;
        platformFeeBalance = 0;
        payable(owner()).transfer(amount);
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
        bool isFinished,
        QuizType quizType,
        uint256 categoryId
    ) {
        Game storage game = games[gameId];
        return (
            game.startTime,
            game.endTime,
            game.totalPrizePool,
            game.playerCount,
            game.isActive,
            game.isFinished,
            game.quizType,
            game.categoryId
        );
    }
    
    function getPlayerInfo(uint256 gameId, address player) external view gameExists(gameId) returns (
        uint256 score,
        uint256 finishTime,
        bool hasSubmitted,
        bool hasWithdrawn,
        QuizType preferredQuizType
    ) {
        Player storage playerInfo = games[gameId].players[player];
        return (
            playerInfo.score,
            playerInfo.finishTime,
            playerInfo.hasSubmitted,
            playerInfo.hasWithdrawn,
            playerInfo.preferredQuizType
        );
    }
    
    function getPlayerAddresses(uint256 gameId) external view gameExists(gameId) returns (address[] memory) {
        return games[gameId].playerAddresses;
    }
    
    function getCategoryInfo(uint256 categoryId) external view returns (
        string memory name,
        bool isActive,
        uint256 questionCount,
        bool supportsImageReveal
    ) {
        Category storage category = categories[categoryId];
        return (
            category.name,
            category.isActive,
            category.questionCount,
            category.supportsImageReveal
        );
    }
    
    function getCategoryCount() external view returns (uint256) {
        return currentCategoryId;
    }
    
    // Basit entry fee ödeme fonksiyonu
    function payEntryFee(uint256 categoryId) external payable {
        require(categories[categoryId].isActive, "Category not active");
        require(msg.value == ENTRY_FEE, "Incorrect entry fee amount");
        
        // Entry fee'yi contract'a al
        // Bu fonksiyon sadece fee alır, oyun başlatmaz
        emit PlayerJoined(0, msg.sender, QuizType.TEXT); // Event log için
    }
}
