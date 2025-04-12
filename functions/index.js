// デプロイ地域の設定
const { setGlobalOptions } = require("firebase-functions/v2");
setGlobalOptions({
  region: "asia-northeast1",
});

// Firebase Admin SDKの初期化
const admin = require("firebase-admin");
admin.initializeApp();

const { onDocumentUpdated } = require("firebase-functions/v2/firestore");

// 取得したドキュメントスナップショットを使って更新または作成する関数
function updateOrSetReportFromSnapshot(docSnapshot, ref, salary, countClass, transaction) {
  if (docSnapshot.exists) {
    const data = docSnapshot.data();
    transaction.update(ref, {
      totalSalary: (data.totalSalary || 0) + salary,
      totalClass: (data.totalClass || 0) + countClass,
      totalWorkDays: (data.totalWorkDays || 0) + 1,
    });
  } else {
    transaction.set(ref, {
      totalSalary: salary,
      totalClass: countClass,
      totalWorkDays: 1,
    });
  }
}

// 退勤登録(users/{uid}/attendance/{attendanceId})されたときにトリガーされる関数
// 月次レポートを更新する
exports.updateReport = onDocumentUpdated(
  "users/{uid}/attendance/{attendanceId}",
  async (event) => {
    const uid = event.params.uid;

    const snapshot = event.data;
    const data = snapshot.after.data();

    const yearKey = data.date.slice(0, 4);
    const monthKey = data.date.slice(5, 7);

    const salary = data.salary;
    const countClass = data.countClass;

    const monthReportRef = admin
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("yearReports")
      .doc(yearKey)
      .collection("monthReports")
      .doc(monthKey);

    const yearReportRef = admin
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("yearReports")
      .doc(yearKey);

    try {
      await admin.firestore().runTransaction(async (transaction) => {

        const [monthReportDoc, yearReportDoc] = await Promise.all([
          transaction.get(monthReportRef),
          transaction.get(yearReportRef),
        ]);

        updateOrSetReportFromSnapshot(monthReportDoc, monthReportRef, salary, countClass, transaction);
        updateOrSetReportFromSnapshot(yearReportDoc, yearReportRef, salary, countClass, transaction);
    });
      console.log("Report updated successfully");
    } catch (error) {
      console.error("Error updating report: ", error);
    }
  }
);
