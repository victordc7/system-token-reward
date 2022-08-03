const { ethers, run, network } = require("hardhat");

async function main() {
  const STRTokenFactory = await ethers.getContractFactory(
    "SystemTokensRewards"
  );
  console.log("Deploying System Tokens Rewards...");
  const systemTokensRewards = await STRTokenFactory.deploy();

  await systemTokensRewards.deployed();
  console.log(
    `Deployed System Tokens Rewards to: ${systemTokensRewards.address}`
  );

  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    await systemTokensRewards.deployTransaction.wait(6);
    await verify(systemTokensRewards.address, []);
  }
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
