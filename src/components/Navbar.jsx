import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ isAuth }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

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
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium  ${
                isActive('/')
                  ? 'text-blue-600 bg-blue-100'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
              to="/"
            >
              Home
            </Link>
            {isAuth ? (
              <>
                <Link
                  className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium  ${
                    isActive('/summary')
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  to="/summary"
                >
                  Monthly Summary
                </Link>
                <Link
                  className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium  ${
                    isActive('/logout')
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  to="/logout"
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium  ${
                isActive('/login')
                  ? 'text-blue-600 bg-blue-100'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
                to="/login"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
