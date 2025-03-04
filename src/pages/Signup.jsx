import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase";
import { set, ref } from "firebase/database";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [choice, setChoice] = useState("");
  const [toggle, setToggle] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState("");

  const checkinput = () => {
    if (email.trim().length == 0 || password.trim().length == 0 || confirmPassword.trim() == 0 || name.trim() == 0 || choice.trim() ==0) {
      console.log(email, password);
      toast.error("Fill All Fields", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      if (password != confirmPassword) {
        toast.error("Paswords do not match", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        onRegister();
      }
    }
  };

  async function onRegister () {
    await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      //registered
      const user = userCredential.user;
        set(ref(db, choice+"/" + user.uid), {
          name:name,
          email: email,
          profilepic:imageSrc,
          bio:"",
          stars:"0.0",
          cph:"0"
        })
        
        toast.success("Account Created", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/signin");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      toast.error(errorCode,errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
  
  }

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setImageSrc(base64Image); // Correctly set the base64 image source
    };
    reader.readAsDataURL(compressedFile);
  };

  const handleButtonClick = () => {
    document.getElementById("fileInputO").click();
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // Frontend only for now
    checkinput();

    // navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#ffded5]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start your learning journey today
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                className="object-cover rounded-full w-32"
                src={
                  imageSrc
                    ? `${imageSrc}`
                    : "https://cdn.pixabay.com/photo/2023/05/02/10/35/avatar-7964945_960_720.png"
                }
                alt="Profile"
              />
              <button
                size="icon"
                variant="outline"
                onClick={handleButtonClick}
                className="absolute bottom-0 right-0 rounded-full bg-gradient-to-r from-white to-[#ffded5]/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                  />
                </svg>
              </button>
              <input
                type="file"
                id="fileInputO"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileInputChange}
              />
            </div>
            <h2 className="text-xl font-semibold">{name || "Name"}</h2>
            <p className="text-sm text-gray-500">{email || "Mail"}</p>
            <div className="flex gap-4 justify-between" >
              <button className={`rounded-xl p-2 border-2 border-gray-700 ${choice == "tutors" ? " bg-gray-700 text-white": ""}`}  onClick={()=> setChoice("tutors")} >
                Tutor
              </button>
              <button className={`rounded-xl p-2 border-2 border-gray-700 ${choice == "users" ? " bg-gray-700 text-white": ""}`}  onClick={()=> setChoice("users")} >
                Student
              </button>
            </div>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <label
              htmlFor="name"
              className="text-xs flex flex-col  font-medium text-gray-700"
            >
              <span className="text-xs ">Full Name</span>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="Enter your full name"
              />
            </label>
            <label
              htmlFor="email"
              className="text-sm flex gap-2 flex-col font-medium text-gray-700"
            >
              <span className="text-xs ">Email address</span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="Enter your email"
              />
            </label>
            <label
              htmlFor="password"
              className="text-sm flex flex-col font-medium text-gray-700"
            >
              <span className="text-xs ">Password</span>
              <input
                id="password"
                type={toggle == true ? "password" : "text"}
                value={password}
                onChange={(e) => {
                  e.preventDefault();
                  setPassword(e.target.value);
                }}
                required
                className="mt-1 tflex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="Password"
              />
            </label>
            <label
              htmlFor="email"
              className="text-sm flex flex-col font-medium text-gray-700"
            >
              <span className="text-xs ">Confirm Password</span>
              <input
                id="confirm_password"
                type={toggle == true ? "password" : "text"}
                value={confirmPassword}
                onChange={(e) => {
                  e.preventDefault();
                  setConfirmPassword(e.target.value);
                }}
                required
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="Confirm Password"
              />
            </label>

            <button
              type="submit"
              className="w-full bg-gray-700 rounded-full py-1 "
              size="lg"
            >
              <div className="flex gap-2 items-center justify-self-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
                Sign Up{" "}
              </div>
            </button>

            <div className="text-center text-sm">
              <Link
                to="/signin"
                className="font-medium text-peach-500 hover:text-peach-400"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
