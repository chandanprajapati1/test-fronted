'use client';
import React, { useState, useEffect, useRef } from 'react';
import Overview from '../../../components/projectDetailsICR/Overview';
import CarbonImpactndPerf from '../../../components/projectDetailsICR/CarbonImpactndPerf';
import DocumentNdReports from '../../../components/projectDetailsICR/DocumentNdReports';
import SatelliteLocation from '../../../components/projectDetailsICR/SatelliteLocation';
import Gallery from '../../../components/projectDetailsICR/Gallery';
import GalleryView from '../../../components/projectDetailsICR/Popups/GalleryView';
import Location from '../../../components/projectDetailsICR/Location';
import ProjectDetails from '../../../components/projectDetailsICR/ProjectDetails';
import ProjectCredits from '../../../components/projectDetailsICR/ProjectCredits';
import RegistryDetails from '../../../components/projectDetailsICR/RegistryDetails';
import GoalsMet from '../../../components/projectDetailsICR/GoalsMet';
import CoBenefit from '../../../components/projectDetailsICR/CoBenefit';
import Impact from '../../../components/projectDetailsICR/Impact';
import ProjectDetailsPopup from '../../../components/projectDetailsICR/Popups/ProjectDetailsPopup';
import { useDispatch } from 'react-redux';
import { appendData } from '@/app/store/slices/projectDetailsSlice';
import FloatingBar from '../../../components/projectDetailsICR/FloatingBar';
import { useParams } from 'next/navigation';
import Footer from '@/components/common/Footer';
import BuyCreditPopup from "@/components/projectDetailsICR/BuyCreditPopup";
import { hideManagementStatuses } from "@/utils/constants";
import { getAuthCredentials } from '@/utils/auth-utils';
import { getBaseUrl } from "@/utils/axios-api";

interface ProjectDetails {
    name: string;
    details: string;
    background_image: string;
    status: string;
    estimation_annual_estimated_reductions: number;
    actual_annual_estimated_reductions: number;
    documents: string[];
    address: string[];
    satellite_location?: string;
    gallery?: string[];
    similar_projects?: string[];
    country_name: string;
    carbon_performance_description: string;
    project_status: ProjectStatus
}

interface ProjectStatus {
    _id: string;
    created_at: string;
    document_ids: string[];
    project_status_name: string;
    updated_at: string;
}

interface Error {
    message: string;
}

