import React, {useState, useEffect, useContext} from 'react'
import { useParams } from "react-router-dom";
import { getDatabase, ref, get, set } from "firebase/database";
import { db } from "../firebase";
import Navbar from '../components/Navbar';
import { AuthContext } from '../AuthProvider';
import { toast } from 'react-toastify';
import { Helmet } from "react-helmet-async";

function Studentinfo() {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const {currentUser} = useContext(AuthContext);
  const [stud, setStud] = useState("");
  const [name, setName] = useState("")

  
    useEffect(() => {
      fetchUserData();
    }, [id]);

      const fetchUserData = async () =>{
        const userRef = ref(db, `users/${id}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          // console.log(snapshot.val());
          setStud(snapshot.val());
        }
      }


      if (!stud) {
        return (
          <div className="flex items-center justify-center h-screen">
            Loading...
          </div>
        );
      }
    
      return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-10">
          <Helmet>
            <title>{stud ? stud.name : "Student Profile"} - Tutors Forum</title>
            <meta name="description" content={stud ? `View the profile of ${stud.name}, a student on Tutors Forum.` : "View the profile of a student on Tutors Forum."} />
          </Helmet>
          <Navbar />
          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl mt-16 shadow-md p-6">
            {/* Left Column: Profile Info */}
            <div className="flex flex-col items-center md:items-start border-r border-gray-300 pr-6">
              {/* Profile Image */}
              <img
                src={stud.profilepic || "https://cdn.pixabay.com/photo/2023/05/02/10/35/avatar-7964945_960_720.png"}
                alt={stud.name}
                className="w-36 h-36 rounded-full border-4 border-peach-300 shadow-lg mb-4 hover:scale-105 transition-transform"
              />
    
              {/* Name & Stats */}
              <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                {stud.name}
              </h1>
    
              {/* Contact Button */}
              <button className="w-full mb-4 md:w-auto px-4 py-2 rounded-full text-white bg-gradient-to-r from-peach-300 to-peach-100 hover:bg-peach-600 transition-colors">
                🗨️ Chat with student
              </button>
              
            </div>
    
            {/* Right Column: Details */}
            <div className="space-y-6">
              {/* About */}
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  🧑‍🏫 Test Results
                </h2>
                <p className="text-gray-600">
                  {stud.bio ||
                    "Appeared in No tests"}
                </p>
              </div>
    
              {/* Languages */}
              {/* <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  🌐 Languages
                </h2>
                <div className="flex flex-wrap gap-2">
                  {stud?.lang?.map((language) => (
                    <span
                      key={language}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div> */}
    
              {/* Locations */}
              {/* <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  📍 Locations
                </h2>
                <div className="flex flex-wrap gap-2">
                  {stud.locations?.map((location) => (
                    <span
                      key={location}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div> */}
    
              {/* Reviews */}
              {/* <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  💬 Student Reviews
                </h2>
                <div className="space-y-3">
                  {stud.reviews && stud.reviews.length > 0 ? (
                    stud.reviews.map((review, index) => (
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
              </div> */}
    
              {/* Schedule */}
              {/* <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  📆 Availability
                </h2>
                {stud.schedule && stud.schedule.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {stud.schedule.map((entry, index) => (
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
              </div> */}
            </div>
          </div>
        </div>
      );
}

export default Studentinfo