const { db, admin } = require("../../config/firestore"); 

const Test = async (info, res) => {

  try {
    await db.collection("group")
     .doc("exampleGroupAddress")
     .set({"testtest": "testpkpkpkpkpk"}); 
    
    return res.status(200).send({ message: "OK" });
  } catch (error) {
    return res.status(500).send({ error: "Failed to pay payment", detail: error.message });
  
  }
};

module.exports = Test;