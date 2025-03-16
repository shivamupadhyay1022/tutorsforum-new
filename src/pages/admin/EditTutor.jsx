import React, { useState, useContext, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { db } from "../../firebase";
import { ref, onValue, update } from "firebase/database";
import { toast } from "react-toastify";
import { State, City } from "country-state-city";
import { useParams } from "react-router-dom";
import Select from "react-select";

const subjectsList = ["English", "Maths", "Chemistry", "Biology"];
const languagesList = ["Hindi", "English", "Bengali", "Odia"];

const EditTutor = () => {
  const [tutorData, setTutorData] = useState({});
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilepic, setprofilepic] = useState(null);
  const [sub, setSubjects] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [hourlyRate, setHourlyRate] = useState("");
  const [teachOnline, setTeachOnline] = useState(false);
  const [stateName, setstateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [credits, setCredits] = useState(0);
  const { id } = useParams();

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [locations, setLocations] = useState([]);

  // Fetch Tutor Data from Firebase
  useEffect(() => {
    const tutorRef = ref(db, `tutors/${id}`);
    onValue(tutorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTutorData(data);
        setName(data.name || "");
        setBio(data.bio || "");
        setSubjects(data.sub || []);
        setLanguages(data.lang || []);
        setHourlyRate(data.hourlyRate || "");
        setTeachOnline(data.teachOnline || false);
        setstateName(data.state || "");
        setCityName(data.city || "");
        setLocations(data.locations || "");
        setCredits(data.credits || 0);
      }
    });
  }, [id]);

  // Handle Profile Pic Upload and Compression
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const compressedImage = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onload = (event) => setprofilepic(event.target.result);
      reader.readAsDataURL(compressedImage);
    } catch (error) {
      toast.error("Image compression failed!");
    }
  };

  // Handle Subject Selection
  const handleSubjectToggle = (subject) => {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  // Handle Language Selection
  const handleLanguageToggle = (language) => {
    setLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedCity(null);
  };

  const states = State.getStatesOfCountry("IN").map((state) => ({
    label: state.name,
    value: state.isoCode,
  }));

  const cities = selectedState
    ? City.getCitiesOfState("IN", selectedState.value).map((city) => ({
        label: city.name,
        value: city.name,
      }))
    : [];

  const handleAddLocation = () => {
    if (selectedState && selectedCity) {
      const newLocation = `${selectedCity.label}, ${selectedState.label}`;

      // Check if the location already exists
      if (!locations.includes(newLocation)) {
        const updatedLocations = [...locations, newLocation];
        const updates = {};
        updates[`/tutors/${id}/locations`] = updatedLocations;

        update(ref(db), updates);
      }
    }
  };

  // Remove location
  const handleRemoveLocation = (location) => {
    const updatedLocations = locations.filter((loc) => loc !== location);
    const updates = {};
    updates[`/tutors/${id}/locations`] = updatedLocations;

    update(ref(db), updates);
    setLocations(updatedLocations);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      name,
      bio,
      profilepic: profilepic || tutorData.profilepic || "",
      sub: sub,
      lang: languages,
      cph: hourlyRate,
      teachOnline,
      credits,
    };

    try {
      await update(ref(db, `tutors/${id}`), updatedData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile!");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Edit Tutor Profile</h2>

      {/* Profile Picture */}
      <label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <div className="w-24 h-24 rounded-full overflow-hidden cursor-pointer border">
          <img
            src={profilepic || tutorData.profilepic || "/default-avatar.png"}
            alt="Profile"
          />
        </div>
      </label>

      {/* Name */}
      <label className="block mt-4 font-medium">Name:</label>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded mt-4"
      />

      {/* Bio */}
      <label className="block mt-4 font-medium">Bio:</label>
      <textarea
        placeholder="Write your bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full p-2 border rounded mt-4"
      />

      {/* Credits (New Field) */}
        <label className="block mt-4 font-medium">Credits:</label>      
        <input
          type="number"
          name="credits"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          className="w-full p-2 border rounded-md"
        />

      {/* Subjects */}
      <h3 className="mt-4 mb-2 font-medium">Subjects taught:</h3>
      <div className="flex flex-wrap gap-2">
        {subjectsList.map((subject) => (
          <button
            key={subject}
            onClick={() => handleSubjectToggle(subject)}
            className={`px-4 py-1 rounded ${
              sub.includes(subject) ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* Languages */}
      <h3 className="mt-4 mb-2 font-medium">Languages you speak:</h3>
      <div className="flex flex-wrap gap-2">
        {languagesList.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageToggle(lang)}
            className={`px-4 py-1 rounded ${
              languages.includes(lang)
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Hourly Rate */}
      <label className="block mt-4 font-medium">Hourly Rate:</label>
      <input
        type="number"
        placeholder="Hourly Rate (₹)"
        value={hourlyRate}
        onChange={(e) => setHourlyRate(e.target.value)}
        className="w-full p-2 border rounded mt-4"
      />

      {/* Teach Online Toggle */}
      <label className="flex items-center mt-4">
        <input
          type="checkbox"
          checked={teachOnline}
          onChange={() => setTeachOnline(!teachOnline)}
          className="mr-2"
        />
        Teach Online
      </label>

      {/* State and City Selection */}
      {/* select location */}
      <div className="">
        <h2 className=" flex items-center text-lg font-semibold mt-6 mb-2">
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
            className="bg-blue-500 text-white px-4 py-2 rounded "
          >
            ➕
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

      {/* Save Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white p-2 rounded mt-6 hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditTutor;
