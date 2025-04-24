import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import { AuthContext } from "../../AuthProvider";
import { db } from "../../firebase";

function DashNav({ func, refresh }) {
  const [menu, toggleMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  // Fetch notifications from Firebase
  useEffect(() => {
    if (currentUser) {
      const path = `tutors/${currentUser.uid}/notifications`;
      const altPath = `users/${currentUser.uid}/notifications`;

      const pathRef = ref(db, path);
      const altPathRef = ref(db, altPath);

      const unsubscribe = onValue(pathRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setNotifications(
            Object.entries(data).map(([id, notif]) => ({ id, ...notif }))
          );
        } else {
          onValue(altPathRef, (altSnapshot) => {
            if (altSnapshot.exists()) {
              const data = altSnapshot.val();
              setNotifications(
                Object.entries(data).map(([id, notif]) => ({ id, ...notif }))
              );
            } else {
              setNotifications([]);
            }
          });
        }
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);

    // Mark all as read
    notifications.forEach((notif) => {
      if (!notif.read) {
        const notifRef = ref(
          db,
          `users/${currentUser?.uid}/notifications/${notif.id}`
        );
        update(notifRef, { read: true });
      }
    });
  };

  const handleDelete = (id) => {
    const userTypePath =
      notifications[0]?.userType === "tutor"
        ? `tutors/${currentUser.uid}/notifications/${id}`
        : `users/${currentUser.uid}/notifications/${id}`;
    remove(ref(db, userTypePath));
  };

  const menuItems = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      ),
      label: "Home",
      onClick: () => func("home"),
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      ),
      label: "Profile",
      onClick: () => func("profile"),
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
      ),
      label: "Classes",
      onClick: () => func("previous_classes"),
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
          />
        </svg>
      ),
      label: "Chat",
      onClick: () => func("chats"),
    },
  ];

  return (
    <div className="w-full flex items-center justify-between p-3 border-b px-8">
      <div className="flex items-center gap-3">
        <div
          className="font-bold text-lg cursor-pointer"
          onClick={() => navigate("/")}
        >
          TutorsForum
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex gap-5">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 text-sm cursor-pointer hover:opacity-70"
              onClick={item.onClick}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
        <div
          className="relative cursor-pointer"
          onClick={handleNotificationClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
            />
          </svg>

          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-200 flex-col p-1 border rounded shadow-lg z-50 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 flex bg-white justify-between border-b text-sm"
                  >
                    {notif.message || "No message"}
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
          )}
        </div>

        <div
          className="md:hidden cursor-pointer"
          onClick={() => toggleMenu(!menu)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
            />
          </svg>
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
      {menu && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg z-50">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-3 text-sm border-b cursor-pointer hover:bg-gray-100"
              onClick={item.onClick}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashNav;
