import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

function TutorCarousel() {
  const [data, setData] = useState([]);
  const [slidesPerView, setSlidesPerView] = useState(5);
  const [width, setWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const dataRef = ref(db, "tutors/"); // Replace with your reference
    // dataRef.orderByChild('nestedObject.subject').equalTo('Chemistry')
    onValue(
      dataRef,
      (snapshot) => {
        const retrievedData = [];
        snapshot.forEach((childSnapshot) => {
          const item = childSnapshot.val();
          const uid = childSnapshot.key;
          retrievedData.push({ uid, ...item });
        });
        setData(retrievedData);
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
    console.log(data);
  };

  useEffect(() => {
    setWidth(window.innerWidth);
    handleResize();
  }, [width]);

  const handleResize = () => {
    const width = window.innerWidth;
    if (width > 1200) {
      setSlidesPerView(5);
    } else if (width > 900) {
      setSlidesPerView(4);
    } else if (width > 700) {
      setSlidesPerView(3);
    } else if (width > 500) {
      setSlidesPerView(2);
    } else {
      setSlidesPerView(1);
    }
  };

  const tutors = [
    {
      id: 1,
      name: "Sarah Johnson",
      subject: "Mathematics",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
    {
      id: 2,
      name: "Michael Chen",
      subject: "Physics",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    },
    {
      id: 3,
      name: "Emily Davis",
      subject: "Chemistry",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    },
    {
      id: 4,
      name: "David Wilson",
      subject: "Biology",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },
    {
      id: 5,
      name: "Lisa Anderson",
      subject: "English",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    },
  ];

  return (
    <>
      <Swiper
        slidesPerView={slidesPerView}
        centeredSlides={width > 500 ? true : false}
        spaceBetween={width > 500 ? 40 : 0}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay, Virtual]}
        className="justify-center min-h-[420px] items-center"
      >
        {data &&
          data.map((item, index) => (
            <SwiperSlide
              className={
                width < 500
                  ? `flex flex-col w-full rounded-2xl min-h-60 justify-center items-center`
                  : `grid gap-16 rounded-2xl min-w-80 min-h-72`
              }
            >
              <div
                key={`${item.id}-${index}`}
                className="flex shadow-md flex-col rounded-2xl justify-center items-center min-w-80 min-h-80 p-4 hover:shadow-lg transition-all  duration-300 ease-in-out bg-white/80 backdrop-blur-sm cursor-pointer transform hover:scale-105"
                onClick={() => navigate(`/tutor/${item.uid}`)}
              >
                <div className="relative w-full h-72 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={item.profilepic}
                    alt={item.name}
                    className="w-full h-72  transition-transform duration-300 ease-in-out hover:scale-110"
                    loading="lazy"
                  />
                  <div
                    className="absolute p-2 text-sm rounded-2xl top-2 right-2 bg-white/90 transition-colors duration-300 hover:bg-peach-100"
                    variant="secondary"
                  >
                    ★ {item.stars}
                    {/* {item.rating} */}
                  </div>
                  <div
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-2 rounded-2xl p-2 right-2 bg-white/90 transition-all duration-300 hover:bg-peach-100 hover:scale-110"
                    onClick={(e) => handleChatClick(e, item.id)}
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
                <h3 className="font-semibold text-lg mb-1 transition-colors duration-300 hover:text-peach-500">
                  {item.name}
                </h3>
                {/* <p className="text-sm text-gray-600 transition-colors duration-300">
                  {item.sub}
                </p> */}
                <div className="flex flex-wrap justify-end gap-2 px-2">
                  {!item.sub?.includes("Maths") || (
                    <div className="shadow-md  rounded-full bg-gradient-to-br from-white to-[#ffded5]  text-sm ">
                      <div className="bg-white m-1 p-y1 px-2 rounded-full">
                        {"Maths"}
                      </div>
                    </div>
                  )}
                  {!item.sub?.includes("Physics") || (
                    <div className="shadow-md  rounded-full bg-gradient-to-br from-white to-[#ffded5]  text-sm ">
                    <div className="bg-white m-1 p-y1 px-2 rounded-full">
                      {"Physics"}
                    </div>
                  </div>
                  )}
                  {!item.sub?.includes("Chemistry") || (
                    <div className="shadow-md  rounded-full bg-gradient-to-br from-white to-[#ffded5]  text-sm ">
                    <div className="bg-white m-1 p-y1 px-2 rounded-full">
                      {"Chemistry"}
                    </div>
                  </div>
                  )}
                  {!item.sub?.includes("Bio") || (
                    <div className="shadow-md  rounded-full bg-gradient-to-br from-white to-[#ffded5]  text-sm ">
                    <div className="bg-white m-1 p-y1 px-2 rounded-full">
                      {"Biology"}
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
}

export default TutorCarousel;
