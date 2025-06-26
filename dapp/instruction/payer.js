import 'react-native-get-random-values';
import "react-native-url-polyfill/auto";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram
} from "@solana/web3.js";
import idl from '../idl/contract.json'; 
import { Buffer } from 'buffer';
global.Buffer = Buffer;
global.process = require('process');
global.TextEncoder = global.TextEncoder || require('text-encoding-polyfill').TextEncoder;
global.TextDecoder = global.TextDecoder || require('text-encoding-polyfill').TextDecoder;
import { generateNonce } from "./utils" ;
// TODO : 調整net 和 programId
const connection = new Connection(clusterApiUrl("devnet"));
const provider = new AnchorProvider(connection, {}, {});
const programId = new PublicKey("EYR8PHamGh1S1PM7d7txEDzyqfGfnchMbQ6tNHMBBsfX");
const program = new Program(idl, programId, provider);
import { Program, AnchorProvider } from '@coral-xyz/anchor';
// important : only anchor@0.28.0 can run on react-native
// please download correct version !! (latest versions greatly 
// rely on node.js core, which just doesn't work on react-native)
// these are a bunch of packages needed to run anchor on react-native


const closeExpenseTrans = async (
  signerWallet,
  expensePda
) => {
  const trans = await program.methods
.closeExpense()
.accounts({
  signer: new PublicKey(signerWallet),
  expense: new PublicKey(expensePda)
})
.transaction();

return trans ;
} ;

const confirmUsdTrans = async (
  signerWallet,
  paymentPda,
  groupPda
) => {
  const trans = await program.methods
  .confirmUsd()
  .accounts({
    signer: new PublicKey(signerWallet),
    payment: new PublicKey(paymentPda),
    group: new PublicKey(groupPda)
  })
  .transaction();

  return trans ;
} ;

const createExpenseTrans = async (
  signerWallet,
  groupPda,
  memberPublicKey,
  expenseArray,
  amount
) => {
  const nonce = generateNonce(7) ;
  const [ expensePda, bump ] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("expense"),
      Buffer.from(nonce)
    ],
    programId
  );

  const convertedKeys = memberPublicKey
  .map(k => k ? new PublicKey(k) : PublicKey.default);

  const trans = await program.methods
  .createExpense(
    nonce,
    convertedKeys,
    expenseArray,
    amount, 
  )
  .accounts({
    payer: new PublicKey(signerWallet),
    expense: expensePda,
    group: new PublicKey(groupPda),
    systemProgram: SystemProgram.programId
  })
  .transaction();

  return trans ;
     
} ;

const finalizeExpenseTrans = async (
  signerWallet,
  expensePda,
  groupPda
) => {
  const trans = await program.methods
  .finalizeExpense()
  .accounts({
    signer: new PublicKey(signerWallet),
    expense: new PublicKey(expensePda), 
    group: new PublicKey(groupPda)
  })
  .transaction();
  
  return trans ;
     
} ;

export { 
  closeExpenseTrans, 
  confirmUsdTrans, 
  createExpenseTrans, 
  finalizeExpenseTrans 
} ;