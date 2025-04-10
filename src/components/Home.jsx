import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";

const Home = ({ isAuth }) => {
  const navigate = useNavigate();

  // ログインしていない場合はログイン画面にリダイレクト
  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  // 出勤登録
  const registerClockIn = async () => {
    const uid = auth.currentUser.uid;
    const nowDate = new Date();
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

    const workMinutes = clockOutMinutes - clockInMinutes;
    const countClass = workMinutes / 90;

    // TODO
    // classWage の取得
    const userRef = doc(db, "users", uid);
    const userData = await getDoc(userRef);
    console.log(userData.classWage)

    // 退勤データ登録
    try {
      await updateDoc(attendanceCollectionRef, {
        clockOut: clockOutMinutes,
        workMinutes: workMinutes
      });
      console.log("succes");
    } catch (error) {
      console.log("更新エラー", error);
    }
  };

  return (
    <>
      <div>
        <h1>勤怠登録</h1>
        <h3>今日のタイムレコーダー履歴</h3>
        <table>
          <thead>
            <tr>
              <th>種別</th>
              <th>日時</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>出勤</td>
              <td>何時何分</td>
            </tr>
          </tbody>
        </table>
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
    </>
  );
};

export default Home;
