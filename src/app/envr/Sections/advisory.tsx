"use client";
import React from "react";

const Advisory = () => {
  return (
    <div id="marketplace" className="h-auto bg-[#f3f4f6] px-4 sm:px-8 scroll-mt-[87px]  py-[50px]">
      <div className="flex flex-col lg:flex-row lg:items-stretch w-full lg:space-x-12 h-full">
        <div className="lg:w-1/2 h-full">
          <div className="flex items-center space-x-3 mb-[36px]">
            <div className="w-4 h-4 bg-brand1-500 rounded-full"></div>
            <p className="font-[500] text-[18px] font-inter text-black">
              Marketplace
            </p>
          </div>
          <span className=" font-inter bg-brand1-500 text-white text-[15px] pt-[7px] pb-[7px] pl-[17px] pr-[17px] font-normal gap-[10px] leading-[23px] tracking-[-0.78px] uppercase sm:w-1/4 w-1/2 p-1.5 text-center rounded-[40px]">
            Connect with{" "}
          </span>

          <h2 className="text-[40px] lg:text-[65px] font-[300] text-[#000] lg:leading-[75px] leading-[50px] mt-[12px] ">
            <span className="text-[#000] font-[600]">One stop shop</span> <br />
            <span className="font-[300]">for </span> <span className="text-[#57CC99] font-[600]">effortless </span> <span className="font-[300]">Carbon</span> <br />
            Credits
            <span className="text-[#57CC99] font-[600]"> trading </span>
          </h2>

          <div className="lg:w-[90%] text-justify">
            <p className="text-[#979797] font-inter text-[16px] font-normal leading-[35px] mt-6 ">
              Magnified market visibility leveraging the unrestricted trading through Smart decisions.
            </p>

            <div className="mt-2 grid md:grid-cols-1  sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-[50px] lg:text-[50px] font-inter font-[400] text-[#57CC99] lg:leading-[88px] leading-[70px]">
                  100+
                </h3>
                <p className="text-[#000] font-inter text-[18px] lg:text-base">
                  Projects across prominent sectors, registries and zones

                </p>
                <p className="text-[#979797] font-inter text-[16px] font-normal leading-[35px] mt-6">
                  Our advisory services support businesses in understanding carbon markets, maximizing their environmental impact, and aligning with global sustainability standards.
                </p>
              </div>
              <div>
                <h3 className="text-[50px] lg:text-[50px] font-inter font-[400] text-[#57CC99] lg:leading-[88px] leading-[70px]">
                  1200+
                </h3>
                <p className="text-[#000] font-inter text-[18px] lg:text-base">
                  Tonns traded
                </p>
                <p className="text-[#979797] font-inter text-[16px] font-normal leading-[35px] mt-6">
                  We offer comprehensive consultancy to help your business reduce its carbon footprint, navigate regulations, and make the most of carbon credit opportunities.
                </p>
              </div>
            </div>
          </div>

          <button className=" font-inter mt-8 bg-black text-white  pt-[16px] pb-[16px] pl-[40px] pr-[40px] rounded-[42px] text-sm lg:text-base shadow-md hover:opacity-90">

            <span className="pl-[10px] flex items-center gap-[20px]">
              <span> Need Assistance</span>
              <img
                src="./envr/arrow.svg"
                alt="Arrow Icon"
                className="w-4"
              />
            </span>
          </button>
        </div>

        <div className="lg:w-1/2 mt-12 lg:mt-0 relative h-full">
          <div className="relative w-full h-full custom-range-web:h-[1220px]">
            <img
              src="./envr/image.png"
              alt="Wind Turbines"
              className="rounded-lg w-full h-full  sm:max-h-[400px] md:max-h-[750px] lg:max-h-[1276px] xl:max-h-[1276px] "
            />
          </div>

          <div className="mt-2 xl:mt-[5rem] xl:mt-13 2xl:mt-15 2xl:space-y-[68px] custom-range-web:w-[80%] custom-range-web:right-[25%] custom-range-web:mt-[10%] space-y-[34px] lg:absolute lg:top-0 lg:bottom-3 lg:w-[70%] lg:right-[35%]">
            <div className="bg-white p-6 shadow-md rounded-[35px]">
              <div className="flex flex-col items-start">
                <div className="gap-xl flex items-center">
                  <img
                    src="./envr/analytics1.svg"
                    alt="Description of SVG"
                    className=" w-[32px]"
                  />
                  <h4 className="font-semibold text-gray-800">Exhaustive projects repository </h4>
                </div>
                <p className="text-[#979797] font-inter text-[16px] font-normal leading-[30px] mt-1">
                  Encyclopedic collection of projects from varied sectors  . Renders what is the best for your requirements.

                </p>
              </div>
            </div>

            <div className="bg-white p-6 shadow-md rounded-[35px]">
              <div className="flex flex-col items-start">

                <div className="gap-xl flex items-center">
                  <img
                    src="./envr/textlinkanalysis.svg"
                    alt="Description of SVG"
                    className=" w-[32px]"
                  />
                  <h4 className="font-semibold text-gray-800">Intuitive AI driven journey </h4>
                </div>
                <p className="text-[#979797] font-inter text-[16px] font-normal leading-[30px] mt-1">
                  Impeccable User Experience through AI backed intuitive business journey.
                  Carbon Credits trading had never been so easy.
                </p>

              </div>
            </div>

            <div className="bg-white p-6 shadow-md rounded-[35px]">
              <div className="flex flex-col items-start">

                <div className="gap-xl flex items-center">
                  <img
                    src="./envr/charthistogram.svg"
                    alt="Description of SVG"
                    className=" w-[32px]"
                  />
                  <h4 className="font-semibold text-gray-800">Blockchain Powered</h4>
                </div>
                <p className="text-[#979797] font-inter text-[16px] font-normal leading-[30px] mt-1">
                  Ensuring the global reliability of transactions through Secure, transparent and robust Blockchain powered Smart Contracts.

                </p>
              </div>
            </div>

            <div className="bg-white p-6 shadow-md rounded-[35px]">
              <div className="flex flex-col items-start">

                <div className="gap-xl flex items-center">
                  <img
                    src="./envr/charthistogram.svg"
                    alt="Description of SVG"
                    className=" w-[32px]"
                  />
                  <h4 className="font-semibold text-gray-800">Smart Negotiations and customized pricing</h4>

                </div>
                <p className="text-[#979797] font-inter text-[16px] font-normal leading-[30px] mt-1">
                  Parties can negotiate for extracting the best trade in a Jiffy.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 shadow-md rounded-[35px]">
              <div className="flex flex-col items-start">

                <div className="gap-xl flex items-center">
                  <img
                    src="./envr/charthistogram.svg"
                    alt="Description of SVG"
                    className="h-[32px] w-[32px]"
                  />
                  <h4 className="font-semibold text-gray-800">Trouble free trading</h4>

                </div>
                <p className="text-[#979797] font-inter text-[16px] font-normal leading-[30px] mt-1">
                  Envr owns the responsibility to trade efficiently through transparency and in depth expertise.
                </p>
              </div>
            </div>

            {/* <div className="bg-white p-4 shadow-md rounded-[35px] justify-between">
        <p className="text-[#979797] font-inter text-center text-[11px] font-[500] leading-[35px]">
          Advisory & Consulting Powered By
        </p>
        <img
          src="./envr/Carbon Logo.png"
          alt="ComplianceKart Logo"
          className="h-6 mx-auto"
        />
      </div> */}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Advisory;
