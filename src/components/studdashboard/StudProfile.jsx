import React, { useState, useLayoutEffect, useContext } from "react";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";
import { AuthContext } from "../../AuthProvider";
import { db } from "../../firebase";
import { ref, onValue, update, set } from "firebase/database";

function StudProfile() {
  const [imageSrc, setImageSrc] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [clas,setClass] = useState("");
  const [exam, setExam] = useState("");

  const { currentUser } = useContext(AuthContext);

  useLayoutEffect(() => {
    fetchData();
  }, [currentUser]);

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
    document.getElementById("fileInputtwo").click();
  };

  async function fetchData() {
    if (currentUser) {
      const starCountRef = ref(db, "users/" + currentUser.uid);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          var data = snapshot.val();
          setName(data.name);
          setEmail(data.email);
          setImageSrc(data.profilepic || "https://cdn.pixabay.com/photo/2023/05/02/10/35/avatar-7964945_960_720.png");
          setClass(data.clas);
          setExam(data.exam);
        } else {
          toast.error("User not found", {
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
      });
    }
  }

  async function updateUserData() {
    if (currentUser) {
      const tutorRef = ref(db, "users/" + currentUser.uid);
      try {
        await set(tutorRef, {
          name: name,
          email: email,
          profilepic: imageSrc || "",
          exam:exam || "",
          clas:clas || "",
        });
        toast.success("User data updated successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
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
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 hover:border-peach-300 transition-colors">
            <div>
              <div className="bg-gradient-to-r from-peach-300 to-peach-100 bg-clip-text text-transparent">
                Profile
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img
                  className="object-cover h-40 w-40 rounded-full"
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
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
                <input
                  type="file"
                  id="fileInputtwo"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                />
              </div>
              <h2 className="text-xl font-semibold">{name || "name"}</h2>
              <p className="text-sm text-gray-500">
                {email || "email@example.com"}
              </p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="hover:border-peach-300 transition-colors">
              <div>
                <div className="bg-gradient-to-r from-peach-300 to-peach-100 bg-clip-text text-transparent">
                  Personal Information
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col my-2 ">
                    <p className="text-sm text-gray-400">Name</p>
                    <input
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      placeholder="First Name"
                      defaultValue="Undefined, contact admin"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                  </label>
                  <label className="flex flex-col my-2 ">
                    <p className="text-sm text-gray-400">Email</p>
                    <input
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      placeholder="Phone"
                      defaultValue="Undefined, contact admin"
                      contentEditable={false}
                      value={email}
                    />
                  </label>
                  <select
                    value={exam}
                    onChange={(e) => setExam(e.target.value)}
                    className="border p-2 rounded-md"
                  >
                    <option value="">All Exams</option>
                    <option value="JEE">JEE</option>
                    <option value="NEET">NEET</option>
                  </select>
                  <select
                    value={clas}
                    onChange={(e) => setClass(e.target.value)}
                    className="border p-2 rounded-md"
                  >
                    <option value="">All Classes</option>
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                    <option value="Passout">Passout</option>
                  </select>
                </div>
                <button
                  onClick={() => updateUserData()}
                  className="w-full rounded-full py-1 px-2 md:w-auto bg-gradient-to-r from-peach-300 to-peach-100 text-white hover:opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </div>

            <div className="hover:border-peach-300 transition-colors">
              <div>
                <div className="bg-gradient-to-r from-peach-300 to-peach-100 bg-clip-text text-transparent">
                  Recent Payments
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudProfile;
