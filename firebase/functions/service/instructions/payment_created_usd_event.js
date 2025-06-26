const { db, admin } = require("../../config/firestore"); 

const paymentCreatedUsdEvent = async (info, res) => {
  const { data, event, txSig } = info;
  try {

    const groupDocRef = db.collection("group").doc(data.group);
    const groupSnap = await groupDocRef.get();
    const currentIndex = groupSnap.exists ? groupSnap.data().index || 0 : 0;
    const newIndex = currentIndex + 1;

    await groupDocRef
     .update({
        index: newIndex,
        records: admin.firestore.FieldValue.arrayUnion({
          event: event,
          txSig: txSig,
          group: data.group,
          signer: data.signer,
          account: data.account,
          payer: data.payer,
          recipient: data.recipient,
          amount: data.amount,
          time: data.time,
          index: newIndex
        })
    });

    return res.status(200).send({ message: "Payment Created successfully." });
  } catch (error) {
    return res.status(500).send({ error: "Failed to create payment", detail: error.message });
  
  }
};

module.exports = paymentCreatedUsdEvent;