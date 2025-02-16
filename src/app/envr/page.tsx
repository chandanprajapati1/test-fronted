import React from "react";
import HeaderWithResponsiveMenu from "@/app/envr/header";
import Home from "./Sections/home";
import Registries from "./Sections/registries";
import About from "./Sections/about";
import Advisory from "./Sections/advisory";
import Projects from "./Sections/projects";
import Contact from "./Sections/contact";
import Footer from "./footer";

const HomePage: React.FC = () => {
  return (
    <div className="w-full bg-[#F3F4F6]">
      <div className="md:container md:mx-auto">
        <HeaderWithResponsiveMenu />

        <main >

          <Home />
          <Registries />
          <About />
          <Advisory />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>


    </div>
  );
};

export default HomePage;
