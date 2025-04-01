import { useState } from "react";
import { auth } from "../firebase"; // Ensure Firebase auth is correctly imported
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("A password reset link has been sent to your email.");
    } catch (err) {
      setError("Failed to send reset email. Please check your email and try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-white to-[#ffded5]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Forgot Password</h2>
        <p className="text-sm text-gray-500 text-center mb-4">Enter your email to receive a reset link.</p>

        {message && <p className="text-green-600 text-sm text-center mb-2">{message}</p>}
        {error && <p className="text-red-600 text-sm text-center mb-2">{error}</p>}

        <form onSubmit={handleResetPassword} className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className={`w-full bg-peach-300 hover:bg-peach-400 text-white p-2 rounded ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/signin" className="text-sm text-peach-500 hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
