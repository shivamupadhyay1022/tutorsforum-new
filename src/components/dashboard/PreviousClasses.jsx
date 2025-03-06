import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";
import TopicTracker from "../studdashboard/TopicTracker";
import SubtopicSearch from "../SubtopicSearch";
import StudentRequests from "./StudentRequests";
import TutorRequests from "./TutorRequests";
function PreviousClasses() {
  const { currentUser } = useContext(AuthContext);
  const [stud, setStud] = useState(false);
  const [key, setKey] = useState(0)
  const [endedClasses, setEndedClasses] = useState([]);

    

  const classes = [
    {
      id: 1,
      subject: "Mathematics",
      tutor: "Ashutosh Tiwari",
      date: "March 1, 2024",
      duration: "1 hour",
      rating: 5,
      topics: ["Calculus", "Derivatives"],
      notes:
        "Covered fundamental concepts of derivatives and their applications.",
    },
    {
      id: 2,
      subject: "Physics",
      tutor: "Shivam",
      date: "February 28, 2024",
      duration: "1.5 hours",
      rating: 4,
      topics: ["Mechanics", "Newton's Laws"],
      notes: "Practical examples of Newton's laws of motion.",
    },
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    if (currentUser) {
      const userRef = ref(db, "users/" + currentUser.uid);
      const snapshot = await get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          setStud(true);
          setKey(Math.random())
        }
      }); // 🔹 Use `get()` instead of `onValue()`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:mx-16 px-4 py-8 pt-20">
        <div key={key} >
        {!stud ? (
          <div>
            <h2 className="text-xl font-semibold mt-6">Class Requests</h2>
            <TutorRequests />
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mt-6">Class Requests</h2>
            <StudentRequests />
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default PreviousClasses;
