import { useState, useEffect } from "react";
import { ref, update, onValue } from "firebase/database";
import { db } from "../../firebase";
const TeachOnlineToggle = ({ currentUser }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const tutorRef = ref(db, "tutors/" + currentUser?.uid);

  // Fetch tutor's online status and schedule from Firebase
  useEffect(() => {
    if (currentUser) {
      onValue(tutorRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setIsOnline(data.teachOnline || false);
          setSchedule(data.schedule || []);
        }
      });
    }
  }, [currentUser]);

  // Toggle teach online status
  const toggleTeachOnline = async () => {
    const updatedStatus = !isOnline;
    setIsOnline(updatedStatus);
    try {
      await update(tutorRef, { teachOnline: updatedStatus });
    } catch (error) {
      console.error("Error updating teach online status:", error);
    }
  };

  // Add a new schedule entry
  const addScheduleEntry = async () => {
    if (selectedDay && startTime && endTime) {
      const newSchedule = [...schedule, { day: selectedDay, start: startTime, end: endTime }];
      setSchedule(newSchedule);

      try {
        await update(tutorRef, { schedule: newSchedule });
      } catch (error) {
        console.error("Error updating schedule:", error);
      }

      setSelectedDay("");
      setStartTime("");
      setEndTime("");
    }
  };

  // Remove a schedule entry
  const removeScheduleEntry = async (index) => {
    const updatedSchedule = schedule.filter((_, i) => i !== index);
    setSchedule(updatedSchedule);

    try {
      await update(tutorRef, { schedule: updatedSchedule });
    } catch (error) {
      console.error("Error removing schedule entry:", error);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-2">Teach Online</h2>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={isOnline} onChange={toggleTeachOnline} className="hidden" />
        <div
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
            isOnline ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-md transform duration-300 ${
              isOnline ? "translate-x-6" : "translate-x-0"
            }`}
          ></div>
        </div>
        <span className="text-sm">{isOnline ? "Enabled" : "Disabled"}</span>
      </label>

      {isOnline && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Set Availability</h3>
          <div className="flex gap-2 mb-2">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="border rounded-md p-2 w-full"
            >
              <option value="">Select a day</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border rounded-md p-2"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border rounded-md p-2"
            />
            <button
              onClick={addScheduleEntry}
              className="rounded-full py-1 w-12 px-2 bg-gradient-to-r from-peach-300 to-peach-100 text-white hover:opacity-90"
            >
              ✔
            </button>
          </div>

          <ul className="mt-2">
            {schedule.map((entry, index) => (
              <li key={index} className="flex justify-between items-center border-b p-2">
                <span>
                  {entry.day}: {entry.start} - {entry.end}
                </span>
                <button
                  onClick={() => removeScheduleEntry(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TeachOnlineToggle;
