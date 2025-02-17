import React, { useContext, useLayoutEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PreviousClasses from "../components/dashboard/PreviousClasses";
import DashNav from "../components/dashboard/DashNav";
import Home from "./Home";
import Chats from "../components/dashboard/Chats";
import Profile from "../components/dashboard/Profile";
import Payments from "../components/dashboard/Payments";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../firebase";
import { AuthContext } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [nav, setNav] = useState("previous_classes");
  const [seed, setSeed] = useState("123");
  const navigate = useNavigate();

  function content() {
    switch (nav) {
      case "previous_classes":
        return <PreviousClasses />;
        break;
      case "chats":
        return <Chats />;
        break;
      case "profile":
        return <Profile />;
        break;
      case "payments":
        return <Payments />;
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
            navigate("/")
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
      <DashNav func={setNav} refresh={setSeed} />
      {content()}
    </div>
  );
}

export default Dashboard;
