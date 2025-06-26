require('dotenv').config();
const { Helius } = require("helius-sdk");


// TODO : 記得改網路
const helius = new Helius(process.env.HELIUS_API_KEY, {
    endpoint: "https://devnet-api.helius.xyz"
}) ;

const defaulatWebhookId = process.env.HELIUS_WEBHOOK_ID ;

const heliusOnListening = async (newAddresses, webhookID=defaulatWebhookId) => {
  try {
    await helius.appendAddressesToWebhook(webhookID, newAddresses);
    console.log("✅ listeing for new addresses:", newAddresses);
  } catch (error) {
    console.error("❌ fail to add new addresses:", error.message);
  }
};

const heliusOnRemove = async (newAddresses, webhookID=defaulatWebhookId) => {
  try {
    await helius.removeAddressesFromWebhook(webhookID, newAddresses);
    console.log("✅ remove for new addresses:", newAddresses);
  } catch (error) {
    console.error("❌ fail to remove new addresses:", error.message);
  }
};

module.exports = {
  heliusOnListening,
  heliusOnRemove
}

