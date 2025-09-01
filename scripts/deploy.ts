// @ts-ignore
import pkg from 'hardhat';
const { ethers } = pkg;

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
  console.log(`QuizGame address: ${quizGameAddress}`);
  console.log(`World ID contract: ${worldIdAddress}`);
  console.log(`Entry fee: 0.002 ETH`);

  // Save deployment info
  const deploymentInfo = {
    network: "deployed",
    contractAddress: quizGameAddress,
    worldIdAddress: worldIdAddress,
    deployer: await (await ethers.provider.getSigner()).getAddress(),
    timestamp: new Date().toISOString(),
  };

  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
