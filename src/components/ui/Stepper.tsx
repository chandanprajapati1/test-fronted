import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import axiosApi from "@/utils/axios-api";
import {
    currentProjectDetail,
    currentStatusHandler,
    currentTabHandler,
    updateAllowedTabs
} from "@/app/store/slices/projectOnboardingSlice";
import { customToast } from "@/components/ui/customToast";

interface Step {
    title: string;
    description: string;
}

interface StepperProps {
    steps: Step[];
    currentStep: number;
}


const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
    const projectDetail = useSelector((state: any) => state.projectOnboarding?.projectDetail);
    const dispatch = useDispatch();

    // const updateStatus = async () => {

    //     try {
    //         const response = await axiosApi.project.post(`/project-status/${projectDetail._id}`, {
    //             project_completion_status: 4,
    //         });
    //         if (response.status === 200) {
    //             dispatch(currentProjectDetail(response.data.project));
    //             dispatch(currentStatusHandler(response.data.project.project_completion_status));
    //             dispatch(updateAllowedTabs({ isDetailsComplete: true, isSpecificationsComplete: true, isEnrichmentComplete: true }));
    //             dispatch(currentTabHandler("management"));
    //             customToast.success(`Onboarding completed successfully.`);
    //         }
    //     } catch (err) {
    //         customToast.error('Failed to update status');
    //     } finally {
    //     }
    // }
    return (
        <div className="flex flex-col items-start w-full max-w-md mx-auto">
            {steps.map((step, index) => (
                <div key={index} className="flex">
                    <div className="flex flex-col items-center ">
                        <div
                            className={`p-[5px] flex items-center justify-center border border-brand1-500 rounded-full  ${index != currentStep ? 'bg-gray-200 ' : 'bg-green-500'
                                }`}
                        >
                            {(index) < currentStep ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6.5 12.0006L2 7.50058L2.707 6.79358L6.5 10.5861L13.293 3.79358L14 4.50058L6.5 12.0006Z" fill="#0D9438" />
                            </svg>
                                : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M14 1.00061H2C1.73488 1.00091 1.4807 1.10637 1.29323 1.29384C1.10576 1.48131 1.0003 1.73549 1 2.00061V14.0006C1.0003 14.2657 1.10576 14.5199 1.29323 14.7074C1.4807 14.8949 1.73488 15.0003 2 15.0006H14C14.2651 15.0003 14.5193 14.8949 14.7068 14.7074C14.8942 14.5199 14.9997 14.2657 15 14.0006V2.00061C14.9997 1.73549 14.8942 1.48131 14.7068 1.29384C14.5193 1.10637 14.2651 1.00091 14 1.00061ZM14 7.00061H11.5V2.00061H14V7.00061ZM8 2.00061H10.5V7.00061H8V2.00061ZM7 2.00061V10.0006H2V2.00061H7ZM2 11.0006H7V14.0006H2V11.0006ZM8 14.0006V8.00061H14V14.0006H8Z" fill="#1A1A1A" />
                                </svg>}
                        </div>
                        {index < steps.length - 1 && (
                            <div className="h-full flex flex-col w-full  items-center">
                                <div className={`flex-1 w-px ${index < currentStep ? 'bg-brand1-500' : 'bg-gray-200'}`} />
                                <div className={` h-s w-s border border-gray-300 rounded-full ${index < currentStep ? 'bg-brand1-500 border-brand1-500 ' : 'bg-gray-200 border-gray-300 '}`} />
                                <div className={`flex-1 w-px ${index < currentStep ? 'bg-brand1-500' : 'bg-gray-200'}`} />
                            </div>

                        )}
                    </div>
                    <div className="ml-2xl pb-4xl">
                        <h3 className="text-f-l font-semibold text-gray-900">{step.title}</h3>
                        <p className="text-f-m font-normal  text-neutral-1200">{step.description}</p>
                    </div>
                </div>
            ))}

            {/* {[12].includes(projectDetail?.project_completion_status) && (
                <button
                    type="button"
                    className="w-full flex items-center justify-center h-14 px-6 rounded-lg bg-gray-300 hover:bg-gray-400 transition-colors"
                    onClick={updateStatus}
                >
                    Complete Onboarding
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10.9998 8L5.9998 13L5.2998 12.3L9.5998 8L5.2998 3.7L5.9998 3L10.9998 8Z"
                            fill="currentColor"
                        />
                    </svg>
                </button>
            )} */}
        </div>
    );
};

export default Stepper;
