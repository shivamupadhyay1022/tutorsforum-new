import {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom';

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [choice, setChoice] = useState("");
  const [toggle, setToggle] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate();

  const handleSignin = (e) => {
    e.preventDefault();
    // Frontend only for now

    navigate("/dashboard");
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
      <form className="mt-8 space-y-6" onSubmit={handleSignin}>
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
                  <input
                    id="password"
                    type={toggle == true ? "password" : "text"}
                    value={password}
                    onChange={(e) => {
                      e.preventDefault();
                      setPassword(e.target.value);
                    }}
                    required
                    className="mt-2 tflex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="Password"
                  />
                  
              </label>
          <button
            type="submit"
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
              Sign up{" "}
            </div>
          </button>

          <div className="text-center text-sm">
            <Link
              to="/signup"
              className="font-medium text-peach-500 hover:text-peach-400"
            >
              Don't have an account? Sign Up
            </Link>
          </div>
        </div>
      </form>
    </div>
  </div>
  )
}

export default Signin