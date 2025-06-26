const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { db } = require("./config/firestore") ;
const instructions = require("./service/instructions") ;

exports.healthCheck = onRequest((req, res) => {
  logger.info("healthcheck", {structuredData: true});
  res.send("Hello from Firebase!");
});


exports.instructions = instructions ;

const API_KEY = "56e5e408-6483-4b76-9a90-5a81246a5918";
const address = "EYR8PHamGh1S1PM7d7txEDzyqfGfnchMbQ6tNHMBBsfX";
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




exports.pushMessage = onRequest(async (req, res) => {
  try {
    const response = await axios.post('https://app.nativenotify.com/api/notification', {
      appId: 30818,
      appToken: "ZmwQ5lOc1tV4oM9jyMuU9J",
      title: "Push title here as a string",
      body: "Push message here as a string",
      dateSent: "6-22-2025 1:57AM",
      pushData: { yourProperty: "yourPropertyValue" }
    });

    res.status(200).send("✅ 推播已送出：" + JSON.stringify(response.data));
  } catch (err) {
    console.error("❌ 發送失敗：", err.response?.data || err.message);
    res.status(500).send("❌ 推播失敗");
  }
});


exports.pushIndieMessage = onRequest(async (req, res) => {
  try{
    const response = await axios.post(`https://app.nativenotify.com/api/indie/notification`, {
      subID: 'testdambitch',
      appId: 30818,
      appToken: 'ZmwQ5lOc1tV4oM9jyMuU9J',
      title: 'put your push notification title here as a string',
      message: 'put your push notification message here as a string'
    });

    res.status(200).send("✅ 推播已送出：" + JSON.stringify(response.data));

  }catch(error) {
    console.error("❌ 發送失敗：", err.response?.data || err.message);
    res.status(500).send("❌ 推播失敗")
  }

}) ;


exports.getUser = onRequest( async (req, res) => {
  try {
    const doc = await db.collection("address").doc("test").get();
    if (!doc.exists) {
      res.status(404).send({ error: "User not found" });
      return;
    }
    console.log(doc.data());
    res.status(200).send(doc.data());
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});



