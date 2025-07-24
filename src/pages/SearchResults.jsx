import React, { useContext, useLayoutEffect, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { ref, onValue, set } from "firebase/database";
import { db } from "../firebase";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../AuthProvider";
import { Helmet } from "react-helmet-async";

const SearchResults = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
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
  const [name, setName] = useState("");
  const [stud, setStud] = useState(false);

  useEffect(() => {
    const tutorsRef = ref(db, "tutors");
    onValue(tutorsRef, (snapshot) => {
      if (snapshot.exists()) {
        const tutorsData = snapshot.val();
        const tutorsArray = Object.entries(tutorsData).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setAllTutors(tutorsArray);
        setFilteredTutors(tutorsArray);
      } else {
        setAllTutors([]);
        setFilteredTutors([]);
      }
    });
  }, []);

  useEffect(() => {
    let result = [...allTutors];

    // Only search by tutor name
    if (searchQuery) {
      result = result.filter((tutor) =>
        tutor.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterLanguage) {
      result = result.filter(
        (tutor) => Array.isArray(tutor.lang) && tutor.lang.includes(filterLanguage)
      );
    }

    if (filterSubject) {
      result = result.filter(
        (tutor) => Array.isArray(tutor.sub) && tutor.sub.includes(filterSubject)
      );
    }

    if (filterLocation) {
      result = result.filter(
        (tutor) =>
          Array.isArray(tutor.locations) &&
          tutor.locations.some((str) => str.includes(filterLocation))
      );
    }

    if (filterStars) {
      result = result.filter((tutor) => tutor.stars >= parseFloat(filterStars));
    }

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

  useLayoutEffect(() => {
    if (currentUser) {
      const userRef = ref(db, "users/" + currentUser.uid);
      onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setStud(true);
          setName(data.name);
        }
      });
    }
  }, [currentUser]);

  const requestClass = (tutorId, tutorName) => {
    if (!tutorId) {
      return toast.error("Tutor not found", { position: "top-right" });
    }

    set(ref(db, `tutors/${tutorId}/requests/${currentUser.uid}`), {
      studentId: currentUser.uid,
      studentName: name,
      status: "pending",
    });

    set(ref(db, `users/${currentUser.uid}/requests/${tutorId}`), {
      tutorId: tutorId,
      tutorName: tutorName,
      status: "pending",
    });

    toast.success("Class request sent", { position: "top-right" });
  };

  return (
    <div>
      <Helmet>
        <title>Search Results - Tutors Forum</title>
        <meta name="description" content="Find the perfect tutor for your needs by searching our extensive database of qualified instructors." />
      </Helmet>
      <Navbar />
      <div className="p-6 mt-16 space-y-4">
        {/* Search Input */}
        <div className="flex flex-col gap-4 items-center">
          <div className="flex flex-row w-full sm:w-[50vw] justify-between px-6 items-center h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm">
            <input
              type="text"
              placeholder="Search by tutor name..."
              className="w-full px-4 bg-transparent focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-gradient-to-r from-peach-300 to-peach-100 text-white rounded-full px-4 py-2 hover:opacity-90">
              Search
            </button>
          </div>

          <div className="flex flex-row w-full sm:w-[50vw] px-6 items-center justify-center h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm">
            <input
              type="text"
              placeholder="Filter by location"
              className="w-full px-4 bg-transparent focus:outline-none"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center">
          <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="border p-2 rounded-md">
            <option value="">All Subjects</option>
            <option value="Physics">Physics</option>
            <option value="Maths">Maths</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
          </select>

          <select value={filterLanguage} onChange={(e) => setFilterLanguage(e.target.value)} className="border p-2 rounded-md">
            <option value="">All Languages</option>
            <option value="English">English</option>
            <option value="French">French</option>
            <option value="Tamil">Tamil</option>
            <option value="Hindi">Hindi</option>
          </select>

          <select value={filterStars} onChange={(e) => setFilterStars(e.target.value)} className="border p-2 rounded-md">
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="5">5 Stars</option>
          </select>

          <div className="flex gap-2">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded-md">
              <option value="">Sort By</option>
              <option value="stars">Stars</option>
              <option value="cost">Cost</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border p-2 rounded-md">
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filteredTutors.length > 0 ? (
            filteredTutors.map((tutor) => (
              <div
                key={tutor.id}
                className="flex shadow-md flex-col w-80 h-80 rounded-2xl justify-center items-center min-w-80 min-h-96 px-4 pt-4 bg-white/80 backdrop-blur-sm transform hover:scale-105 hover:shadow-lg transition-all"
              >
                <div
                  className="relative w-full h-72 mb-4 overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => navigate(`/tutor/${tutor.id}`)}
                >
                  <img
                    src={tutor.profilepic || "https://cdn.pixabay.com/photo/2023/05/02/10/35/avatar-7964945_960_720.png"}
                    alt={tutor.name}
                    className="w-full h-72 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 text-sm rounded-2xl p-1">★ {tutor.stars}</div>
                </div>

                <h3
                  className="font-semibold text-lg mb-1 cursor-pointer hover:text-peach-500"
                  onClick={() => navigate(`/tutor/${tutor.id}`)}
                >
                  {tutor.name}
                </h3>

                <div className="flex flex-wrap justify-center gap-2 px-2 text-sm">
                  {tutor.sub?.map((subject) => (
                    <span key={subject} className="px-3 py-1 bg-white rounded-full shadow text-xs">
                      {subject}
                    </span>
                  ))}
                </div>

                <div className="my-2 text-sm text-gray-600">{tutor.cph ? `${tutor.cph} /hr` : "Cost not defined"}</div>

                {stud && (
                  <button
                    onClick={() => requestClass(tutor.id, tutor.name)}
                    className="bg-gradient-to-r from-peach-300 to-peach-100 text-white rounded-xl py-2 w-full hover:opacity-90 transition-opacity"
                  >
                    Request a class
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No tutors found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
