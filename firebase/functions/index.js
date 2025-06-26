/**
 * firebase 的功能到底有甚麼?
 * 1. 回應 helius 的 webhook : 12種
 * 2. 回應 dapp端的請求
 * 3. 處理native-notify 的請求 v
 * 
 * 
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

exports.getAddress