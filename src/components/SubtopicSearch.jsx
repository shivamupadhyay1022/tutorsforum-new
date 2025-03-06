import React, { useState, useEffect } from "react";
import syllabusData from "../syllabuses/syllabus.json"; // Import syllabus JSON

const SubtopicSearch = ({func}) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [syllabus, setSyllabus] = useState({});

  // Load syllabus.json into state
  useEffect(() => {
    setSyllabus(syllabusData);
  }, []);

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
        }}
        className="border p-2 rounded-md w-full mb-2"
        disabled={!selectedClass}
      >
        <option value="">Select Subject</option>
        {selectedClass &&
          Object.keys(syllabus[selectedClass] || {}).map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
      </select>

      {/* Topic Selection */}
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

      {/* Subtopic Selection */}
      <select
        value={selectedSubtopic}
        onChange={(e) => {setSelectedSubtopic(e.target.value); func(selectedClass+","+selectedSubject+","+selectedTopic+","+selectedSubtopic)}}
        className="border p-2 rounded-md w-full mb-2"
        disabled={!selectedTopic}
      >
        <option value="">Select Subtopic</option>
        {selectedTopic &&
          syllabus[selectedClass]?.[selectedSubject]
            ?.find((topic) => topic.name === selectedTopic)
            ?.subtopics.map((subtopic, index) => (
              <option key={index} value={subtopic.name}>
                {subtopic.name}
              </option>
            ))}
      </select>

      {/* Summary */}
      {selectedClass && selectedSubject && selectedTopic && selectedSubtopic && (
        <p className="mt-4 p-2 bg-gray-100 rounded-md text-gray-700">
          📌 Selected: <strong>{selectedClass}</strong> → <strong>{selectedSubject}</strong> → <strong>{selectedTopic}</strong> → <strong>{selectedSubtopic}</strong>
        </p>
      )}
    </div>
  );
};

export default SubtopicSearch;
