import React, { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabase";

function Backnav({ title, timer, toggleSidebar, onSubmit, showsubmit, setHandleSubmit = null }) {
  const [counter, setCounter] = useState(timer || 10); // Initialize with provided timer or default
  const navigate = useNavigate();
  const [showdelaytext, setShowDelayedText] = useState(false);
  const [timerSubmitted, setTimerSubmitted] = useState(false); // Track if timer has triggered submission
  const [isSubmitting, setIsSubmitting] = useState(false); // Track if submission is in progress

  const {id} =useParams()

  useLayoutEffect(() => {
    setTimeout(() => {
      setShowDelayedText(true);
    }, 2000);
    if (id) {
      // console.log("Exam ID set:", id);
      fetchexam();
    }
  }, [id]);

  // Reset timerSubmitted if showsubmit changes to false (quiz restarted)
  useEffect(() => {
    if (!showsubmit) {
      setTimerSubmitted(false);
      setIsSubmitting(false);
    }
  }, [showsubmit]);

  // Wrap the onSubmit function to set isSubmitting flag and reset timer
  const handleSubmit = () => {
    setIsSubmitting(true);

    // Start a timer to count down to zero
    const currentCount = counter;

    // Force the counter to a value that will take about 2 seconds to count down
    // This ensures the countdown is visible regardless of the current timer value
    const startValue = Math.min(currentCount, 40);
    setCounter(startValue);

    // Start the countdown animation
    const countdownInterval = setInterval(() => {
      setCounter(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Call onSubmit directly when the timer reaches zero
          onSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 50); // Speed up the countdown for visual effect
  };

  // Expose handleSubmit to parent component if setHandleSubmit is provided
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (typeof setHandleSubmit === 'function') {
      setHandleSubmit(() => handleSubmit); // Pass as a function to avoid immediate execution
    }
  }, []);

  async function fetchexam() {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .match({ id: id })
        .limit(1);
      if (error) throw error;
      if (data && data.length > 0) {
        // Only set counter if not in showsubmit mode
        if (!showsubmit) {
          setCounter(data[0]?.Duration * 60);
        }
        setShowDelayedText(true);
      }
    } catch (error) {
      console.log(error);
    }
  }
  // Update counter when timer prop changes
  useEffect(() => {
    if (timer !== undefined && timer !== null) {
      setCounter(timer);
    }
  }, [timer]);

  // Start countdown when counter is set and > 0
  useEffect(() => {
    // Run the timer if not already submitted and not in showsubmit mode
    // or if we're in the process of submitting (to continue counting down)
    if (counter > 0 && (!showsubmit || isSubmitting) && !timerSubmitted) {
      const timerInterval = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
      return () => clearInterval(timerInterval); // Clear timer on unmount or when counter changes
    } else if (counter <= 0 && !showsubmit && !timerSubmitted) {
      // Trigger submission only once when timer hits 0
      setTimerSubmitted(true);
      handleSubmit(); // Trigger the function when timer hits 0
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter, showsubmit, timerSubmitted, isSubmitting]);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };


  return (
    <div className="font-hind flex flex-col z-[500] justify-center text-white">
      <div className="bg-slate-700 flex items-center px-4 fixed z-50 left-1 right-1 border-slate-400 top-0 h-12 rounded-b-3xl border-b-2">
        <div className="items-center w-full justify-between flex">
          <button onClick={toggleSidebar}>Questions</button>
          <div className="flex items-center flex-row space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
              onClick={() => navigate(-2)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <p>{title || "Back"}</p>
          </div>
          <div className="text-white" >{formatTime(counter)}</div>
        </div>
      </div>
    </div>
  );
}

export default Backnav;
