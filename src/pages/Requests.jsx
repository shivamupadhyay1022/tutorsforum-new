import React, { useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../firebase"; // Adjust the import based on your project structure
import { v4 as uuidv4 } from "uuid";
import { Helmet } from "react-helmet-async";

const Request = () => {
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact.trim()) {
      alert("Please enter a valid email or phone number.");
      return;
    }

    try {
      // Generate a unique request ID
      const requestId = uuidv4();

      // Store the request in Firebase under "deletionRequests/{requestId}"
      await set(ref(db, `deletionRequests/${requestId}`), {
        contactInfo: contact,
        timestamp: Date.now(),
        status: "pending", // You can update this once processed
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("There was an issue submitting your request. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Helmet>
        <title>Account & Data Deletion - Tutors Forum</title>
        <meta name="description" content="Request account and data deletion from Tutors Forum." />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">Request Account & Data Deletion</h1>

      {!submitted ? (
        <>
          <p className="mb-4">
            If you wish to delete your TutorsForum account and associated data, please submit your request below. 
            Deletion requests are processed in compliance with our data retention policies.
          </p>

          <h2 className="text-xl font-semibold mt-4">How to Request Deletion</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>Enter your registered email or phone number below.</li>
            <li>Click the "Submit Request" button.</li>
            <li>Your request will be reviewed and processed within **30 days**.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-4">What Happens After Deletion?</h2>
          <p className="mb-4">
            - **All personal data, including account credentials, class history, and preferences, will be permanently erased.**  
            - **Transaction records may be retained for legal and regulatory compliance.**  
            - **Once processed, this action cannot be undone.**  
          </p>

          <form onSubmit={handleSubmit} className="mb-6">
            <label className="block text-lg font-medium mb-2">
              Enter your email or phone number:
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              placeholder="Enter your email or phone number"
              required
            />
            <button
              type="submit"
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Submit Request
            </button>
          </form>

          <p className="text-sm">
            ⚠ **Your data will be deleted within a month.** To stop this process, email **support@tutorsforum.in** with relevant details.
          </p>
        </>
      ) : (
        <div className="p-4 bg-green-100 border border-green-400 rounded">
          <p className="text-green-700 font-semibold">
            ✅ Your request has been submitted successfully. Your account and associated data will be deleted within 30 days.
          </p>
          <p className="text-sm mt-2">
            If you wish to cancel this request, please email **support@tutorsforum.in** with your account details.
          </p>
        </div>
      )}
    </div>
  );
};

export default Request;
