const { db, admin } = require("../../config/firestore"); // 確認 admin 有引入

const expenseSignedEvent = async (info, res) => {
  const { data, event, txSig } = info;

  try {
    const groupDocRef = db.collection("group").doc(data.group);
    const groupSnap = await groupDocRef.get();
    const currentIndex = groupSnap.exists ? groupSnap.data().index || 0 : 0;
    const newIndex = currentIndex + 1;

    await db.collection("group")
     .doc(data.group)
     .update({
        index: newIndex,
        records: admin.firestore.FieldValue.arrayUnion({
        event: event,
        txSig: txSig,
        group: data.group,
        signer: data.signer,
        account: data.account,
        verified: data.verified,
        totalExpense: data.total_expense,
        end: data.end,
        time: data.time,
        index: newIndex
      })
    });

    // TODO : 如果end 是false or true 要發相關的通知所有participants(除了自己)

    return res.status(200).send({ message: "Expense Signed successfully." });
  } catch (error) {
    return res.status(500).send({ error: "Failed to sign expense", detail: error.message });
  
  }
};

module.exports = expenseSignedEvent;