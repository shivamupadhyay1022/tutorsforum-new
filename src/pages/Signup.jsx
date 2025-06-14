import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, googleProvider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { set, ref } from "firebase/database";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [choice, setChoice] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [toggle, setToggle] = useState(true);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [tempUserData, setTempUserData] = useState(null);
  const navigate = useNavigate();

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const options = { maxSizeMB: 0.2, maxWidthOrHeight: 800, useWebWorker: true };
    const compressedFile = await imageCompression(file, options);
    const reader = new FileReader();
    reader.onloadend = () => setImageSrc(reader.result);
    reader.readAsDataURL(compressedFile);
  };

  const handleEmailSignup = () => {
    if (!email || !password || !confirmPassword || !name || !choice) {
      toast.error("Fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        saveUserToDB(user.uid, name, email, imageSrc);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const saveUserToDB = (uid, name, email, profilepic) => {
    set(ref(db, `${choice}/${uid}`), {
      name,
      email,
      profilepic: profilepic || "",
      bio: "",
      stars: "0.0",
      cph: "0",
    });
    toast.success("Account Created");
    navigate("/dashboard");
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setTempUserData({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        profilepic: user.photoURL,
      });
      setShowRoleDialog(true); // Ask for tutor/user role
    } catch (err) {
      toast.error(err.message);
    }
  };

  const confirmRoleAndSave = (selectedRole) => {
    setChoice(selectedRole);
    set(ref(db, `${selectedRole}/${tempUserData.uid}`), {
      name: tempUserData.name,
      email: tempUserData.email,
      profilepic: tempUserData.profilepic || "",
      bio: "",
      stars: "0.0",
      cph: "0",
    });
    toast.success("Account Created via Google");
    setShowRoleDialog(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#ffded5]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
          <p className="text-sm text-gray-600">Start your learning journey today</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignup}
            className="w-full py-2 bg-red-500 text-white rounded-lg font-medium"
          >
            Sign Up with Google
          </button>

          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <hr className="flex-1 border-gray-300" />
            OR
            <hr className="flex-1 border-gray-300" />
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type={toggle ? "password" : "text"}
              placeholder="Password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type={toggle ? "password" : "text"}
              placeholder="Confirm Password"
              className="w-full p-2 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="flex justify-around">
              <button
                className={`px-4 py-1 border rounded ${choice === "tutors" ? "bg-black text-white" : ""}`}
                onClick={() => setChoice("tutors")}
              >
                Tutor
              </button>
              <button
                className={`px-4 py-1 border rounded ${choice === "users" ? "bg-black text-white" : ""}`}
                onClick={() => setChoice("users")}
              >
                Student
              </button>
            </div>

            <button
              onClick={handleEmailSignup}
              className="w-full bg-gray-700 text-white py-2 rounded-full"
            >
              Sign Up
            </button>
          </form>

          <div className="text-center text-sm">
            <Link to="/signin" className="text-blue-500 hover:underline">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Role selection dialog after Google Signup */}
      {showRoleDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md text-center space-y-4">
            <h3 className="text-lg font-semibold">Select your role</h3>
            <p className="text-sm text-gray-600">Choose how you want to use TutorsForum</p>
            <div className="flex justify-around">
              <button
                onClick={() => confirmRoleAndSave("tutors")}
                className="px-6 py-2 bg-gray-800 text-white rounded"
              >
                Tutor
              </button>
              <button
                onClick={() => confirmRoleAndSave("users")}
                className="px-6 py-2 bg-gray-800 text-white rounded"
              >
                Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
