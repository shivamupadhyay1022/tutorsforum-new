import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PreviousClasses from "../components/dashboard/PreviousClasses";
import DashNav from "../components/dashboard/DashNav";
import Home from "./Home";
import Chats from "../components/dashboard/Chats";
import Profile from "../components/dashboard/Profile";
import Payments from "../components/dashboard/Payments";

function Dashboard() {
  const [nav, setNav] = useState("previous_classes");
  const [seed, setSeed] =useState("123")
  function content  ()  {
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
      default:
        break;
    }
  };
  return (
    <div key={seed} >
      <DashNav func = {setNav} refresh={setSeed} />
      {content()}
    </div>
  );
}

export default Dashboard;
