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
import SearchResults from "./pages/SearchResults";
import TutorInfo from "./pages/TutorInfo";
import Studentinfo from "./pages/Studentinfo";
import { useNavigate } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app"; // Rename import
import PrivacyPolicy from "./pages/PrivacyPolicy";


function App() {
  const [count, setCount] = useState(0);
  const {currentUser} = useContext(AuthContext)
  // useEffect(() => {
  //   console.log(currentUser)})
  
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const backButtonListener = CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        navigate(-1); // Go to the previous page
      } else {
        CapacitorApp.exitApp(); // Exit the app if no previous page
      }
    });

    return () => {
      backButtonListener.remove(); // Clean up event listener
    };
  }, [navigate]);

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
          <Route path="/search" element={<SearchResults />} />
          <Route path="/tutor/:id" element={<TutorInfo />} />
          <Route path="/student/:id" element={<Studentinfo />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy/>} />

        </>
      </Routes>
    </>
  );
}

export default App;
