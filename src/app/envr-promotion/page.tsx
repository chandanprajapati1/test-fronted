'use client'
import Consulting from '@/components/envr-promotion/Consulting'
import Hero from '@/components/envr-promotion/Hero'
import ShowcaseCard from '@/components/envr-promotion/ShowcaseCard'
import Sidebar from '@/components/envr-promotion/Sidebar'
import WhyUs from '@/components/envr-promotion/WhyUs'
import React, { useRef, useEffect, useState } from 'react';
import Contact from '@/components/envr-promotion/Contact'
import Registries from '@/components/envr-promotion/Registries'
import Footer from '@/components/envr-promotion/Footer'
import FloationButton from '@/components/envr-promotion/FloationButton'
import { API_ENDPOINTS } from '@/config/api-endpoint'
import axiosApi from '@/utils/axios-api'
import { getAuthCredentials } from '@/utils/auth-utils'
import { customToast } from '@/components/ui/customToast'
import RightSidebar from '@/components/envr-promotion/RightSidebar'

const page = () => {
    const hasFetchedData = useRef(false);
    const [token, setToken] = useState('');
    const [projectDetails, setProjectDetails] = useState<any>();
    const [showSideBar, SetShowSideBar] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");
    useEffect(() => {

        const fetchProject = async (tokenFromURL: string) => {
            try {
                const response = await axiosApi.project.get(API_ENDPOINTS.Promotion(tokenFromURL));

                if (response.status === 200) {

                    if (response.data.error) {
                        customToast.error(`${response.data.error}`)
                    }
                    else {
                        console.log("bingo data found ", response)
                        setProjectDetails(response.data.project)
                    }
                }

            } catch (error) {
                customToast.error(`Promotional Data Error : ${error}`)
            }
        }
        if (typeof window !== 'undefined' && !hasFetchedData.current) {
            hasFetchedData.current = true;
            const params = new URLSearchParams(window.location.search);
            const tokenFromURL = params.get('token');
            if (tokenFromURL) {
                fetchProject(tokenFromURL)
                setToken(tokenFromURL)
            } else {
                customToast.error("Token not found.")
            }
        }

        const handleScroll = () => {
            const sections = ["hero", "whyUs", "consulting", "registries", "contact"];
            let currentSection = "hero";

            for (let section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
                        currentSection = section;
                        break;
                    }
                }
            }
            setActiveSection(currentSection);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);

    }, [])

    return (
        <div className="flex flex-col">
            {projectDetails && <FloationButton token={token} status={projectDetails.status || 1} />}
            <Sidebar SetShowSideBar={SetShowSideBar} activeSection={activeSection} />
            {showSideBar && <RightSidebar SetShowSideBar={SetShowSideBar} />}
            <div id="hero" className="flex-1 relative flex flex-col 2xl:pl-[340px] xl:pl-0 ">
                <Hero projectDetails={projectDetails} />
                {projectDetails && <div className="hidden absolute lg:block mx-s  bottom-5 md:bottom-10 sm:mx-xl lg:bottom-0 md:right-10 lg:top-36 xl:top-10">
                    <ShowcaseCard details={projectDetails} />
                </div>}
            </div>
            <div id="whyUs" className="flex-1 flex flex-col 2xl:pl-[340px] xl:pl-0">
                <WhyUs />
            </div>
            <div id="consulting" className="flex-1 flex flex-col 2xl:pl-[340px] xl:pl-0">
                <Consulting />
            </div>
            <div id="registries" className="flex-1 flex flex-col 2xl:pl-[340px] xl:pl-0">
                <Registries />
            </div>
            <div id="contact" className="flex-1 flex flex-col 2xl:pl-[340px] xl:pl-0">
                <Contact />
            </div>
            <div className="flex-1 flex flex-col 2xl:pl-[340px] xl:pl-0">
                <Footer />
            </div>
        </div>
    )
}

export default page