import React from 'react';
import { useDispatch } from "react-redux";
import { currentProjectDetail, currentStatusHandler } from "@/app/store/slices/projectOnboardingSlice";
import axiosApi from '@/utils/axios-api';
import { API_ENDPOINTS } from "@/config/api-endpoint";
import { useSearchParams } from "next/navigation";
import { encryptString } from '@/utils/enc-utils';
import {customToast} from "@/components/ui/customToast";
import {ChevronRight} from "@carbon/icons-react";

const Verified = () => {
    const dispatch = useDispatch();
    const [isEnvrSubmitting, setEnvrSubmitting] = React.useState(false);
    const [isSelfSubmitting, setSelfSubmitting] = React.useState(false);
    const searchParams = useSearchParams();

    const handleSubmit = async (ckAssisted: boolean, buttonType:string) => {

        try {
            if(isEnvrSubmitting || isSelfSubmitting){
                return;
            }
            if(buttonType == "envr" ){
                setEnvrSubmitting(true);
            }else{
                setSelfSubmitting(true);
            }

            const projectId = searchParams.get('id');
            if (!projectId) {
                console.log("No project ID found in URL. Skipping project details fetch.");
                return;
            }
            const requestBody = { ck_assisted: ckAssisted }
            let encryptedPayload = {};
            if(Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0){
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            const response = await axiosApi.project.put(
                API_ENDPOINTS.ProjectUpdate(projectId),{ data: encryptedPayload }
            );
            dispatch(currentStatusHandler(response.data.data.project.project_completion_status));
            dispatch(currentProjectDetail(response.data.data.project));
        } catch (err) {
            customToast.error('Failed to update preferences. Please try again.');
            console.error('Error updating preferences:', err);
        } finally {
            setEnvrSubmitting(false);
            setSelfSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-6xl flex flex-col items-center bg-white text-neutral-1400 px-6 gap-6">
            <h1 className="text-f-5xl font-normal  text-brand1-500">Congratulations! </h1>
            <h2 className="text-xl font-light text-center ">Your Project Has Been Successfully Verified!</h2>
            <h2 className="text-xl text-neutral-800 font-light text-center"> You can now proceed with your project setup. Let us know how you’d like to continue.</h2>

            <p className="text-f-3xl font-normal text-neutral-1200 text-center">
                Would you prefer to complete the onboarding process yourself or with Envr assistance?"
            </p>

            <div className="flex flex-col sc-sm:flex-row justify-center items-center gap-4 pt-8">
                <button
                    onClick={() => handleSubmit(false, "self")}
                    disabled={isSelfSubmitting}
                    className="flex items-center justify-center h-12 gap-4 px-6 py-4 rounded-lg bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-72"
                >
                    <span className="text-sm text-white">
                        {isSelfSubmitting ? 'Processing...' : 'Continue with Self-Onboarding'}
                    </span>
                   <ChevronRight className="w-4 h-4 text-white" />
                </button>

                <button
                    onClick={() => handleSubmit(true, "envr")}
                    disabled={isEnvrSubmitting}
                    className="flex items-center justify-center h-12 gap-4 px-6 py-4 rounded-lg bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-72"
                >
                    <span className="text-sm text-white">
                        {isEnvrSubmitting ? 'Processing...' : 'Continue with Envr Assistance'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-white" />
                </button>
            </div>
        </div>
    );
};

export default Verified;