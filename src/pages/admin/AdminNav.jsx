import React, { useState } from "react";

function AdminNav() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex flex-col absolute  z-50 w-full">
      <header className="flex items-center justify-between p-6 bg-white shadow-md md:px-8">
        <button onClick={toggleSidebar} className="md:hidden">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <button onClick={toggleSidebar} className="hidden md:block mr-4">
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
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        </button>
        <div className="flex items-center w-full justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome back, Admin!</p>
        </div>
      </header>
      {/* Sidebar */}
      <div
        className={`fixed  w-64 md:h-full bg-white shadow-lg  transform transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:w-1/4 z-50`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between text-center mb-6">
            <h2 className="text-2xl font-bold h-full text-center ">
              Admin Panel
            </h2>
            <button onClick={toggleSidebar} className="">
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
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
            </button>
          </div>
          <nav className="space-y-4">
            <a
              href="/admin/dashboard"
              className="block text-gray-700 font-medium"
            >
              Dashboard
            </a>
            <a href="/admin/users" className="block text-gray-700 font-medium">
              Users
            </a>
            <a href="/admin/tutors" className="block text-gray-700 font-medium">
              Tutors
            </a>
            <a href="#" className="block text-gray-700 font-medium">
              Payments
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default AdminNav;
