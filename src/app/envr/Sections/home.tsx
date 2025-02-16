"use client";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";

const Home = () => {
  const slides = [
    {
      id: 1,
      image: "./envr/user.png",
      text: "Talk to our expert for onboarding the projects  ",
    },
    {
      id: 2,
      image: "./envr/user.png",
      text: "Talk to our expert for onboarding the projects",
    },
    {
      id: 3,
      image: "./envr/user.png",
      text: "Talk to our expert for onboarding the projects",
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    beforeChange: (_: number, next: number) => setActiveSlide(next),
    appendDots: (dots: any) => (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <ul className="flex gap-2 absolute left-[16%] md:left-[40%] bottom-[60px] left-[30%]">{dots}</ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div
        className={`w-8 h-1 mt-5 mx-auto rounded transition-all duration-300 ${i === activeSlide ? "bg-brand1-500" : "bg-gray-300"
          }`}
      ></div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  // Style for `slick-active` and `slick-dash`



  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const isAutoScrolling = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      isAutoScrolling.current = true;
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    if (sliderRef.current && isAutoScrolling.current) {
      const slideWidth = sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({
        left: currentSlide * slideWidth,
        behavior: "smooth",
      });
      isAutoScrolling.current = false;
    }
  }, [currentSlide]);

  const handleScroll = () => {
    if (sliderRef.current && !isAutoScrolling.current) {
      const slideWidth = sliderRef.current.offsetWidth;
      const newSlideIndex = Math.round(
        sliderRef.current.scrollLeft / slideWidth
      );
      if (newSlideIndex !== currentSlide) {
        setCurrentSlide(newSlideIndex);
      }
    }
  };

  const handleDashClick = (index: number) => {
    if (index !== currentSlide) {
      isAutoScrolling.current = true;
      setCurrentSlide(index);
    }
  };

  return (
    <div
      id="home"
      className=" h-auto w-full bg-[#f3f4f6] scroll-mt-[87px] px-4 lg:px-8 pb-[50px]"
    >
      <div className="flex flex-col-reverse lg:items-stretch lg:flex-row lg:gap-[60px] pt-[6rem]  ">
        <div className="lg:w-2/3 relative  ">
          <div className="rounded-xl overflow-hidden ">
            <img
              src="./envr/hero_image.png"
              alt="Sustainable Future"
              className="w-full h-auto"
            />
          </div>

          <div
            className="
    absolute bottom-[-50px] xl:bottom-[-50px] custom-range:bottom-[-30px] lg:bottom-[6%] md:bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-white shadow-lg 
    rounded-[1.4rem] p-4 w-full max-w-md sm:w-[560px]
  pb-8"
          >
            <h3 className="text-[#000] font-inter text-[16px] font-normal leading-[35px]">
              Innovative Features for a Smarter Experience
            </h3>
            <p className="text-sm text-gray-500">
              Feature loaded intuitive marketplace enabling the trade in a jiffy .
            </p>
          </div>
        </div>

        <div className="lg:w-1/3  lg:text-left mb-10 lg:mb-0">
          <h1
            className="text-black font-inter font-[400] 
            
 xl:text-[80px] xl:leading-[90px]
  lg:text-[69px] lg:leading-[75px]
  md:text-[96px] md:leading-[120px] 
  sm:text-[72px] sm:leading-[90px]
   text-[40px] leading-[50px]"
          >
            Building <span className="font-[600]"> a </span> <br />
            <span className="text-[#57CC99] font-[600]">Sustainable</span>{" "}
            <br /> Future
          </h1>
          <p className="text-[#979797] font-inter text-[16px] font-normal leading-[35px] mt-[60px] mb-[60px] hidden lg:block">
            Unlock the potential of carbon trading to drive environmental impact
            and compliance. Together, we can reduce emissions and create a
            cleaner world.
          </p>

          <a href="/signup">
            <button className="mt-6 bg-black text-white py-3 px-8 rounded-[42px] text-sm lg:text-base shadow-md hover:opacity-90 font-inter hidden lg:block flex items-center">

              <span className="pl-[10px] flex items-center gap-[25px]">
                <span>Signup</span>
                <img
                  src="./envr/arrow.svg"
                  alt="Arrow Icon"
                  className="w-4"
                />
              </span>
            </button>
          </a>
        </div>
      </div>
      <div className="sm:mt-5 mt-10">
        <p className="text-[#979797] font-inter text-[16px] font-normal leading-[35px] mt-[70px] block lg:hidden">
          Unlock the potential of carbon trading to drive environmental impact
          and compliance. Together, we can reduce emissions and create a cleaner
          world.
        </p>
        <button className="mt-6 bg-black text-white py-3 px-8 rounded-[42px] text-sm lg:text-base shadow-md hover:opacity-90 font-inter  block lg:hidden flex items-center">

          <span className="pl-[10px] flex items-center gap-[25px]">
            <span>Signup</span>
            <img
              src="./envr/arrow.svg"
              alt="Arrow Icon"
              className="w-4 "
            />
          </span>
        </button>
      </div>

      <div className="lg:flex xl:flex lg:items-stretch xl:items-stretch lg:space-x-4 xl:space-x-4 mt-8 pt-4">
        <div className=" relative lg:w-1/2  bg-white border-[1px] border-[#57CC99] rounded-[18px]  p-6 pr-9 pb-6 pl-9 gap-[12px] flex items-center space-x-4 mt-3 ">
          <div>
            <img
              src="./envr/seller.svg"
              alt="Description of SVG"
              className=" w-[32px] "
            />
          </div>

          <div>
            <h3 className="text-[12px] lg:text-[18px] font-[500] text-[#000] font-inter">
              Seller
            </h3>

            <p className="text-gray-600 text-sm mt-1 flex items-center">
              <span className="text-[#979797] font-inter flex items-center text-[12px] lg:text-[18px] font-[500]">
                Onboard&nbsp;
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="16"
                  viewBox="0 0 23 16"
                  fill="none"
                  className="ml-1"
                >
                  <path
                    d="M21.7278 8.70711C22.1184 8.31658 22.1184 7.68342 21.7278 7.29289L15.3639 0.928931C14.9734 0.538407 14.3402 0.538407 13.9497 0.928931C13.5591 1.31946 13.5591 1.95262 13.9497 2.34314L19.6065 8L13.9497 13.6569C13.5591 14.0474 13.5591 14.6805 13.9497 15.0711C14.3402 15.4616 14.9734 15.4616 15.3639 15.0711L21.7278 8.70711ZM0.404419 9L21.0207 9L21.0207 7L0.404419 7L0.404419 9Z"
                    fill="#57CC99"
                  />
                </svg>
              </span>
              <span className="text-[#979797] font-inter flex items-center ml-2 text-[12px] lg:text-[18px] font-[500]">
                {" "}
                &nbsp;List Project&nbsp;
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="16"
                  viewBox="0 0 23 16"
                  fill="none"
                  className="ml-1"
                >
                  <path
                    d="M21.7278 8.70711C22.1184 8.31658 22.1184 7.68342 21.7278 7.29289L15.3639 0.928931C14.9734 0.538407 14.3402 0.538407 13.9497 0.928931C13.5591 1.31946 13.5591 1.95262 13.9497 2.34314L19.6065 8L13.9497 13.6569C13.5591 14.0474 13.5591 14.6805 13.9497 15.0711C14.3402 15.4616 14.9734 15.4616 15.3639 15.0711L21.7278 8.70711ZM0.404419 9L21.0207 9L21.0207 7L0.404419 7L0.404419 9Z"
                    fill="#57CC99"
                  />
                </svg>
              </span>

              <span className="text-[#979797] font-inter text-[12px] lg:text-[18px] font-[500]">
                {" "}
                &nbsp;Sell&nbsp;{" "}
              </span>
            </p>
          </div>
        </div>
        <div className=" relative lg:w-1/2 bg-white  border-[1px] border-[#57CC99] rounded-[18px] p-6 pr-9 pb-6 pl-9  gap-[12px] flex items-center space-x-4 mt-3">
          <div>
            <img
              src="./envr/buyer.svg"
              alt="Description of SVG"
              className=" w-[32px] "
            />
          </div>

          <div>
            <h3 className="text-[12px] lg:text-[18px] font-[500] text-[#000] font-inter">
              Buyer
            </h3>

            <p className="text-gray-600 text-sm mt-1 flex items-center">
              <span className="text-[#979797] font-inter flex items-center text-[12px] lg:text-[18px] font-[500]">
                Find&nbsp;
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="16"
                  viewBox="0 0 23 16"
                  fill="none"
                  className="ml-1"
                >
                  <path
                    d="M21.7278 8.70711C22.1184 8.31658 22.1184 7.68342 21.7278 7.29289L15.3639 0.928931C14.9734 0.538407 14.3402 0.538407 13.9497 0.928931C13.5591 1.31946 13.5591 1.95262 13.9497 2.34314L19.6065 8L13.9497 13.6569C13.5591 14.0474 13.5591 14.6805 13.9497 15.0711C14.3402 15.4616 14.9734 15.4616 15.3639 15.0711L21.7278 8.70711ZM0.404419 9L21.0207 9L21.0207 7L0.404419 7L0.404419 9Z"
                    fill="#57CC99"
                  />
                </svg>
              </span>
              <span className="text-[#979797] font-inter flex items-center ml-2 text-[12px] lg:text-[18px] font-[500]">
                {" "}
                &nbsp;Negotiate&nbsp;
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="16"
                  viewBox="0 0 23 16"
                  fill="none"
                  className="ml-1"
                >
                  <path
                    d="M21.7278 8.70711C22.1184 8.31658 22.1184 7.68342 21.7278 7.29289L15.3639 0.928931C14.9734 0.538407 14.3402 0.538407 13.9497 0.928931C13.5591 1.31946 13.5591 1.95262 13.9497 2.34314L19.6065 8L13.9497 13.6569C13.5591 14.0474 13.5591 14.6805 13.9497 15.0711C14.3402 15.4616 14.9734 15.4616 15.3639 15.0711L21.7278 8.70711ZM0.404419 9L21.0207 9L21.0207 7L0.404419 7L0.404419 9Z"
                    fill="#57CC99"
                  />
                </svg>
              </span>

              <span className="text-[#979797] font-inter text-[12px] lg:text-[18px] font-[500]">
                {" "}
                &nbsp;Buy&nbsp;{" "}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="lg:flex xl:flex md:items-stretch xl:items-stretch lg:space-x-4 xl:space-x-4 mt-8  ">
        <div className="relative   lg:w-1/3  p-4 bg-[#57CC99;] rounded-[18px] shadow-custom mb-5 px-[25px] py-[24px] ">
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className=" w-full h-full flex overflow-hidden snap-x snap-mandatory scrollbar-hide"
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="flex  snap-center"
                style={{ minWidth: "100%" }}
              >
                <img
                  src={slide.image}
                  alt="profile"
                  className="w-[80px] h-[80px] rounded-full flex-shrink-0"
                />
                <div className="flex flex-col items-start px-4 gap-1 lg:gap-4 pb-4">

                  <p className="text-white font-[500] text-[24px] ml-4 font-inter break-words overflow-wrap ">
                    {slide.text}
                  </p>
                  <img
                    src="./envr/Group 15.svg"
                    alt="Description of SVG"
                    className="h-[32px] w-[32px] ml-4 relative  "
                  />
                </div>

              </div>
            ))}
          </div>

          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 mb-s pt-xl">
            {slides.map((_, index) => (
              <div
                key={index}
                onClick={() => handleDashClick(index)}
                className={`w-12 h-1 rounded cursor-pointer ${index === currentSlide ? "bg-white" : "bg-gray-300"
                  }`}
              ></div>
            ))}
          </div>
        </div>
        {/* <div className="lg:w-1/3  bg-white border border-gray-200 rounded-[35px] shadow-lg p-4  mb-5 ml-0 px-[25px] py-[24px]">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src="./envr/Icon.svg"
              alt="Description of SVG"
              className=" h-[32px] w-[32px] "
            />

            <h3 className="text-[18px] font-[500] text-black font-inter ">
              Slabs Wise Pricing
            </h3>
          </div>

          <p className="text-[#979797] text-[13px] font-inter">
            Flexible pricing based on usage slabs to suit your specific needs
            and budget.
          </p>
        </div>

        <div className="lg:w-1/3 bg-white border border-gray-200 rounded-[35px] shadow-lg p-4 mb-5  ml-0 px-[25px] py-[24px]">
          <div className="flex items-center space-x-3 mb-4 ">
            <img
              src="./envr/Layer_1.svg"
              alt="Description of SVG"
              className=" h-[32px] w-[32px] "
            />

            <h3 className="text-[18px] font-[500] text-black font-inter">
            Forward and Backward Negotiations
            </h3>
          </div>

          <p className="text-[#979797] text-[13px] font-inter">
          Exploit your power to negotiate and extract the best value.

          </p>
        </div> */}
        <div className="lg:w-2/3  lg:flex xl:flex md:items-stretch xl:items-stretch lg:space-x-4 xl:space-x-4  ">
          <div className="bg-white border border-gray-200 flex flex-col flex-1 rounded-[18px] shadow-custom  mb-5 ml-0 px-[25px] py-[24px] md:min-h-[140px] min-h-[190px]">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="./envr/Icon.svg"
                alt="Description of SVG"
                className="h-[69px] w-[69px]"
              />
              <h3 className="text-[24px] font-[500] text-black font-inter max-w-40">
                Slabs Wise Pricing
              </h3>
            </div>
            <p className="text-[#979797] text-[16px] font-inter leading-[35px] ">
              Flexible pricing based on usage slabs to suit your specific needs
              and budget.
            </p>
          </div>
          <div className="bg-white border border-gray-200 flex flex-1  flex-col  rounded-[18px] shadow-custom  p-4  mb-5 ml-0 px-[25px] py-[24px] md:min-h-[140px]  min-h-[190px]">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="./envr/Layer_1.svg"
                alt="Description of SVG"
                className="h-[69px] w-[69px]"
              />
              <h3 className="text-[24px] font-[500] text-black font-inter">
                Negotiation Available
              </h3>
            </div>
            <p className="text-[#979797] text-[16px] font-inter leading-[35px]">
              Pricing available for negotiation to better align with your requirements and budget.
            </p>
          </div>
          {/* <Slider {...settings} className="space-x-4 rounded-[18px] bg-transparent">
            
           
            <div className="bg-white border border-gray-200 rounded-[18px] shadow-custom  p-4  mb-5 ml-0 px-[25px] py-[24px] md:min-h-[140px]  min-h-[190px]">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="./envr/Icon.svg"
                  alt="Description of SVG"
                  className="h-[32px] w-[32px]"
                />
                <h3 className="text-[18px] font-[500] text-black font-inter">
                  One stop shop for all sustainability needs
                </h3>
              </div>
              <p className="text-[#979797] text-[16px] font-inter">
                No need to wander to multiple sites, your search for sustainability ends here.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-[18px] shadow-custom  p-4  mb-5 ml-0 px-[25px] py-[24px] md:min-h-[140px]  min-h-[190px]">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="./envr/Icon.svg"
                  alt="Description of SVG"
                  className="h-[32px] w-[32px]"
                />
                <h3 className="text-[18px] font-[500] text-black font-inter">
                  Credibility backed by Blockchain
                </h3>
              </div>
              <p className="text-[#979797] text-[16px] font-inter">
                Secure, transparent and immutable transactions backed by Blockchain Network.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-[18px] shadow-custom  p-4  mb-5 ml-0 px-[25px] py-[24px] md:min-h-[140px]  min-h-[190px]">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="./envr/Icon.svg"
                  alt="Description of SVG"
                  className="h-[32px] w-[32px]"
                />
                <h3 className="text-[18px] font-[500] text-black font-inter">
                  Comprehensive Project Bouquet
                </h3>
              </div>
              <p className="text-[#979797] text-[16px] font-inter">
                Global project catalogue serving the requirements of multiple scale of operations.
              </p>
            </div>
          </Slider> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
