import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import { db } from "../../firebase";
import { ref, onValue, update, remove, set, get } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import SubtopicSearch from "../SubtopicSearch";
import { useNavigate } from "react-router-dom";

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
  const [selectedUser, setSelectedUser] = useState(null);
  const [offset, setOffset] = useState(0); // Offset from Firebase
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const requestsRef = ref(db, `tutors/${currentUser?.uid}/requests`);
    onValue(requestsRef, (snapshot) => {
      if (snapshot.exists()) {
        setRequests(Object.entries(snapshot.val()));
      } else setRequests([]);
    });
    // console.log(Date.now());
  }, [currentUser]);

  useEffect(() => {
    const classRef = ref(db, `tutors/${currentUser?.uid}/classOngoing`);
    onValue(classRef, (snapshot) => {
      if (snapshot.exists()) {
        const classData = Object.entries(snapshot.val())[0]; // Get the first ongoing class
        setOngoingClass({ id: classData[0], ...classData[1] });
        // console.log(classData[0]);
        // console.log(classData[1]);
      } else {
        setOngoingClass(null);
      }
    });
  }, [currentUser]);

  // ⏳ Live Timer (HH:MM:SS format)
  useEffect(() => {
    const offsetRef = ref(db, ".info/serverTimeOffset");
    const offsetUnsub = onValue(offsetRef, (snapshot) => {
      setOffset(snapshot.val() || 0);
    });

    if (ongoingClass) {
      const startTime = ongoingClass.startTime; // Stored startTime from Firebase

      const updateTimer = () => {
        const now = Date.now() + offset; // Adjust local time using Firebase offset
        const elapsed = Math.max(0, Math.floor((now - startTime) / 1000)); // Prevent negative values
      
        const hours = String(Math.floor(elapsed / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
        const seconds = String(elapsed % 60).padStart(2, "0");
      
        setTime(`${hours}:${minutes}:${seconds}`);
      };

      updateTimer(); // Run immediately
      const interval = setInterval(updateTimer, 1000);

      return () => {
        clearInterval(interval);
        offsetUnsub(); // Unsubscribe from Firebase offset listener
      };
    }

    return () => offsetUnsub();
  }, [ongoingClass, db, offset]);

  useEffect(() => {
    if (!currentUser) return;

    fetchStudents();
    const classesRef = ref(db, `tutors/${currentUser.uid}/classHistory`);

    onValue(classesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const groupedByUsers = {};

        Object.entries(data).forEach(([id, class_]) => {
          let studentNames = Array.isArray(class_.studentName)
            ? class_.studentName
            : [class_.studentName]; // Ensure it's always an array

          studentNames.forEach((name) => {
            if (!groupedByUsers[name]) {
              groupedByUsers[name] = [];
            }
            groupedByUsers[name].push({ id, ...class_ });
          });
        });

        setEndedClasses(groupedByUsers);
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
  const verifyOtpAndStartClass = async (studentId) => {
    try {
      const studentRef = ref(
        db,
        `users/${studentId}/requests/${currentUser.uid}`
      );
      const studentNameRef = ref(db, `users/${studentId}/name`);
      const tutorNameRef = ref(db, `tutors/${currentUser.uid}/name`);

      // Fetch student and tutor names in parallel
      const [studentSnap, tutorSnap] = await Promise.all([
        get(studentNameRef),
        get(tutorNameRef),
      ]);

      if (!studentSnap.exists() || !tutorSnap.exists()) {
        return toast.error("User data missing. Please try again.", {
          position: "top-right",
        });
      }

      const studentName = studentSnap.val();
      const tutorName = tutorSnap.val();
      setStudentName(studentName);
      setTutorName(tutorName);

      // Fetch OTP
      const requestSnap = await get(studentRef);
      if (!requestSnap.exists()) {
        return toast.error("OTP not found.", { position: "top-right" });
      }

      const otpFromDB = requestSnap.val().otp;
      if (enteredOtp !== otpFromDB) {
        return toast.error("Incorrect OTP.", { position: "top-right" });
      }

      // Proceed to start the class
      const classId = uuidv4();
      const classDetails = {
        tutorId: currentUser.uid,
        tutorName,
        studentId,
        studentName,
        startTime: Date.now(),
        status: "ongoing",
      };

      // Store in both student & tutor history
      await Promise.all([
        set(
          ref(db, `users/${studentId}/classOngoing/${classId}`),
          classDetails
        ),
        set(
          ref(db, `tutors/${currentUser.uid}/classOngoing/${classId}`),
          classDetails
        ),
        remove(ref(db, `users/${studentId}/requests/${currentUser.uid}`)),
        remove(ref(db, `tutors/${currentUser.uid}/requests/${studentId}`)),
      ]);

      toast.success("Class started.", { position: "top-right" });
      setEnteredOtp(0);
      setTime("00:00:00");
      setOffset(0);
    } catch (error) {
      console.error("Error starting class:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
      });
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
    setTime("00:00:00");
    setOffset(0);
    toast.success("Class ended.", { position: "top-right" });
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

  const fetchStudents = async () => {
    const historyRef = ref(db, `tutors/${currentUser.uid}/classHistory`);
    const snapshot = await get(historyRef);

    if (snapshot.exists()) {
      const studentMap = new Map(); // Store unique student records

      Object.values(snapshot.val()).forEach((entry) => {
        const studentIds = Array.isArray(entry.studentId)
          ? entry.studentId
          : [entry.studentId];
        const studentNames = Array.isArray(entry.studentName)
          ? entry.studentName
          : [entry.studentName];

        studentIds.forEach((sId, index) => {
          studentMap.set(sId, {
            studentId: sId,
            studentName: studentNames[index] || "Unknown", // Ensure correct mapping
          });
        });
      });

      setStudents(Array.from(studentMap.values())); // Convert Map back to an array
    }
  };

  const toggleStudentSelection = (student) => {
    setSelectedStudents((prev) =>
      prev.some((s) => s.studentId === student.studentId)
        ? prev.filter((s) => s.studentId !== student.studentId)
        : [...prev, student]
    );
  };

  const startGroupClass = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Select at least one student", {
        position: "top-right",
        timeout: 2000,
      });
      // document.getElementById("dialog").close();
      return;
    } else {
      const classId = uuidv4();
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const startTime = Date.now();
      const tutorNameRef = ref(db, `tutors/${currentUser.uid}/name`);

      const tutorSnap = await Promise.all([get(tutorNameRef)]);
      const tutorName = tutorSnap[0].val();
      const studentNames = selectedStudents.map(
        ({ studentName }) => studentName
      );
      const studentIds = selectedStudents.map(({ studentId }) => studentId);
      console.log(classId);
      console.log(selectedStudents);
      const classDetails = {
        tutorId: currentUser.uid,
        tutorName: tutorName, // Fetch if needed
        studentId: studentIds,
        studentName: studentNames,
        startTime,
        status: "approved",
        groupClass: "true",
        otp: otp,
      };
      selectedStudents.forEach(({ studentId, studentName }, index) => {
        console.log(classDetails);
        processStudents(classDetails, studentId, classId);
      });
      await set(
        ref(db, `tutors/${currentUser.uid}/requests/${classId}`),
        classDetails
      );
      toast.success("Class started successfully!", { position: "top-right" });
      document.getElementById("dialog").close();
    }
  };

  async function processStudents(classDetails, studentId, classId) {
    if (classDetails && studentId) {
      await set(
        ref(db, `users/${studentId}/requests/${classId}`),
        classDetails
      );
    } else {
      toast.error("User data missing. Contact admin.", {
        position: "top-right",
      });
    }
  }
  // start grouyp class
  const verifyOtpAndStartGroupClass = async (
    currentClassId,
    studentId,
    studentName,
    tutorName
  ) => {
    try {
      if (!enteredOtp)
        return toast.error("Enter OTP", { position: "top-right" });

      if (!studentId || !tutorName || !studentName) {
        return toast.error("User data missing. Please try again.", {
          position: "top-right",
        });
      }
      const studentRef = ref(
        db,
        `users/${studentId[0]}/requests/${currentClassId}`
      );
      // Fetch OTP
      const requestSnap = await get(studentRef);
      if (!requestSnap.exists()) {
        return toast.error("OTP not found.", { position: "top-right" });
      }

      const otpFromDB = requestSnap.val().otp;
      if (enteredOtp !== otpFromDB) {
        return toast.error("Incorrect OTP.", { position: "top-right" });
      }

      // Proceed to start the class
      const classId = uuidv4();
      const classDetails = {
        tutorId: currentUser.uid,
        tutorName: tutorName,
        studentId: studentId,
        studentName: studentName,
        startTime: Date.now(),
        status: "ongoing",
      };
      await Promise.all(
        studentId.map(async (sId) => {
          await set(
            ref(db, `users/${sId}/classOngoing/${classId}`),
            classDetails
          );
          await remove(ref(db, `users/${sId}/requests/${currentClassId}`));
          console.log(sId);
        })
      );
      set(
        ref(db, `tutors/${currentUser.uid}/classOngoing/${classId}`),
        classDetails
      );
      remove(ref(db, `tutors/${currentUser.uid}/requests/${currentClassId}`));
      toast.success("Class Started!", { position: "top-right" });
      setEnteredOtp(0);
      setTime("00:00:00");
      setOffset(0);
    } catch (error) {
      console.error("Error starting class:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
      });
    }
  };

  const endGroupClass = async () => {
    const classId = uuidv4();
    const completedClassDetails = {
      ...ongoingClass,
      groupClass: "true",
      endTime: Date.now(),
      duration: time, // Store elapsed time as duration
      topicsCovered: topicsList, // Convert string to array
      status: "completed",
    };

    // Store in student & tutor history
    await Promise.all(
      ongoingClass.studentId.map(async (sId) => {
        await set(
          ref(db, `users/${sId}/classHistory/${classId}`),
          completedClassDetails
        );
        // Remove from ongoing classes
        await remove(ref(db, `users/${sId}/classOngoing/${ongoingClass.id}`));
        // console.log(sId);
        // console.log(completedClassDetails);
      })
    );

    set(
      ref(db, `tutors/${currentUser.uid}/classHistory/${classId}`),
      completedClassDetails
    );
    remove(
      ref(db, `tutors/${currentUser.uid}/classOngoing/${ongoingClass.id}`)
    );

    setOngoingClass(null);
    setTime("00:00:00");
    setOffset(0);
    toast.success("Class ended successfully!", { position: "top-right" });
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <div className=" flex justify-between items-center mb-4">
        <h2 className="text-lg h-auto font-bold">Ended Classes</h2>
        <button
          onClick={() => document.getElementById("dialog").showModal()}
          className=" bg-peach-300 hover:bg-peach-400 text-white font-bold py-2 px-4 rounded"
        >
          Start Group Class
        </button>
      </div>
      {Object.keys(endedClasses).length === 0 ? (
        <p className="mb-4">No ended classes found.</p>
      ) : (
        <div className="grid gap-4 mb-4">
          {Object.keys(endedClasses).map((user) => (
            <div key={user}>
              {/* user Dropdown */}
              <button
                className="w-full text-left font-semibold bg-gray-200 p-2 rounded"
                onClick={() =>
                  setSelectedUser(selectedUser === user ? null : user)
                }
              >
                {user} ▼
              </button>
              {/* Show Classes if user is Selected */}
              {selectedUser === user && (
                <div className="mt-2 space-y-2">
                  {endedClasses[user].map((class_) => (
                    <div
                      key={class_.id}
                      className="hover:border-peach-300 border-2 p-4 cursor-pointer rounded-2xl transition-colors"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="text-white flex items-center my-2">
                          .
                          {class_.groupClass && (
                            <div className="bg-peach-400 p-2 text-white rounded">
                              Group Class
                            </div>
                          )}
                        </div>
                        <button
                          className="justify-self-end text-md bg-blue-500 text-white p-2 rounded-lg"
                          onClick={() =>
                            navigate(`/student/${class_.studentId}`)
                          }
                        >
                          Know the Student
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
                      {Array.isArray(class_.studentName) &&
                        class_.studentName.length > 1 && (
                          <div className="ml-2 mb-2">
                            <p>Group Class with:</p>
                            {/* {console.log(class_.studentName)} */}
                            <ul className="list-disc ml-4">
                              {class_.studentName.map((name, index) => (
                                <li key={index}>{name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 className="text-lg font-bold">Ongoing Class</h2>
      {ongoingClass ? (
        <div className="px-2 border rounded mb-4">
          {/* {ongoingClass.id} */}
          {!Array.isArray(ongoingClass.studentName) ||
          ongoingClass.studentName.length === 1 ? (
            <div>
              <p>
                <strong>Student:</strong> {ongoingClass.studentName}
              </p>
            </div>
          ) : (
            <div>
              <p>Group Class with:</p>
              <ul className="list-disc ml-4">
                {ongoingClass.studentName.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
          )}

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
            onClick={() => {
              if (
                !Array.isArray(ongoingClass.studentName) ||
                ongoingClass.studentName.length === 1
              ) {
                endClass();
                // console.log("one");
              } else {
                endGroupClass(
                  ongoingClass.id,
                  ongoingClass.studentId,
                  ongoingClass.studentName,
                  ongoingClass.tutorName
                );
                // console.log(ongoingClass.studentId);
              }
            }}
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
            {Array.isArray(request?.studentName) &&
            request?.studentName?.length > 1 ? (
              <div>
                Group class with
                <ul className="list-disc ml-4">
                  {request?.studentName?.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
                ...waiting for otp
              </div>
            ) : (
              <p>
                <strong>
                  {Array.isArray(request?.studentName)
                    ? request.studentName[0]
                    : request.studentName}
                </strong>{" "}
                requested a class
              </p>
            )}

            {/* <p>
              Student ID: <span>{request.studentId} </span>
            </p> */}
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
                onClick={() => {
                  if (
                    !Array.isArray(request.studentName) ||
                    request.studentName.length === 1
                  ) {
                    verifyOtpAndStartClass(request.studentId);
                    // console.log("one");
                  } else {
                    verifyOtpAndStartGroupClass(
                      studentId,
                      request.studentId,
                      request.studentName,
                      request.tutorName
                    );
                    // console.log(request.studentId);
                  }
                }}
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
      {/* dialog box start group class */}
      <dialog
        id="dialog"
        className="bg-white p-6 h-4/5 rounded-lg shadow-lg w-4/5 md:w-3/5 "
      >
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Start Group Class</h2>
          <button onClick={() => document.getElementById("dialog").close()}>
            ❌
          </button>
        </div>
        <h2 className="text-sm ">Selected Students</h2>
        <ul className="list-disc ml-4 my-1">
          {selectedStudents.length > 0 &&
            selectedStudents.map((student) => (
              <li key={student.studentId}> {student.studentName}</li>
            ))}
        </ul>
        <input
          type="text"
          placeholder="Search students..."
          className="border p-2 w-full mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="max-h-72 overflow-y-auto border p-2">
          {students
            .filter((s) =>
              s.studentName.toLowerCase().includes(search.toLowerCase())
            )
            .map((student) => (
              <div
                key={student.studentId}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>{student.studentName}</span>
                <button
                  className={`p-1 rounded ${
                    selectedStudents.some(
                      (s) => s.studentId === student.studentId
                    )
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => toggleStudentSelection(student)}
                >
                  ✅
                </button>
              </div>
            ))}
        </div>
        <button
          onClick={startGroupClass}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Start Class
        </button>
      </dialog>
    </div>
  );
};

export default TutorRequests;
