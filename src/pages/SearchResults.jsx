import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect } from "react";
import { db } from "../firebase";
import { useSearchParams } from "react-router-dom";



const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const initialSubject = searchParams.get("subject") || "";
  const initialSearch = searchParams.get("search") || "";
  const [allTutors, setAllTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filterSubject, setFilterSubject] = useState(initialSubject);
  const [filterLanguage, setFilterLanguage] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterStars, setFilterStars] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  
  // Fetch all tutors from Firebase
  useEffect(() => {
    const tutorsRef = ref(db, "tutors");
  
    // Listen for real-time changes
    onValue(tutorsRef, (snapshot) => {
      if (snapshot.exists()) {
        const tutorsData = snapshot.val();
        // console.log(tutorsData)
        const tutorsArray = tutorsData
  ? Object.keys(tutorsData).map((key) => ({
      id: key,
      ...tutorsData[key],
    }))
  : [];
  // console.log(tutorsArray)
        setAllTutors(tutorsArray);
        setFilteredTutors(tutorsArray);
      } else {
        setAllTutors([]);
        setFilteredTutors([]);
      }
    });
  }, []);
  
  // Filter and sort tutors based on user inputs
  useEffect(() => {
    let result = [...allTutors];
  
    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (tutor) =>
          tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tutor.sub.some((subject) =>
            subject.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

        // Apply language filter
        if (filterLanguage) {
          result = result.filter((tutor) => tutor.lang.includes(filterLanguage));
        }
  
    // Apply subject filter
    if (filterSubject) {
      result = result.filter((tutor) => tutor.sub.includes(filterSubject));
    }
  

  
    // Apply location filter
    if (filterLocation) {
      result = result.filter((tutor) => tutor.locations?.includes(filterLocation));
    }
  
    // Apply stars filter
    if (filterStars) {
      result = result.filter((tutor) => tutor.stars >= parseFloat(filterStars));
    }
  
    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];
  
        if (sortOrder === "asc") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }
  
    setFilteredTutors(result);
  }, [
    searchQuery,
    filterSubject,
    filterLanguage,
    filterLocation,
    filterStars,
    sortBy,
    sortOrder,
    allTutors,
  ]);

  return (
    <div>
      <Navbar/>
    <div className="p-6 mt-16 space-y-4">
      {/* Search Bar */}
      <div className="flex w-full justify-center">
        <div className="flex flex-row min-w-[50vw] justify-between px-6 items-center h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm">
          <input
            type="text"
            placeholder="Search for subjects or tutors..."
            className="w-full px-4 bg-transparent focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-gradient-to-r from-peach-300 to-peach-100 text-white rounded-full px-4 py-2 hover:opacity-90">
            Search
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Subject Filter */}
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">All Subjects</option>
          <option value="Physics">Physics</option>
          <option value="Maths">Maths</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
        </select>

        {/* Language Filter */}
        <select
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">All Languages</option>
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="Tamil">Tamil</option>
          <option value="Hindi">Hindi</option>
        </select>

        {/* Location Filter */}
        <select
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">All Locations</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Chennai">Chennai</option>
          <option value="Kolkata">Kolkata</option>
        </select>

        {/* Stars Filter */}
        <select
          value={filterStars}
          onChange={(e) => setFilterStars(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
          <option value="5">5 Stars</option>
        </select>

        {/* Sorting */}
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="">Sort By</option>
            <option value="stars">Stars</option>
            <option value="cost">Cost</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>

      {/* Search Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredTutors.length > 0 ? (
          filteredTutors.map((tutor) => (
            <div
              key={Math.random()}
              className="flex shadow-md flex-col w-80 h-80 rounded-2xl justify-center items-center min-w-80 min-h-80 p-4 hover:shadow-lg transition-all duration-300 ease-in-out bg-white/80 backdrop-blur-sm cursor-pointer transform hover:scale-105"
            >
              {/* Image Section */}
              <div className="relative w-full h-72 mb-4 overflow-hidden rounded-lg">
                <img
                  src={tutor.profilepic}
                  alt={tutor.name}
                  className="w-full h-72 transition-transform duration-300 ease-in-out hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute p-2 text-sm rounded-2xl top-2 right-2 bg-white/90 transition-colors duration-300 hover:bg-peach-100">
                  ★ <span>{tutor.stars}</span>
                </div>
                <div
                  className="absolute bottom-2 rounded-2xl p-2 right-2 bg-white/90 transition-all duration-300 hover:bg-peach-100 hover:scale-110"
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
                      d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>
                </div>
              </div>

              {/* Tutor Name */}
              <h3 className="font-semibold text-lg mb-1 transition-colors duration-300 hover:text-peach-500">
                {tutor.name}
              </h3>

              {/* Subjects */}
              <div className="flex flex-wrap justify-end gap-2 px-2">
                {tutor.sub.map((subject) => (
                  <div
                    key={subject}
                    className="shadow-md rounded-full bg-gradient-to-br from-white to-[#ffded5] text-sm"
                  >
                    <div className="bg-white m-1 py-1 px-2 rounded-full">
                      {subject}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hourly Cost */}
              <div className="mt-2 text-sm text-gray-600">
                ₹500/hour
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No tutors found.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default SearchResults;
