const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

exports.helloFireStore = onRequest(async (req, res) => {
  const doc = await db.collection("test").doc("mydoc").get();
  if (!doc.exists) {
    res.send("No such document !");
  } else {
    res.send(doc.data());
  }
});

exports.test = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});


const API_KEY = "56e5e408-6483-4b76-9a90-5a81246a5918";
const address = "EotpYAoc7dokSnzuKosXJ41yMM9Ba9dS1ErQhG4EFHRQ";
const signatures = ["nwTfzXV8LrRGLPwy31J9vLtNU8w36cjusKHYGGT4LzEpT4hZFaePe8Tn5eHTp6v9e2N3EUzabJcuGW5GnMJNtKx"];

exports.getAddress = onRequest(async (req, res) => {
  try {
    const allTxns = [];
    let before;
    while (true) {
      const url = `https://api-devnet.helius.xyz/v0/addresses/${address}/transactions?api-key=${API_KEY}` +
        (before ? `&before=${before}` : "");

      const response = await axios.get(url);
      const data = response.data;
      if (!data || data.length === 0) break;
      allTxns.push(...data);
      before = data[data.length - 1].signature;
    }
    return res.json({total: allTxns.length, data: allTxns});
  } catch (error) {
    return res.status(500).json({error: "抓取失敗"});
  }
});

exports.getTransactions = onRequest(async (req, res) => {
  try {
    const url = `https://api-devnet.helius.xyz/v0/transactions?api-key=${API_KEY}`;
    const response = await axios.post(url, {transactions: signatures}, {
      headers: {"Content-Type": "application/json"},
    });
    const data = response.data;
    return res.json(data);
  } catch (error) {
    return res.status(500).json({error: `抓取失敗, ${error.message}`});
  }
});


exports.heliousWebhook = onRequest(async (req, res) => {
  console.log(req.body);
});


// const options = {
//   method: 'POST',
//   headers: {'Content-Type': 'application/json'},
//   body: `{
//     "webhookURL":"https://us-central1-monkeytank.cloudfunctions.net/heliousWebhook",
//     "transactionTypes":[],
//     "webhookType":"raw",
//     "accountAddresses":["EotpYAoc7dokSnzuKosXJ41yMM9Ba9dS1ErQhG4EFHRQ"]}
//   `
// };

// fetch('https://api.helius.xyz/v0/webhooks?api-key=56e5e408-6483-4b76-9a90-5a81246a5918', options)
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err));

