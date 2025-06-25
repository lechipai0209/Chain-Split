import 'react-native-get-random-values';
import "react-native-url-polyfill/auto";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram
} from "@solana/web3.js";
import { Program, AnchorProvider } from '@coral-xyz/anchor';
// important : only anchor@0.28.0 can run on react-native
// please download correct version !! (latest versions greatly 
// rely on node.js core, which just doesn't work on react-native)
// these are a bunch of packages needed to run anchor on react-native
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


// const closeExpenseTrans = async () => {
     
// } ;

// const confirmUsdTrans = async () => {
     
// } ;

// const createExpenseTrans = async () => {
     
// } ;

// const finalizeExpenseTrans = async () => {
     
// } ;

// export { 
//   closeExpenseTrans, 
//   confirmUsdTrans, 
//   createExpenseTrans, 
//   finalizeExpenseTrans 
// } ;