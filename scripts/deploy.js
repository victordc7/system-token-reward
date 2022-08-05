const { ethers, run, network } = require("hardhat");
const { AdminClient } = require("defender-admin-client");
import {createRelay} from "./relay";
require("dotenv").config();

async function main() {
  const contract = await deployContract();
  if (contract != null) {
    await uploadContractToDefender("SystemTokensRewards", contract);
  }
  const relayData = createRelay();
}

async function deployContract() {
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
    console.log("Waiting 6 blocks...");
    await systemTokensRewards.deployTransaction.wait(6);
    await verify(systemTokensRewards.address, []);
  }

  return systemTokensRewards;
}

async function uploadContractToDefender(name, contract) {
  console.log("Uploading contract to Defender....");
  console.log(`Contract Address: ${contract.address}`);
  const client = new AdminClient({
    apiKey: process.env.DEFENDER_API_KEY,
    apiSecret: process.env.DEFENDER_SECRET_KEY,
  });

  try {
    await client.addContract({
      network: "rinkeby",
      address: contract.address,
      name: name,
      // abi: '[...]',
    });
    console.log("Contract uploaded to defender!!!");
  } catch (e) {
    console.log(e);
  }
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    console.log("Contract correctly verified!");
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
