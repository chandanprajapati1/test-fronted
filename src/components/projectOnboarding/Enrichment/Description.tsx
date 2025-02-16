'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Interface } from 'readline';
import { useDispatch, useSelector } from 'react-redux';
import {
    currentProjectDetail,
    currentTabHandler, incrementDetailStepper,
    incrementEnrichmentStepper, initialEnrichmentStepper
} from '@/app/store/slices/projectOnboardingSlice';
import { getAuthCredentials } from '@/utils/auth-utils';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosApi from '@/utils/axios-api';
import { API_ENDPOINTS } from '@/config/api-endpoint';
import { Routes } from '@/config/routes';
import { customToast } from "@/components/ui/customToast";
import { validateFile } from "@/utils/validate-file";
import { encryptString } from '@/utils/enc-utils';
import { isHtmlTagPresent } from '@/utils/input-utils';
import {ErrorMessage} from "@/components/ui/validationMsg";

interface ErrorType {
    description: boolean;
    file: boolean;
}

export default function Description() {
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const projectDetail = useSelector((state: any) => state.projectOnboarding?.projectDetail);
    const dispatch = useDispatch();
    const [error, setError] = useState<ErrorType>({ description: false, file: false });
    const searchParams = useSearchParams();

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
                setDescription(projectData.details)
                setFileName(projectData.background_image)
                console.log('projectData Description', projectData)
            } catch (e: any) {
                console.log(e)
            } finally {
                console.log("finally")
            }
        };
        fetchData();
    }, []);


    const getAcceptedFileTypes = (extensions: string[]) => {
        return extensions
            .map(ext => ext.startsWith('.') ? ext.substring(1) : ext)
            .map(ext => `.${ext}`)
            .join(',');
    };

    const onClickNextHandler = async () => {

        if (file && fileName) {


            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'project-images');
            // console.log("formData", formData, selectedFile[0])
            try {
                const token = getAuthCredentials();
                const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_IMAGE_ENDPOINT}/auth/file-upload`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }

                });

                if (response.ok) {
                    const result = await response.json();

                    console.log('Files uploaded successfully:', result);
                    if (description) {
                        const newData = {
                            "details": description,
                            "background_image": result.data.file_path,
                            "onboarding_status": {
                                "step_number": 0,
                                "step_name": "enrichment",
                                "is_complete": true
                            }
                        }
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
                                const projectId = response.data.data.project._id;
                                dispatch(incrementEnrichmentStepper())
                                // router.replace(`${Routes.ProjectCreate}?id=${projectId}`);
                            }

                        } catch (e: any) {
                            console.log(e)
                        } finally {
                            console.log("finally")
                        }
                    }
                    else {
                        setError({
                            description: !description,
                            file: !file && !fileName
                        });
                    }
                    // Additional actions based on success
                } else {
                    console.error('Failed to upload files:', response.statusText);
                }
            } catch (error) {
                console.error('Error uploading files:', error);
            }
        }
        else if (fileName && description) {
            const newData = {
                "details": description,
            }
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
                    const projectId = response.data.data.project._id;
                    dispatch(incrementEnrichmentStepper())
                    // router.replace(`${Routes.ProjectCreate}?id=${projectId}`);
                }

            } catch (e: any) {
                console.log(e)
            } finally {
                console.log("finally")
            }

        }
        // if (!file && fileName && description) {
        //     dispatch(incrementEnrichmentStepper())
        // }
        else {
            setError({
                description: !description,
                file: !file && !fileName
            });
        }
    };
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            const validation = validateFile(file, 8, ['.jpg', '.jpeg', '.png']);
            if (!validation.isValid) {
                customToast.error(validation.error || 'Invalid file');

                // Clear the file input to allow re-upload of the same file
                e.target.value = '';
                return;
            }

            setError((prev) => ({
                ...prev,
                file: false,
            }));
            setFile(file);
            setFileName(file.name);
        }
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        setError((prev) => ({
            ...prev,
            description: false,
        }));
    }

    const handleBack = () => {
        dispatch(currentTabHandler('specifications'));
    }

    const handleSkip = () => {
        dispatch(initialEnrichmentStepper(1));
    }

    return (<div className="text-neutral-1400 flex flex-col gap-8 ">
        <div className="">
            <h2 className="text-f-5xl font-light">About Project</h2>
            <div className="text-f-l text-neutral-1200 font-normal">
                Fill in the details below
            </div>
        </div>
        <div className="">
            <label className="block text-f-m text-neutral-1200 font-normal mb-s" htmlFor="description"> Project Description <span className="text-negativeBold">*</span>
            </label> <textarea
                id="description"
                className="w-full border rounded-md  text-gray-700 resize-none px-l py-m  hover:ring-brand1-500 hover:border-brand1-500 focus:outline-none focus:border-brand1-500 focus:ring-brand1-500"
                placeholder="Description"
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                maxLength={2000}
                rows={5}
            />
            <div className='flex justify-between items-center'>
                <ErrorMessage message={error.description ? 'This field is required' : ''} />
                <p className="italic text-f-m text-gray-400 ">Max. 2000 characters</p>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <div className="p-l bg-gray-200 border-dashed border border-gray-300 rounded-md">
                <div className="w-full h-auto relative flex items-center justify-center cursor-pointer">
                    <input
                        type="file"
                        ref={fileInputRef}
                        id="banner"
                        className="opacity-0 absolute h-full w-full cursor-pointer"
                        onChange={handleFileChange}
                        accept={getAcceptedFileTypes(['.jpg', '.jpeg', '.png'])}
                    />
                    <div className="text-center">
                        {fileName ? (<p className="text-gray-700">{fileName}</p>) : (
                            <div className='flex justify-center flex-col items-center '>
                                <div className='w-fit p-m rounded-full border-4 border-white mb-m'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                        <path d="M7.5 10.7076L5 8.20711L5.7065 7.50061L7.5 9.29361L11.2925 5.50061L12 6.20811L7.5 10.7076Z" fill="#808080"/>
                                        <path d="M8.5 1.00061C7.11553 1.00061 5.76216 1.41115 4.61101 2.18032C3.45987 2.94949 2.56266 4.04274 2.03285 5.32183C1.50303 6.60091 1.36441 8.00838 1.63451 9.36624C1.9046 10.7241 2.57129 11.9714 3.55026 12.9504C4.52922 13.9293 5.7765 14.596 7.13437 14.8661C8.49224 15.1362 9.8997 14.9976 11.1788 14.4678C12.4579 13.938 13.5511 13.0407 14.3203 11.8896C15.0895 10.7385 15.5 9.38508 15.5 8.00061C15.5 6.14409 14.7625 4.36362 13.4497 3.05086C12.137 1.73811 10.3565 1.00061 8.5 1.00061ZM8.5 14.0006C7.31332 14.0006 6.15328 13.6487 5.16658 12.9894C4.17989 12.3301 3.41085 11.3931 2.95673 10.2967C2.5026 9.20035 2.38378 7.99395 2.61529 6.83007C2.8468 5.66618 3.41825 4.59708 4.25736 3.75797C5.09648 2.91885 6.16558 2.34741 7.32946 2.1159C8.49335 1.88439 9.69975 2.00321 10.7961 2.45733C11.8925 2.91146 12.8295 3.68049 13.4888 4.66719C14.1481 5.65388 14.5 6.81392 14.5 8.00061C14.5 9.59191 13.8679 11.118 12.7426 12.2433C11.6174 13.3685 10.0913 14.0006 8.5 14.0006Z" fill="#808080"/>
                                    </svg>
                                </div>
                                <p className="text-tertiary text-f-m font-semibold">Click to upload banner image</p>
                                <p className="text-neutral-1000 text-f-m font-normal">
                                    jpeg, png (max. 8mb, Dimension: 1920px*330px)
                                </p>
                            </div>)}
                    </div>
                </div>

            </div>
            {error.file && <ErrorMessage message="This field is required" />}
        </div>

        <div className='flex justify-end gap-l border-t pt-xl'>
            <button className='px-xl py-l flex items-center' onClick={handleBack}>
                <div className='-scale-100'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10.9998 8.00061L5.9998 13.0006L5.2998 12.3006L9.5998 8.00061L5.2998 3.70061L5.9998 3.00061L10.9998 8.00061Z" fill="#22577a"/>
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
                        fill="currentColor"/>
                </svg>
            </button>) : (
                <button className='px-xl py-l bg-brand1-500 text-white rounded-lg flex items-center' onClick={onClickNextHandler}>
                    <div className='text-f-m mr-l font-normal'>Next</div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10.9998 8.00061L5.9998 13.0006L5.2998 12.3006L9.5998 8.00061L5.2998 3.70061L5.9998 3.00061L10.9998 8.00061Z" fill="white"/>
                        </svg>
                    </div>
                </button>)}
        </div>
    </div>);
}
