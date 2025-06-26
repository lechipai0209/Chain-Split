import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import idl from "../target/idl/contract.json";

// 這兩行刪掉會跑不起來!!!!
import { Program } from "@coral-xyz/anchor";
import { Contract } from "../target/types/contract";

/**
 * 建立一個測試用的錢包（Signer），並空投 SOL 至 localnet 測試鏈
 * @param solAmount 空投多少 SOL（預設 1）
 */
export async function createTestUser(solAmount: number = 1): Promise<{
  signer: anchor.web3.Keypair;
  publicKey: anchor.web3.PublicKey;
  balance: number;
}> {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const signer = Keypair.generate();
  const lamports = solAmount * LAMPORTS_PER_SOL;

  const txSig = await provider.connection.requestAirdrop(signer.publicKey, lamports);
  await provider.connection.confirmTransaction(txSig, "confirmed");

  const balance = await provider.connection.getBalance(signer.publicKey);

  return {
    signer,
    publicKey: signer.publicKey,
    balance: balance / LAMPORTS_PER_SOL,
  };
}

function generateRandomNonce(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 256));
}


describe("contract", () => {
  
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const programId = new anchor.web3.PublicKey("EYR8PHamGh1S1PM7d7txEDzyqfGfnchMbQ6tNHMBBsfX");
  const program = new anchor.Program(idl as anchor.Idl, programId, provider);
  
  const myWallet = anchor.workspace.contract.provider.wallet;
  const parser = new anchor.EventParser(program.programId, program.coder);
  
  it("whole test", async () => {
    
    const user = await createTestUser(2);
    const user_temp = await createTestUser(2);


    // create group
    let nonce = generateRandomNonce(5);

    const [groupPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("group"),
        Buffer.from(nonce)
      ],
      program.programId
    );


    let txSig = await program.methods
      .createGroup(nonce)
      .accounts({
        group: groupPda,
        payer: myWallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([])
      .rpc();

    console.log("this is create group txSig : ", txSig, "\n") ;

    await provider.connection.confirmTransaction(txSig, "confirmed");
    let res = await provider.connection.getTransaction(txSig, {
      commitment: "confirmed",
    });

    let creatGroupLog = Array.from(parser.parseLogs(res.meta.logMessages)) ;
    console.log("this is create group : ", creatGroupLog[0], "\n") ;

    // join group 
    txSig = await program.methods
    .joinGroup()
    .accounts({
      group: groupPda,
      signer: user.publicKey,
    })
    .signers([user.signer])
    .rpc();

    await provider.connection.confirmTransaction(txSig, "confirmed");
    res = await provider.connection.getTransaction(txSig, {
      commitment: "confirmed",
    });

    let joinGroupLog = Array.from(parser.parseLogs(res.meta.logMessages)) ;
    console.log("this is join group : ", joinGroupLog[0], "\n") ;

// remove member 
    txSig = await program.methods
    .joinGroup()
    .accounts({
      group: groupPda,
      signer: user_temp.publicKey,
    })
    .signers([user_temp.signer])
    .rpc();

    await provider.connection.confirmTransaction(txSig, "confirmed");

    txSig = await program.methods
    .removeGroupMember(user_temp.publicKey)
    .accounts({
      group: groupPda,
      signer: myWallet.publicKey,
    })
    .signers([])
    .rpc();

    await provider.connection.confirmTransaction(txSig, "confirmed");
    res = await provider.connection.getTransaction(txSig, {
      commitment: "confirmed",
    });

    let removeMemberLog = Array.from(parser.parseLogs(res.meta.logMessages)) ;
    console.log("this is remove member : ", removeMemberLog[0], "\n") ;



// create expense
    nonce = generateRandomNonce(7);

    const [expensePda, bump2] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("expense"),
        Buffer.from(nonce)
      ],
      program.programId
    );

    const expenseArray = [
      ...new Array(1).fill(10),
      ...new Array(1).fill(80),
      ...new Array(18).fill(0)
    ];


    const memberPubkeys = [
      myWallet.publicKey,
      user.publicKey,
      ...Array(18).fill(PublicKey.default)
    ];

    txSig = await program.methods
    .createExpense(
      nonce,
      memberPubkeys,
      expenseArray,
      90, 
    )
    .accounts({
      payer: myWallet.publicKey,
      expense: expensePda,
      group: groupPda,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([]) 
    .rpc();

    await provider.connection.confirmTransaction(txSig, "confirmed");
    res = await provider.connection.getTransaction(txSig, {
      commitment: "confirmed",
    });

    let createExpenseLog = Array.from(parser.parseLogs(res.meta.logMessages)) ;
    console.log("this is create expense : ", createExpenseLog[0], "\n") ;


// sign expense
    txSig = await program.methods
    .signExpense(true)
    .accounts({
      signer: user.publicKey,
      expense: expensePda,
      group: groupPda
    })
    .signers([user.signer])
    .rpc();

    await provider.connection.confirmTransaction(txSig, "confirmed");
    res = await provider.connection.getTransaction(txSig, {
      commitment: "confirmed",
    });

    let signExpenseAllLog = Array.from(parser.parseLogs(res.meta.logMessages)) ;
    const signedExpenseLog = signExpenseAllLog.find(e => e.name === "ExpenseSignedEvent");
    const autofinalizedLog = signExpenseAllLog.find(e => e.name === "AutoFinalizeEvent");
    console.log("this is sign expense : ", signedExpenseLog, "\n") ;
    if(autofinalizedLog){
      console.log("this is auto finalized expense : ", autofinalizedLog, "\n") ;
    }

// finalize expense (if not auto finalized)

    if(!autofinalizedLog){
      txSig = await program.methods
      .finalizeExpense()
      .accounts({
        signer: myWallet.publicKey,
        expense: expensePda, 
        group: groupPda
      })
      .signers([])
      .rpc();

      await provider.connection.confirmTransaction(txSig, "confirmed");
      res = await provider.connection.getTransaction(txSig, {
        commitment: "confirmed",
      });

      let finalizeExpenseLog = Array.from(parser.parseLogs(res.meta.logMessages)) ;
      console.log("this is finalize expense : ", finalizeExpenseLog[0], "\n") ;
    }

// close expense
    txSig = await program.methods
    .closeExpense()
    .accounts({
      signer: myWallet.publicKey,
      expense: expensePda
    })
    .signers([])
    .rpc();

    await provider.connection.confirmTransaction(txSig, "confirmed");
    res = await provider.connection.getTransaction(txSig, {
      commitment: "confirmed",
    });

    let closeExpenseLog = Array.from(parser.parseLogs(res.meta.logMessages)) ;
    console.log("this is close expense : ", closeExpenseLog[0], "\n") ;

// close pay with usd
    nonce = generateRandomNonce(7);
    const [paymentPdaTemp, bump4] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("payment"),
        Buffer.from(nonce)
      ],
      program.programId
    );

    
    txSig = await program.methods
    .payWithUsd(nonce, 80)
    .accounts({
      payer: user.publicKey,
      recipient: myWallet.publicKey,
      group: groupPda,
      payment: paymentPdaTemp,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([user.signer])
    .rpc();

    await provider.connection.confirmTransaction(txSig, "confirmed");    


    const txSigClose = await program.methods
    .closePayWithUsd()
    .accounts({
      signer: user.publicKey,
      payment: paymentPdaTemp,
    })
    .signers([user.signer])
    .rpc() ;

    await provider.connection.confirmTransaction(txSigClose, "confirmed");
    res = await provider.connection.getTransaction(txSigClose, {
      commitment: "confirmed",
    });

    let closePayWithUsdLog = Array.from(parser.parseLogs(res.meta.logMessages)) ;
    console.log("this is close pay with usd : ", closePayWithUsdLog[0], "\n") ;

// pay with usd
    nonce = generateRandomNonce(7);
    const [paymentPda, bump3] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("payment"),
        Buffer.from(nonce)
      ],
      program.programId
    );

    
    txSig = await program.methods
    .payWithUsd(nonce, 80)
    .accounts({
      payer: user.publicKey,
      recipient: myWallet.publicKey,
      group: groupPda,
      payment: paymentPda,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([user.signer])
    .rpc();

    await provider.connection.confirmTransaction(txSig, "confirmed");
    res = await provider.connection.getTransaction(txSig, {
      commitment: "confirmed",
    });

    let payWithUsdLog = Array.from(parser.parseLogs(res.meta.logMessages)) ;
    console.log("this is pay with usd : ", payWithUsdLog[0], "\n") ;

// confirm usd
    txSig = await program.methods
    .confirmUsd()
    .accounts({
      signer: myWallet.publicKey,
      payment: paymentPda,
      group: groupPda
    })
    .signers([])
    .rpc();

    await provider.connection.confirmTransaction(txSig, "confirmed");
    res = await provider.connection.getTransaction(txSig, {
      commitment: "confirmed",
    });

    let confirmUsdLog = Array.from(parser.parseLogs(res.meta.logMessages)) ;
    console.log("this is confirm usd : ", confirmUsdLog[0], "\n") ;



    
// close group
    txSig = await program.methods
    .closeGroup()
    .accounts({
      group: groupPda,
      signer: myWallet.publicKey
    })
    .signers([])
    .rpc();

    await provider.connection.confirmTransaction(txSig, "confirmed");
    res = await provider.connection.getTransaction(txSig, {
      commitment: "confirmed",
    });

    let closeGroupLog = Array.from(parser.parseLogs(res.meta.logMessages)) ;
    console.log("this is close group : ", closeGroupLog[0], "\n") ;

  })


});
