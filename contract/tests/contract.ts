import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contract } from "../target/types/contract";

describe("contract", () => {

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Contract as Program<Contract>;
  it("should create a group", async () => {
    const payer = anchor.workspace.contract.provider.wallet;

    const nonce = new anchor.BN(Math.floor(Date.now() / 1000));
    const [groupPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("group"),
        nonce.toArrayLike(Buffer, "le", 8)
      ],
      program.programId
    );

    const groupName = Array.from(Buffer.from("JakeGroup".padEnd(32), "utf8")); // [u8; 32]
    const hosterName = new anchor.BN(1234567890123456);

    const txSig = await program.methods
      .createGroup(groupName, hosterName, nonce)
      .accounts({
        group: groupPda,
        payer: payer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([])
      .rpc();

    console.log("Tx sent:", txSig);
    await provider.connection.confirmTransaction(txSig, "confirmed");
    const latest = await provider.connection.getTransaction(txSig, {
      commitment: "confirmed",
    });

    const parser = new anchor.EventParser(program.programId, program.coder);

    let a = Array.from(parser.parseLogs(latest.meta.logMessages)) ;
    console.log(a[0]) ;


  })


});
