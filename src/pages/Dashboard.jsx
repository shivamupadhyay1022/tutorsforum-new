import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PreviousClasses from "../components/dashboard/PreviousClasses";
import DashNav from "../components/dashboard/DashNav";
import Home from "./Home";
import Exams from "./Exams";
import Chats from "../components/dashboard/Chats";
import Profile from "../components/dashboard/Profile";
import Payments from "../components/dashboard/Payments";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../firebase";
import { AuthContext } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import StudProfile from "../components/studdashboard/StudProfile";
import { useLocation } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

function Dashboard() {
  const [nav, setNav] = useState("profile");
  const [seed, setSeed] = useState("123");
  const [stud, setStud] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const location = useLocation();
  const [lastPage, setLastPage] = useState(null);

  useEffect(() => {
    checkStud();
    console.log(currentUser)
    // if (previousPage) {
    //   setLastPage(previousPage);
    // }
    // sessionStorage.setItem("lastVisitedPage", location.pathname);
    // console.log(signOut(auth));
  }, [currentUser]);
  
  async function checkStud() {
        if (currentUser) {
          const starCountRef = ref(db, "tutors/" + currentUser.uid);
          onValue(starCountRef, (snapshot) => {
            if (snapshot.exists()) {
              setStud(false); // ✅ Tutor found
            } else {
              setStud(true); // ✅ No tutor data
            }
          });
        }
  }

  function content() {
    switch (nav) {
      case "previous_classes":
        return <PreviousClasses />;
        break;
      case "chats":
        return <Chats />;
        break;
      case "profile":
        return (stud ? <StudProfile/>: <Profile/>) ;
        break;
      case "payments":
        return <Payments />;
        break;
      case "exams":
        return <Exams />;
        break;
      case "home":
        return navigate("/");
        break;
      case "logout": {
        signOut(auth)
          .then(() => {
            toast.success("Signed Out Successfully", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            navigate("/");
          })
          .catch((error) => {
            toast.error(error.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          });
        break;
      }
      default:
        break;
    }
  }

  return (
    <div key={seed}>
      <Helmet>
        <title>Dashboard - Tutors Forum</title>
        <meta name="description" content="Manage your account, view your classes, and connect with tutors on your Tutors Forum dashboard." />
      </Helmet>
      <DashNav func={setNav} refresh={setSeed} />
      {content()}
    </div>
  );
}

export default Dashboard;
