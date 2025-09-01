# Quiz Chain - World Chain Mini App

A Kahoot-like quiz game built on World Chain with World ID verification, featuring both TEXT and IMAGE_REVEAL quiz types.

## 🌟 Features

### Quiz Types
- **TEXT Questions**: Traditional multiple-choice questions
- **IMAGE_REVEAL Questions**: Blur-to-sharp reveal over time with scoring based on timing and accuracy

### Categories
8 different categories with both quiz types:
- Technology, Science, History, Geography, Entertainment, Sports, Business, General Culture

### World ID Integration
- **Real World ID Verification**: When running inside World App
- **Demo Mode**: When running outside World App
- **Optional Verification**: Users can play without verification
- **MiniKit-JS SDK**: Official World ID integration

### Blockchain Features
- **Hardhat Integration**: Local Ethereum development
- **Smart Contract**: QuizGame.sol with quiz type support
- **MetaMask Wallet**: Connect and pay entry fees
- **Real-time Prizes**: ETH rewards for winners

### Real-time Features
- **Socket.IO**: Real-time multiplayer communication
- **Live Leaderboards**: Real-time scoring and rankings
- **Game State Sync**: Synchronized game flow across players

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask browser extension
- World App (for real World ID verification)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd kahoot
npm install
```

2. **Set up environment variables:**
```bash
cp env.example .env.local
# Edit .env.local with your configuration
```

3. **Start Hardhat node:**
```bash
npx hardhat node
```

4. **Deploy smart contract:**
```bash
npm run compile
npx hardhat run scripts/deploy.ts --network localhost
```

5. **Start the application:**
```bash
# Terminal 1: Next.js app
npm run dev

# Terminal 2: Socket.IO server
npm run socket-server

# Terminal 3: ngrok for public access (optional)
ngrok http 3000
```

## 🌐 World ID Integration

### Overview
This application integrates with World ID using the official [MiniKit-JS SDK](https://docs.world.org/mini-apps/quick-start/installing) for proof-of-personhood verification.

### How It Works

#### Inside World App
When the application runs inside World App:
1. **MiniKit Detection**: Automatically detects World App environment
2. **Real Verification**: Uses actual World ID proof-of-personhood
3. **Zero-Knowledge Proofs**: Verifies human identity without revealing personal data
4. **Credential Types**: Supports ORB and other credential types

#### Outside World App (Demo Mode)
When running in a regular browser:
1. **Demo Verification**: Simulates World ID verification process
2. **Mock Data**: Provides realistic verification data for testing
3. **Same UI**: Maintains consistent user experience
4. **Clear Indication**: Shows "Demo Mode" status

### Implementation Details

#### MiniKit Provider Setup
```tsx
// app/layout.tsx
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <MiniKitProvider>
        <body>{children}</body>
      </MiniKitProvider>
    </html>
  )
}
```

#### World ID Hook
```tsx
// hooks/useWorldId.ts
import { MiniKit } from '@worldcoin/minikit-js'

