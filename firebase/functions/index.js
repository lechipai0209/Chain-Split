/**
 * firebase 的功能到底有甚麼?
 * 1. 回應 helius 的 webhook : 12種
 * 2. 回應 dapp端的請求
 * 3. 處理native-notify 的請求 v
 * 
 * 
 */

const {onRequest} = require("firebase-functions/v2/https"); // 預設任何人可以訪問
// const logger = require("firebase-functions/logger");


const instructions = require("./service/instructions") ;

const functions = require("firebase-functions");

exports.instructions = instructions ;

// 定義一個 HTTP function
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.test = onRequest(async (req, res) => {
  res.status(200).send({ message: "OK" });
});