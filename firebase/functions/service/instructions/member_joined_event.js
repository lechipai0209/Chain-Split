const { db, admin } = require("../../config/firestore");


const groupCreatedEvent = async (info, res) => {
  try {
    const { data, event, txSig } = info;

    const userRef = db.collection("user").doc(data.signer);
    const docSnap = await userRef.get();

    // 不存在先自動創建一個user account
    if (!docSnap.exists) {
      const userDoc = {
        name: data.signer,
        deviceTokens: [], //TODO : 這邊要再想一下!!! 和 nativenotify有關
        groups: [data.group]
      };
      await userRef.set(userDoc);
      console.log(`✅ User ${data.signer} created in Firestore.`);
    }


    const groupDocRef = db.collection("group").doc(data.group);
    const groupSnap = await groupDocRef.get();
    const currentIndex = groupSnap.exists ? groupSnap.data().index || 0 : 0;
    const newIndex = currentIndex + 1;

    const record = {
      event: event,
      txSig: txSig,
      group: data.group,
      signer: data.signer,
      account: data.account,
      index: newIndex
    };

    await groupDocRef
      .update({
        index: newIndex,
        members: admin.firestore.FieldValue.arrayUnion(data.signer),
        records: admin.firestore.FieldValue.arrayUnion(record),
      });

    return res.status(200).send({ message: "Join Group successfully." });
  } catch (error) {
    console.error("❌ Error in groupCreatedEvent:", error);
    return res.status(500).send({ error: "Internal server error", detail: error.message });
  }
};

module.exports = groupCreatedEvent;

