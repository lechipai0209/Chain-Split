const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin") ; 


admin.initializeApp() ;
const db = admin.firestore() ;

exports.helloFireStore = onRequest(async (req, res) => {
  const doc = await db.collection("test").doc("mydoc").get() ;
  if (!doc.exists) {
    res.send("No such document !")
  }else{
    res.send(doc.data()) ;
  }
})

exports.test = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
