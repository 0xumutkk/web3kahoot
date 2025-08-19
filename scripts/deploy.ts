import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  console.log("Deploying QuizGame contract...");

  // Get the contract factory
  const QuizGame = await ethers.getContractFactory("QuizGame");

  // World ID contract addresses (these would be different for each network)
  const worldIdAddress = process.env.WORLD_ID_CONTRACT || "0x1234567890123456789012345678901234567890";
  const usdcAddress = process.env.USDC_TOKEN_ADDRESS || "0x1234567890123456789012345678901234567890";

  // Deploy the contract
  const quizGame = await QuizGame.deploy(worldIdAddress, usdcAddress);

  await quizGame.waitForDeployment();

  const address = await quizGame.getAddress();
  console.log(`QuizGame deployed to: ${address}`);

  // Skip waiting for confirmations in local development
  console.log("Deployment transaction completed");

  console.log("Deployment completed successfully!");
  console.log(`Contract address: ${address}`);
  console.log(`World ID contract: ${worldIdAddress}`);
  console.log(`USDC token: ${usdcAddress}`);

  // Save deployment info
  const deploymentInfo = {
    network: "deployed",
    contractAddress: address,
    worldIdAddress: worldIdAddress,
    usdcAddress: usdcAddress,
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