export const useWorldId = () => {
  const [isInstalled, setIsInstalled] = useState(false)
  
  useEffect(() => {
    const checkInstallation = () => {
      const installed = MiniKit.isInstalled()
      setIsInstalled(installed)
    }
    // Check periodically
  }, [])
  
  // Verification logic
}
```

#### Verification Process
1. **Check Environment**: Detect if running in World App
2. **Trigger Verification**: Use MiniKit commands for real verification
3. **Handle Response**: Process verification results
4. **Update UI**: Show verification status and data

### World ID Commands

#### Verify Command
```tsx
// Real World ID verification
await MiniKit.commandsAsync.verify({
  action: 'quiz_verification',
  signal: 'user_quiz_participation'
})
```

#### Event Handling
```tsx
// Subscribe to verification events
MiniKit.subscribe('MiniAppVerify', (response) => {
  if (response.status === 'success') {
    // Handle successful verification
  }
})
```

### Configuration

#### Environment Variables
```env
# World ID Configuration
NEXT_PUBLIC_WORLD_ID_APP_ID=your_app_id
NEXT_PUBLIC_WORLD_ID_ACTION=quiz_verification
NEXT_PUBLIC_WORLD_ID_SIGNAL=user_quiz_participation
```

#### Package Dependencies
```json
{
  "@worldcoin/minikit-js": "^1.9.6",
  "@worldcoin/idkit": "^0.5.1"
}
```

## 🎮 Game Flow

### 1. Connect Wallet
- Connect MetaMask to Hardhat network
- Verify wallet connection status

### 2. World ID Verification (Optional)
- **Inside World App**: Real verification with zero-knowledge proofs
- **Outside World App**: Demo verification for testing
- Verification is optional - users can play without it

### 3. Select Category & Quiz Type
- Choose from 8 categories
- Select TEXT or IMAGE_REVEAL quiz type
- View category details and prize pools

### 4. Pay Entry Fee
- Pay 0.001 ETH entry fee
- Transaction processed on Hardhat network
- Smart contract integration

### 5. Join Game Lobby
- Real-time player count
- Wait for game to start
- Chat with other players

### 6. Play Quiz
- **TEXT**: Traditional multiple-choice questions
- **IMAGE_REVEAL**: Blur-to-sharp reveal with timing-based scoring
- Real-time leaderboard updates

### 7. Win Prizes
- ETH prizes distributed automatically
- Smart contract handles payouts
- Winner verification

## 🏗️ Architecture

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations

### Backend
- **Socket.IO**: Real-time communication
- **Node.js**: Server-side logic
- **Hardhat**: Ethereum development environment

### Smart Contract
- **Solidity**: Smart contract language
- **QuizGame.sol**: Main game contract
- **Quiz Types**: Support for TEXT and IMAGE_REVEAL
- **Prize Distribution**: Automated ETH payouts

### World ID Integration
- **MiniKit-JS**: Official World ID SDK
- **Proof-of-Personhood**: Zero-knowledge verification
- **Credential Types**: ORB and other types
- **Demo Mode**: Fallback for testing

## 🔧 Development

### Project Structure
```
kahoot/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── categories/        # Category selection
│   ├── lobby/            # Game lobby
│   └── quiz/             # Quiz gameplay
├── components/            # React components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and contracts
├── server/               # Socket.IO server
├── contracts/            # Smart contracts
└── scripts/              # Deployment scripts
```

### Key Files
- `hooks/useWorldId.ts`: World ID integration hook
- `lib/contract.ts`: Smart contract interactions
- `server/socket-server.js`: Real-time server
- `contracts/QuizGame.sol`: Main game contract

### Development Commands
```bash
# Development
npm run dev              # Start Next.js
npm run socket-server    # Start Socket.IO server

# Smart Contract
npm run compile          # Compile contracts
npx hardhat test         # Run tests
npx hardhat node         # Start local node

# Build & Deploy
npm run build            # Build for production
npm start                # Start production server
```

## 🌍 Deployment

### Local Development
1. Start Hardhat node
2. Deploy smart contract
3. Start Next.js and Socket.IO servers
4. Use ngrok for public access

### Production Deployment
1. Deploy smart contract to target network
2. Update contract addresses
3. Deploy Next.js app
4. Configure environment variables

### World App Integration
1. Register mini app in World Developer Portal
2. Configure World ID settings
3. Test inside World App
4. Submit for review

## 📚 Resources

### World ID Documentation
- [Mini Apps Quick Start](https://docs.world.org/mini-apps/quick-start/installing)
- [World ID Commands](https://docs.world.org/mini-apps/commands/verify)
- [MiniKit-JS SDK](https://docs.world.org/mini-apps/quick-start/installing)

### Technology Stack
- [Next.js Documentation](https://nextjs.org/docs)
- [Socket.IO Documentation](https://socket.io/docs)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For World ID integration issues:
- Check [World Documentation](https://docs.world.org)
- Join [World Discord](https://discord.gg/worldcoin)
- Review [World ID Examples](https://github.com/worldcoin/world-id-examples)

For general application issues:
- Check the documentation
- Review the code
- Open an issue on GitHub


