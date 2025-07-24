import React, { useEffect,useState,useRef,useLayoutEffect } from "react";
import Backnav from "../components/Backnav";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabase";
import { parseTextWithImages } from "../components/parseTextWithImages";
import SolveexamWithMathlive from "../components/SolveexamWithMathlive";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function Exam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentquestion, setCurrentQuestion] = useState();
  const [attemptedQuestions, setAttemptedQuestions] = useState([]);
  const [examquestionlistid, SetexamquestionlistidId] = useState([]);
  const [examquestionlist, Setexamquestionlist] = useState([]);
  const [correctoptionlist, setCorrectOptionList] = useState([]);
  const [useroptionlist, setUserOptionList] = useState([]);
  const [score, setScore] = useState();
  const [exam, setExam] = useState();
  const [examName, setExamName] = useState();
  const [showsubmit, setShowSubmit] = useState(false);
  const [counter, setCounter] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef(null);

  
  const [isCalculating, setIsCalculating] = useState(false);
  const [reviewQuestions, setReviewQuestions] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [handleSubmitFn, setHandleSubmitFn] = useState(null);

  useLayoutEffect(() => {
    if (examquestionlistid.length > 0) {
        console.log(examquestionlistid[currentQuestionIndex])
      fetchQuestion(examquestionlistid[currentQuestionIndex]);

      // Mark the current question as visited
      setVisitedQuestions((prev) => {
        if (!prev.includes(currentQuestionIndex)) {
          return [...prev, currentQuestionIndex];
        }
        return prev;
      });
    }
  }, [examquestionlistid, currentQuestionIndex]);

  useEffect(() => {
    const fetchExam = async () => {
      if (!id) return;
      console.log(id)
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) {
        setExam(data);
        setExamName(data.Name);
        setCounter(data.Duration * 60);
        const ids = data.Questions.split(",").map((id) => id.trim());
        SetexamquestionlistidId(ids);
      }else{
        console.log(error)
      }
    };
    fetchExam();
  }, []);

  useLayoutEffect(() => {
    // Changed from useEffect
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    // Store the current scroll position right after React has updated the DOM
    const prevScrollTop = sidebar.scrollTop;

    // Use requestAnimationFrame to ensure the restoration happens
    // after the browser has potentially completed its layout calculations,
    // but still aiming to do it before the next paint.
    // useLayoutEffect helps ensure we capture the *latest* scroll state
    // right after React's updates.
    requestAnimationFrame(() => {
      sidebar.scrollTop = prevScrollTop;
    });
  }, [useroptionlist, currentQuestionIndex, counter]);

  const fetchQuestion = async (id) => {
    console.log(id)
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) setCurrentQuestion(data);
  };

  const onSubmit = async () => {
    // Prevent multiple submissions
    if (isCalculating || showsubmit) return;

    // Show loading screen immediately
    setIsCalculating(true);
    console.log("Submitting quiz...");

    // Use setTimeout to allow the loading screen to render before starting calculations
    setTimeout(async () => {
      try {
        // Step 1: Fetch all question details
        console.log("Fetching question details...");
        const results = [];

        // Simulate slower loading for better user experience
        await new Promise((resolve) => setTimeout(resolve, 1000));

        for (const id of examquestionlistid) {
          const { data } = await supabase
            .from("questions")
            .select("*")
            .eq("id", id)
            .single();
          if (data) results.push(data);

          // Add a small delay between fetches to make the loading more visible
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        console.log(`Fetched ${results.length} questions`);

        // Step 2: Process the results
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Prepare all data BEFORE showing the results screen
        // This ensures everything is ready when the loading screen disappears
        const newCorrectOptions = results.map((q) =>
          q.correct.replace("option", "op")
        );

        // Step 3: Calculate the score
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Calculate score using BITSAT marking scheme: +3 for correct, -1 for wrong, 0 for unattempted
        const calculatedScore = newCorrectOptions.reduce(
          (acc, correctOption, index) => {
            const userOption = useroptionlist[index];

            // If user didn't attempt this question
            if (userOption === undefined) {
              return acc; // No change to score (0)
            }

            // If user's answer is correct
            if (userOption === correctOption) {
              return acc + 3; // Add 3 points
            }

            // If user's answer is wrong
            return acc - 1; // Subtract 1 point
          },
          0
        );

        // Step 4: Prepare the results display
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Set all the state variables with the calculated data
        Setexamquestionlist(results);
        setCorrectOptionList(newCorrectOptions);
        setScore(calculatedScore);

        // Add a final delay to ensure all state updates have been processed
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Only show the results after all processing is complete and state is updated
        console.log("Showing results screen");
        setIsCalculating(false);
        setShowSubmit(true);
      } catch (error) {
        console.error("Error calculating results:", error);
        toast.error("An error occurred while calculating your results");
        setIsCalculating(false);
      }
    }, 100);
  };

  const handleOptionSelect = (selectedOption) => {
    const newUserOptions = [...useroptionlist];
    newUserOptions[currentQuestionIndex] = selectedOption;
    setUserOptionList(newUserOptions);
    const newCorrectOptions = [...correctoptionlist];
    newCorrectOptions[currentQuestionIndex] = currentquestion.correct.replace(
      "option",
      "op"
    );
    setCorrectOptionList(newCorrectOptions);

    // If this question was marked for review, unmark it when an option is selected
    if (reviewQuestions.includes(currentQuestionIndex)) {
      toggleReviewQuestion(currentQuestionIndex);
    }
  };

  // Function to toggle a question's review status
  const toggleReviewQuestion = (index) => {
    setReviewQuestions((prev) => {
      if (prev.includes(index)) {
        // Remove from review if already there
        return prev.filter((i) => i !== index);
      } else {
        // Add to review if not there
        return [...prev, index];
      }
    });
  };

  const LoadingScreen = () => {
    const [dots, setDots] = useState("");
    const [progressStep, setProgressStep] = useState(0);
    const steps = [
      "Gathering questions...",
      "Processing answers...",
      "Calculating score...",
      "Preparing results...",
    ];

    // Animate the dots
    useEffect(() => {
      const dotsInterval = setInterval(() => {
        setDots((prev) => {
          if (prev.length >= 3) return "";
          return prev + ".";
        });
      }, 400);
      // Progress through the steps
      const progressInterval = setInterval(() => {
        setProgressStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1200);

      return () => {
        clearInterval(dotsInterval);
        clearInterval(progressInterval);
      };
    }, []);

    // Progress through the steps more slowly to match our onSubmit timing
    useEffect(() => {
      // Start with step 0
      setProgressStep(0);

      // Move to step 1 after 1 second
      const timer1 = setTimeout(() => setProgressStep(1), 1000);

      // Move to step 2 after 3 seconds (when questions are fetched)
      const timer2 = setTimeout(() => setProgressStep(2), 3000);

      // Move to step 3 after 5 seconds (when score is calculated)
      const timer3 = setTimeout(() => setProgressStep(3), 5000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }, []);

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="p-8 rounded-xl shadow-xl text-center bg-white max-w-md w-full">
          <div className="mb-6 relative">
            <div className="w-24 h-24 mx-auto border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 text-xl font-bold">
              TF
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Calculating Results{dots}
          </h2>
          <p className="text-gray-600 mb-8">
            Please wait while we process your answers
          </p>

          <div className="mt-6 w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(progressStep + 1) * 25}%` }}
            ></div>
          </div>

          <div className="mt-2 text-left text-sm text-gray-500">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center mb-1 ${
                  index <= progressStep
                    ? "text-blue-600 font-medium"
                    : "text-gray-400"
                }`}
              >
                {index <= progressStep ? (
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <div className="w-4 h-4 mr-2 rounded-full border border-gray-400"></div>
                )}
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  const ResultScreen = () => {
    console.log("Rendering ResultScreen");
    console.log("Questions:", examquestionlist.length);
    console.log("User options:", useroptionlist);
    console.log("Correct options:", correctoptionlist);
    console.log("Score:", score);

    // Calculate detailed statistics
    const totalQuestions = examquestionlistid.length;

    // Count attempted, correct, and incorrect questions
    let attemptedCount = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    useroptionlist.forEach((userOption, index) => {
      const correctOption = correctoptionlist[index];

      // Count attempted questions
      if (userOption !== undefined) {
        attemptedCount++;

        // Count correct and incorrect questions
        if (userOption === correctOption) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      }
    });

    // Calculate unattempted questions
    const unattemptedCount = totalQuestions - attemptedCount;

    // Calculate score breakdown
    const correctScore = correctCount * 3; // +3 for each correct answer
    const incorrectScore = incorrectCount * -1; // -1 for each incorrect answer

    // Ensure we have all the data before calculating the percentage
    const maxPossibleScore = totalQuestions * 3; // Each question is worth 3 points
    const percentage =
      maxPossibleScore > 0 ? ((score / maxPossibleScore) * 100).toFixed(2) : 0;
    const renderOption = (optionKey, optionText, userAnswer, correctAnswer) => {
      let border = "border-gray-300";
      let icon = null;
      if (userAnswer === optionKey && userAnswer === correctAnswer) {
        border = "border-green-500";
        icon = "✅";
      } else if (userAnswer === optionKey && userAnswer !== correctAnswer) {
        border = "border-red-500";
        icon = "❌";
      } else if (optionKey === correctAnswer) {
        border = "border-green-500";
      }
      return (
        <div
          key={optionKey}
          className={`flex items-center p-2 mb-1 border-2 rounded-lg ${border}`}
        >
          <span className="mr-2 font-semibold">
            {optionKey.replace("op", "").toUpperCase()}.
          </span>
          <span className="flex-1">{parseTextWithImages(optionText)}</span>
          {icon && <span className="ml-2">{icon}</span>}
        </div>
      );
    };

    return (
      <div className="flex flex-col p-4 pb-20 overflow-y-auto">
        <div className="flex flex-col items-center justify-center p-4">
          <div className="p-8 rounded-xl shadow-xl text-center text-gray-800 w-full sm:w-[500px]">
            <h1 className="text-3xl font-bold text-blue-600">Quiz Results</h1>
            <p className="text-lg font-medium text-gray-700">Your Score</p>
            <div className="mt-4 flex justify-center items-center">
              <div className="w-24 h-24 border-4 border-blue-500 rounded-full flex items-center justify-center bg-gradient-to-b from-green-400 to-blue-500 text-white">
                <span className="text-3xl font-extrabold">{score}</span>
              </div>
              <span className="text-xl font-bold text-gray-500 mx-4">/</span>
              <span className="text-3xl font-extrabold text-gray-700">
                {examquestionlistid.length * 3}
              </span>
            </div>
            <p className="mt-4 text-lg text-gray-500">{percentage}% Correct</p>

            {/* Score Breakdown */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200 text-left">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Score Breakdown
              </h2>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Total Questions</p>
                  <p className="text-xl font-bold text-gray-800">
                    {totalQuestions}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Attempted</p>
                  <p className="text-xl font-bold text-gray-800">
                    {attemptedCount}
                  </p>
                  <p className="text-xs text-gray-500">
                    ({((attemptedCount / totalQuestions) * 100).toFixed(1)}% of
                    total)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Correct</p>
                  <p className="text-xl font-bold text-green-600">
                    {correctCount}
                  </p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Incorrect</p>
                  <p className="text-xl font-bold text-red-600">
                    {incorrectCount}
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Unattempted</p>
                  <p className="text-xl font-bold text-gray-600">
                    {unattemptedCount}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Marks Calculation
                </h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Correct</p>
                    <p className="font-semibold text-green-600">
                      +{correctCount} × 3 = +{correctScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Incorrect</p>
                    <p className="font-semibold text-red-600">
                      {incorrectCount} × (-1) = {incorrectScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total</p>
                    <p className="font-semibold text-blue-600">{score}</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="mt-6 px-6 py-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md"
              onClick={() => window.location.reload()}
            >
              Retake Quiz
            </button>
          </div>
        </div>
        {examquestionlist && examquestionlist.length > 0 ? (
          examquestionlist.map((q, index) => (
            <div
              key={index}
              className="mb-6 p-4 border rounded-lg shadow-sm bg-white"
            >
              <h2 className="font-semibold mb-2">
                Q{index + 1}. {parseTextWithImages(q.question)}
              </h2>
              {["op1", "op2", "op3", "op4"].map((key, i) => {
                const optionText = q[`option${i + 1}`];
                return renderOption(
                  key,
                  optionText,
                  useroptionlist[index],
                  correctoptionlist[index]
                );
              })}
            </div>
          ))
        ) : (
          <div className="text-center p-4 bg-yellow-100 rounded-lg border border-yellow-300">
            <p className="text-yellow-800">
              No questions to display. Please try again.
            </p>
          </div>
        )}
        <button
          className="mt-6 px-6 py-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md"
          onClick={() => window.location.reload()}
        >
          Retake Quiz
        </button>
      </div>
    );
  };

  const Sidebar = () => {
    return (
      <div
        ref={sidebarRef}
        className={`fixed h-[70vh] pb-10 overflow-y-auto top-12 left-0 z-40 transform transition-transform duration-300 ease-in-out border-r border-gray-200 bg-white ${
          showSidebar ? "translate-x-0 w-20 sm:w-24" : "-translate-x-full w-0"
        }`}
        style={{
          height: "calc(100vh - 3rem)",
          overflowY: "auto",
          willChange: "transform",
        }}
      >
        <div className="flex flex-col items-center mt-4 space-y-2 p-2">
          {examquestionlistid.map((_, index) => {
            return (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                }}
                className={`rounded-full w-10 h-10 text-sm flex items-center justify-center font-semibold border-2 ${
                  // Determine the background color based on the question status
                  reviewQuestions.includes(index) && useroptionlist[index]
                    ? "bg-gradient-to-r from-blue-500 to-green-500 text-white border-blue-600" // Blue-green gradient for review + answered
                    : reviewQuestions.includes(index)
                    ? "bg-blue-500 text-white border-blue-600" // Blue for review but not answered
                    : useroptionlist[index]
                    ? "bg-green-500 text-white border-green-600" // Green for answered
                    : visitedQuestions.includes(index)
                    ? "bg-red-500 text-white border-red-600" // Red for visited but not answered
                    : "bg-white border-gray-300" // White for not visited
                } ${
                  index === currentQuestionIndex ? "ring-2 ring-blue-400" : ""
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <Helmet>
        <title>{examName ? examName : "Exam"} - Tutors Forum</title>
        <meta name="description" content={`Take the ${examName ? examName : "exam"} on Tutors Forum.`} />
      </Helmet>
      <Sidebar />
      <div className="min-h-screen overflow-y-auto pt-16 pb-16">
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            showSidebar ? "ml-20 sm:ml-24" : "ml-0"
          }`}
        >
          <Backnav
            timer={counter}
            toggleSidebar={() => setShowSidebar(!showSidebar)}
            showsubmit={showsubmit}
            onSubmit={onSubmit}
            setHandleSubmit={setHandleSubmitFn}
          />
          {isCalculating ? (
            <LoadingScreen />
          ) : showsubmit &&
            examquestionlist.length > 0 &&
            score !== undefined ? (
            <ResultScreen />
          ) : showsubmit ? (
            // If showsubmit is true but data isn't ready yet, show loading screen
            <LoadingScreen />
          ) : (
            <div className="p-4 pb-20 overflow-y-auto">
              <p className="font-medium text-lg">
                Question {currentQuestionIndex + 1}:
              </p>
              <SolveexamWithMathlive
                currentquestion={currentquestion}
                option={useroptionlist[currentQuestionIndex] || ""}
                setOption={(value) => handleOptionSelect(value)}
                clearOption={() => handleOptionSelect(undefined)}
                isMarkedForReview={reviewQuestions.includes(
                  currentQuestionIndex
                )}
                toggleReview={() => toggleReviewQuestion(currentQuestionIndex)}
              />
              {!isCalculating && (
                <div className="mt-4 bg-slate-700 flex items-center px-4 fixed z-50 left-1 right-1 border-slate-400 bottom-0 h-14 rounded-t-3xl border-b-2 justify-between shadow-lg">
                  <button
                    onClick={() => {
                      setCurrentQuestionIndex((prev) =>
                        prev > 0 ? prev - 1 : prev
                      );
                    }}
                    className="px-4 py-2 text-white rounded"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() =>
                      handleSubmitFn ? handleSubmitFn() : onSubmit()
                    }
                    className="px-4 py-2 text-white rounded"
                  >
                    Submit
                  </button>

                  <button
                    onClick={() => {
                      if (currentQuestionIndex === examquestionlistid.length - 1) {
                        handleSubmitFn ? handleSubmitFn() : onSubmit();
                      } else {
                        setCurrentQuestionIndex((prev) =>
                          prev < examquestionlistid.length - 1 ? prev + 1 : prev
                        );
                      }
                    }}
                    className={`px-4 py-2 text-white rounded`}
                  >
                    {currentQuestionIndex === examquestionlistid.length - 1 ? "Finish" : "Next"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Exam;
