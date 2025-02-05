import React from "react";
import Navbar from "../components/Navbar";
import TutorCarousel from "../components/TutorCarousel";
import SubjectsGrid from "../components/SubjectsGrid";
import HowItWorks  from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer.jsx";

function Home() {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#ffded5]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 flex flex-col items-center pb-4 px-4">
        <div className="w-full grid grid-cols-1  justify-center items-center mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Find Your Perfect Tutor
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Connect with expert tutors who can help you master any subject and
            achieve your academic goals.
          </p>

          {/* Star Tutors Carousel */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Our Star Tutors</h2>
            <TutorCarousel />
          </div>

          {/* Search Section */}
          {/* <SearchSection /> */}
          <div className="  flex w-full justify-center">
            <div className="flex shadow-md flex-row min-w-[50vw] justify-self-center justify-between px-6 items-center  h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-peach-100 focus:border-transparent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search for subjects or tutors..."
                className=" w-full px-4 bg-transparent focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-peach-300 to-peach-100 text-white rounded-full px-4 py-2 hover:opacity-90 transition-opacity">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Explore Subjects
          </h2>
          <SubjectsGrid />
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto">{/* <HowItWorks /> */}</div>
      </section>

      {/* How It Works */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          <HowItWorks />
        </div>
      </section>

            {/* Testimonials */}
            <Testimonials />

                  {/* Call to Action with Features */}
      <CallToAction />

{/* Footer */}
<Footer />
    </div>
  );
}

export default Home;
