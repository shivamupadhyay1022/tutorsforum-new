import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import { db } from "../../firebase";
import { ref, onValue, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

const TutorRequests = () => {
  const { currentUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const requestsRef = ref(db, `tutors/${currentUser?.uid}/requests`);
    onValue(requestsRef, (snapshot) => {
      if (snapshot.exists()) setRequests(Object.entries(snapshot.val()));
      else setRequests([]);
    });
  }, [currentUser]);

  const verifyOtpAndStartClass = () => {
    if (!selectedRequest) return alert("Select a request first!");
    if (enteredOtp !== selectedRequest.otp) return alert("Incorrect OTP!");

    const classId = uuidv4();
    const classDetails = {
      tutorId: currentUser.uid,
      tutorName: currentUser.displayName,
      studentId: selectedRequest.studentId,
      subject: selectedRequest.subject,
      topics: selectedRequest.topics,
      startTime: Date.now(),
      status: "ongoing",
    };

    set(
      ref(db, `users/${selectedRequest.studentId}/classHistory/${classId}`),
      classDetails
    );
    set(
      ref(db, `tutors/${currentUser.uid}/classHistory/${classId}`),
      classDetails
    );

    alert("Class Started!");
  };

  async function requestApprove() {
    
  }
  async function requestReject() {
    
  }

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-bold">Student Requests</h2>
      {requests.length === 0 && <p>No pending requests</p>}
      {requests.map(([studentId, request]) => (
        <div key={studentId} className="p-2 flex justify-between border rounded mt-2">
          <div>
            <p>
              <strong>{request.studentName}</strong> requested a class{" "}
            </p>
            <p>
              Student Id: <span>{request.studentId}</span>
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
          <div className="flex gap-2" >
            <button onClick={requestApprove} className="text-2xl">✅</button>
            <button onClick={requestReject} className="text-2xl">❌</button>
          </div>
          {request.status === "approved" && (
            <>
              <input
                type="text"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                placeholder="Enter OTP"
                className="border p-2 rounded w-full mt-2"
              />
              <button
                onClick={verifyOtpAndStartClass}
                className="bg-blue-500 text-white p-2 rounded w-full mt-2"
              >
                Start Class
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TutorRequests;
