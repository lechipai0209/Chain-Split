const { db, admin } = require("../../config/firestore"); // 確認 admin 有引入

const groupCreatedEvent = async (info, res) => {
  const { data, event, offChainData, txSig } = info;

  const groupRef = db.collection("group").doc(data.group);
  const userRef = db.collection("user").doc(data.signer);

  try {
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);

      // if user doesn't exist, create it first
      if (!userDoc.exists) {
        transaction.set(userRef, {
          name: data.signer,
          groups: [data.group],
          deviceTokens: [], // TODO : 你之前提過的，可以自行調整
        });
      } else {
        transaction.update(userRef, {
          groups: admin.firestore.FieldValue.arrayUnion(data.group),
        });
      }

      transaction.set(groupRef, {
        groupName: offChainData.name,
        group: data.group,
        members: [data.signer],
        host: data.signer,
        index: 0,
        records: [
          {
            event: event,
            txSig: txSig,
            group: data.group,
            signer: data.signer,
            account: data.account,
            groupName: offChainData.name,
          },
        ],
      });
    });

    console.log(`Group ${data.group} created in Firestore.`);
    return res.status(200).send({ message: "Group created successfully." });
  } catch (error) {
    console.error("Transaction failed:", error);
    return res.status(500).send({ error: "Transaction failed", detail: error.message });
  }
};

module.exports = groupCreatedEvent;
/**
 * user: /// -> name、 parti groups devices id
 * group: /// -> group name、members 、 group address(account) 、 record 
 */