// @ts-ignore
import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function main() {
  console.log("Deploying QuizGame contract...");

  // Get the QuizGame contract factory
  const QuizGame = await ethers.getContractFactory("QuizGame");

  // World ID contract addresses (these would be different for each network)
  const worldIdAddress = process.env.WORLD_ID_CONTRACT || "0x1234567890123456789012345678901234567890";

  // Deploy the QuizGame contract (ETH payments)
  const quizGame = await QuizGame.deploy(worldIdAddress);
  await quizGame.waitForDeployment();
  const quizGameAddress = await quizGame.getAddress();
  console.log(`QuizGame deployed to: ${quizGameAddress}`);

  console.log("Deployment completed successfully!");
  
  // Save the contract address to a file in the lib directory
  const deploymentInfo = {
    contractAddress: quizGameAddress
  };
  
  // ES Module-safe way to get the directory name
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(__dirname, '..', 'lib', 'contract-address.json');
  fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));

  console.log(`Contract address saved to ${filePath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
