import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";

const Navbar = ({ isAuth }) => {

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              {/* <img src="/images/attendance.png" alt="" className="h-20" /> */}
              <span className="text-3xl font-bold text-gray-900">
                Attendance
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              to="/"
            >
              Home
            </Link>
            {isAuth ? (
              <>
                <Link
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  to="/summary"
                >
                  Monthly Summary
                </Link>
                <Link
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  to="/logout"
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                to="/login"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
