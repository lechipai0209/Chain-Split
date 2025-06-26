const { db, admin } = require("../../config/firestore"); // 確認 admin 有引入

const expenseCreatedEvent = async (info, res) => {
  const { data, event, offChainData, txSig } = info;

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
        expenseName: offChainData.name,
        members: data.members,
        expense: data.expense,
        time: data.time,        
        index: newIndex
      })
    });

    // TODO : 要發相關的通知給參與人員(除了signer自己)

    return res.status(200).send({ message: "Expense recorded successfully." });
  } catch (error) {
    return res.status(500).send({ error: "Failed to record expense", detail: error.message });
  
  }
};

module.exports = expenseCreatedEvent;