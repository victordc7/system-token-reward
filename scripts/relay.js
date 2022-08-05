const { RelayClient } = require("defender-relay-client");
require("dotenv").config();

const client = new RelayClient({
  apiKey: process.env.DEFENDER_API_KEY,
  apiSecret: process.env.DEFENDER_SECRET_KEY,
});

const requestParams = {
  name: "STR Relay",
  network: "rinkeby",
  minBalance: BigInt(1e17).toString(),
};

async function createRelay() {
  try {
    console.log("Creating relay...");
    const strRelay = await client.create(requestParams);
    console.log(`Relay created ${strRelay.relayerId} ${strRelay.address}`);
    // const srtRelayKeys = await client.createKey(strRelay.relayerId);
    // console.log("Relay keys created");
    return {
      relay: strRelay,
      relayKey: srtRelayKeys,
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = { createRelay };
