import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";
import TopicTracker from "../studdashboard/TopicTracker";
import SubtopicSearch from "../SubtopicSearch";
import StudentRequests from "../studdashboard/StudentRequests";
import TutorRequests from "./TutorRequests";
function PreviousClasses() {
  const { currentUser } = useContext(AuthContext);
  const [stud, setStud] = useState(false);
  const [key, setKey] = useState(0);
  const [endedClasses, setEndedClasses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  async function fetchUserData() {
    console.log(currentUser.uid)
    if (currentUser) {
      const userRef = ref(db, "users/" + currentUser.uid);
      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setStud(true);
          console.log("Stud")
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    } else {
      setLoading(false); // Stop loading if no user
    }
  }

  useEffect(() => {
    fetchUserData();
  }, [currentUser]);

  // async function fetchUserData() {
  //   if (currentUser) {
  //     const userRef = ref(db, "users/" + currentUser.uid);
  //     const snapshot = await Promise.all[(get(userRef))]
  //     if (snapshot.val()) {
  //       setStud(true);
  //       setKey(Math.random()); // 🔹 Use `get()` instead of `onValue()`
  //     }
  //   }
  // }

  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-2 md:mx-8 px-4 py-8 pt-20">
        <div key={key}>
          {!stud ? (
            <div>
              <TutorRequests />
            </div>
          ) : (
            <div>
              <StudentRequests />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreviousClasses;
