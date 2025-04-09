import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import { db } from "../firebase";
import { ref, onValue, remove } from "firebase/database";

function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const path = `tutors/${currentUser.uid}/notifications`;
      const altPath = `users/${currentUser.uid}/notifications`;

      const pathRef = ref(db, path);
      const altPathRef = ref(db, altPath);

      const unsubscribe = onValue(pathRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setNotifications(Object.entries(data).map(([id, notif]) => ({ id, ...notif })));
        } else {
          onValue(altPathRef, (altSnapshot) => {
            if (altSnapshot.exists()) {
              const data = altSnapshot.val();
              setNotifications(Object.entries(data).map(([id, notif]) => ({ id, ...notif })));
            } else {
              setNotifications([]);
            }
          });
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleDelete = (id) => {
    const userTypePath = notifications[0]?.userType === "tutor"
      ? `tutors/${currentUser.uid}/notifications/${id}`
      : `users/${currentUser.uid}/notifications/${id}`;
    remove(ref(db, userTypePath));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center h-16">
          <div className="flex items-center">
            <span
              onClick={() => navigate("/")}
              className="text-xl font-semibold bg-gradient-to-r from-peach-300 to-peach-100 bg-clip-text text-transparent cursor-pointer"
            >
              TutorsForum
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="relative focus:outline-none"
                >
                  {/* Bell Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.418A2.001 2.001 0 0112 19a2.001 2.001 0 01-2.857-1.582M6.73 10.73a7.5 7.5 0 0110.54 0M18 12c0 3.866-3.582 7-8 7S2 15.866 2 12c0-3.314 2.686-6 6-6s6 2.686 6 6z"
                    />
                  </svg>
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="p-2">
                      {notifications.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center">No notifications</p>
                      ) : (
                        notifications.slice(0, 5).map((notif) => (
                          <div
                            key={notif.id}
                            className="flex justify-between items-center p-2 border-b last:border-none"
                          >
                            <span className="text-sm text-gray-700">{notif.message}</span>
                            <button onClick={() => handleDelete(notif.id)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-500 hover:text-red-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        ))
                      )}
                      {notifications.length > 5 && (
                        <button
                          className="w-full text-sm text-blue-600 hover:underline mt-1"
                          onClick={() => {
                            setShowDialog(true);
                            setShowDropdown(false);
                          }}
                        >
                          Show more...
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentUser ? (
              <button
                className="bg-gradient-to-r p-2 rounded-xl from-peach-300 to-peach-100 text-white hover:opacity-80 transition-opacity"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </button>
                <button
                  className="bg-gradient-to-r p-2 rounded-xl from-peach-300 to-peach-100 text-white hover:opacity-90 transition-opacity"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dialog for all notifications */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-96 rounded-lg shadow-lg p-4 relative">
            <h2 className="text-lg font-semibold mb-4">All Notifications</h2>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <span className="text-sm text-gray-700">{notif.message}</span>
                  <button onClick={() => handleDelete(notif.id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-500 hover:text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
