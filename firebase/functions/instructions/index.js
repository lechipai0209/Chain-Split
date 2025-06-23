const { db } = require("../config/firestore") ;
const { Connection, clusterApiUrl } = require("@solana/web3.js");
const { EventParser, BorshCoder } = require("@project-serum/anchor");
const { onRequest } = require("firebase-functions/v2/https") ;
const groupCreatedEvent = require("./group_created_event.js") ;
const memberJoinedEvent = require("./member_joined_event.js") ;
const GroupMemberRemovedEvent = require("./group_member_removed_event.js") ;
const expenseCreatedEvent = require("./expense_created_event.js") ;
const expenseSignedEvent = require("./expense_signed_event.js") ;
const finalizeExpenseEvent = require("./finalize_expense_event.js") ;
const expenseClosedEvent = require("./expense_closed_event.js") ;
const paymentClosedEvent = require("./payment_closed_event.js") ;
const paymentCreatedEvent = require("./payment_created_event.js") ;
const paymentConfirmedEvent = require("./payment_confirmed_event.js") ;
const groupClosedEvent = require("./group_closed_event.js") ;

const instructions = onRequest(async (req, res) => {
  const { tx } = req.body ;

  // 網路要記得改!!!!!!!!!
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const res = await connection.getTransaction(txSig, {
    maxSupportedTransactionVersion: 0,
    commitment: "confirmed",
  });

  if (!res || !res.meta || !res.meta.logMessages) {
    console.error("❌ No logs or info");
    return res.status(404).send({ error: "No logs or info" });
  }

  const coder = new BorshCoder(idl);
  const parser = new EventParser(programId, coder);
  const logs = Array.from(parser.parseLogs(res.meta.logMessages));
  const data = logs[0] ;


  switch(data.name){
    case "GroupCreatedEvent":
      return groupCreatedEvent(data) ;
    case "MemberJoinedEvent":
      return memberJoinedEvent(data) ;
    case "GroupMemberRemovedEvent":
      return GroupMemberRemovedEvent(data) ;
    case "ExpenseCreatedEvent":
      return expenseCreatedEvent(data) ;
    case "ExpenseSignedEvent":
      return expenseSignedEvent(data) ;
    case "FinalizeExpenseEvent":
      return finalizeExpenseEvent(data) ;
    case "ExpenseClosedEvent":
      return expenseClosedEvent(data) ;
    case "PaymentClosedEvent":
      return paymentClosedEvent(data) ;
    case "PaymentCreatedEvent":
      return paymentCreatedEvent(data) ;
    case "PaymentConfirmedEvent":
      return paymentConfirmedEvent(data) ;
    case "GroupClosedEvent":
      return groupClosedEvent(data) ;
    default:
      return res.status(404).send({ error: "Event not found" }) ;
  }

});