import React from "react";

const Footer = () => {
  return (
    <footer className=" bg-[#f3f4f6] py- px-4 sm:px-8  lg:pt-[198px] pt-[100px]">
      <div className=" mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-[#C3C3C3]">
        <div className="space-y-4 mt-6">
          <div className="flex items-start text-lg font-bold flex-col ">
            <img
              src="./envr/logoenvr.svg"
              alt="ENVR Logo"
              className="w-[80px]  "
            />
            <div className="text-black text-xs pt-2">
              Sustained by Compliance Kart Pvt Ltd.
            </div>
          </div>
          <p className="text-[#979797] text-[15px] font-inter">
            Unlock the potential of carbon trading to drive environmental impact
            and compliance. Together, we can reduce emissions and create a
            cleaner world.
          </p>
          <div className="flex space-x-4">
            {/* <a href="#" className="text-gray-600 hover:text-black">
              <img
                src="./envr/social.svg"
                alt="ENVR Logo"
                className="w-[35px]  "
              />
            </a>
            <a href="#" className="text-gray-600 hover:text-black">
              <img
                src="./envr/social-1.svg"
                alt="ENVR Logo"
                className="w-[35px]  "
              />
            </a>
            <a href="#" className="text-gray-600 hover:text-black">
              <img
                src="./envr/social-2.svg"
                alt="ENVR Logo"
                className="w-[35px]  "
              />
            </a> */}
            <a href="#" className="text-gray-600 hover:text-black">
              <img
                src="./envr/social-3.svg"
                alt="ENVR Logo"
                className="w-[35px]  "
              />
            </a>
          </div>
        </div>

        <div className="space-y-4 mt-6  lg:ml-20 ">
          <h3 className="text-[16px] font-inter font-semibold text-[#57CC99] font-uppercase">
            COMPANY
          </h3>
          <ul className="space-y-2 text-[14px] font-inter font-[400] text-[#979797]">
            <li>
              <a href="#home" className="hover:text-black">
                Home
              </a>
            </li>
            <li>
              <a href="#about-us" className="hover:text-black">
                About
              </a>
            </li>
            <li>
              <a href="#marketplace" className="hover:text-black">
                Marketplace
              </a>
            </li>
            <li>
              <a href="#projects" className="hover:text-black">
                Projects
              </a>
            </li>
            <li>
              <a href="#registries" className="hover:text-black">
                Registries
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4 mt-6 lg:ml-10">
          <h3 className="text-[16px] font-inter font-semibold text-[#57CC99] font-uppercase">
            LEARN MORE
          </h3>
          <ul className="space-y-2 text-[14px] font-inter font-[400] text-[#979797]">
            <li>
              <a href="#" className="hover:text-black">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Terms of service
              </a>
            </li>

          </ul>
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="text-[16px] font-inter font-semibold text-[#57CC99] font-uppercase">
            CONTACT
          </h3>
          <div className="text-[14px] font-inter font-[400] text-[#979797]">
            B1002, 10th Floor, Advant Navis Business Park, Sector 142, <br />
            Noida, uttar Pradesh
            <br />
            Phone: +91 1234567890
            <br />
            Email:{" "}
            <a href="mailto:connect@compliancekart.io" className="text-[#979797]">
              connect@compliancekart.io
            </a>
          </div>
          {/* <h3 className="text-[16px] font-inter font-semibold text-[#57CC99]">
            CERTIFICATIONS
          </h3>
          <div className="flex space-x-4">
            <img
              src="./envr/Google.png"
              alt="Google Certified"
              className="w-[9rem] h-auto"
            />
            <img
              src="./envr/Google.png"
              alt="Google Certified"
              className="w-[9rem] h-auto"
            />
          </div> */}
        </div>
      </div>

      <div className="border-t border-[#C3C3C3] mt-8 py-3  text-center text-[16px] font-inter font-[400] text-[#979797]">
        © Copyright 2024, All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
