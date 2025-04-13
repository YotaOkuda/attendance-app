import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Home = ({ isAuth }) => {
  const navigate = useNavigate();
  const [todayWorkRecord, setTodayWorkRecord] = useState();

  // ログインしていない場合はログイン画面にリダイレクト
  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const nowDate = new Date();
        const date = nowDate.toLocaleDateString("sv-SE");
        const docRef = doc(db, "users", uid, "attendance", date);

        // リアルタイムでドキュメントの更新を監視するリスナーを設定
        const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            console.log("Realtime Document data:", docSnap.data());
            setTodayWorkRecord(docSnap.data());
          } else {
            console.log("No such document!");
            setTodayWorkRecord(null);
          }
        });
        // コンポーネントアンマウント時にリスナーを解除
        return () => unsubscribeSnapshot();
      }
    });
    return () => unsubscribe();
  }, []);

  // 出勤登録
  const registerClockIn = async () => {
    const uid = auth.currentUser.uid;
    const nowDate = new Date();
    const realTime = nowDate.toLocaleTimeString("ja-JP");
    const date = nowDate.toLocaleDateString("sv-SE");
    const attendanceCollectionRef = doc(db, "users", uid, "attendance", date);

    const hours = nowDate.getHours();
    let clockInMinutes = nowDate.getMinutes() + hours * 60;

    // 出勤時間の調整
    if (clockInMinutes >= 540 && clockInMinutes <= 585) {
      clockInMinutes = 555;
    } else if (clockInMinutes >= 630 && clockInMinutes <= 675) {
      clockInMinutes = 645;
    } else {
      clockInMinutes = 555;
    }

    // 出勤データ登録
    try {
      await setDoc(attendanceCollectionRef, {
        date: date,
        clockIn: clockInMinutes,
        realClockIn: realTime,
      });
      console.log("succes");
    } catch (error) {
      console.log("non succes", error);
    }
  };

  // 退勤登録
  const registerClockOut = async () => {
    const uid = auth.currentUser.uid;
    const nowDate = new Date();
    const realTime = nowDate.toLocaleTimeString("ja-JP");
    const date = nowDate.toLocaleDateString("sv-SE");
    const attendanceCollectionRef = doc(db, "users", uid, "attendance", date);

    // 出勤時間の取得
    const attendanceData = await getDoc(attendanceCollectionRef);
    const clockInMinutes = attendanceData.data().clockIn;

    const hours = nowDate.getHours();
    let clockOutMinutes = nowDate.getMinutes() + hours * 60;

    // 退勤時間の調整
    if (clockOutMinutes >= 630 && clockOutMinutes <= 675) {
      clockOutMinutes = 645;
    } else if (clockOutMinutes >= 720 && clockOutMinutes <= 765) {
      clockOutMinutes = 735;
    } else {
      clockOutMinutes = 735;
    }

    // 給料の計算
    const workMinutes = clockOutMinutes - clockInMinutes;
    const countClass = workMinutes / 90;

    const userDocRef = doc(db, "users", uid);
    const userData = await getDoc(userDocRef);
    const classWage = userData.data().classWage;
    const salary = countClass * classWage;

    // 退勤データ登録
    try {
      await updateDoc(attendanceCollectionRef, {
        clockOut: clockOutMinutes,
        realClockOut: realTime,
        workMinutes: workMinutes,
        countClass: countClass,
        salary: salary,
      });
      console.log("succes");
    } catch (error) {
      console.log("更新エラー", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          勤怠登録
        </h1>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-800">
            本日のタイムレコーダー履歴
          </h3>
          {todayWorkRecord ? (
            <div className="mt-4">
              {todayWorkRecord.realClockIn && (
                <p className="text-lg font-medium text-green-700">
                  出勤済み：{todayWorkRecord.realClockIn}
                </p>
              )}
              {todayWorkRecord.realClockOut && (
                <p className="text-lg font-medium text-red-700">
                  退勤済み：{todayWorkRecord.realClockOut}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-4 text-lg font-medium text-gray-700">まだ今日の勤務記録はありません</div>
          )}
        </div>
      </div>
      <div className="flex justify-center my-10">
        <button
          className="transition text-2xl py-16 px-16 rounded-xl
          border bg-blue-500 text-white font-bold
          hover:bg-blue-700 hover:scale-105 mr-20"
          onClick={registerClockIn}
        >
          出勤
        </button>
        <button
          className="transition text-2xl py-16 px-16 rounded-xl
          border bg-yellow-300 text-white font-bold
          hover:bg-yellow-500 hover:scale-105"
          onClick={registerClockOut}
        >
          退勤
        </button>
      </div>
    </div>
  );
};

export default Home;
