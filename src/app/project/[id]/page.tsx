'use client';
import React, { useState, useEffect, useRef } from 'react';
import Overview from '../../../components/projectDetails/Overview';
import CarbonImpactndPerf from '../../../components/projectDetails/CarbonImpactndPerf';
import DocumentNdReports from '../../../components/projectDetails/DocumentNdReports';
import SatelliteLocation from '../../../components/projectDetails/SatelliteLocation';
import Gallery from '../../../components/projectDetails/Gallery';
import GalleryView from '../../../components/projectDetails/Popups/GalleryView';
import Location from '../../../components/projectDetails/Location';
import ProjectDetails from '../../../components/projectDetails/ProjectDetails';
import ProjectCredits from '../../../components/projectDetails/ProjectCredits';
import RegistryDetails from '../../../components/projectDetails/RegistryDetails';
import GoalsMet from '../../../components/projectDetails/GoalsMet';
import CoBenefit from '../../../components/projectDetails/CoBenefit';
import Impact from '../../../components/projectDetails/Impact';
import ProjectDetailsPopup from '../../../components/projectDetails/Popups/ProjectDetailsPopup';
import { useDispatch } from 'react-redux';
import { appendData } from '@/app/store/slices/projectDetailsSlice';
import FloatingBar from '../../../components/projectDetails/FloatingBar';
import {useParams, useRouter} from 'next/navigation';
import SimilarProject from '@/components/projectDetails/SimilarProject';
import BuyCreditPopup from "@/components/projectDetails/BuyCreditPopup";
import { hideManagementStatuses } from "@/utils/constants";
import { getAuthCredentials } from '@/utils/auth-utils';
import { getBaseUrl } from "@/utils/axios-api";
import AdminLayout from "@/components/layouts/adminWithoutAuth";
import {Routes} from "@/config/routes";

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
    const endPointURL = token.token ? `${getBaseUrl('project')}/beta/${id}` : `${getBaseUrl('project')}/public-details?id=${id}`

    const response = await fetch(endPointURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.token}`
        }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();
    console.log(result.data.project_details)
    return result.data;
};

const Page: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [activePop, setActivePop] = useState(false);
    const [showProjectDetails, setShowProjectDetails] = useState(false);
    const [showBuyCreditPopup, setshowBuyCreditPopup] = useState(false);
    const [data, setData] = useState<ProjectDetails | null>(null);
    const [taxDetail, setTaxDetail] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [activeSection, setActiveSection] = useState<string>('overview');
    const [activeToken, setActiveToken] = useState(true);
    const dispatch = useDispatch();
    const router = useRouter();

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
                setData(projectData.project_details);
                dispatch(appendData(projectData.project_details))
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
        router.replace(Routes.NOT_FOUND_ERROR);
    }

    return (
        <AdminLayout>
            {data && (
                <div id="project-detail" className=" bg-neutral-100">
                    {!showBuyCreditPopup && <FloatingBar scrollToSection={scrollToSection} activeSection={activeSection} openModal={openModal} activeToken={activeToken} />}
                    {activePop && <GalleryView setActivePop={setActivePop} data={data} />}
                    {showProjectDetails && <ProjectDetailsPopup details={data.details} setShowProjectDetails={setShowProjectDetails} />}
                    {/*{showBuyCreditPopup && <BuyCreditsPopup isOpen={showBuyCreditPopup} onClose={closeModal} data={data} />}*/}
                    {showBuyCreditPopup && <BuyCreditPopup isOpen={showBuyCreditPopup} onClose={closeModal} data={data} tax={taxDetail} />}
                    <div className="py-xl px-l w-full flex flex-col  max-w-screen-sc-2xl overflow-x-hidden mx-auto">
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
                                    <ProjectCredits data={data} openModal={openModal} activeToken={activeToken} />
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
                                <RegistryDetails data={data} />
                            </section>
                            <section
                                id="address"
                                ref={(el) => { if (el) sectionRefs.current['address'] = el; }}
                            >
                                <Location data={data} />
                            </section>

                            <section
                                id="goals-met"
                                ref={(el) => { if (el) sectionRefs.current['goals-met'] = el; }}
                            >
                                <GoalsMet data={data} />
                            </section>
                            <section
                                id="co-benefits"
                                ref={(el) => { if (el) sectionRefs.current['co-benefits'] = el; }}
                            >
                                <CoBenefit data={data} />
                            </section>
                            <section
                                id="impacts"
                                ref={(el) => { if (el) sectionRefs.current['impacts'] = el; }}
                            >
                                <Impact data={data} />
                            </section>
                            <section
                                id="location-gallery"
                                ref={(el) => { if (el) sectionRefs.current['location-gallery'] = el; }}
                            >
                                <div className="w-full flex-col md:flex-row flex gap-xl">
                                    <SatelliteLocation data={data} />
                                    <Gallery setActivePop={setActivePop} data={data} />
                                </div>
                            </section>
                            <section
                                id="carbon-impact"
                                ref={(el) => { if (el) sectionRefs.current['carbon-impact'] = el; }}
                            >
                                <CarbonImpactndPerf
                                    data={data}
                                />
                            </section>
                            <section
                                id="documents"
                                ref={(el) => { if (el) sectionRefs.current['documents'] = el; }}
                            >
                                <DocumentNdReports data={data} />
                            </section>
                            {/* <SimilarProject /> */}
                        </div>
                    </div>
                    <section id="footer"
                        ref={(el) => { if (el) sectionRefs.current['footer'] = el; }}>
                    </section>
                </div>
            )}
        </AdminLayout>
    );
};

export default Page;
