"use client";
import React, { useState } from "react";
import Slider from "react-slick";
const Registries = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    beforeChange: (_: number, next: any) => setActiveSlide(next),
    appendDots: (dots: any) => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <ul style={{ display: "flex", gap: "10px" }}> {dots} </ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div
        className={`w-[30px] h-[4px]  mt-5 mx-auto gap-3 rounded-[2px] transition-all duration-300 ${i === activeSlide ? "bg-brand1-500" : "bg-gray-300"
          }`}
      ></div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
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


  const cards = [
    {
      logo: "./envr/Frame.png",
      title: "Carbon Registry",
    },
    {
      logo: "./envr/puro.earth.svg",
      title: "Puro Earth",
    },
    {
      logo: "./envr/Verra-Logo0.png",
      title: "Verra",
    },
  ];
  return (
    <div id="registries" className="h-auto bg-[#f3f4f6]   scroll-mt-[87px] px-4 lg:px-8  py-[50px]">
      <div className="pb-12 ">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-4 h-4 bg-brand1-500 rounded-full"></div>
          <p className="font-[500] text-[20px] font-inter  text-black ">
            Registries
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-start justify-between mb-12">

          <div className="flex-1 lg:basis-2/3">
            <h1 className="text-[40px] lg:text-[65px] font-[400] text-gray-800 lg:leading-[75px] leading-[50px]">
              Strategic Tie-ups <br /> with{" "}
              <span className="text-[#57CC99] font-semibold">Registries</span>
            </h1>
          </div>

          <div className="flex-1 lg:basis-1/3 mt-4 lg:mt-0 lg:ml-8">
            <p className="text-[#000] font-inter text-[16px] font-[400] leading-[35px]">
              Our strategic alliances with prominent registries provide seamless integration
              and robust management of carbon credits. Together, we drive
              meaningful climate action and support sustainable practices.
            </p>
          </div>
        </div>

        <Slider {...settings}>
          {cards.map((card, index) => (
            <div key={index} className="px-4">
              <div className="bg-white shadow-lg rounded-[35px] p-6 text-center lg:px-[57px] lg:py-[43px] mb-5">
                <div className=" h-[160px] rounded-[15px] mx-auto bg-[#F5F5F5] flex justify-center items-center">
                  <img
                    src={card.logo}
                    alt={card.title}
                    className="h-auto max-h-[100px] max-w-[160px] mx-auto"
                  />
                </div>
                <h3 className="text-[18px] font-medium text-black mt-6 mb-2">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};
export default Registries;
