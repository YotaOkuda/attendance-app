import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";

const Summary = () => {
  const [monthReports, setMonthReports] = useState([]);
  const uid = auth.currentUser.uid;

  const nowDate = new Date();
  const date = nowDate.toLocaleDateString("sv-SE");
  const year = date.slice(0, 4);

  useEffect(() => {
    const getMonthReports = async () => {
      const data = await getDocs(
        collection(db, "users", uid, "yearReports", year, "monthReports")
      );
      setMonthReports(
        data.docs.map((doc) => ({ ...doc.data(), month: doc.id }))
      );
    };
    getMonthReports();
  }, []);

  console.log(monthReports);

  return (
    <>
      <h3 className="text-2xl font-bold my-10">月次集計</h3>
      <div className ="mb-5">
        <span className="text-xl font-bold"></span>
      </div>
      <table
        className="mx-auto w-2/4 table-auto border-collapse border-b-2 border-gray-300"
        border="1"
      >
        <thead className ="bg-gray-200 rounded-lg">
          <th scope="col" className="px-2 py-2 text-xl">
            月
          </th>
          <th scope="col" className="px-2 py-2 text-xl">
            労働日数
          </th>
          <th scope="col" className="px-2 py-2 text-xl">
            コマ数
          </th>
          <th scope="col" className="px-2 py-2 text-xl">
            給料（円）
          </th>
          <th scope="col" className="px-2 py-2 text-xl">
            源泉徴収額（円）
          </th>
        </thead>
        <tbody>
          {monthReports.map((monthReport) => {
            return (
              <tr kye={monthReport.month}>
                <th className="px-4 py-2 text-xl">{monthReport.month}</th>
                <th className="px-4 py-2 text-xl">{monthReport.totalWorkDays}</th>
                <th className="px-4 py-2 text-xl">{monthReport.totalClass}</th>
                <th className="px-4 py-2 text-xl">{monthReport.totalSalary}</th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Summary;
