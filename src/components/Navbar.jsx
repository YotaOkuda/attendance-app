import firebase from "firebase/compat/app";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

const Navbar = ({ isAuth }) => {
  const location = useLocation();
  const [photoURL, setPhotURL] = useState();

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
      const photoURL = user.photoURL;
      setPhotURL(photoURL);
      }
    });
    return () => unsubscribe();
  }, []);


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
                  Summary
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
                <img src={photoURL}
                className="h-10 w-10 rounded-full" />
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
