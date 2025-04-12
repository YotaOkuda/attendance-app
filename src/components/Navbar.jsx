import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isAuth }) => {
  return (
    <nav className="flex justify-center items-center h-12 gap-12 bg-blue-300 font-semibold">
      <Link className="no-underline transition-all" to="/">ホーム</Link>
      {isAuth ? (
        <>
          <Link to="/summary">集計</Link>
          <Link  to="/logout">ログアウト</Link>
          <p className="">でログイン中</p>
        </>
      ) : (
        <>
          <Link to="/login">ログイン</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
