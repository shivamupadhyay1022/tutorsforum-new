import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import { db } from "../../firebase";
import { ref, onValue, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

const StudentRequests = () => {
  const { currentUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [ongoingClass, setOngoingClass] = useState(null);
  const [time, setTime] = useState("00:00:00");
    const [endedClasses, setEndedClasses] = useState([]);
  

  useEffect(() => {
    const requestsRef = ref(db, `users/${currentUser?.uid}/requests`);
    onValue(requestsRef, (snapshot) => {
      if (snapshot.exists()) {
        setRequests(Object.entries(snapshot.val()));
        // console.log(snapshot.val());
      } else setRequests([]);
    //   console.log(requests);
    });
  }, [currentUser]);

  useEffect(() => {
      const classRef = ref(db, `users/${currentUser?.uid}/classOngoing`);
      onValue(classRef, (snapshot) => {
        if (snapshot.exists()) {
          const classData = Object.entries(snapshot.val())[0]; // Get the first ongoing class
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
        const startTime = ongoingClass.startTime;
        const elapsed = Math.floor((now - startTime) / 1000);

        const hours = String(Math.floor(elapsed / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(
          2,
          "0"
        );
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
          const data = Object.entries(snapshot.val()).map(([id, details]) => ({
            id,
            ...details,
          }));
          // const data = snapshot.val();
        //   console.log(data);
          setEndedClasses(data);
        } else {
          setEndedClasses([]);
        }
      });
    }, [currentUser]);

  return (
    <div className="p-4 border rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Ended Classes</h2>
      {endedClasses.length === 0 ? (
        <p className="mb-4" >No ended classes found.</p>
      ) : (
        <div className="grid gap-4 mb-4">
          {endedClasses.map((class_) => (
            <div
              key={class_.id}
              className="hover:border-peach-300 border-2 p-4 cursor-pointer rounded-2xl transition-colors"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">
                      with <strong className="text-xl" >{class_.tutorName}</strong>
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(class_.rating || 0)].map((_, i) => (
                      <span
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex flex-col" >
                    <div
                      variant="secondary"
                      className="bg-gradient-to-r from-white to-[#ffded5]/10 p-1 rounded"
                    >
                      <strong>Start Time: </strong>{new Date(class_.startTime).toLocaleDateString()}
                    </div>
                    <div
                      variant="secondary"
                      className="bg-gradient-to-r from-white to-[#ffded5]/10 p-1 rounded"
                    >
                      <strong>End Time: </strong>{new Date(class_.endTime).toLocaleDateString()}
                    </div>
                    <div
                      variant="secondary"
                      className="bg-gradient-to-r from-white to-[#ffded5]/10 p-1 rounded"
                    >
                      <strong>Duration: </strong>{class_.duration} min
                    </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-center">
                      {class_.topicsCovered?.map((topic) => (
                        <div
                          key={topic}
                          className="shadow-sm rounded-full bg-gradient-to-br from-white to-[#ffded5] text-sm"
                        >
                          <div className="bg-white m-1 py-1 px-4 rounded-full">
                            {topic}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {class_.notes || "No additional notes"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
              <h2 className="text-lg font-bold">Ongoing Class </h2>
      {ongoingClass ? (
        <div className="p-2 border rounded mt-2">
          <p>
            <strong>Student:</strong> {ongoingClass.studentId}
          </p>
          <p>
            <strong>Started:</strong>{" "}
            {new Date(ongoingClass.startTime).toLocaleString()}
          </p>
          {/* Live Timer Display */}
          <p className="text-2xl font-bold text-blue-500">⏳ {time}</p>
        </div>
      ) : (
        <p>No ongoing class</p>
      )}
            <h2 className="text-lg font-bold">Student Requests</h2>
            {requests.length === 0 && <p>No pending requests</p>}
      {requests.map(([tutorId, request]) => (
        <div
          key={tutorId}
          className="p-2 flex justify-between border rounded mt-2"
        >
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
