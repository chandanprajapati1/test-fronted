// components/SDGGoalsForm.tsx
import {
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

interface Benefit {
    header: string;
    body: string;
    isEditing: boolean;
}

export default function ImpactAtGlance() {
    const [addBenfits, setAddBenefits] = useState<Benefit[]>([]);
    const [introduction, setIntroduction] = useState<string>('');
    const [header, setHeader] = useState<string>('');
    const [body, setBody] = useState<string>('');
    const [headerError, setHeaderError] = useState<string>('');
    const [introductionError, setIntroductionError] = useState<string>('');
    const [benefitsError, setBenefirError] = useState<string>('');
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [optionalcheck, setOptionalcheck] = useState(false);
    const [onSaveError, setOnSaveError] = useState('');
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
                setIntroduction(projectData.impact_at_glance_description);
                if (projectData.impact_at_glance) {
                    const newData = projectData.impact_at_glance.map((glance: any) => ({
                        header: glance.header,
                        body: glance.text,
                        isEditing: false
                    }));
                    setAddBenefits(newData)
                }

                setOptionalcheck(projectData.project_status.project_status_name === "Listed" || projectData.project_status.project_status_name === "Validated")
                console.log('projectData Description', projectData)
            } catch (e: any) {
                console.log(e)
            } finally {
                console.log("finally")
            }
        };
        fetchData();
    }, []);

    const handleAddBenefit = () => {
        if (header.length == 0 || body.length === 0) {
            (header.length == 0) && setHeaderError('This field is required');
            (body.length == 0) && setBenefirError('This field is required');
            return;
        }
        const newBenefit = {
            header: header,
            body: body,
            isEditing: false
        }
        console.log("newBenefit", newBenefit)
        if (isHtmlTagPresent(newBenefit)) {
            customToast.error("Invalid Input!");
            return;
        }
        setAddBenefits((prevBenfit) =>
            [...prevBenfit, newBenefit]
        )
        setHeader('')
        setBody('')
        setBenefirError('')
        setHeaderError('')
    };

    const handleEditClick = (benefitHeader: string) => {
        setAddBenefits((prevBenefit) =>
            prevBenefit.map((benefit) =>
                benefit.header === benefitHeader ? { ...benefit, isEditing: true } : benefit
            )
        );
    };

    const handleDescriptionChange = (benefitHeader: string, newDescription: string) => {
        setOnSaveError('')
        setAddBenefits((prevBenefit) =>
            prevBenefit.map((benefit) =>
                benefit.header === benefitHeader ? { ...benefit, body: newDescription } : benefit
            )
        );
    };

    const handleSaveClick = (benefitHeader: string) => {
        const filteredData: any = addBenfits.filter(
            (benefit) => benefit.header === benefitHeader
        );

        if (filteredData[0].body.length === 0 && filteredData[0].body.trim() == '') {
            setOnSaveError(benefitHeader)
            return;
        }

        setAddBenefits((prevBenefit) =>
            prevBenefit.map((benefit) =>
                benefit.header === benefitHeader
                    ? {
                        ...benefit,
                        isEditing: false,
                    }
                    : benefit
            )
        );
    };

    const onclickBackButton = () => {
        dispatch(decrementEnrichmentStepper())
    }

    const onClickNextButton = async () => {
        if ((!introduction || addBenfits.length === 0) && !optionalcheck) {
            !introduction && setIntroductionError('This field is required.');
            (addBenfits.length === 0) && setBenefirError("Impact is required.");
            return;
        }
        const addedBenefits = addBenfits.map((benefit: any) => ({
            'header': benefit.header,
            'text': benefit.body
        }));

        const newData = {
            "impact_at_glance_description": introduction,
            "impact_at_glance": addedBenefits,
            "onboarding_status": {
                "step_number": 4,
                "step_name": "enrichment",
                "is_complete": true
            }
        };
        if (isHtmlTagPresent(newData)) {
            customToast.error("Invalid Input!");
            return;
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
                dispatch(incrementEnrichmentStepper())
                /*const projectId = response.data.data.project._id;
                router.replace(`${Routes.ProjectCreate}?id=${projectId}`);*/
            }
        } catch (e: any) {
            console.log(e)
        } finally {
            console.log("finally")
        }
        console.log("proponents===========", newData)
    }

    const handleSkip = () => {
        dispatch(initialEnrichmentStepper(5));
    }


    return (<div className="text-neutral-1400 flex flex-col gap-6">
        <div className="">
            <h2 className="text-f-5xl font-light">Impact at Glance</h2>
            <div className="text-f-l text-neutral-1200 font-normal">
                Fill in the details below
            </div>
        </div>

        <div className=" ">
            <label htmlFor="introduction" className="block text-f-m font-normal text-neutral-1200 mb-s"> Introduction{!optionalcheck &&
                <span className="text-negativeBold ml-xs">*</span>}
            </label> <textarea
                id="introduction"
                value={introduction}
                onChange={(e) => {
                    setIntroduction(e.target.value.trimStart());
                    setIntroductionError('');
                }}
                placeholder="Add Introduction"
                rows={3}
                maxLength={2000}
                className={`text-f-m font-normal px-l py-s block w-full border rounded-md border-gray-300 focus:outline-none ${!introductionError && 'hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500'}  ${introductionError ? 'border-red-500' : 'border-neutral-300'} resize-none`}
            />
            <div className='flex justify-between items-center pt-s'>
                <ErrorMessage message={introductionError ? introductionError : ''} />
                <p className="italic text-f-m text-gray-400 ">Max. 2000 characters</p>
            </div>

        </div>
        <div className='flex flex-col px-xl py-l border rounded-xl gap-2xl'>
            <div>
                <label htmlFor="sdg-goal" className="block text-f-m font-normal text-neutral-1200 mb-s"> Header{!optionalcheck &&
                    <span className="text-negativeBold ml-xs">*</span>}
                </label>

                <textarea
                    id="body"
                    value={header}
                    onChange={(e) => setHeader(e.target.value.trimStart())}
                    placeholder="Enter Details"
                    className={`mt-1 block mb-s px-l py-m w-full rounded-md border border-gray-300 shadow-sm focus:outline-none ${!headerError && 'hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500'}  ${headerError && header.length == 0 ? 'border-red-500' : 'border-neutral-300'} resize-none`}
                    maxLength={500}
                    rows={1}
                />
                <div className='flex justify-between items-center'>
                    <ErrorMessage message={headerError && header.length == 0 ? headerError : ''} />
                    <p className="italic text-f-m text-gray-400 ">Max. 500 characters</p>
                </div>

            </div>
            <div className="">
                <label htmlFor="body" className="block text-f-m font-normal text-neutral-1200 mb-s"> Body{!optionalcheck &&
                    <span className="text-negativeBold ml-xs">*</span>}
                </label> <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value.trimStart())}
                    placeholder="Enter Details"
                    className={`mt-1 block mb-s px-l py-m w-full rounded-md border border-gray-300 shadow-sm focus:outline-none ${!benefitsError && 'hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500'}  ${benefitsError ? 'border-red-500' : 'border-neutral-300'} resize-none`}
                    maxLength={2000}
                    rows={5}
                />
                <div className='flex justify-between items-center'>
                    <ErrorMessage message={benefitsError} />
                    <p className="italic text-f-m text-gray-400 ">Max. 2000 characters</p>
                </div>
            </div>

            {[4, 6, 7, 8, 9, 10].includes(projectDetail?.project_completion_status) ? (
                <div className='flex flex-wrap justify-end  gap-l'>
                    <button className='px-xl py-l flex items-center' onClick={onclickBackButton}>
                        <div className='-scale-100'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10.9998 8.00061L5.9998 13.0006L5.2998 12.3006L9.5998 8.00061L5.2998 3.70061L5.9998 3.00061L10.9998 8.00061Z" fill="#22577a"/>
                            </svg>
                        </div>
                        <div className='text-f-m ml-l text-tertiary font-normal'>Back</div>
                    </button>
                    <button
                        type='button'
                        className={`flex w-fit  h-12 min-w-12 px-6 py-4 justify-end items-center gap-4 rounded-lg bg-brand1-500 text-white cursor-pointer`}
                        onClick={handleSkip}
                    >
                        Skip
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.9998 8L5.9998 13L5.2998 12.3L9.5998 8L5.2998 3.7L5.9998 3L10.9998 8Z"
                                fill="currentColor"/>
                        </svg>
                    </button>
                </div>) : (<div className="flex flex-wrap justify-between gap-l w-full">
                <button className='px-xl py-l flex items-center' onClick={onclickBackButton}>
                    <div className='-scale-100'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10.9998 8.00061L5.9998 13.0006L5.2998 12.3006L9.5998 8.00061L5.2998 3.70061L5.9998 3.00061L10.9998 8.00061Z" fill="#22577a"/>
                        </svg>
                    </div>
                    <div className='text-f-m ml-l text-tertiary font-normal'>Back</div>
                </button>
                <div className="flex flex-wrap sc-sm:flex-row justify-end gap-xl ml-auto">
                    <button className='px-xl py-l bg-white text-tertiary border border-brand1-500 rounded-lg flex items-center' onClick={handleAddBenefit}>
                        <div className='text-f-m font-normal'>Submit</div>
                    </button>
                    <button className='px-xl py-l bg-brand1-500 text-white rounded-lg flex items-center' onClick={onClickNextButton}>
                        <div className='text-f-m mr-l font-normal'>Next</div>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10.9998 8.00061L5.9998 13.0006L5.2998 12.3006L9.5998 8.00061L5.2998 3.70061L5.9998 3.00061L10.9998 8.00061Z" fill="white"/>
                            </svg>
                        </div>
                    </button>
                </div>
            </div>)}
        </div>

        <div className="bg-white shadow border border-gray-50 rounded-2xl mt-xl">
            <div className='py-l px-xl  border-b'>
                <div className="text-f-3xl font-light text-black border-gray-300 ">Impact of this project</div>
            </div>

            <div className="p-xl">
                {addBenfits.map((benefit, index) => (<div key={index}>
                    {onSaveError === benefit.header &&
                        <ErrorMessage message="This field is not empty." />}
                    <div
                        className={`p-l rounded-xl flex gap-m bg-neutral-300 justify-center items-start ${index !== (addBenfits.length - 1) && 'border-b-2 mb-l'}`}
                    >
                        <div className='flex-1 '>
                            <h3 className="text-f-m font-semibold">{benefit.header}</h3>{benefit.isEditing ? (
                                <div>
                                    <textarea
                                        value={benefit.body}
                                        onChange={(e) => handleDescriptionChange(benefit.header, e.target.value)}
                                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:border focus:border-brand1-500 focus:ring-brand1-500 resize-none"
                                    />

                                </div>) : (
                                <p className="text-neutral-1200 font-normal text-f-m mt-2">{(benefit.body).length > 150 ? (benefit.body).slice(0, 150) + "..." : benefit.body}</p>)}
                        </div>

                        {!benefit.isEditing ? (<button
                            onClick={() => handleEditClick(benefit.header)}
                            className="text-indigo-600 hover:underline p-m bg-gray-100 rounded-full h-fit"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M15 13.0006H1V14.0006H15V13.0006Z" fill="#161616" />
                                <path d="M12.7 4.50061C13.1 4.10061 13.1 3.50061 12.7 3.10061L10.9 1.30061C10.5 0.90061 9.9 0.90061 9.5 1.30061L2 8.80061V12.0006H5.2L12.7 4.50061ZM10.2 2.00061L12 3.80061L10.5 5.30061L8.7 3.50061L10.2 2.00061ZM3 11.0006V9.20061L8 4.20061L9.8 6.00061L4.8 11.0006H3Z" fill="#161616" />
                            </svg>
                        </button>) : (<button
                            onClick={() => handleSaveClick(benefit.header)}
                            className="text-indigo-600 hover:underline p-m bg-gray-100 rounded-full h-fit rotate-180"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 9.00061L3.705 9.70561L7.5 5.91561V15.0006H8.5V5.91561L12.295 9.70561L13 9.00061L8 4.00061L3 9.00061Z" fill="#4D4D4D" />
                                <path d="M3 4.00061V2.00061H13V4.00061H14V2.00061C14 1.73539 13.8946 1.48104 13.7071 1.2935C13.5196 1.10597 13.2652 1.00061 13 1.00061H3C2.73478 1.00061 2.48043 1.10597 2.29289 1.2935C2.10536 1.48104 2 1.73539 2 2.00061V4.00061H3Z" fill="#4D4D4D" />
                            </svg>
                        </button>)}
                    </div>
                </div>

                ))}
            </div>
        </div>
    </div>);
}
