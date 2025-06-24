const { db, admin } = require("../config/firestore");


const groupCreatedEvent = async (info, res) => {
  try {
    const { data, event, txSig } = info;

    const userRef = db.collection("user").doc(data.signer);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      const userDoc = {
        name: data.signer,
        deviceTokens: [], //TODO : 這邊要再想一下!!! 和 nativenotify有關
        groups: [data.group]
      };
      await userRef.set(userDoc);
      console.log(`✅ User ${data.signer} created in Firestore.`);
    }

    const record = {
      event: event,
      txSig: txSig,
      group: data.group,
      signer: data.signer,
      account: data.account,
    };

    await db.collection("group")
      .doc(data.group)
      .update({
        recordIndex: admin.firestore.FieldValue.increment(1),
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

