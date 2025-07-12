import React, { useEffect, useState, useContext } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { AuthContext } from "../AuthProvider";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";

function countQuestions(questions) {
  if (!questions) return 0;
  return questions.split(",").filter((q) => q.trim() !== "").length;
}

function Exams() {
  const [exams, setExams] = useState([]);
  const {currentUser} = useContext(AuthContext)
  const [search, setSearch] = useState("");
  const [assignedTests, setAssignedTests] = useState([]);
  const [completedTests, setCompletedTests] = useState([]);
  const navigate = useNavigate()

    useEffect(() => {
    const fetchExams = async () => {
      const { data, error } = await supabase
        .from("exams")
        .select("id,Name,Duration,Questions");
      if (error) {
        alert(error.message);
      } else {
        setExams(data);
      }
    };
    fetchExams();
  }, []);


  useEffect(() => {
    console.log(currentUser)
    const assignedRef = ref(db, `users/${currentUser.uid}/tests/assigned`);
    const completedRef = ref(db, `users/${currentUser.uid}/tests/completed`);

    onValue(assignedRef, (snapshot) => {
      const vals = snapshot.val();
      const arr = [];
      if (vals) {
        Object.entries(vals).forEach(([key, val]) => {
          arr.push({ id: key, ...val });
        });
      }
      setAssignedTests(arr);
    });

    onValue(completedRef, (snapshot) => {
      const vals = snapshot.val();
      const arr = [];
      if (vals) {
        Object.entries(vals).forEach(([key, val]) => {
          arr.push({ id: key, ...val });
        });
      }
      setCompletedTests(arr);
    });

    return () => {};
  }, []);

    function formatDate(dt) {
    if (!dt) return '';
    return new Date(dt).toLocaleString();
  }

  function getExamName(test_id) {
    const exam = exams.find(ex => ex.id === test_id);
    return exam ? exam.Name : '';
  }

  function getExamQuestions(test_id) {
    const exam = exams.find(ex => ex.id === test_id);
    return exam ? countQuestions(exam.Questions) : '';
  }

      const filteredExams = exams.filter(exam =>
    exam.Name.toLowerCase().includes(search.toLowerCase())
  );
return (
  <div className="p-6 space-y-10">

      {/* Assigned Tests Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">Assigned Tests</h2>
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Test ID</th>
              <th className="border px-4 py-2">Exam Name</th>
              <th className="border px-4 py-2">Assigned At</th>
              <th className="border px-4 py-2">No of Questions</th>
              <th className="border px-4 py-2">Duration (Min)</th>
              <th className="border px-4 py-2">Attempt</th>
            </tr>
          </thead>
          <tbody>
            {assignedTests.length === 0 && (
              <tr>
                <td className="border px-4 py-2 text-center" colSpan={5}>No tests assigned.</td>
              </tr>
            )}
            {assignedTests.map(test => (
              <tr key={test.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{test.test_id}</td>
                <td className="border px-4 py-2">{test.name}</td>
                <td className="border px-4 py-2">{formatDate(test.assigned_at)}</td>
                <td className="border px-4 py-2">{test.no_q}</td>
                <td className="border px-4 py-2">{test.duration}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    title="Delete"
                    onClick={() => {navigate(`/exam/${test.test_id}`)}}
                    className="text-red-600 hover:text-red-900 text-xl font-bold"
                  >
                    ✍🏻
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Completed Tests Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">Completed Tests</h2>
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Test ID</th>
              <th className="border px-4 py-2">Exam Name</th>
              <th className="border px-4 py-2">No. of Questions</th>
              <th className="border px-4 py-2">Attempted At</th>
              <th className="border px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {completedTests.length === 0 && (
              <tr>
                <td className="border px-4 py-2 text-center" colSpan={5}>No tests completed.</td>
              </tr>
            )}
            {completedTests.map(test => (
              <tr key={test.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{test.test_id}</td>
                <td className="border px-4 py-2">{getExamName(test.test_id)}</td>
                <td className="border px-4 py-2">{getExamQuestions(test.test_id)}</td>
                <td className="border px-4 py-2">{formatDate(test.attempted_at)}</td>
                <td className="border px-4 py-2">{test.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
);
}

export default Exams;
