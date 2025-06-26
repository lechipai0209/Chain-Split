const { db, admin } = require("../../functions/config/firestore"); 

const Test = async (info, res) => {

  try {
    await db.collection("test")
     .doc("test")
     .set({"testtest": "testpkpkpkpkpk"}); 
    
    return res.status(200).send({ message: "OK" });
  } catch (error) {
    return res.status(500).send({ error: "Failed to pay payment", detail: error.message });
  
  }
};

module.exports = Test;