const fetchProjectDetails = async (id: string): Promise<any> => {
    const token = getAuthCredentials();
    // public-details?id=675318fbf59cabf5311fc932
    const endPointURL = `${getBaseUrl('auth')}/icr-user-projects`;

    const response = await fetch(endPointURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.token}`
        }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();
    console.log(result.data.projects)
    return result.data;
};

const Page: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [activePop, setActivePop] = useState(false);
    const [showProjectDetails, setShowProjectDetails] = useState(false);
    const [showBuyCreditPopup, setshowBuyCreditPopup] = useState(false);
    const [data, setData] = useState<any>(null);
    const [taxDetail, setTaxDetail] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [activeSection, setActiveSection] = useState<string>('overview');
    const [activeToken, setActiveToken] = useState(true);
    const dispatch = useDispatch();

    const openModal = (data: any = null) => {
        // if (me?.data?.data?.organization?.status !== 2) {
        //     return;
        // }
        setshowBuyCreditPopup(true);
        localStorage.setItem("buyCredit", "true")
    };

    const closeModal = () => {
        setshowBuyCreditPopup(false);
        localStorage.setItem("buyCredit", "false")
    };
    // Create a map of refs for each section
    const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

    const scrollToSection = (id: string) => {
        const section = sectionRefs.current[id];
        if (section) {
            setActiveSection(id);

            // Get the section's position and adjust the offset
            const topOffset = section.getBoundingClientRect().top + window.scrollY - 300; // Adjust 100 to whatever offset you need

            window.scrollTo({
                top: topOffset,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectData = await fetchProjectDetails(id);
                setData(projectData);
                dispatch(appendData(projectData))
                setTaxDetail(projectData.tax)
            } catch (e: any) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };
        const buyCredit = localStorage.getItem("buyCredit");
        (buyCredit && buyCredit === "true") ? setshowBuyCreditPopup(true) : setshowBuyCreditPopup(false);
        const token = getAuthCredentials();
        setActiveToken(token.token ? true : false);
        fetchData();
    }, []);

    if (loading) {
        return <div className="spinner">Loading...</div>;
    }

    console.log("data");
    console.log(data);
    console.log("data end");

    if (error) {
        return <div className='mt-10xl w-full flex justify-center items-start'>
            <div className='text-neutral-700 mt-10xl font-extrabold text-3xl flex flex-col justify-center items-center'>
                <div className='text-10xl'>
                    🙏
                </div>
                <div className='w-[60vw] text-center'>
                    The requested project is currently unavailable on our website.
                </div>
            </div>
        </div>;
    }

    return (
        <>
            {data && (
                <div id="project-detail" className="w-full h-full  bg-neutral-100">
                    {!showBuyCreditPopup && <FloatingBar scrollToSection={scrollToSection} activeSection={activeSection} openModal={openModal} activeToken={activeToken} />}
                    {activePop && <GalleryView setActivePop={setActivePop} data={data} />}
                    {showProjectDetails && <ProjectDetailsPopup details={data.details} setShowProjectDetails={setShowProjectDetails} />}
                    {/*{showBuyCreditPopup && <BuyCreditsPopup isOpen={showBuyCreditPopup} onClose={closeModal} data={data} />}*/}
                    {showBuyCreditPopup && <BuyCreditPopup isOpen={showBuyCreditPopup} onClose={closeModal} data={data} tax={taxDetail} />}
                    <div className="pt-xl pb-xl px-l w-full flex flex-col  max-w-screen-sc-2xl overflow-x-hidden mx-auto">
                        <div className="z flex flex-col">
                            <section
                                id="overview"
                                ref={(el) => { if (el) sectionRefs.current['overview'] = el; }}
                            >
                                <Overview
                                    data={data}
                                    setShowProjectDetails={setShowProjectDetails}
                                />
                            </section>
                            {!hideManagementStatuses.includes(data?.project_status?.project_status_name as string) && (
                                <section
                                    id="project-credits"
                                    ref={(el) => { if (el) sectionRefs.current['project-credits'] = el; }}
                                >
                                    <ProjectCredits data={data?.projects[0]} openModal={openModal} activeToken={activeToken} />
                                </section>
                            )}
                            <section
                                id="project-details"
                                ref={(el) => { if (el) sectionRefs.current['project-details'] = el; }}
                            >
                                <ProjectDetails data={data} />
                            </section>
                            <section
                                id="registry-details"
                                ref={(el) => { if (el) sectionRefs.current['registry-details'] = el; }}
                            >
                                <RegistryDetails data={data?.projects[0]} />
                            </section>
                            <section
                                id="address"
                                ref={(el) => { if (el) sectionRefs.current['address'] = el; }}
                            >
                                <Location data={data?.projects[0]} />
                            </section>

                            <section
                                id="goals-met"
                                ref={(el) => { if (el) sectionRefs.current['goals-met'] = el; }}
                            >
                                <GoalsMet data={data?.projects[0]} />
                            </section>
                            <section
                                id="co-benefits"
                                ref={(el) => { if (el) sectionRefs.current['co-benefits'] = el; }}
                            >
                                <CoBenefit data={null} />
                            </section>
                            {/*<section
                                id="impacts"
                                ref={(el) => { if (el) sectionRefs.current['impacts'] = el; }}
                            >
                                <Impact data={data} />
                            </section>*/}
                            <section
                                id="location-gallery"
                                ref={(el) => { if (el) sectionRefs.current['location-gallery'] = el; }}
                            >
                                <div className="w-full flex gap-xl">
                                    <SatelliteLocation data={data?.projects[0]} />
                                    <Gallery setActivePop={setActivePop} data={null} />
                                </div>
                            </section>
                            {/*<section
                                id="carbon-impact"
                                ref={(el) => { if (el) sectionRefs.current['carbon-impact'] = el; }}
                            >
                                <CarbonImpactndPerf
                                    data={data}
                                />
                            </section>*/}
                            <section
                                id="documents"
                                ref={(el) => { if (el) sectionRefs.current['documents'] = el; }}
                            >
                                <DocumentNdReports data={data?.projects[0]} />
                            </section>
                            {/* <SimilarProject /> */}
                        </div>
                    </div>
                    <section id="footer"
                        ref={(el) => { if (el) sectionRefs.current['footer'] = el; }}>
                        <Footer />
                    </section>
                </div>
            )}
        </>
    );
};

export default Page;
