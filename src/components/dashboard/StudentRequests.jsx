import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import { db } from "../../firebase";
import {
  ref,
  onValue,
  update,
  query,
  orderByChild,
  equalTo,
  get,
  child,
} from "firebase/database";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const StudentRequests = () => {
  const { currentUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [ongoingClass, setOngoingClass] = useState(null);
  const [time, setTime] = useState("00:00:00");
  const [endedClasses, setEndedClasses] = useState({});
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [feedbackDialog, setFeedbackDialog] = useState(null);
  const [feedback, setFeedback] = useState({});

  const navigate = useNavigate();

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
        const data = snapshot.val();
        // console.log(data);
        const groupedByTutors = {};
        Object.entries(data).forEach(([id, class_]) => {
          // console.log("Class Object:", class_);
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

  const submitFeedback = async () => {
    if (!feedbackDialog || !feedback) return;

    const { tutorId, classId } = feedbackDialog;
    const feedbackRef = ref(db, `tutors/${tutorId}/classHistory`);

    const dataQuery = query(feedbackRef, orderByChild("id"), equalTo(classId));
    const snapshot = await get(dataQuery);

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const recordRef = childSnapshot.ref;
        const feedbackPath = child(recordRef, "feedback");
        update(feedbackPath, feedback)
          .then(() => {
            setFeedbackDialog(null);
            setFeedback({});
            toast.success("Feedback saved successfully");
          })
          .catch((error) => {
            console.error("Error saving feedback:", error);
            toast.error(error.message);
          });
      });
    } else {
      console.error("No record found");
    }
  };

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
              <button className="w-full flex justify-between text-left font-semibold bg-gray-200 p-2 rounded">
                <p
                  className="w-full"
                  onClick={() =>
                    setSelectedTutor(selectedTutor === tutor ? null : tutor)
                  }
                >
                  {tutor} ▼
                </p>
              </button>
              {/* Show Classes if Tutor is Selected */}
              {selectedTutor === tutor && (
                <div className="mt-2 space-y-2">
                  {endedClasses[tutor].map((class_) => (
                    <div
                      key={class_.id}
                      className="hover:border-peach-300 border-2 p-4  rounded-2xl transition-colors"
                    >
                      <div className="flex justify-end w-full">
                        <button
                          className="justify-self-end text-md bg-blue-500 text-white p-2 rounded-lg"
                          onClick={() => navigate(`/tutor/${class_.tutorId}`)}
                        >
                          Know the Tutor
                        </button>
                      </div>
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

                      {/* Feedback Button */}
                      {/* {console.log(class_)} */}
                      {!class_.feedback ||
                      Object.keys(class_.feedback).length === 0 ? (
                        <button
                          onClick={() =>
                            setFeedbackDialog({
                              tutorId: class_.tutorId,
                              classId: class_.id,
                            })
                          }
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                        >
                          Give Feedback
                        </button>
                      ) : (
                        <button
                          className="mt-2 px-4 py-2 bg-gray-400 text-white rounded"
                          disabled
                        >
                          Feedback Given
                        </button>
                      )}
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

      {feedbackDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-2">Rate the Class</h2>

            {/* Rating Inputs */}
            {[
              "Teaching Quality",
              "Engagement & Interaction",
              "Concept Understanding",
              "Punctuality & Professionalism",
              "Class Structure",
              "Doubt Resolution",
              "Overall Satisfaction",
            ].map((param) => (
              <div key={param} className="mb-2">
                <label className="block font-semibold">{param}</label>
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    setFeedback((prev) => ({
                      ...prev,
                      [param]: e.target.value,
                    }))
                  }
                >
                  <option value="">Select</option>
                  <option value="Bad">Bad</option>
                  <option value="Okay">Okay</option>
                  <option value="Good">Good</option>
                </select>
              </div>
            ))}

            {/* Submit & Cancel Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setFeedbackDialog(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => submitFeedback()}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRequests;
