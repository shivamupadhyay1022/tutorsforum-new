import { useEffect, useState } from "react";
import { ref, get, remove } from "firebase/database";
import { db, auth } from "../../firebase";
import { deleteUser } from "firebase/auth";
import AdminNav from "./AdminNav";
import { useNavigate } from "react-router-dom";
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); 
  // Fetch all students from Firebase
  const fetchUsers = async () => {
    const usersRef = ref(db, "users/");
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const usersArray = Object.keys(data).map((userId) => ({
        id: userId,
        ...data[userId],
      }));
      setUsers(usersArray);
    }
  };

  // Delete User from Auth & Realtime db
  const handleDelete = async (userId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmation) return;

    // Delete from Firebase Realtime db
    await remove(ref(db, `users/${userId}`));

    // Delete from Firebase Authentication (if user is authenticated)
    const userToDelete = auth.currentUser;
    if (userToDelete) {
      await deleteUser(userToDelete);
    }

    // Remove from local state
    setUsers(users.filter((user) => user.id !== userId));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className=" bg-gray-100 min-h-screen">
      <AdminNav/>
      <h1 className="text-3xl font-bold mb-8">Manage Students</h1>

      <div className="grid p-8 mt-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow-md p-6 relative"
            onClick={() => navigate(`/admin/users/${user.id}`)}
          >
            {/* Edit & Delete Buttons */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button className="text-blue-500 hover:text-blue-700">✏️</button>
              <button
                onClick={() => handleDelete(user.id)}
                className="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </div>

            {/* User Info */}
            <img
              src={user.profilepic || "/default-avatar.png"}
              alt="Profile"
              className="w-20 h-20 mx-auto rounded-full mb-4"
            />
            <div className="flex flex-col justify-start">
              <h3 className="text-lg font-semibold ">{user.name}</h3>
              <p className="text-sm text-gray-500 ">{user.email}</p>
              <p className="text-sm text-gray-500 ">
                Class: <strong>{user.clas}</strong>
              </p>
              <p className="text-sm text-gray-500 ">
                Exam: <strong>{user.exam}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
