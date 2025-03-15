import { signInWithEmailAndPassword } from 'firebase/auth';
import React, {useState, useEffect, useContext} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';

function AdminSignin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [choice, setChoice] = useState("");
    const [toggle, setToggle] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

      const handleSignin = (e) => {
        e.preventDefault();
        if (email == "admin@tutorsforum.in"){
        signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            toast.success("Welcome back admin", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            navigate("/admin/dashboard");
          })
          .catch((error) => {
            toast.error(error.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          });}
          else{
            toast.error("YOU are NOT an ADMIN", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
          }
      };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#ffded5]">
    <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Welcome Admin
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Manage your platform
        </p>
      </div>
      <div className="mt-8 space-y-6" >
        <div className="space-y-4">
          <label
            htmlFor="password"
            className="text-sm flex gap-2 flex-col font-medium text-gray-700"
          >
            <span className="text-xs ">Email address</span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Enter your email"
            />
          </label>
          <label
            htmlFor="password"
            className="text-sm flex flex-col font-medium text-gray-700"
          >
            <span className="text-xs ">Password</span>
            <div className="flex rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" >
            <input
              id="password"
              type={toggle == true ? "password" : "text"}
              value={password}
              onChange={(e) => {
                e.preventDefault();
                setPassword(e.target.value);
              }}
              required
              className="mt-2 tflex h-10 w-full "
              placeholder="Password"
            />
            {toggle == true ? (
              <button onClick={()=>setToggle(!toggle)} >
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
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              </button>
            ) : (
              <button onClick={()=>setToggle(!toggle)}>
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
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
              </button>
            )}
            </div>
          </label>
          <button
            onClick={handleSignin}
            className="w-full bg-gray-700 rounded-full py-1 "
            size="lg"
          >
            <div className="flex gap-2 items-center text-white justify-self-center">
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
              Sign In{" "}
            </div>
          </button>

          <div className="text-center text-sm">
            <a
              href='https://wa.me/9470356441'
              className="font-medium text-peach-500 hover:text-peach-400"
            >
              Having problem signing in ? Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default AdminSignin