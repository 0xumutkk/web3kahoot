# 🎯 Quiz Chain - World Chain Mini App

A Kahoot-like quiz game built on World Chain with World ID verification, real-time competition, and automated prize distribution.

## 🌟 Features

- **World ID Verification**: Prove you're human using zero-knowledge proofs
- **Entry Fee System**: Pay 1 USDC to join each quiz
- **Real-time Competition**: Compete with players worldwide
- **Automated Prizes**: Smart contract automatically distributes prizes
- **Live Leaderboard**: See rankings in real-time
- **Time-based Scoring**: Speed and accuracy matter
- **Secure & Transparent**: All transactions on-chain

## 🏗️ Architecture

### Smart Contract (QuizGame.sol)
- **Entry Management**: World ID verification + USDC payment
- **Scoring System**: Time-based scoring with signature verification
- **Prize Distribution**: Automatic 50/30/20 split for top 3 players
- **Platform Fees**: 10% fee for developers/DAO

### Frontend (Next.js)
- **World ID Integration**: Seamless verification flow
- **Real-time UI**: Live updates with Framer Motion
- **Wallet Integration**: MetaMask support
- **Responsive Design**: Mobile-first approach

### Backend (API Routes)
- **Proof Verification**: World ID proof validation
- **Score Signing**: Cryptographic signature generation
- **Contract Interaction**: Smart contract calls

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet
- World ID app (for verification)
- USDC tokens for entry fees

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/0xumutkk/web3kahoot.git
cd web3kahoot
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# World ID Configuration
NEXT_PUBLIC_WORLD_APP_ID=your_world_app_id
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_id

# Smart Contract Configuration
CONTRACT_ADDRESS=deployed_contract_address
WORLD_ID_CONTRACT=world_id_contract_address
USDC_TOKEN_ADDRESS=usdc_token_address

# Blockchain Configuration
RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
```

4. **Deploy smart contract**
```bash
npx hardhat compile
npx hardhat run scripts/deploy.ts --network mumbai
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to start playing!

## 🎮 How to Play

### 1. Connect Wallet
- Click "Connect Wallet" to connect your MetaMask
- Ensure you have USDC tokens for entry fees

### 2. Verify Humanity
- Click "Verify with World ID"
- Complete the World ID verification process
- This proves you're human using zero-knowledge proofs

### 3. Join Quiz
- Pay 1 USDC entry fee
- Wait for other players to join
- Quiz starts automatically when ready

### 4. Answer Questions
- Answer 10-20 questions within time limits
- Speed and accuracy determine your score
- Watch the live leaderboard

### 5. Win Prizes
- Top 3 players win USDC prizes
- Prizes distributed automatically
- 50% for 1st, 30% for 2nd, 20% for 3rd

## 🔧 Technical Details

### Smart Contract Functions

```solidity
// Join a quiz game
function enterGame(
    uint256 gameId,
    uint256 root,
    uint256 nullifierHash,
    uint256[8] calldata proof
) external

// Submit quiz answers
function submitAnswers(
    uint256 gameId,
    uint256 score,
    uint256 finishTime,
    bytes calldata signature
) external

// Finish game and distribute prizes
function finishGame(uint256 gameId) external
```

### Scoring Algorithm
```
Score = Correct Answers × 100 + Time Bonus
Time Bonus = (Time Remaining / Time Limit) × 100
```

### Prize Distribution
- **1st Place**: 50% of prize pool
- **2nd Place**: 30% of prize pool  
- **3rd Place**: 20% of prize pool
- **Platform Fee**: 10% (developer/DAO)

## 🛠️ Development

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── quiz/              # Quiz page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── contracts/             # Smart contracts
│   └── QuizGame.sol       # Main contract
├── lib/                   # Utilities
│   └── contract.ts        # Contract interactions
├── hooks/                 # Custom hooks
│   └── useWallet.ts       # Wallet management
└── scripts/               # Deployment scripts
    └── deploy.ts          # Contract deployment
```

### Key Components

#### World ID Integration
```typescript
<IDKitWidget
  app_id={process.env.NEXT_PUBLIC_WORLD_APP_ID}
  action="quiz_verification"
  signal={account}
  onSuccess={handleVerify}
>
  {({ open }) => <button onClick={open}>Verify</button>}
</IDKitWidget>
```

#### Contract Interaction
```typescript
const contract = new QuizGameContract(address, signer)
await contract.enterGame(gameId, root, nullifierHash, proof)
```

### Testing

```bash
# Run smart contract tests
npx hardhat test

# Run frontend tests
npm run test

# Run e2e tests
npm run test:e2e
```

## 🌐 Deployment

### Smart Contract Deployment

1. **Compile contracts**
```bash
npx hardhat compile
```

2. **Deploy to testnet**
```bash
npx hardhat run scripts/deploy.ts --network mumbai
```

3. **Deploy to mainnet**
```bash
npx hardhat run scripts/deploy.ts --network polygon
```

4. **Verify on block explorer**
```bash
npx hardhat verify --network polygon CONTRACT_ADDRESS WORLD_ID_ADDRESS USDC_ADDRESS
```

### Frontend Deployment

1. **Build for production**
```bash
npm run build
```

2. **Deploy to Vercel**
```bash
npm run deploy
```

## 🔒 Security

### Smart Contract Security
- **Reentrancy Protection**: Using OpenZeppelin's ReentrancyGuard
- **Access Control**: Owner-only functions for game management
- **Input Validation**: Comprehensive parameter checks
- **Signature Verification**: Cryptographic proof validation

### Frontend Security
- **World ID Verification**: Zero-knowledge proof validation
- **Wallet Integration**: Secure MetaMask integration
- **API Security**: Rate limiting and input sanitization

## 📊 Analytics & Monitoring

### Smart Contract Events
```solidity
event GameStarted(uint256 indexed gameId, uint256 startTime)
event PlayerJoined(uint256 indexed gameId, address indexed player)
event AnswerSubmitted(uint256 indexed gameId, address indexed player, uint256 score, uint256 finishTime)
event GameFinished(uint256 indexed gameId, address[] winners, uint256[] prizes)
```

### Key Metrics
- Total games played
- Total prize pools distributed
- Average players per game
- World ID verification success rate

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [World Chain Docs](https://docs.world.org/minikit)
- **Discord**: Join our community
- **Issues**: Report bugs on GitHub

## 🙏 Acknowledgments

- [World Coin](https://worldcoin.org/) for World ID
- [OpenZeppelin](https://openzeppelin.com/) for smart contract libraries
- [Next.js](https://nextjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling


