const { db, admin } = require("../config/firestore") ;

const groupCreatedEvent = async (info, res) => {
  const { data, event, txSig } = info;

  const userRef = db.collection("user").doc(data.member);
  const groupRef = db.collection("group").doc(data.group);

  try {
    await db.runTransaction(async (transaction) => {
      // 1. 清掉user 欄位已面的group
      transaction.update(userRef, {
        groups: admin.firestore.FieldValue.arrayRemove(data.group)
      });

      // 2. 清掉group 欄位已面的member
      transaction.update(groupRef, {
        members: admin.firestore.FieldValue.arrayRemove(data.member),
        recordIndex: admin.firestore.FieldValue.increment(1),
        records: admin.firestore.FieldValue.arrayUnion({
          event: event,
          txSig: txSig,
          group: data.group,
          signer: data.signer,
          account: data.account,
          member: data.member
        })
      });
    });

    return res.status(200).send({ message: "Member removed successfully." });
  } catch (error) {
    console.error("Transaction failure:", error);
    return res.status(500).send({ error: "Transaction failed", detail: error.message });
  }
};

module.exports = groupCreatedEvent ;

