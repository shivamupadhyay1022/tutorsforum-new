import React, { useState, useEffect } from "react";
import syllabusData from "../syllabuses/syllabus.json"; // Import syllabus JSON

const SubtopicSearch = ({ func }) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [customInput, setCustomInput] = useState(""); // Input for additional notes
  const [practiceFeedback, setPracticeFeedback] = useState(""); // Input for practice test feedback
  const [syllabus, setSyllabus] = useState({});

  // Load syllabus.json into state
  useEffect(() => {
    setSyllabus(syllabusData);
  }, []);

  // Function to handle changes & send data to parent
  const handleUpdate = () => {
    let finalValue = selectedClass + "," + selectedSubject;
    
    if (selectedSubject === "Practice Test") {
      finalValue += "," + (practiceFeedback.trim() ? practiceFeedback : "No Feedback");
    } else if (selectedTopic && selectedSubtopic) {
      finalValue += "," + selectedTopic + "," + selectedSubtopic;
      if (customInput.trim()) finalValue += "," + customInput;
    }

    func(finalValue);
  };

  return (
    <div className="p-4">
      {/* Class Selection */}
      <select
        value={selectedClass}
        onChange={(e) => {
          setSelectedClass(e.target.value);
          setSelectedSubject("");
          setSelectedTopic("");
          setSelectedSubtopic("");
          setCustomInput("");
          setPracticeFeedback("");
        }}
        className="border p-2 rounded-md w-full mb-2"
      >
        <option value="">Select Class</option>
        {Object.keys(syllabus).map((className) => (
          <option key={className} value={className}>
            {className}
          </option>
        ))}
      </select>

      {/* Subject Selection */}
      <select
        value={selectedSubject}
        onChange={(e) => {
          setSelectedSubject(e.target.value);
          setSelectedTopic("");
          setSelectedSubtopic("");
          setCustomInput("");
          setPracticeFeedback("");
        }}
        className="border p-2 rounded-md w-full mb-2"
        disabled={!selectedClass}
      >
        <option value="">Select Subject</option>
        {selectedClass && (
          <>
            {Object.keys(syllabus[selectedClass] || {}).map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
            <option value="Practice Test">Practice Test</option>
          </>
        )}
      </select>

      {/* Topic Selection (Hidden if "Practice Test" is chosen) */}
      {selectedSubject !== "Practice Test" && (
        <select
          value={selectedTopic}
          onChange={(e) => {
            setSelectedTopic(e.target.value);
            setSelectedSubtopic("");
          }}
          className="border p-2 rounded-md w-full mb-2"
          disabled={!selectedSubject}
        >
          <option value="">Select Topic</option>
          {selectedSubject &&
            syllabus[selectedClass]?.[selectedSubject]?.map((topic, index) => (
              <option key={index} value={topic.name}>
                {topic.name}
              </option>
            ))}
        </select>
      )}

      {/* Subtopic Selection (Hidden if "Practice Test" is chosen) */}
      {selectedSubject !== "Practice Test" && selectedTopic && (
        <select
          value={selectedSubtopic}
          onChange={(e) => setSelectedSubtopic(e.target.value)}
          className="border p-2 rounded-md w-full mb-2"
        >
          <option value="">Select Subtopic</option>
          {syllabus[selectedClass]?.[selectedSubject]
            ?.find((topic) => topic.name === selectedTopic)
            ?.subtopics.map((subtopic, index) => (
              <option key={index} value={subtopic.name}>
                {subtopic.name}
              </option>
            ))}
        </select>
      )}

      {/* Custom Input Field (Appears for both normal and practice test cases) */}
      {(selectedSubject === "Practice Test" || (selectedTopic && selectedSubtopic)) && (
        <input
          type="text"
          placeholder={selectedSubject === "Practice Test" ? "Feedback (optional)" : "Add details (optional)"}
          value={selectedSubject === "Practice Test" ? practiceFeedback : customInput}
          onChange={(e) =>
            selectedSubject === "Practice Test"
              ? setPracticeFeedback(e.target.value)
              : setCustomInput(e.target.value)
          }
          className="border p-2 rounded-md w-full mb-2"
        />
      )}

      {/* Send data to parent when changes happen */}
      {selectedClass && selectedSubject && (selectedSubject === "Practice Test" || (selectedTopic && selectedSubtopic)) && handleUpdate()}

      {/* Summary */}
      {selectedClass && selectedSubject && (
        <p className="mt-4 p-2 bg-gray-100 rounded-md text-gray-700">
          📌 Selected: <strong>{selectedClass}</strong> → <strong>{selectedSubject}</strong>{" "}
          {selectedTopic && selectedSubtopic && (
            <>
              → <strong>{selectedTopic}</strong> → <strong>{selectedSubtopic}</strong>
            </>
          )}
        </p>
      )}
    </div>
  );
};

export default SubtopicSearch;
