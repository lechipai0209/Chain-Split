const {onRequest} = require("firebase-functions/v2/https");
const axios = require("axios");
const addListen = onRequest(async (req, res) => {
    console.log(req.body);
    res.status(200).send("✅ Webhook received");
});


module.exports = addListen ;