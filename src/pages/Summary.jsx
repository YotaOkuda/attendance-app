import { doc, getDoc } from "firebase/firestore";
import React, { forwardRef, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  Banknote,
  CalendarCheck,
  CalendarDays,
  Pen,
  TrendingUp,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="flex items-center border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <CalendarDays className="h-6 w-6 text-blue-600 mr-2" />
    <span className="text-lg text-gray-700">{value || "yyyy/MM"}</span>
  </button>
));

const Summary = () => {
  const nowDate = new Date();
  const date = nowDate.toLocaleDateString("sv-SE");
  const currentYear = date.slice(0, 4);
  const currentMonth = date.slice(5, 7);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [monthReport, setMonthReports] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());


  const fetchMonthReport = async (uid) => {
    const formattedMonth = selectedMonth.toString().padStart(2, "0");
    const docRef = doc(
      db,
      "users",
      uid,
      "yearReports",
      selectedYear.toString(),
      "monthReports",
      formattedMonth
    );
    const snapshot = await getDoc(docRef);
    setMonthReports(snapshot.data());
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        fetchMonthReport(uid);
      }
    });
    return () => unsubscribe();
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    const updatedDate = selectedDate.toLocaleString("sv-SE")
    const updatedYear = updatedDate.slice(0, 4)
    const updatedMonth = updatedDate.slice(5, 7)
    setSelectedYear(updatedYear)
    setSelectedMonth(updatedMonth)
  }, [selectedDate])

  const monthlyStats = {
    totalHours: 168,
    daysPresent: 21,
    avgHoursPerDay: 8,
    overtime: 8,
  };


  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Monthly Summary
            </h1>
            <div className="flex">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy/MM"
                showMonthYearPicker
                customInput={<CustomDateInput />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <CalendarCheck className="h-8 w-8 text-blue-600" />
                <div className="bg-blue-600/10 rounded-full p-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Total Days
              </h3>
              <p className="text-4xl font-bold text-blue-600">
                {monthReport?.totalWorkDays + "days" || "Loading..."}
              </p>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <Pen className="h-8 w-8 text-green-600" />
                <div className="bg-green-600/10 rounded-full p-2">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Total Classes
              </h3>
              <p className="text-4xl font-bold text-green-600">
                {monthReport?.totalClass || "Loading..."}
              </p>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <Banknote className="h-8 w-8 text-purple-600" />
                <div className="bg-purple-600/10 rounded-full p-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Total Salary
              </h3>
              <p className="text-4xl font-bold text-purple-600">
                {monthReport?.totalSalary.toLocaleString("ja-JP", {
                  style: "currency",
                  currency: "JPY",
                }) || "Loading..."}
              </p>
            </div>

            <div className="group bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="bg-orange-600/10 rounded-full p-2">
                  <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Overtime
              </h3>
              <p className="text-4xl font-bold text-orange-600">
                {monthlyStats?.overtime || "Loading..."}h
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
