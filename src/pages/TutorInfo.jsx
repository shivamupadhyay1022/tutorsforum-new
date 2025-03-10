import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, get, set } from "firebase/database";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import { toast } from "react-toastify";

const TutorInfo = () => {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const {currentUser} = useContext(AuthContext);
  const [stud, setStud] = useState(false);
  const [name, setName] = useState("")

  useEffect(() => {
    const fetchTutorData = async () => {
      const tutorRef = ref(db, `tutors/${id}`);
      const snapshot = await get(tutorRef);
      if (snapshot.exists()) {
        // console.log(snapshot.val());
        setTutor(snapshot.val());
      }
    };
    fetchTutorData();
  }, [id]);

  useEffect(()=>{
    if (currentUser){
      fetchUserData();
    }
  }, [currentUser])

  const fetchUserData = async () =>{
    const userRef = ref(db, `users/${currentUser.uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      // console.log(snapshot.val());
      setStud(true);
      setName(snapshot.val().name);
    }
  }

  const requestClass = () => {
      if (!id)
        return toast.error("Tutor not found", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
  
      set(ref(db, `tutors/${id}/requests/${currentUser.uid}`), {
        studentId: currentUser.uid,
        studentName: name,
        status: "pending",
      });
      set(ref(db, `users/${currentUser.uid}/requests/${id}`), {
        tutorId: id,
        tutorName: tutor.name,
        status: "pending",
      });
  
       toast.success("Class request Sent", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
    };


  if (!tutor) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <Navbar />
      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl mt-16 shadow-md p-6">
        {/* Left Column: Profile Info */}
        <div className="flex flex-col items-center md:items-start border-r border-gray-300 pr-6">
          {/* Profile Image */}
          <img
            src={tutor.profilepic || "https://via.placeholder.com/150"}
            alt={tutor.name}
            className="w-36 h-36 rounded-full border-4 border-peach-300 shadow-lg mb-4 hover:scale-105 transition-transform"
          />

          {/* Name & Stats */}
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            {tutor.name}
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            ⭐ {tutor.stars} | ₹{tutor.cph}/hr
          </p>

          {/* Teach Online Badge */}
          {tutor.teachOnline ? (
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-md w-fit mb-4">
              <span>🟢 Teaches Online</span>
            </div>
          ):(
            <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-md w-fit mb-4">
              <span>🔴 Doesn't Teach Online</span>
            </div>
          )}

          {/* Subjects */}
          <div className="mb-6 w-full">
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              📚 Subjects
            </h2>
            <div className="flex flex-wrap gap-2">
              {tutor?.sub?.map((subject) => (
                <span
                  key={subject}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Button */}
          <button className="w-full mb-4 md:w-auto px-4 py-2 rounded-full text-white bg-gradient-to-r from-peach-300 to-peach-100 hover:bg-peach-600 transition-colors">
            🗨️ Chat with tutor
          </button>
          {stud && <button onClick={requestClass} className="w-full md:w-auto px-4 py-2 rounded-full text-white bg-gradient-to-r from-peach-300 to-peach-100 hover:bg-peach-600 transition-colors">
            ⌛ Request Class with tutor
          </button>}
          
        </div>

        {/* Right Column: Details */}
        <div className="space-y-6">
          {/* About */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              🧑‍🏫 About
            </h2>
            <p className="text-gray-600">
              {tutor.bio ||
                "This tutor has a strong academic background with extensive teaching experience to help students achieve their goals."}
            </p>
          </div>

          {/* Languages */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              🌐 Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {tutor?.lang?.map((language) => (
                <span
                  key={language}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              📍 Locations
            </h2>
            <div className="flex flex-wrap gap-2">
              {tutor.locations?.map((location) => (
                <span
                  key={location}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {location}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              💬 Student Reviews
            </h2>
            <div className="space-y-3">
              {tutor.reviews && tutor.reviews.length > 0 ? (
                tutor.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg bg-gray-50 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-gray-800">
                        {review.reviewer}
                      </span>
                      <span className="ml-auto text-sm text-yellow-500">
                        ⭐ {review.rating}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews available.</p>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              📆 Availability
            </h2>
            {tutor.schedule && tutor.schedule.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {tutor.schedule.map((entry, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 rounded-md bg-gray-100"
                  >
                    <span className="text-sm text-gray-700">{entry.day}</span>
                    <span className="text-sm text-gray-600">
                      {entry.start} - {entry.end}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Schedule not available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorInfo;
