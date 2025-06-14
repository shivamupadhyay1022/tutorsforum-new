import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { toast } from "react-toastify";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toggle, setToggle] = useState(true);
  const navigate = useNavigate();

  const handleSignin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast.success("Signed In Successfully");
        navigate("/dashboard");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleGoogleSignin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed In with Google");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#ffded5]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign In to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Continue your learning journey
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignin}
            className="w-full py-2 bg-red-500 text-white rounded-lg font-medium"
          >
            Sign In with Google
          </button>

          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <hr className="flex-1 border-gray-300" />
            OR
            <hr className="flex-1 border-gray-300" />
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSignin}>
          <label className="text-sm flex gap-2 flex-col font-medium text-gray-700">
            <span className="text-xs">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 w-full rounded-md border px-3 py-2 text-base"
              placeholder="Enter your email"
            />
          </label>

          <label className="text-sm flex flex-col font-medium text-gray-700">
            <span className="text-xs">Password</span>
            <div className="flex items-center rounded-md border px-3 py-2">
              <input
                type={toggle ? "password" : "text"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex-1 h-10"
                placeholder="Password"
              />
              <button type="button" onClick={() => setToggle(!toggle)}>
                {toggle ? (
                  <EyeIcon />
                ) : (
                  <EyeOffIcon />
                )}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="w-full bg-gray-700 text-white rounded-full py-2 flex items-center justify-center gap-2"
          >
            <LoginIcon />
            Sign In
          </button>

          <div className="text-center flex flex-col gap-2 text-sm">
            <Link to="/forgot">
              Forgot Password? <span className="text-blue-600 hover:text-blue-800">Click Here</span>
            </Link>
            <Link to="/signup" className="text-peach-500 hover:text-peach-400">
              Don't have an account? Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// Icons
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const LoginIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
  </svg>
);

export default Signin;
