// @ts-ignore
import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  console.log("Checking balances...");

  // Contract address
  const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  
  // Get the contract
  const QuizGame = await ethers.getContractFactory("QuizGame");
  const quizGame = QuizGame.attach(contractAddress);

  // Get contract owner
  const owner = await quizGame.owner();
  console.log(`Contract Owner: ${owner}`);

  // Get contract balance
  const contractBalance = await ethers.provider.getBalance(contractAddress);
  console.log(`Contract Balance: ${ethers.formatEther(contractBalance)} ETH`);

  // Get owner balance
  const ownerBalance = await ethers.provider.getBalance(owner);
  console.log(`Owner Balance: ${ethers.formatEther(ownerBalance)} ETH`);

  // Get platform fees (if function exists)
  try {
    const platformFees = await quizGame.platformFees();
    console.log(`Platform Fees: ${ethers.formatEther(platformFees)} ETH`);
  } catch (error) {
    console.log(`Platform Fees: Function not available`);
  }

  // Get current game info
  try {
    const currentGameId = await quizGame.currentGameId();
    console.log(`Current Game ID: ${currentGameId}`);
    
    const gameInfo = await quizGame.games(currentGameId);
    console.log(`Game Info:`, {
      entryFee: ethers.formatEther(gameInfo.entryFee),
      totalEntries: gameInfo.totalEntries.toString(),
      isActive: gameInfo.isActive,
      startTime: new Date(Number(gameInfo.startTime) * 1000).toLocaleString()
    });
  } catch (error) {
    console.log("Could not get game info:", error.message);
  }

  console.log("\n💰 Fee Summary:");
  console.log(`- Your payment: 0.1 ETH`);
  console.log(`- Contract holds: ${ethers.formatEther(contractBalance)} ETH`);
  console.log(`- Platform fees: Function not available`);
  console.log(`- Prize pool: ${ethers.formatEther(contractBalance)} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
