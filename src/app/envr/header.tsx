"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import NavbarItem from "./navbarItem";
import Link from "next/link";

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("");
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const closeSidebar = () => setIsSidebarOpen(false);

  const updateHash = useCallback(
      (() => {
        let timeout: NodeJS.Timeout | null = null;

        return (hash: string) => {
          if (timeout) clearTimeout(timeout);

          timeout = setTimeout(() => {
            setActiveHash(hash);
            window.history.replaceState(null, "", hash);
          }, 100);
        };
      })(),
      []
  );

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
          isSidebarOpen &&
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target as Node) &&
          hamburgerRef.current &&
          !hamburgerRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling when sidebar is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const sections = [
      "#home",
      "#registries",
      "#about-us",
      "#marketplace",
      "#projects",
      "#contact-us",
    ];
    const observer = new IntersectionObserver(
        (entries) => {
          let closestSection: string | null = null;
          let maxIntersectionRatio = 0;

          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > maxIntersectionRatio) {
              maxIntersectionRatio = entry.intersectionRatio;
              closestSection = `#${entry.target.id}`;
            }
          });

          if (closestSection && closestSection !== activeHash) {
            updateHash(closestSection);
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: Array.from({ length: 11 }, (_, i) => i / 10),
        }
    );

    const sectionElements = sections.map((id) => document.querySelector(id));

    sectionElements.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => {
      sectionElements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [activeHash, updateHash]);

  return (
      <>
        <header className="fixed top-0 left-0 bg-[#f3f4f6] z-50 w-full">
          <div className="md:container mx-auto flex justify-between items-center px-4 py-3 md:px-8">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <img src="/envr/logoenvr.svg" alt="ENVR Logo" className="w-[80px]" />
            </div>

            {/* Navigation Links for Desktop */}
            <nav className="hidden sm:hidden lg:flex space-x-8 lg:gap-[25px] lg:mt-[15px] capitalize">
              {["#home", "#registries", "#about-us", "#marketplace", "#projects", "#contact-us"].map((hash) => (
                  <NavbarItem
                      key={hash}
                      href={hash}
                      text={hash.replace("#", "").replace("-", " ")}
                      isActive={activeHash === hash}
                  />
              ))}
            </nav>

            {/* Login and Signup Buttons */}
            <div className="capitalize flex items-center justify-center sm:justify-center md:justify-end space-x-4 lg:gap-[25px] md:gap-[35px] lg:mt-[15px] lg:ml-[0] md:ml-[50%] custom-range-tab:ml-[27%] custom-range-tab:gap-[20px] custom-range-mobile:gap-[20px] custom-range-mobile:ml-[50%]">
              <Link
                  href="/signin"
                  className="text-black px-4 py-1 rounded-[42px] hover:bg-gray-100 text-[18px] font-inter"
              >
                Login
              </Link>
              <Link
                  href="/signup"
                  className="bg-black text-white px-4 py-1 rounded-[42px] hover:bg-gray-800 text-[18px] font-inter"
              >
                Signup
              </Link>
            </div>

            {/* Hamburger Button for Mobile */}
            <button
                ref={hamburgerRef}
                onClick={toggleSidebar}
                className="lg:hidden focus:outline-none z-50"
            >
              <img src="./envr/overflow-menu.svg" alt="Menu" className="w-[24px]" />
            </button>
          </div>

          {/* Backdrop */}
          {isSidebarOpen && (
              <div
                  className="fixed inset-0 bg-black bg-opacity-50 transition-opacity lg:hidden"
                  onClick={closeSidebar}
              />
          )}

          {/* Sidebar for Mobile */}
          <div
              ref={sidebarRef}
              className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform ${
                  isSidebarOpen ? "translate-x-0" : "translate-x-full"
              } transition-transform duration-300 lg:hidden z-50`}
          >
            <div className="flex flex-col space-y-10 p-6 font-inter capitalize">
              <button
                  onClick={closeSidebar}
                  className="self-end text-gray-500 focus:outline-none"
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {["#home", "#registries", "#about-us", "#marketplace", "#projects", "#contact-us"].map((hash) => (
                  <NavbarItem
                      key={hash}
                      href={hash}
                      text={hash.replace("#", "").replace("-", " ")}
                      closeSidebar={closeSidebar}
                      isActive={activeHash === hash}
                  />
              ))}
            </div>
          </div>
        </header>
      </>
  );
};

export default Header;