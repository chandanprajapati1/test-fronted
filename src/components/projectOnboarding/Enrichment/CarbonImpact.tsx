// components/SDGGoalsForm.tsx
import {
    currentProjectDetail,
    decrementEnrichmentStepper,
    incrementEnrichmentStepper,
    initialEnrichmentStepper
} from '@/app/store/slices/projectOnboardingSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosApi from '@/utils/axios-api';
import { API_ENDPOINTS } from '@/config/api-endpoint';
import { Routes } from '@/config/routes';
import { encryptString } from '@/utils/enc-utils';
import { isHtmlTagPresent } from '@/utils/input-utils';
import { customToast } from '@/components/ui/customToast';
import {ErrorMessage} from "@/components/ui/validationMsg";

export default function CarbonImpact() {
    const [body, setBody] = useState<string>('');
    const [error, setError] = useState<string>('');
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const router = useRouter();
    const projectDetail = useSelector((state: any) => state.projectOnboarding?.projectDetail);

    useEffect(() => {
        window.scrollTo(0, 0);
        const projectId = searchParams.get('id');
        if (!projectId) {
            console.log("No project ID found in URL. Skipping project details fetch.");
            return;
        }
        const fetchData = async () => {
            try {
                const projectResponse = await axiosApi.project.get(API_ENDPOINTS.ProjectCurrentStatus(projectId));
                const projectData = projectResponse.data.data.project_details;
                setBody(projectData.carbon_performance_description);

                console.log('projectData Description', projectData)
            } catch (e: any) {
                console.log(e)
            } finally {
                console.log("finally")
            }
        };
        fetchData();
    }, []);

    const handleAddBenefit = async () => {

        if (!body) {
            setError('This field is required.');
            return;
        }
        const newData = {
            "carbon_performance_description": body,
            "onboarding_status": {
                "step_number": 5,
                "step_name": "enrichment",
                "is_complete": true
            }
        };
        if (isHtmlTagPresent(newData)) {
            customToast.error("Invalid Input!");
            return;
        }
        if (body) {
            dispatch(incrementEnrichmentStepper())
        }






        try {
            const projectId = searchParams.get('id');
            if (!projectId) {
                console.error("No project ID found.");
                return;
            }
            const requestBody = newData;
            let encryptedPayload = {};
            if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            let response = await axiosApi.project.put(API_ENDPOINTS.ProjectUpdate(projectId), { data: encryptedPayload });
            if (response.data.data && response.data.data.project) {
                const projectId = response.data.data.project._id;
                dispatch(currentProjectDetail(response.data.data.project));
                // router.replace(`${Routes.ProjectCreate}?id=${projectId}`);
            }
        } catch (e: any) {
            console.log(e)
        } finally {
            console.log("finally")
        }
        console.log("proponents===========", newData)
    };


    const onclickBackButton = () => {
        dispatch(decrementEnrichmentStepper())
    }
    const handleSkip = () => {
        dispatch(initialEnrichmentStepper(6));
    }


    return (<div className="text-neutral-1400 flex flex-col gap-6">
        <div className="">
            <h2 className="text-f-5xl font-light">Carbon Impact</h2>
            <div className="text-f-l text-neutral-1200 font-normal">
                Fill in the details below
            </div>
        </div>
        <div className="">
            <label htmlFor="body" className="block text-f-m font-normal text-neutral-1200 mb-s"> Impact Description<span className="text-negativeBold ml-xs">*</span>
            </label> <textarea
                id="body"
                value={body}
                onChange={(e) => {
                    setBody(e.target.value)
                    setError('');
                }}
                placeholder="Enter Details"
                className={`mt-1 block mb-s px-l py-m w-full rounded-md border border-gray-300 shadow-sm focus:outline-none ${!error && 'hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500'}  ${error ? 'border-red-500' : 'border-neutral-300'} resize-none`}
                maxLength={2000}
                rows={5}
            />
            <div className='flex justify-between items-center flex-wrap'>
                <ErrorMessage message={error} />
                <p className="italic text-f-m text-gray-400 ">Max. 2000 characters</p>
            </div>

        </div>
        <div className=' flex justify-end gap-l border-t pt-xl'>
            <button className='px-xl py-l flex items-center' onClick={onclickBackButton}>
                <div className='-scale-100'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10.9998 8.00061L5.9998 13.0006L5.2998 12.3006L9.5998 8.00061L5.2998 3.70061L5.9998 3.00061L10.9998 8.00061Z" fill="#22577a" />
                    </svg>
                </div>
                <div className='text-f-m ml-l text-tertiary font-normal'>Back</div>
            </button>
            {[4, 6, 7, 8, 9, 10].includes(projectDetail?.project_completion_status) ? (<button
                type='button'
                className={`flex h-12 min-w-12 px-6 py-4 justify-end items-center gap-4 rounded-lg bg-brand1-500 text-white cursor-pointer'`}
                onClick={handleSkip}
            >
                Skip
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.9998 8L5.9998 13L5.2998 12.3L9.5998 8L5.2998 3.7L5.9998 3L10.9998 8Z"
                        fill="currentColor" />
                </svg>
            </button>) : (
                <button className='px-xl py-l bg-brand1-500 text-white rounded-lg flex items-center' onClick={handleAddBenefit}>
                    <div className='text-f-m font-normal'>Submit</div>
                </button>)}
        </div>
    </div>);
}
