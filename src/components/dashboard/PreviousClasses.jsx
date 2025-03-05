import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";
import TopicTracker from "../studdashboard/TopicTracker";
import SubtopicSearch from "../SubtopicSearch";
import TutorRequests from "./TutorRequests";

function PreviousClasses() {
  const { currentUser } = useContext(AuthContext);
  const [stud, setStud] = useState(false);

  const classes = [
    {
      id: 1,
      subject: "Mathematics",
      tutor: "Ashutosh Tiwari",
      date: "March 1, 2024",
      duration: "1 hour",
      rating: 5,
      topics: ["Calculus", "Derivatives"],
      notes: "Covered fundamental concepts of derivatives and their applications.",
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
      const snapshot = await get(userRef); // 🔹 Use `get()` instead of `onValue()`

      if (snapshot.exists()) {
        setStud(true);
      } else {
        console.error("User not found");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:mx-16 px-4 py-8 pt-20">
        <h1 className="text-2xl font-bold mb-6">Previous Classes</h1>
        <div className="space-y-6">
          {classes.map((class_) => (
            <div key={class_.id} className="hover:border-peach-300 border-2 p-4 cursor-pointer rounded-2xl transition-colors">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="bg-gradient-to-r from-peach-300 to-peach-100 bg-clip-text text-transparent">
                      {class_.subject}
                    </div>
                    <p className="text-sm text-gray-500">with {class_.tutor}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(class_.rating)].map((_, i) => (
                      <span key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <div variant="secondary" className="bg-gradient-to-r from-white to-[#ffded5]/10">
                      {class_.date}
                    </div>
                    <div variant="secondary" className="bg-gradient-to-r from-white to-[#ffded5]/10">
                      {class_.duration}
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-center">
                      {class_.topics.map((topic) => (
                        <div key={topic} className="shadow-sm rounded-full bg-gradient-to-br from-white to-[#ffded5] text-sm">
                          <div className="bg-white m-1 py-1 px-2 rounded-full">{topic}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{class_.notes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!stud && (
          <div>
            <h2 className="text-xl font-semibold mt-6">Pending Class Requests</h2>
            <TutorRequests />
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviousClasses;
