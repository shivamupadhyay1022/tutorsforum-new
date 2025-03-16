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
import AdminSignin from "./pages/admin/AdminSignin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTutors from "./pages/admin/AdminTutors";
import EditUser from "./pages/admin/EditUser";
import EditTutor from "./pages/admin/EditTutor";


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
          <Route path="/search" element={<SearchResults />} />
          <Route path="/tutor/:id" element={<TutorInfo />} />
          <Route path="/student/:id" element={<Studentinfo />} />
          <Route path="/admin" element={<AdminSignin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:id" element={<EditUser />} />
          <Route path="/admin/tutors" element={<AdminTutors />} />
          <Route path="/admin/tutors/:id" element={<EditTutor />} />

        </>
      </Routes>
    </>
  );
}

export default App;
