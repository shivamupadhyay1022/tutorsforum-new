import { useEffect, useState } from "react";
import { ref, get, remove } from "firebase/database";
import { deleteUser } from "firebase/auth";
import { db, auth } from "../../firebase";
import AdminNav from "./AdminNav";
import { useNavigate } from "react-router-dom";

export default function AdminTutors() {
  const [tutors, setTutors] = useState([]);
  const navigate = useNavigate()
  // Fetch All Tutors from Firebase
  const fetchTutors = async () => {
    const tutorsRef = ref(db, "tutors/");
    const snapshot = await get(tutorsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const tutorsArray = Object.keys(data).map((tutorId) => ({
        id: tutorId,
        ...data[tutorId],
      }));
      setTutors(tutorsArray);
    }
  };

  // Delete Tutor from Auth & Realtime db
  const handleDelete = async (tutorId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this tutor?"
    );
    if (!confirmation) return;

    // Delete from Firebase Realtime db
    await remove(ref(db, `tutors/${tutorId}`));

    // Delete from Firebase Authentication (if authenticated)
    const tutorToDelete = auth.currentUser;
    if (tutorToDelete) {
      await deleteUser(tutorToDelete);
    }

    // Remove from local state
    setTutors(tutors.filter((tutor) => tutor.id !== tutorId));
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  return (
    <div className=" bg-gray-100 min-h-screen">
            <AdminNav />

      <h1 className="text-3xl font-bold mb-8">Manage Tutors</h1>

      <div className="grid p-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-16 lg:grid-cols-4 gap-6">
        {tutors.map((tutor) => (
          <div
            key={tutor.id}
            className="bg-white rounded-lg shadow-md p-6 relative"
          >
            {/* Edit & Delete Buttons */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button onClick={() => navigate(`/admin/tutors/${tutor.id}`)} className="text-blue-500 hover:text-blue-700">✏️</button>
              <button
                onClick={() => handleDelete(tutor.id)}
                className="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </div>

            {/* Tutor Info */}
            <img
              src={tutor.profilepic || "/default-avatar.png"}
              alt="Profile"
              className="w-20 h-20 mx-auto rounded-full mb-4"
            />
            <h3 className="text-lg font-semibold ">{tutor.name}</h3>
            <p className="text-sm text-gray-500 ">{tutor.email}</p>

            <p className="text-sm text-gray-500 ">Language: </p>
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
            <p className="text-sm text-gray-500 ">Location: </p>
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
            <p className="text-sm text-gray-500 ">Subjects: </p>
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
            <p className="text-sm text-gray-500 ">
              Stars: ⭐{tutor.stars}
            </p>
            <p className="text-sm text-gray-500 ">
              CPH: ₹{tutor.cph}/hr
            </p>
            <p className="text-sm text-gray-500 ">Schedule: </p>
            {tutor.schedule && tutor.schedule.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {tutor.schedule.map((entry, index) => (
                  <div
                    key={index}
                    className="flex justify-between gap-2 items-center p-2 rounded-md bg-gray-100"
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
            <p className="text-sm text-gray-500 ">
              Online: {tutor.teachOnline ? "✅ Yes" : "❌ No"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
