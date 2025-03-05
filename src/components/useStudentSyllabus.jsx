import React from 'react'
import { useEffect, useState, useContext } from "react";
import { db } from "../firebase";
import { ref, get, update } from "firebase/database";
import syllabusData from "../syllabuses/syllabus.json";
import { AuthContext } from '../AuthProvider';

const useStudentSyllabus = () => {
    const [syllabus, setSyllabus] = useState({});
      const { currentUser } = useContext(AuthContext);
      const studentId = currentUser.uid;

    // Fetch student syllabus progress from Firebase
    useEffect(() => {
        console.log(studentId)
      if (!studentId) return;
  
      const studentRef = ref(db, `users/${studentId}/syllabus`);
      get(studentRef).then((snapshot) => {
        if (snapshot.exists()) {
          setSyllabus(snapshot.val());
        } else {
          // If no syllabus data exists, initialize from JSON
          setSyllabus(syllabusData);
          update(studentRef, syllabusData);
        }
      });
    }, [studentId]);
  
    // Update topic or subtopic status
    const updateStatus = async (subject, topicId, subtopicId = null, newStatus) => {
      let path = `users/${studentId}/syllabus/${subject}/${topicId}`;
      if (subtopicId) {
        path += `/subtopics/${subtopicId}`;
      }
      
      const statusRef = ref(db, path);
      await update(statusRef, { status: newStatus });
  
      setSyllabus((prev) => ({
        ...prev,
        [subject]: prev[subject].map((topic) => {
          if (topic.id === topicId) {
            if (subtopicId) {
              return {
                ...topic,
                subtopics: topic.subtopics.map((sub) =>
                  sub.id === subtopicId ? { ...sub, status: newStatus } : sub
                ),
              };
            }
            return { ...topic, status: newStatus };
          }
          return topic;
        }),
      }));
    };
  
    return { syllabus, updateStatus };
}

export default useStudentSyllabus