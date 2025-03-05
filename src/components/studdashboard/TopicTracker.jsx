import React, { useContext } from "react";
import useStudentSyllabus from "../useStudentSyllabus";
import { AuthContext } from "../../AuthProvider";

const TopicTracker = () => {
  const { currentUser } = useContext(AuthContext);
  const studentId = currentUser?.uid;
  const { syllabus, updateStatus } = useStudentSyllabus(studentId);
  const statuses = ["pending", "ongoing", "completed"];

  console.log("Syllabus Data:", syllabus); // Debugging Step

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📚 Student Syllabus</h2>
      {syllabus &&
        Object.entries(syllabus).map(([subject, topics]) => (
          <div key={subject} className="mb-6">
            <h3 className="text-lg font-medium mb-2">{subject}</h3>
            <div className="flex flex-col gap-4">
              {topics &&
                Object.values(topics).map((topic) => ( // Convert topics object to array
                  <div key={topic.name} className="bg-gray-100 p-3 rounded-md">
                    {/* Topic Name & Status */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">{topic.name}</span>
                      <select
                        value={topic.status}
                        onChange={(e) =>
                          updateStatus(subject, topic.name, null, e.target.value)
                        }
                        className="border rounded-md p-1 text-sm"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subtopics Handling */}
                    {topic.subtopics && Object.values(topic.subtopics).length > 0 && (
                      <div className="ml-4 mt-2">
                        {Object.values(topic.subtopics).map((sub) => (
                          <div
                            key={sub.name}
                            className="flex justify-between items-center p-2 bg-gray-200 rounded-md mt-1"
                          >
                            <span className="text-sm">{sub.name}</span>
                            <select
                              value={sub.status}
                              onChange={(e) =>
                                updateStatus(subject, topic.name, sub.name, e.target.value)
                              }
                              className="border rounded-md p-1 text-sm"
                            >
                              {statuses.map((status) => (
                                <option key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default TopicTracker;
