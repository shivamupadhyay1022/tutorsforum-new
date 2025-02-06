import { useEffect, useState,useContext } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Signin from "./pages/Signin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "./AuthProvider";


function App() {
  const [count, setCount] = useState(0);
  const {currentUser} = useContext(AuthContext)
  useEffect(() => {
    console.log(currentUser)})

  return (
    <>
    <ToastContainer/>
      <Routes>
        <>
          {" "}

          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
        </>
      </Routes>
    </>
  );
}

export default App;
