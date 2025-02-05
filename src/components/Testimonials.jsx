import React, { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";

function Testimonials() {
  const [data, setData] = useState([]);
  const [slidesPerView, setSlidesPerView] = useState(5);
  const [width, setWidth] = useState(window.innerWidth);

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

  const testaments = [
    {
      name: "Sunil Kumar Sahoo",
      role: "AIIMS Bhubaneswar",
      content:
        "TutorsForum made learning so much easier! I found the perfect tutor for math, and their guidance helped me ace my calculus exam. The whole process was smooth and stress-free!",
      image: "https://i.ibb.co/tpBK7kXb/image.png",
    },
    {
      name: "Jyotiraditya",
      role: "AIIMS Deoghar",
      content:
        "TutorsForum took the stress out of finding a good tutor. I struggled with physics, but after just a few sessions, I gained confidence and started scoring way better in my exams!",
      image:
        "https://i.ibb.co/27CW6D7y/Whats-App-Image-2025-01-29-at-22-54-54-b845340c.jpg",
    },
    {
      name: "Aditi",
      role: "MKCG Medical College And Hospital",
      content:
        "Finding a great tutor used to be a challenge, but TutorsForum made it effortless. Within days, I found an amazing physics tutor who helped me improve my understanding and confidence in the subject!",
      image:
        "https://i.ibb.co/4w8fWnrp/Whats-App-Image-2025-01-29-at-22-55-55-c3e9bb6c.jpg",
    },
    {
      name: "Charushree",
      role: "IIT Roorkee",
      content:
        "TutorsForum is a game-changer! The user-friendly platform helped me connect with the best tutors, and their support played a huge role in my academic success.",
      image:
        "https://i.ibb.co/h1XCGLHk/Whats-App-Image-2025-01-30-at-18-09-39-7ef540f8.jpg",
    },
    {
      name: "Swastika Agarwal",
      role: "IIT Mumbai",
      content:
        "I love how easy it is to find expert tutors on TutorsForum. Their flexible scheduling and personalized sessions helped me stay on top of my studies and perform my best in exams!",
      image:
        "https://i.ibb.co/d0PVQV5N/Whats-App-Image-2025-01-30-at-18-11-53-e5948400.jpg",
    },
  ];

  return (
    <div className="bg-gradient-to-b font-sans py-6 from-white to-peach-50">
    <div className="text-4xl text-center my-6 font-semibold" >
      What our students say
    </div>
      <Swiper
        slidesPerView={slidesPerView}
        centeredSlides={width > 500 ? true : false}
        spaceBetween={width > 500 ? 80 : 0}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay, Virtual]}
        className=" max-h-48 justify-center items-center"
      >
        {testaments &&
          testaments.map((item, index) => (
            <SwiperSlide
            key={index}
              className={
                width < 500
                  ? `flex flex-col w-2/3 rounded-2xl justify-center items-center`
                  : `grid gap-8 rounded-2xl min-w-[360px] min-h-[120px] `
              }
            >
              <div
                key={item.name}
                className="p-6 rounded-2xl min-w-[360px] shadow-md bg-white/80  backdrop-blur-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="ml-4 text-start">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-xs">{item.content}</p>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}

export default Testimonials;
