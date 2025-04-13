import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Summary from "./pages/Summary";
import Shift from "./pages/Shift";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  return (
    <Router>
      <Navbar isAuth={isAuth} />
      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} />}></Route>
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />}></Route>
        <Route path="/logout" element={<Logout setIsAuth={setIsAuth} />}></Route>
        <Route path="/summary" element={<Summary />}></Route>
        <Route path="/shift" element={<Shift />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
