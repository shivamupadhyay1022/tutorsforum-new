import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";

const StudentRequests = () => {
  const { currentUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [ongoingClass, setOngoingClass] = useState(null);
  const [time, setTime] = useState("00:00:00");
  const [endedClasses, setEndedClasses] = useState({});
  const [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(() => {
    const requestsRef = ref(db, `users/${currentUser?.uid}/requests`);
    onValue(requestsRef, (snapshot) => {
      if (snapshot.exists()) {
        setRequests(Object.entries(snapshot.val()));
      } else setRequests([]);
    });
  }, [currentUser]);

  useEffect(() => {
    const classRef = ref(db, `users/${currentUser?.uid}/classOngoing`);
    onValue(classRef, (snapshot) => {
      if (snapshot.exists()) {
        const classData = Object.entries(snapshot.val())[0];
        setOngoingClass({ id: classData[0], ...classData[1] });
      } else {
        setOngoingClass(null);
      }
    });
  }, [currentUser]);

  useEffect(() => {
    if (ongoingClass) {
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - ongoingClass.startTime) / 1000);

        const hours = String(Math.floor(elapsed / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
        const seconds = String(elapsed % 60).padStart(2, "0");

        setTime(`${hours}:${minutes}:${seconds}`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [ongoingClass]);

  useEffect(() => {
    if (!currentUser) return;

    const classesRef = ref(db, `users/${currentUser.uid}/classHistory`);
    onValue(classesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const groupedByTutors = {};
        Object.entries(data).forEach(([id, class_]) => {
          if (!groupedByTutors[class_.tutorName]) {
            groupedByTutors[class_.tutorName] = [];
          }
          groupedByTutors[class_.tutorName].push({ id, ...class_ });
        });
        setEndedClasses(groupedByTutors);
      } else {
        setEndedClasses({});
      }
    });
  }, [currentUser]);

  return (
    <div className="p-4 border rounded-lg shadow-md">
      {/* Ended Classes */}
      <h2 className="text-lg font-bold mb-4">Ended Classes</h2>
      {Object.keys(endedClasses).length === 0 ? (
        <p className="mb-4">No ended classes found.</p>
      ) : (
        <div className="grid gap-4 mb-4">
          {Object.keys(endedClasses).map((tutor) => (
            <div key={tutor}>
              {/* Tutor Dropdown */}
              <button
                className="w-full text-left font-semibold bg-gray-200 p-2 rounded"
                onClick={() =>
                  setSelectedTutor(selectedTutor === tutor ? null : tutor)
                }
              >
                {tutor} ▼
              </button>
              {/* Show Classes if Tutor is Selected */}
              {selectedTutor === tutor && (
                <div className="mt-2 space-y-2">
                  {endedClasses[tutor].map((class_) => (
                    <div
                      key={class_.id}
                      className="hover:border-peach-300 border-2 p-4 cursor-pointer rounded-2xl transition-colors"
                    >
                      <div>
                        <p className="text-sm text-gray-500">
                          <strong>{class_.subject}</strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(class_.startTime).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="bg-gray-100 px-2 py-1 rounded text-sm">
                          <strong>Duration:</strong> {class_.duration} min
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {class_.topicsCovered?.map((topic) => (
                            <span
                              key={topic}
                              className="bg-peach-200 text-sm px-2 py-1 rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Ongoing Class */}
      <h2 className="text-lg font-bold">Ongoing Class</h2>
      {ongoingClass ? (
        <div className="p-2 border rounded mt-2">
          <p>
            <strong>Student:</strong> {ongoingClass.studentId}
          </p>
          <p>
            <strong>Started:</strong>{" "}
            {new Date(ongoingClass.startTime).toLocaleString()}
          </p>
          <p className="text-2xl font-bold text-blue-500">⏳ {time}</p>
        </div>
      ) : (
        <p>No ongoing class</p>
      )}

      {/* Student Requests */}
      <h2 className="text-lg font-bold">Student Requests</h2>
      {requests.length === 0 && <p>No pending requests</p>}
      {requests.map(([tutorId, request]) => (
        <div key={tutorId} className="p-2 flex justify-between border rounded mt-2">
          <div>
            <p>
              Requested a class to <strong>{request.tutorName}</strong>
            </p>
            <p>
              Tutor Id: <span>{request.tutorId}</span>
            </p>
            <p>
              Status:{" "}
              <span
                className={
                  request.status === "approved"
                    ? "text-green-500"
                    : "text-yellow-500"
                }
              >
                {request.status}
              </span>
            </p>
          </div>
          {request.status === "approved" && (
            <div className="flex flex-col">
              <p>To start the class, give tutor the following OTP</p>
              <p>OTP: {request.otp}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentRequests;
