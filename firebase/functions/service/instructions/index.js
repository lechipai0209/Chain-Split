const { Connection, clusterApiUrl } = require("@solana/web3.js");
const { EventParser, BorshCoder } = require("@project-serum/anchor");
const  idl = require( "../../contract.json");
const { onRequest } = require("firebase-functions/v2/https") ;
const GroupCreatedEvent = require("./group_created_event.js") ;
const MemberJoinedEvent = require("./member_joined_event.js") ;
const GroupMemberRemovedEvent = require("./group_member_removed_event.js") ;
const ExpenseCreatedEvent = require("./expense_created_event.js") ;
const ExpenseSignedEvent = require("./expense_signed_event.js") ;
const FinalizeExpenseEvent = require("./finalize_expense_event.js") ;
const ExpenseClosedEvent = require("./expense_closed_event.js") ;
const PaymentClosedEvent = require("./payment_closed_event.js") ;
const PaymentCreatedUsdEvent = require("./payment_created_usd_event.js") ;
const PaymentCreatedUsdtEvent = require("./payment_created_usdt_event.js") ;
const PaymentConfirmedEvent = require("./payment_confirmed_event.js") ;
const GroupClosedEvent = require("./group_closed_event.js") ;
const Test = require("./test.js") ;

const instructions = onRequest(async (req, res) => {
  const { txSig, offChainData, test } = req.body ;

  // TODO : 測試記得刪
  if(test) {return Test(test, res) ;}

  // TODO : 網路要記得改!!!!!!!!!
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const txDetail = await connection.getTransaction(txSig, {
    maxSupportedTransactionVersion: 0,
    commitment: "confirmed",
  });

  if (!txDetail || !txDetail.meta || !txDetail.meta.logMessages) {
    console.error("❌ No logs or info");
    return res.status(404).send({ error: "No logs or info" });
  }

  const coder = new BorshCoder(idl);
  const parser = new EventParser(programId, coder);
  const logs = Array.from(parser.parseLogs(txDetail.meta.logMessages));

  const info = logs[0] ;
  info.event = info.name ;
  delete info.name ;
  info.txSig = txSig ;
  info.offChainData = offChainData ;

  switch(info.event){
    case "GroupCreatedEvent":
      return GroupCreatedEvent(info, res) ;
    case "MemberJoinedEvent":
      return MemberJoinedEvent(info, res) ;
    case "GroupMemberRemovedEvent":
      return GroupMemberRemovedEvent(info, res) ;
    case "ExpenseCreatedEvent":
      return ExpenseCreatedEvent(info, res) ;
    case "ExpenseSignedEvent":
      return ExpenseSignedEvent(info, res) ;
    case "FinalizeExpenseEvent":
      return FinalizeExpenseEvent(info, res) ;
    case "ExpenseClosedEvent":
      return ExpenseClosedEvent(info, res) ;
    case "PaymentClosedEvent":
      return PaymentClosedEvent(info, res) ;
    case "PaymentCreatedUsdtEvent":
      return PaymentCreatedUsdtEvent(info, res) ;
    case "PaymentCreatedUsdEvent":
      return PaymentCreatedUsdEvent(info, res) ;
    case "PaymentConfirmedEvent":
      return PaymentConfirmedEvent(info, res) ;
    case "GroupClosedEvent":
      return GroupClosedEvent(info, res) ;
    default:
      return res.status(404).send({ error: "Event not found" }) ;
  }

});

module.exports = instructions ;

/**TODO : 這邊要小心，function全部採用
   絕對信任，所以需要額外做資安的保護
   讓api只能是由app打進去的不能任別人亂打

   這邊想要抽象化登入層，在創建群組(group)加入群組時(group)
   會自動在資料庫建立帳號
*/
