import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ref, get, update } from "firebase/database";
import { db } from "../../firebase";
import AdminNav from "./AdminNav";

function EditUser() {
  const { id } = useParams();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profilepic: "",
    clas: "",
    exam: "",
    credits: 0,
    bio: "",
  });

  // Fetch User Data from Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = ref(db, `users/${id}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      }
      console.log(userData);
    };

    fetchUserData();
  }, [id]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update User Data in Firebase
  const handleSave = async () => {
    const userRef = ref(db, `users/${id}`);
    await update(userRef, userData);
            toast.success("User data updated successfully", {
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

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
      <AdminNav />
      <h1 className="text-3xl font-bold mb-20">Edit User</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <img
            src={userData.profilepic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="text-gray-600">Name:</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-600">Email:</label>
            <input
              type="text"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              disabled
            />
          </div>

          {/* Class */}
          <div className="flex items-center gap-2 justify-between w-full">
            <label className="text-gray-600">Class:</label>
            <select
              onChange={handleChange}
              value={userData.clas || ""}
              className="border p-2 w-full rounded-md"
            >
              <option value="">All Classes</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
              <option value="Passout">Passout</option>
            </select>
          </div>
          {/* Exam */}
          <div className="flex items-center gap-2 justify-between w-full">
            <label className="text-gray-600">Exam:</label>
            <select
              onChange={handleChange}
              value={userData.exam || ""}
              className="border p-2 w-full rounded-md"
            >
              <option value="">All Exams</option>
              <option value="JEE">JEE</option>
              <option value="NEET">NEET</option>
            </select>
          </div>

          {/* Credits (New Field) */}
          <div>
            <label className="text-gray-600">Credits:</label>
            <input
              type="number"
              name="credits"
              value={userData.credits}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Save Changes ✅
        </button>
      </div>
    </div>
  );
}

export default EditUser;
