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




const createGroupTrans = async (signerWallet) => {
    
  const nonce = generateNonce(5) ;

  const [ groupPda, bump ] = PublicKey.findProgramAddressSync(
      [Buffer.from("group"), Buffer.from(nonce)],
      programId
  );

  const trans = await program.methods
    .createGroup(nonce)
    .accounts({
      group: groupPda,
      payer: new PublicKey(signerWallet), // 這是 Phantom 給我的 publicKey
      systemProgram: SystemProgram.programId,
    })
    .transaction();
  return trans ;
} ;

const closeGroupTrans = async (signerWallet, groupPda) => {
  const trans = await program.methods
   .closeGroup()
   .accounts({
    signer: new PublicKey(signerWallet),
    group: new PublicKey(groupPda)
  })
   .transaction();

  return trans ;
} ;

const removeGroupMemberTrans = async (signerWallet, groupPda) => {
  const trans = await program.methods
  .removeGroupMember(user_temp.publicKey)
  .accounts({
    group: new PublicKey(groupPda),
    signer: new PublicKey(signerWallet),
  })
  .transaction();

  return trans ;
} ;

export { 
  createGroupTrans, 
  closeGroupTrans, 
  removeGroupMemberTrans 
} ;



