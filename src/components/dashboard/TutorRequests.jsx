import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import { db } from "../../firebase";
import { ref, onValue, update, remove, set, get } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import SubtopicSearch from "../SubtopicSearch";

const TutorRequests = () => {
  const { currentUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [fetchedOtp, setFetchedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [ongoingClass, setOngoingClass] = useState(null);
  const [time, setTime] = useState("00:00:00");
  const [topicsCovered, setTopicsCovered] = useState("");
  const [studentName, setStudentName] = useState("");
  const [tutorName, setTutorName] = useState("");
  const [topicsList, setTopicsList] = useState([]);
  const [endedClasses, setEndedClasses] = useState([]);

  useEffect(() => {
    const requestsRef = ref(db, `tutors/${currentUser?.uid}/requests`);
    onValue(requestsRef, (snapshot) => {
      if (snapshot.exists()) setRequests(Object.entries(snapshot.val()));
      else setRequests([]);
    });
    // console.log(Date.now());
  }, [currentUser]);

  useEffect(() => {
    const classRef = ref(db, `tutors/${currentUser?.uid}/classOngoing`);
    onValue(classRef, (snapshot) => {
      if (snapshot.exists()) {
        const classData = Object.entries(snapshot.val())[0]; // Get the first ongoing class
        setOngoingClass({ id: classData[0], ...classData[1] });
      } else {
        setOngoingClass(null);
      }
    });
  }, [currentUser]);

  // ⏳ Live Timer (HH:MM:SS format)
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

    const classesRef = ref(db, `tutors/${currentUser.uid}/classHistory`);
    onValue(classesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = Object.entries(snapshot.val()).map(([id, details]) => ({
          id,
          ...details,
        }));
        // const data = snapshot.val();
        // console.log(data);
        setEndedClasses(data);
      } else {
        setEndedClasses([]);
      }
    });
  }, [currentUser]);

  // ✅ Approve Request - Updates status to 'approved' & generates OTP
  const requestApprove = (studentId) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    update(ref(db, `tutors/${currentUser.uid}/requests/${studentId}`), {
      status: "approved",
      otp: generatedOtp,
    });
    update(ref(db, `users/${studentId}/requests/${currentUser.uid}`), {
      status: "approved",
      otp: generatedOtp,
    });
    toast.success("Request approved! Student must share OTP with you.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // ❌ Reject Request - Updates status to 'rejected'
  const requestReject = (studentId) => {
    update(ref(db, `tutors/${currentUser.uid}/requests/${studentId}`), {
      status: "rejected",
    });
    update(ref(db, `users/${studentId}/requests/${currentUser.uid}`), {
      status: "rejected",
    });
    toast.error("Request rejected.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // 🗑️ Delete Request - Removes request from database
  const deleteRequest = (studentId) => {
    remove(ref(db, `tutors/${currentUser.uid}/requests/${studentId}`));
    remove(ref(db, `users/${studentId}/requests/${currentUser.uid}`));
    toast.success("Request deleted.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // 🔑 Verify OTP & Start Class
  const verifyOtpAndStartClass = (studentId) => {
    const studentRef = ref(
      db,
      `users/${studentId}/requests/${currentUser.uid}`
    );
    const studentNameRef = ref(db, `users/${studentId}`);
    const tutorNameRef = ref(db, `tutors/${currentUser.uid}`);
    get(studentNameRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // console.log(data.name);
        setStudentName(snapshot.val().name);
      }
    });
    get(tutorNameRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // console.log(data.name);
        setTutorName(snapshot.val().name);
      }
    });
    get(studentRef).then((snapshot) => {
      if (snapshot.exists()) {
        // console.log(snapshot.val());
        setFetchedOtp(snapshot.val().otp);
      } else {
        // If no syllabus data exists, initialize from JSON
        toast.error("Otp not found.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    });
    if (enteredOtp !== fetchedOtp) {
      return toast.error("Incorrect Otp.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      const classId = uuidv4();
      const classDetails = {
        tutorId: currentUser.uid,
        tutorName: tutorName,
        studentId: studentId,
        studentName: studentName,
        startTime: Date.now(),
        status: "ongoing",
      };

      // Store in both student & tutor history
      set(ref(db, `users/${studentId}/classOngoing/${classId}`), classDetails);
      set(
        ref(db, `tutors/${currentUser.uid}/classOngoing/${classId}`),
        classDetails
      );
      remove(ref(db, `users/${studentId}/requests/${currentUser.uid}`));
      remove(ref(db, `tutors/${currentUser.uid}/requests/${studentId}`));
      alert("Class Started!");
    }
  };

  const endClass = () => {
    const classId = uuidv4();
    const completedClassDetails = {
      ...ongoingClass,
      endTime: Date.now(),
      duration: time, // Store elapsed time as duration
      topicsCovered: topicsList, // Convert string to array
      status: "completed",
    };

    // Store in student & tutor history
    set(
      ref(db, `users/${ongoingClass.studentId}/classHistory/${classId}`),
      completedClassDetails
    );
    set(
      ref(db, `tutors/${currentUser.uid}/classHistory/${classId}`),
      completedClassDetails
    );

    // Remove from ongoing classes
    remove(
      ref(db, `users/${ongoingClass.studentId}/classOngoing/${ongoingClass.id}`)
    );
    remove(
      ref(db, `tutors/${currentUser.uid}/classOngoing/${ongoingClass.id}`)
    );

    setOngoingClass(null);
    alert("Class ended & saved to history!");
  };

  // Function to add topics
  const addTopic = () => {
    if (!topicsCovered.trim()) return alert("Enter a topic first!");

    const newTopics = topicsCovered;
    const uniqueTopics = [...new Set([...topicsList, newTopics])]; // Remove duplicates

    setTopicsList(uniqueTopics);
    setTopicsCovered(""); // Clear input
    setTopicsFinal(uniqueTopics); // Pass final topics to parent
  };

  // Function to remove topic
  const removeTopic = (topic) => {
    const updatedTopics = topicsList.filter((t) => t !== topic);
    setTopicsList(updatedTopics);
    setTopicsFinal(updatedTopics); // Update parent state
  };

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
                      with <strong className="text-xl" >{class_.studentName}</strong>
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

      <h2 className="text-lg font-bold">Ongoing Class</h2>
      {ongoingClass ? (
        <div className="px-2 border rounded mb-4">
          <p>
            <strong>Student:</strong> {ongoingClass.studentId}
          </p>
          <p>
            <strong>Started:</strong>{" "}
            {new Date(ongoingClass.startTime).toLocaleString()}
          </p>
          {/* Live Timer Display */}
          <p className="text-2xl font-bold text-blue-500">⏳ {time}</p>
          <p>
            <strong>Select Topic Covered before ending class:</strong>
          </p>
          {/* End Class Input & Button */}
          <div className="flex flex-col gap-3">
            <SubtopicSearch func={setTopicsCovered} />

            <div className="flex items-center gap-3">
              <hr className="flex-1 border-2 border-gray-300" />
              <p className="text-xl">Or</p>
              <hr className="flex-1 border-2 border-gray-300" />
            </div>

            <div className="flex">
              <input
                type="text"
                value={topicsCovered}
                onChange={(e) => setTopicsCovered(e.target.value)}
                placeholder="Enter topics (comma separated)"
                className="border p-2 w-full rounded"
              />
              <button
                onClick={addTopic}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>

            {/* Display Added Topics */}
            <div className="flex flex-wrap gap-2">
              {topicsList.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-200 px-3 py-1 rounded-full"
                >
                  {topic}
                  <button
                    onClick={() => removeTopic(topic)}
                    className="ml-2 text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={endClass}
            className="bg-red-500 text-white p-2 rounded w-full mt-2"
          >
            End Class
          </button>
        </div>
      ) : (
        <p className="mb-4">No ongoing class</p>
      )}

      <h2 className="text-lg font-bold">Student Requests</h2>
      {requests.length === 0 && <p>No pending requests</p>}
      {requests.map(([studentId, request]) => (
        <div
          key={studentId}
          className="p-2 flex flex-col md:flex-row justify-between border rounded mt-2 relative"
        >
          {/* 🗑️ Delete Request Button (Top Right Corner) */}

          <div>
            <p>
              <strong>{request.studentName}</strong> requested a class
            </p>
            <p>
              Student ID: <span>{request.studentId} </span>
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

          {/* 🔑 OTP Entry for Approved Requests */}
          {request.status === "approved" && (
            <div className="flex flex-col ">
              <input
                type="text"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                placeholder="Enter OTP"
                className="border p-2 rounded w-full"
              />
              <button
                onClick={() => verifyOtpAndStartClass(request.studentId)}
                className="bg-blue-500 text-white p-2 rounded w-full mt-2"
              >
                Start Class
              </button>
            </div>
          )}

          <div className="flex gap-2">
            {/* ✅ Approve & ❌ Reject Buttons */}
            {request.status === "pending" && (
              <div className="flex">
                <button
                  onClick={() => requestApprove(request.studentId)}
                  className="text-2xl"
                >
                  ✅
                </button>
                <button
                  onClick={() => requestReject(request.studentId)}
                  className="text-2xl"
                >
                  ❌
                </button>
              </div>
            )}
            <button
              onClick={() => deleteRequest(request.studentId)}
              className="text-2xl"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TutorRequests;
