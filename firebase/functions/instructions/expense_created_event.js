const { db, admin } = require("../config/firestore"); // 確認 admin 有引入

const expenseCreatedEvent = async (info, res) => {
  const { data, event, offChainData, txSig } = info;

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
        expenseName: offChainData.name,
        members: data.members,
        expense: data.expense,
        })
    });

    // TODO : 要發相關的通知給參與人員(除了signer自己)

    return res.status(200).send({ message: "Expense recorded successfully." });
  } catch (error) {
    return res.status(500).send({ error: "Failed to record expense", detail: error.message });
  
  }
};

module.exports = expenseCreatedEvent;