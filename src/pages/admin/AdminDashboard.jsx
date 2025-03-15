import { useState } from "react";
import AdminNav from "./AdminNav";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminName] = useState("Robert Grant");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const hourlyData = [
    { name: "Mon", tutor: 35, student: 28 },
    { name: "Tue", tutor: 25, student: 20 },
    { name: "Wed", tutor: 30, student: 25 },
    { name: "Thu", tutor: 27, student: 18 },
    { name: "Fri", tutor: 20, student: 15 },
    { name: "Sat", tutor: 30, student: 25 },
    { name: "Sun", tutor: 25, student: 20 },
  ];

  const upcomingSessions = [
    {
      id: 1,
      title: "Math Tutoring",
      time: "14:00",
      student: "Alex Wilson",
      chapters: "10 of 45 chapters",
    },
    {
      id: 2,
      title: "Science Concepts",
      time: "15:00",
      student: "Emma Parker",
      chapters: "5 of 30 chapters",
    },
  ];

  const platformStats = [
    { platform: "In-Person", change: "+2%" },
    { platform: "Online", change: "-7%" },
    { platform: "Hybrid", change: "+4%" },
    { platform: "Group", change: "+2%" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 ">
      <AdminNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col mt-16">
        {/* Navbar */}


        {/* Main Content */}
        <main className="p-6 md:p-8 space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Revenue" value="$950,031" change="+20.1%" />
            <Card title="Expenses" value="$234,390" change="+7.4%" />
            <Card title="Total Tutors" value="342" change="+12 this month" />
            <Card
              title="Total Students"
              value="5,721"
              change="+127 this month"
            />
          </div>

          {/* Hourly Data */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Total Hours Spent</h2>
            <div className="flex gap-4">
              {hourlyData.map((data) => (
                <div key={data.name} className="flex flex-col items-center">
                  <div
                    className="bg-purple-400 rounded-md"
                    style={{ height: `${data.tutor * 2}px`, width: "24px" }}
                  ></div>
                  <div
                    className="bg-pink-300 rounded-md mt-1"
                    style={{ height: `${data.student * 2}px`, width: "24px" }}
                  ></div>
                  <p className="mt-2 text-xs text-gray-600">{data.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-medium">{session.title}</h4>
                    <p className="text-xs text-gray-600">
                      {session.chapters} • {session.student}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{session.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {platformStats.map((stat) => (
              <div
                key={stat.platform}
                className="bg-white p-6 rounded-lg text-center shadow-md"
              >
                <h3 className="text-md font-semibold">{stat.platform}</h3>
                <p
                  className={`text-lg font-bold ${
                    stat.change.includes("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

// Reusable Card Component
const Card = ({ title, value, change }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{change}</p>
  </div>
);
