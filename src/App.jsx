import { useEffect, useState,useContext } from "react";
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
import Request from "./pages/Requests";
import ForgotPassword from "./syllabuses/ForgotPassword";
import Exam from "./pages/Exam";
import { Helmet, HelmetProvider } from "react-helmet-async";

function App() {
  const [count, setCount] = useState(0);
  const {currentUser} = useContext(AuthContext)
  // useEffect(() => {
  //   console.log(currentUser)})
  
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    let backButtonListener;

    const setupBackButtonListener = async () => {
      backButtonListener = await CapacitorApp.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) {
          navigate(-1); // Go back
        } else {
          CapacitorApp.exitApp(); // Exit the app
        }
      });
    };

    setupBackButtonListener();

    return () => {
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, [navigate]);



  return (
    <HelmetProvider>
      <Helmet>
        <title>Tutors Forum</title>
        <meta name="description" content="Find the best tutors for any subject." />
      </Helmet>
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
          <Route path="/exam/:id" element={<Exam />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy/>} />
          <Route path="/requests" element={<Request/>} />
          <Route path="/forgot" element={<ForgotPassword/>} />
        </>
      </Routes>
    </HelmetProvider>
  );
}

export default App;

