// @ts-ignore
import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  console.log("Starting a new game...");

  // Contract address
  const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  
  // Get the contract
  const QuizGame = await ethers.getContractFactory("QuizGame");
  const quizGame = QuizGame.attach(contractAddress);

  // Start a new game for category 1 (Teknoloji)
  const tx = await quizGame.startNewGame(1);
  await tx.wait();

  console.log("New game started successfully!");
  console.log("Transaction hash:", tx.hash);
  
  console.log("Game started! Players can now join.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
