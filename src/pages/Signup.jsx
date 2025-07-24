import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup
} from "firebase/auth";
import { set, ref, get } from "firebase/database";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
import { Capacitor } from "@capacitor/core";
import { SocialLogin } from "@capgo/capacitor-social-login";
import { Helmet } from "react-helmet-async";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [toggle, setToggle] = useState(true);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempUserData, setTempUserData] = useState(null);
  const [role, setRole] = useState(""); // "tutors" or "users"
  const navigate = useNavigate();

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(file, options);
    const reader = new FileReader();
    reader.onloadend = () => setImageSrc(reader.result);
    reader.readAsDataURL(compressedFile);
  };

  const handleEmailSignup = () => {
    if (!email || !password || !confirmPassword || !name || !role) {
      toast.error("Fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        set(ref(db, `${role}/${user.uid}`), {
          name,
          email,
          profilepic: imageSrc || "",
          bio: "",
          stars: "0.0",
          cph: "0",
        });
        toast.success("Account Created");
        navigate("/dashboard");
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  const handleRoleSelect = async (selectedRole) => {
    setShowRoleDialog(false);
    setLoading(true);
    setRole(selectedRole);

    try {
      const provider = new GoogleAuthProvider();
      const isAndroid = Capacitor.getPlatform() === "android";

      if (isAndroid) {
        await SocialLogin.initialize({
          google: {
            webClientId:
              "754539837111-2jtngc9guee9bkbg9o5hig6ju40b1rt7.apps.googleusercontent.com", // Use Android clientId
            mode: "online",
          },
        });

        const result = await SocialLogin.login({
          provider: "google",
          options: {
            scopes: ["email", "profile"],
            forceRefreshToken: true,
          },
        });

        const credential = GoogleAuthProvider.credential(result.result.idToken);
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;

        const path = selectedRole === "tutors" ? "tutors" : "users";
        const userRef = ref(db, `${path}/${user.uid}`);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
          await set(userRef, {
            name: user.displayName,
            email: user.email,
            profilepic: user.photoURL || "",
            bio: "",
            stars: "0.0",
            cph: "0",
          });
        }

        toast.success("Signed In with Google");
        navigate("/dashboard");
      } else {
        await signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            checkUserRoleOrPrompt(user);
            // navigate
            // console.log(user);
            // signOut(auth)
            // IdP data available using getAdditionalUserInfo(result)
            // ...
          })
          .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            toast.error(errorCode + ":" + errorMessage);
            // ...
          });
      }
    } catch (err) {
      console.error("Google Sign-In error:", err);
      toast.error(err.message || "Google Sign-In failed");
    } finally {
      setLoading(false);
    }
  };

  const checkUserRoleOrPrompt = async (user) => {
    const userRef = ref(db, `users/${user.uid}`);
    const tutorRef = ref(db, `tutors/${user.uid}`);
    const userSnap = await get(userRef);
    const tutorSnap = await get(tutorRef);

    if (userSnap.exists() || tutorSnap.exists()) {
      toast.success("Signed In with Google");
      navigate("/dashboard");
    } else {
      setTempUserData({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        profilepic: user.photoURL || "",
      });
      setShowRoleDialog(true);
    }
  };

  useEffect(() => {
    const handleRedirect = async () => {
      const result = await getRedirectResult(auth);
      if (result?.user) {
        const user = result.user;

        const userRef = ref(db, `users/${user.uid}`);
        const tutorRef = ref(db, `tutors/${user.uid}`);

        const userSnapshot = await get(userRef);
        const tutorSnapshot = await get(tutorRef);

        if (userSnapshot.exists() || tutorSnapshot.exists()) {
          toast.success("Signed In with Google");
          navigate("/dashboard");
        } else {
          setTempUserData({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            profilepic: user.photoURL || "",
          });
          setShowRoleDialog(true);
        }
      }
    };
    handleRedirect();
  }, []);

  const confirmRoleAndSave = async (selectedRole) => {
    if (!tempUserData) return;
    setRole(selectedRole);
    setLoading(true);
    try {
      await set(ref(db, `${selectedRole}/${tempUserData.uid}`), {
        name: tempUserData.name,
        email: tempUserData.email,
        profilepic: tempUserData.profilepic || "",
        bio: "",
        stars: "0.0",
        cph: "0",
      });
      toast.success("Account Created via Google");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Failed to save user");
    } finally {
      setLoading(false);
      setShowRoleDialog(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#ffded5]">
      <Helmet>
        <title>Sign Up - Tutors Forum</title>
        <meta name="description" content="Create an account on Tutors Forum to start your learning journey today." />
      </Helmet>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-lg font-semibold">Signing in...</div>
        </div>
      )}

      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Create an account
          </h2>
          <p className="text-sm text-gray-600">
            Start your learning journey today
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setShowRoleDialog(true)}
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
              className="w-full p-2 border rounded"
              value={name}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              className="w-full p-2 border rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type={toggle ? "password" : "text"}
              className="w-full p-2 border rounded"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type={toggle ? "password" : "text"}
              className="w-full p-2 border rounded"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <input
              type="file"
              onChange={handleFileInputChange}
              accept="image/*"
            />
            <div className="flex justify-around">
              <button
                className={`px-4 py-1 border rounded ${
                  role === "tutors" ? "bg-black text-white" : ""
                }`}
                onClick={() => setRole("tutors")}
                type="button"
              >
                Tutor
              </button>
              <button
                className={`px-4 py-1 border rounded ${
                  role === "users" ? "bg-black text-white" : ""
                }`}
                onClick={() => setRole("users")}
                type="button"
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

      {showRoleDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md text-center space-y-4">
            <h3 className="text-lg font-semibold">Select your role</h3>
            <p className="text-sm text-gray-600">
              Choose how you want to use TutorsForum
            </p>
            <div className="flex justify-around">
              <button
                onClick={() =>
                  tempUserData
                    ? confirmRoleAndSave("tutors")
                    : handleRoleSelect("tutors")
                }
                className="px-6 py-2 bg-gray-800 text-white rounded"
              >
                Tutor
              </button>
              <button
                onClick={() =>
                  tempUserData
                    ? confirmRoleAndSave("users")
                    : handleRoleSelect("users")
                }
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
