import React, { useState, useContext, useLayoutEffect, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { AuthContext } from "../../AuthProvider";
import { db } from "../../firebase";
import { ref, onValue, update } from "firebase/database";
import { toast } from "react-toastify";
import Select from "react-select";
// import { getStatesOfCountry, getCitiesOfState } from "react-country-state-city";
import { State, City } from "country-state-city";
import TeachOnlineToggle from "./TeachOnlineToggle";

function Profile() {
  const [imageSrc, setImageSrc] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState(" ");
  const [cph, setCph] = useState(" ");
  const [phone, setPhone] = useState("");
  const { currentUser } = useContext(AuthContext);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [locations, setLocations] = useState([]);

  const [subjects, setSubjects] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [choice, setChoice] = useState("");
  const [stud, setStud] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [selectedClass, setSelectedClass] = useState("");
  const [classesTaught, setClassesTaught] = useState([]);

  const subjectsList = [
    "English",
    "Hindi",
    "Sanskrit",
    "Mathematics",
    "General Science",
    "Social Science",
    "Environmental Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Information Practices",
    "History",
    "Geography",
    "Political Science",
    "Economics",
    "Accountancy",
    "Business Studies",
    "Psychology",
    "Sociology",
    "Philosophy",
    "Legal Studies",
    "Entrepreneurship",
    "Applied Mathematics",
    "Home Science",
    "Physical Education",
    "French",
    "German",
    "Spanish",
    "Urdu",
    "Punjabi",
    "Bengali",
    "Tamil",
    "Telugu",
    "Kannada",
    "Malayalam",
    "Marathi",
    "Assamese",
  ];
  const classOptions = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
    "JEE Mains",
    "JEE Advanced",
    "NEET",
    "CUET",
    "NTSE",
    "Olympiads",
    "KVPY",
    "Boards (CBSE/ICSE/State)",
    "BITSAT",
    "SAT",
    "IELTS",
    "TOEFL",
    "SSC",
    "Bank Exams",
    "UPSC",
    "NDA",
    "CLAT",
    "CA Foundation",
    "CPT",
    "IPMAT",
  ];
  const languagesList = [
    "Hindi",
    "English",
    "Bengali",
    "Odia",
    "Assamese",
    "Maithili",
    "Santali",
    "Bhojpuri",
    "Magahi",
    "Angika",
    "Khortha",
    "Nagpuri",
    "Kurmali",
    "Sadri",
  ];
  // Fetch states for India (ISO code: IN)
  const states = State.getStatesOfCountry("IN").map((state) => ({
    label: state.name,
    value: state.isoCode,
  }));

  // Fetch cities when state changes
  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedCity(null);
  };

  const cities = selectedState
    ? City.getCitiesOfState("IN", selectedState.value).map((city) => ({
        label: city.name,
        value: city.name,
      }))
    : [];

  // Add location
  const handleAddLocation = () => {
    if (selectedState && selectedCity) {
      const newLocation = `${selectedCity.label}, ${selectedState.label}`;

      // Check if the location already exists
      if (!locations.includes(newLocation)) {
        const updatedLocations = [...locations, newLocation];
        const updates = {};
        updates[`/tutors/${currentUser.uid}/locations`] = updatedLocations;

        update(ref(db), updates);
        setLocations(updatedLocations);
        setSelectedCity(null);
        setSelectedState(null);
      }
    }
  };

  // Remove location
  const handleRemoveLocation = (location) => {
    const updatedLocations = locations.filter((loc) => loc !== location);
    const updates = {};
    updates[`/tutors/${currentUser.uid}/locations`] = updatedLocations;

    update(ref(db), updates);
    setLocations(updatedLocations);
  };

  useEffect(() => {
    fetchTutorData();
  }, [currentUser]);

  useEffect(() => {
    if (
      subjects !== null &&
      imageSrc !== null &&
      cph !== null &&
      bio !== null &&
      locations !== null
    ) {
      checkData();
    }
  }, [subjects, imageSrc, cph, bio, locations]);

  async function fetchTutorData() {
    if (currentUser) {
      console.log("Fetching data for:", currentUser.uid);
      const starCountRef = ref(db, "tutors/" + currentUser.uid);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          console.log("Snapshot exists");
          const data = snapshot.val();
          console.log("Fetched data:", data);

          setChoice("tutor");
          setSubjects(data.sub || []);
          setLanguages(data.lang || []);
          setName(data.name);
          setEmail(data.email);
          setImageSrc(data.profilepic || "");
          setCph(data.cph || "");
          setBio(data.bio || "");
          setClassesTaught(data.classesTaught );
          console.log(data.classesTaught || "no");

          if (data.locations) setLocations(data.locations);

          // setTimeout(() => {
          //   console.log("Calling checkData after state updates");
          //   checkData();
          // }, 500);
        } else {
          console.log("No snapshot exists, student profile");
        }
      });
    }
  }

  // async function checkData() {
  //   if (!subjects && !imageSrc && !cph && !bio && !locations) {
  //     toast.error("Fill out all the details", {
  //       position: "top-center",
  //       autoClose: false,
  //       hideProgressBar: true,
  //       closeOnClick: false,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //     return;
  //   } else if (!imageSrc) {
  //     toast.error("Add Image", {
  //       position: "top-center",
  //       autoClose: false,
  //       hideProgressBar: true,
  //       closeOnClick: false,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   } else if (!cph) {
  //     toast.error("Add Cost per Hour", {
  //       position: "top-center",
  //       autoClose: false,
  //       hideProgressBar: true,
  //       closeOnClick: false,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   } else if (!bio) {
  //     toast.error("Add your Bio", {
  //       position: "top-center",
  //       autoClose: false,
  //       hideProgressBar: true,
  //       closeOnClick: false,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   } else if (!locations) {
  //     toast.error("Add Locations", {
  //       position: "top-center",
  //       autoClose: false,
  //       hideProgressBar: true,
  //       closeOnClick: false,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   }
  // }
  async function checkData() {
    if (
      !imageSrc &&
      !subjects?.length &&
      !locations?.length &&
      !bio &&
      !cph &&
      !phone
    ) {
      toast.error("Fill out all the details", {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    if (!subjects?.length) {
      toast.error("Add Subjects", {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    if (!imageSrc) {
      toast.error("Add Image", {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    if (!bio.trim()) {
      toast.error("Add Your Bio", {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    if (!cph) {
      toast.error("Add Cost Per Hour", {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    if (!locations?.length) {
      toast.error("Add Locations", {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  async function fetchTutorData() {
    if (currentUser) {
      const starCountRef = ref(db, "tutors/" + currentUser.uid);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setChoice("tutor");
          setSubjects(data.sub || []);
          setLanguages(data.lang || []);
          setName(data.name);
          setEmail(data.email);
          setImageSrc(data.profilepic || "");
          setCph(data.cph);
          setBio(data.bio);
          if (data.locations) {
            setLocations(data.locations);
          }
          setStud(false); // ✅ Tutor found
        } else {
          setStud(true); // ✅ No tutor data
        }
      });
    }
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
    document.getElementById("fileInput").click();
  };

  const addSubject = () => {
    if (selectedSubject && !subjects.includes(selectedSubject)) {
      const updatedSubjects = [...subjects, selectedSubject];
      const updates = {};
      updates[`/tutors/${currentUser.uid}/sub`] = updatedSubjects;

      update(ref(db), updates);
      setSubjects(updatedSubjects);
      setSelectedSubject("");
    }
  };

  const removeSubject = (subjectToRemove) => {
    const updatedSubjects = subjects.filter((sub) => sub !== subjectToRemove);
    const updates = {};
    updates[`/tutors/${currentUser.uid}/sub`] = updatedSubjects;

    update(ref(db), updates);
    setSubjects(updatedSubjects);
  };

  const addLanguage = () => {
    if (selectedLanguage && !languages.includes(selectedLanguage)) {
      const updatedLanguages = [...languages, selectedLanguage];
      const updates = {};
      updates[`/tutors/${currentUser.uid}/lang`] = updatedLanguages;

      update(ref(db), updates);
      setLanguages(updatedLanguages);
      setSelectedLanguage("");
    }
  };

  const removeLanguage = (languageToRemove) => {
    const updatedLanguages = languages.filter(
      (lang) => lang !== languageToRemove
    );
    const updates = {};
    updates[`/tutors/${currentUser.uid}/lang`] = updatedLanguages;

    update(ref(db), updates);
    setLanguages(updatedLanguages);
  };

  async function updateTutorData() {
    if (currentUser) {
      const tutorRef = ref(db, "tutors/" + currentUser.uid);
      try {
        await update(tutorRef, {
          name: name,
          email: email,
          bio: bio,
          cph: cph,
          profilepic: imageSrc,
        });
        toast.success("Tutor data updated successfully", {
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

  // Add class
  const addClassTaught = () => {
    if (selectedClass && !classesTaught.includes(selectedClass)) {
      const updated = [...classesTaught, selectedClass];
      setClassesTaught(updated);
      updateFirebaseClasses(updated);
    }
    setSelectedClass("");
  };

  // Remove class
  const removeClassTaught = (cls) => {
    const updated = classesTaught.filter((c) => c !== cls);
    setClassesTaught(updated);
    updateFirebaseClasses(updated);
  };

  // Firebase update
  const updateFirebaseClasses = (updatedClasses) => {
    if (!currentUser) return;
    const tutorRef = ref(db, `tutors/${currentUser.uid}`);
    update(tutorRef, {
      classesTaught: updatedClasses,
    });
  };

  // Optional: show loading while checking
  if (stud === null) {
    return <div>Loading...</div>;
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
                  id="fileInput"
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
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                  </label>
                  <label className="flex flex-col my-2 ">
                    <p className="text-sm text-gray-400">Email</p>
                    <input
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      placeholder="Phone"
                      contentEditable={false}
                      value={email}
                      readOnly
                    />
                  </label>
                  <label className="flex flex-col my-2 ">
                    <p className="text-sm text-gray-400">Cost Per Hour</p>
                    <input
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      placeholder="Cost Per Hour"
                      onChange={(e) => setCph(e.target.value)}
                      value={cph}
                    />
                  </label>
                </div>
                <label className="flex flex-col my-2 ">
                  <p className="text-sm text-gray-400">Bio</p>
                  <input
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="Bio"
                    onChange={(e) => setBio(e.target.value)}
                    value={bio}
                  />
                </label>
                <button
                  onClick={() => updateTutorData()}
                  className="w-full rounded-full py-1 px-2 md:w-auto bg-gradient-to-r from-peach-300 to-peach-100 text-white hover:opacity-90"
                >
                  Save Changes
                </button>
              </div>
              {currentUser && <TeachOnlineToggle currentUser={currentUser} />}
              {/* select subject */}
              <div className="p-4 bg-gray-50 rounded-lg my-4 shadow-md">
                {/* Subject Selection */}
                <h2 className="text-lg font-semibold mb-2">Select Subjects</h2>
                <div className="flex gap-2">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="border rounded-md p-2 w-full"
                  >
                    <option value="">Select a subject</option>
                    {subjectsList.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addSubject}
                    className="rounded-full py-1 w-10 px-2 bg-gradient-to-r from-peach-300 to-peach-100 text-white hover:opacity-90"
                  >
                    ✔
                  </button>
                </div>

                {subjects.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Selected Subjects:</h3>
                    {subjects.map((subject) => (
                      <div
                        key={subject}
                        className="flex items-center justify-between bg-gray-200 px-3 py-1 rounded-md mb-2"
                      >
                        <span>{subject}</span>
                        <button
                          onClick={() => removeSubject(subject)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Class Selection */}
                <h2 className="text-lg font-semibold mt-6 mb-2">
                  Select Classes Taught
                </h2>
                <div className="flex gap-2">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="border rounded-md p-2 w-full"
                  >
                    <option value="">Select a class or exam</option>
                    {classOptions.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addClassTaught}
                    className="rounded-full py-1 w-10 px-2 bg-gradient-to-r from-peach-300 to-peach-100 text-white hover:opacity-90"
                  >
                    ✔
                  </button>
                </div>

                {classesTaught.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Selected Classes:</h3>
                    {classesTaught.map((cls) => (
                      <div
                        key={cls}
                        className="flex items-center justify-between bg-gray-200 px-3 py-1 rounded-md mb-2"
                      >
                        <span>{cls}</span>
                        <button
                          onClick={() => removeClassTaught(cls)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Language Selection */}
                <h2 className="text-lg font-semibold mt-6 mb-2">
                  Select Languages
                </h2>
                <div className="flex gap-2">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="border rounded-md p-2 w-full"
                  >
                    <option value="">Select a language</option>
                    {languagesList.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addLanguage}
                    className="rounded-full py-1 w-10 px-2 bg-gradient-to-r from-peach-300 to-peach-100 text-white hover:opacity-90"
                  >
                    ✔
                  </button>
                </div>

                {languages.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Selected Languages:</h3>
                    {languages.map((lang) => (
                      <div
                        key={lang}
                        className="flex items-center justify-between bg-gray-200 px-3 py-1 rounded-md mb-2"
                      >
                        <span>{lang}</span>
                        <button
                          onClick={() => removeLanguage(lang)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* select location */}
                <div className="">
                  <h2 className="text-lg font-semibold mt-6 mb-2">
                    Select Location
                  </h2>
                  <div className="flex gap-2">
                    {/* State Select */}
                    <Select
                      options={states}
                      value={selectedState}
                      onChange={handleStateChange}
                      placeholder="Select a state"
                      className="w-1/2"
                    />

                    {/* City Select */}
                    <Select
                      options={cities}
                      value={selectedCity}
                      onChange={setSelectedCity}
                      placeholder="Select a city"
                      className="w-1/2"
                      isDisabled={!selectedState}
                    />

                    {/* Add Button */}
                    <button
                      onClick={handleAddLocation}
                      className="rounded-full py-1 w-10 px-2 bg-gradient-to-r from-peach-300 to-peach-100 text-white hover:opacity-90"
                    >
                      ✔
                    </button>
                  </div>

                  {/* Selected Locations */}
                  {locations.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Selected Locations:</h3>
                      {locations.map((location) => (
                        <div
                          key={location}
                          className="flex items-center justify-between bg-gray-200 px-3 py-1 rounded-md mb-2"
                        >
                          <span>{location}</span>
                          <button
                            onClick={() => handleRemoveLocation(location)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✖
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="hover:border-peach-300 transition-colors">
              <div>
                <div className="bg-gradient-to-r from-peach-300 to-peach-100 bg-clip-text text-transparent">
                  Recent Payments
                </div>
              </div>
              <div>
                {/* <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gradient-to-r from-white to-[#ffded5]/10"
                    >
                      <div className="flex items-center space-x-4">
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
                            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                          />
                        </svg>

                        <div>
                          <p className="font-medium">Math Tutoring Session</p>
                          <p className="text-sm text-gray-500">
                            March {i}, 2024
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">₹{30 + i * 5}.00</p>
                    </div>
                  ))}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
