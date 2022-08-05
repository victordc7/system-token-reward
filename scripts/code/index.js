const { ethers } = require("ethers");
const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/ethers');
require("dotenv").config();
const participants = process.env.PARTICIPANTS.split(",");

// TODO: ABI
const ERC20_ABI = ["function mint(address to, uint256 amount) public"];

// Main function, exported separately for testing
exports.main = async function(signer, recipient, contractAddress) {
  // Create contract instance from the relayer signer
  const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer);

  // Mint and send funds to recipient
  const tx = await contract.mint(recipient, 10);
  console.log(`Transferred 10SRT to ${recipient}`);
  return tx;

}

// Entrypoint for the Autotask
exports.handler = async function(credentials) {
  // Initialize defender relayer provider and signer
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });
  const contractAddress = '???????';
  for (let index = 0; index < participants.length; index++) {
    const recipient =  participants[index];
    return exports.main(signer, recipient, contractAddress); 
  }
}

// To run locally (this code will not be executed in Autotasks)
if (require.main === module) {
  const { RELAY_API_KEY: apiKey, RELAY_API_SECRET: apiSecret } = process.env;
  exports.handler({ apiKey, apiSecret })
    .then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}
