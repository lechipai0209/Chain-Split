const { db, admin } = require("../config/firestore"); 

const paymentClosedEvent = async (info, res) => {
  const { data, event, txSig } = info;

  try {
    await db.collection("group")
     .doc(data.group)
     .update({
        recordIndex: admin.firestore.FieldValue.increment(1),
        records: admin.firestore.FieldValue.arrayUnion({
          event: event,
          txSig: txSig,
          group: data.group,
          signer: data.signer,
          account: data.account,
          payer: data.payer,
          recipient: data.recipient,
          amount: data.amount,
        })
    });

    return res.status(200).send({ message: "Payment Closed successfully." });
  } catch (error) {
    return res.status(500).send({ error: "Failed to close payment", detail: error.message });
  
  }
};

module.exports = paymentClosedEvent;