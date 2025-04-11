// デプロイ地域の設定
const { setGlobalOptions } = require("firebase-functions/v2");
setGlobalOptions({
  region: "asia-northeast1",
});

// Firebase Admin SDKの初期化
const admin = require("firebase-admin");
admin.initializeApp();


const { onDocumentUpdated } = require("firebase-functions/v2/firestore");

// Firestoreのドキュメントが更新されたときにトリガーされる関数
exports.updateuser = onDocumentUpdated(
  "users/{uid}/attendance/{attendanceId}",
  async (event) => {
    const uid = event.params.uid;

    const snapshot = event.data;
    if (!snapshot) {
      console.log("No data associated with the event");
      return;
    }
    const data = snapshot.after.data();

    if (data.salary) {
      console.log("salary: ", data.salary);
    }
    console.log(data);

    const reportRef = admin.firestore()
      .collection("users")
      .doc(uid)
      .collection("yearReport")
      .doc(yearKey)
      .collection("monthReport")
      .doc(monthKey)
  }
);
