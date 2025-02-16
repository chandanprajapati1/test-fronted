"use client";
import Enrichment from '@/components/projectOnboarding/Enrichment';
import Specifications from '@/components/projectOnboarding/Specifications';
import Tabs from '@/components/projectOnboarding/Tabs';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    currentProjectDetail,
    currentStatusHandler,
    currentTabHandler,
    currentTypeHandler, initialEnrichmentStepper, updateAllowedTabs,
} from '../store/slices/projectOnboardingSlice';
import Details from "@/components/projectOnboarding/Details";
import InitialStep from "@/components/projectOnboarding/Initial";
import ThankYou from "@/components/projectOnboarding/Thankyou";
import Verified from "@/components/projectOnboarding/Verified";
import axiosApi from "@/utils/axios-api";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import { PageProps } from "@/types";
import AdminLayout from "@/components/layouts/admin";
import ProjectStatus from "@/components/projectOnboarding/Status";
import {WITHOUT_CREDITS_PROJECT_STATUS_IDS} from "@/utils/constants";
import {Routes} from "@/config/routes";
import {useRouter} from "next/navigation";

const Page = ({ searchParams }: PageProps) => {
    const projectId = searchParams.id;
    const [isLoading, setIsLoading] = useState(true);
    const currentTab = useSelector((state: any) => state.projectOnboarding.currentTab);
    const currentStatus = useSelector((state: any) => state.projectOnboarding.currentStatus);
    const projectDetail = useSelector((state: any) => state.projectOnboarding?.projectDetail);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const fetchProjectDetail = async () => {
            const projectId = searchParams.id as string | null;
            if (!projectId) {
                console.log("No project ID found in URL. Skipping project details fetch.");
                return;
            }

            const projectResponse = await axiosApi.project.get(API_ENDPOINTS.ProjectCurrentStatus(projectId));
            // console.log("fetchStatusOptions fetchStatusOptions", projectResponse)
            return projectResponse.data.data.project_details;

        };
        const fetchData = async () => {
            try {
                const projectData = await fetchProjectDetail();
                dispatch(currentProjectDetail(projectData));
                dispatch(currentStatusHandler(projectData.project_completion_status));
                dispatch(currentTypeHandler(projectData.project_status.project_status_name));
                switch (projectData.project_completion_status) {
                    case 2:
                        dispatch(updateAllowedTabs({ isDetailsComplete: true }));
                        dispatch(currentTabHandler("specifications"));
                        break;
                    case 3:
                        dispatch(updateAllowedTabs({ isDetailsComplete: true }));
                        dispatch(currentTabHandler("specifications"));
                        break;
                    case 11:
                    case 12:
                        dispatch(updateAllowedTabs({ isDetailsComplete: true, isSpecificationsComplete: true }));
                        dispatch(initialEnrichmentStepper(projectData.onboarding_status.step_number));
                        dispatch(currentTabHandler(projectData.onboarding_status.step_name));
                        console.log(projectData);
                        break;
                    case 4:
                        if(WITHOUT_CREDITS_PROJECT_STATUS_IDS.includes(projectData?.project_status?._id)){
                            dispatch(updateAllowedTabs({ isDetailsComplete: true, isSpecificationsComplete: true }));
                            dispatch(currentTabHandler("enrichment"));
                        }else{
                            dispatch(updateAllowedTabs({ isDetailsComplete: true, isSpecificationsComplete: true, isEnrichmentComplete: true }));
                            dispatch(currentTabHandler("management"));
                        }
                        break;
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                        dispatch(updateAllowedTabs({ isDetailsComplete: true, isSpecificationsComplete: true, isEnrichmentComplete: true }));
                        dispatch(currentTabHandler("management"));
                        break;
                    default:
                        dispatch(currentTabHandler(projectData.onboarding_status.step_name));
                }
            } catch (error) {
                console.error('Error fetching project details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [dispatch, projectId, searchParams]);

    // Show initial step if no ID or option in params
    if (!searchParams.id && !searchParams.option) {
        return <AdminLayout><InitialStep /></AdminLayout>;
    }

    // Show loading state while fetching data
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const getContent = () => {
        if (currentTab === 'specifications' && currentStatus === 2) {
            return <ThankYou projectDetails={projectDetail} />;
        }

        if (currentTab === 'specifications' && currentStatus === 3) {
            return <Verified />;
        }

        if (((currentStatus == 4) && (projectDetail?.ck_assisted === true)) || ((currentStatus == 11) && (projectDetail?.ck_assisted === true))) {
            return <>
                <div className="text-neutral-1400 h-screen py-6xl items-center flex flex-col bg-white px-6 gap-6 text-center">
                    <div className='text-f-5xl font-normal text-brand1-500'>You’ve Chosen Envr Assistance!</div>
                    <div className='text-f-xl  mb-m font-normal text-neutral-1200'> Our specialists will take care of your project onboarding, ensuring everything is done smoothly and efficiently. </div>
                    <div className='text-f-xl font-normal text-neutral-1200'> We will keep you updated at every step of the way.</div>
                    <button className='py-l px-10xl bg-brand1-500 text-f-m rounded-xl text-white hover:bg-brand1-300' onClick={() =>  router.push(Routes.Dashboard) }>
                        Home
                    </button>
                </div>
            </>
        }

        const components = {
            details: <Details />,
            specifications: <Specifications />,
            enrichment: <Enrichment />,
            management: <ProjectStatus projectData={projectDetail} />,
        };

        return components[currentTab as keyof typeof components] || <Details />;
    };

    return (
        <AdminLayout>
            <div className="bg-white">
                <div className='text-neutral-1400 pt-xl pb-xl  max-w-screen-sc-lg  mx-auto px-6'>
                    <Tabs currentTab={currentTab}/> {getContent()}
                </div>
            </div>

        </AdminLayout>);
};

export default Page;
