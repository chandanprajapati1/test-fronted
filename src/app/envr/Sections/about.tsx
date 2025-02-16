"use client";
import React from "react";

const About = () => {
  return (
    <div id="about-us" className="bg-[#f3f4f6]  px-4 sm:px-8 scroll-mt-[40px]  py-[50px]">
      <div className=" flex flex-col-reverse lg:flex-row max-w-full  gap-12">
        <div className="relative lg:w-1/2">
          <div className="absolute custom-range-mobile:left-[35%] custom-range-mobile:top-[10%] md:top-[8%] lg:left-[40%] bg-white p-4 lg:rounded-[35px]  rounded-[15px] shadow-md lg:w-[68%] xs:w-full py-[24px] lg:p-6 lg:pr-12 lg:pb-6 lg:pl-12 gap-4 ">
            <div className="flex items-start ">
              <img
                src="./envr/carboncredit.svg"
                alt="Description of SVG"
                className=" w-[32px] relative pt-[8px] "
              />
              <div className="ml-4">
                <h4 className="font-[500] text-[#000] font-inter text-[18px] lg:leading-[29px] leading-[29px]">
                  {" "}
                  Assortment of Technology Solutions and Consulting
                </h4>
              </div>
            </div>
            <p className="font-[400] text-[#979797] font-inter text-[16px] lg:leading-[30px] leading-[35px] ">
              Consulting powered by state of the art technology.
            </p>


          </div>
          <img
            src="./envr/about.png"
            alt="Carbon Credit"
            className="rounded-lg  lg:w-[80%] h-full custom-range-mobile:w-[80%]"
          />
        </div>

        <div className="lg:ml-12 lg:w-1/2">
          <p className="text-[#000] font-inter text-[16px] font-normal leading-[35px]">
            Empowering businesses to reduce their carbon footprint through
            effective carbon credit trading. Join us in building a sustainable,
            low-carbon future.{" "}
            <span className="text-[#979797] font-inter">
              We provide the tools, resources, and expertise to help you succeed
              in the world of carbon trading.......
            </span>
          </p>
          <div className="flex items-center space-x-3 mt-[120px] mb-[48px]">
            <div className="w-4 h-4 bg-brand1-500 rounded-full"></div>
            <p className="font-[500] text-[20px] font-inter  text-black ">
              About Us
            </p>
          </div>

          <h2 className="text-[40px] lg:text-[65px]  font-[400] text-[#000]  lg:leading-[75px] leading-[50px]">
            Your <span className="text-[#57CC99] font-[500]">Net Zero</span>, <br />
            Co-pilot sharing  <br />
            the vision for, <span className="text-[#000] font-[500]">sustainable </span> future.
          </h2>
          {/* <p className="text-[#000] font-inter text-[16px] font-normal leading-[35px] mt-6">
            Empowering businesses to reduce their carbon footprint through
            effective carbon credit trading. Join us in building a sustainable,
            low-carbon future. We provide the tools, resources, and expertise to
            help you succeed in the world of carbon trading.
          </p> */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-[24px]">
              <img
                src="./envr/faciliate.svg"
                alt="Description of SVG"
                className="  w-[32px] "
              />
              <div className="ml-4">
                <h4 className="font-[500] text-[#000] font-inter text-[18px] lg:leading-[29px] leading-[29px]">
                  Online Carbon Credits Trading
                </h4>
                <p className="font-[400] text-[#979797] font-inter text-[13px] lg:leading-[29px] leading-[29px] mt-1">
                  Help Sellers to sell their Carbon Credits globally with feature rich pricing and negotiations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-[24px]">
              <img
                src="./envr/complience.svg"
                alt="Description of SVG"
                className=" w-[32px] "
              />
              <div className="ml-4">
                <h4 className="font-[500] text-[#000] font-inter text-[18px] lg:leading-[29px] leading-[29px]">
                  Carbon Footprint Management
                </h4>
                <p className="font-[400] text-[#979797] font-inter text-[13px] lg:leading-[29px] leading-[29px] mt-1">
                  Helping enterprises to manage their Carbon Foot print in automated mode along with trading.

                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
