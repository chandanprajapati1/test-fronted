import {
    decrementEnrichmentStepper,
    incrementDetailStepper,
    incrementEnrichmentStepper, initialEnrichmentStepper
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

interface Proponent {
    name: string;
    email: string;
    contact_number: string;
}

const Developer: React.FC = () => {
    const [developerName, setDeveloperName] = useState('');
    const [developerEmail, setDeveloperEmail] = useState('');
    const [developerContact, setDeveloperContact] = useState('');
    const [proponentName, setProponentName] = useState('');
    const [proponentEmail, setProponentEmail] = useState('');
    const [proponentContact, setProponentContact] = useState('');
    const [proponents, setProponents] = useState<Proponent[]>([]);
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [contactError, setContactError] = useState('');
    const [developerNameError, setDeveloperNameError] = useState('');
    const [developerEmailError, setDeveloperEmailError] = useState('');
    const [developerContactError, setDeveloperContactError] = useState('');
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const router = useRouter();
    const projectDetail = useSelector((state: any) => state.projectOnboarding?.projectDetail);
    const [editActive, setEditActive] = useState(false);
    const [editErrorActive, setErrorEditActive] = useState(false);

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
                if (projectData.developer) {
                    setDeveloperName(projectData.developer.name ? projectData.developer.name : '')
                    setDeveloperEmail(projectData.developer.email ? projectData.developer.email : '')
                    setDeveloperContact(projectData.developer.contact_number ? projectData.developer.contact_number : '')
                }
                setProponents(projectData.proponents ? projectData.proponents : [])
                console.log('projectData Description', projectData)
            } catch (e: any) {
                console.log("Fetch developer Details : ", e)
            } finally {
                console.log("finally")
            }
        };
        fetchData();
    }, []);

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPhoneNumber = (phone: string) => {
        const phoneRegex = /^[0-9]{1,20}$/; // Adjust this regex based on the phone number format you expect.
        return phoneRegex.test(phone);
    };

    const proponentEmailHandler = (email: any) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Update the email state
        setProponentEmail(email);

        // Validate only if email is not empty
        if (email.trim() === '') {
            setEmailError('Email is required');
        } else if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError(''); // Clear error if email is valid
        }
        // setProponentEmail(email);
        // setEmailError('')
    }

    const proponentPhoneNumberHandler = (number: any) => {
        let value = number.trimStart().slice(0, 20);

        // Check if value is a valid number (contains only digits)
        if (/^\d+$/.test(value) || value === '') {
            setProponentContact(value);
            setContactError('');
        } else {
            setContactError('Please enter a valid number');
        }
        // setProponentContact(number);
        // setContactError('')
    }

    const developerEmailHandler = (email: any) => {
        // Regular expression to validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Update the email state
        setDeveloperEmail(email);

        // Validate only if email is not empty
        if (email.trim() === '') {
            setDeveloperEmailError('Email is required');
        } else if (!emailRegex.test(email)) {
            setDeveloperEmailError('Please enter a valid email address');
        } else {
            setDeveloperEmailError(''); // Clear error if email is valid
        }
    }

    const developerPhoneNumberHandler = (number: any) => {
        let value = number.trimStart().slice(0, 20);

        // Check if value is a valid number (contains only digits)
        if (/^\d+$/.test(value) || value === '') {
            setDeveloperContact(value);
            setDeveloperContactError('');
        } else {
            setDeveloperContactError('Please enter a valid number');
        }
    }

    const handleAddProponent = () => {
        const isEmailValid = isValidEmail(proponentEmail);
        const isContactValid = isValidPhoneNumber(proponentContact);

        if (!isEmailValid || !isContactValid || !proponentName) {
            if (!proponentName) {
                setNameError("This field is required")
            }
            if (!isEmailValid) {
                setEmailError('Invalid email address');
            }
            if (!isContactValid) {
                setContactError('Invalid phone number. Must be 10 digits.');
            }
            return;
        }

        // Clear errors if both inputs are valid
        setEmailError('');
        setContactError('');

        // Add the proponent to the list
        setProponents([...proponents, { name: proponentName, email: proponentEmail, contact_number: proponentContact }]);
        setProponentEmail('');
        setProponentContact('');
        setProponentName('');
        setErrorEditActive(false);
        setEditActive(false);
    };

    const handleDeleteProponent = (index: number) => {
        setProponents(proponents.filter((_, i) => i !== index));
    };

    const handleEditProponent = (index: number) => {
        let value = proponents.find((_, i) => i === index)
        console.log("handleEditProponent", value)
        if (editActive) {
            setErrorEditActive(true)
            return;
        }
        if (value) {
            setEditActive(true);
            setProponentEmail(value?.email);
            setProponentContact(value?.contact_number);
            setProponentName(value?.name)
            setProponents(proponents.filter((_, i) => i !== index));
        }

    };

    const onClickNextHandler = async () => {
        const isEmailValid = isValidEmail(developerEmail);
        const isContactValid = isValidPhoneNumber(developerContact);

        if (!isEmailValid || !isContactValid || !developerName) {
            if (!developerName) {
                setDeveloperNameError("This field is required")
            }
            if (!isEmailValid) {
                setDeveloperEmailError('Invalid email address');
            }
            if (!isContactValid) {
                setDeveloperContactError('Invalid phone number. Must be 10 digits.');
            }
            return;
        }


        const newData = {
            "developer": {
                "name": developerName,
                "email": developerEmail,
                "contact_number": developerContact
            },
            "proponents": proponents,
            "onboarding_status": {
                "step_number": 1,
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

    const onclickBackButton = () => {
        dispatch(decrementEnrichmentStepper())
    }

    const handleSkip = () => {
        dispatch(initialEnrichmentStepper(2));
    }

    return (<div className="text-neutral-1400 flex flex-col gap-6 ">
        <div className="">
            <h2 className="text-f-5xl font-light">Project Developer</h2>
            <div className="text-f-l text-neutral-1200 font-normal">
                Fill in the details below
            </div>
        </div>
        <div className='flex flex-col gap-2'>
            <label className="text-f-m font-normal text-neutral-1200 "> Developer Name <span className="text-negativeBold">*</span>
            </label> <input
                type="text"
                placeholder="Enter your name"
                value={developerName}
                onChange={(e) => {
                    setDeveloperName(e.target.value.trimStart().slice(0, 100));
                    // setDeveloperNameError('');
                }}
                className="w-full px-l py-s text-f-m font-normal border border-gray-200 rounded-lg  hover:ring-brand1-500 hover:border-brand1-500 focus:outline-none focus:border-brand1-500 focus:ring-brand1-500"
            /> {developerName.length == 0 && developerNameError && <ErrorMessage message={developerNameError} />}
        </div>
        <div className=" flex flex-col sc-sm:flex-row gap-6">
            <div className='flex flex-col flex-1 gap-2'>
                <label className="text-f-m font-normal text-neutral-1200 "> Developer Email <span className="text-negativeBold">*</span>
                </label> <input
                    type="email"
                    placeholder="Enter email"
                    value={developerEmail}
                    onChange={(e) => developerEmailHandler(e.target.value.trimStart().slice(0, 50))}
                    className="w-full px-l py-s text-f-m font-normal border border-gray-200 rounded-lg  hover:ring-brand1-500 hover:border-brand1-500 focus:outline-none focus:border-brand1-500 focus:ring-brand1-500"
                /> {developerEmailError && <ErrorMessage message={developerEmailError} />}
            </div>
            <div className='flex flex-col flex-1 gap-2'>
                <label className="text-f-m font-normal  text-neutral-1200 "> Developer Contact Number <span className="text-negativeBold">*</span>
                </label> <input
                    type="text"
                    placeholder="Enter contact number"
                    value={developerContact}
                    onChange={(e) => developerPhoneNumberHandler(e.target.value)}
                    className="w-full px-l py-s border text-f-m font-normal border-gray-200 rounded-lg  hover:ring-brand1-500 hover:border-brand1-500 focus:outline-none focus:border-brand1-500 focus:ring-brand1-500"
                /> {developerContactError && <ErrorMessage message={developerContactError} />}
            </div>

        </div>
        {![4, 6, 7, 8, 9, 10].includes(projectDetail?.project_completion_status) &&
            <div className='flex-1 pt-xl border-t'>
                <label className="text-f-m font-normal text-neutral-1200 "> Proponent Name </label> <input
                    type="text"
                    placeholder="Enter name"
                    value={proponentName}
                    onChange={(e) => {
                        setProponentName(e.target.value.slice(0, 100))
                        setNameError('')
                    }}
                    className={`w-full px-l py-s text-f-m font-normal border border-gray-200 rounded-lg mt-s  hover:ring-brand1-500 hover:border-brand1-500 focus:outline-none focus:border-brand1-500 focus:ring-brand1-500 ${editErrorActive && "border-red-500"}`}
                /> {nameError && <ErrorMessage message={nameError} />}
            </div>} {![4, 6, 7, 8, 9, 10].includes(projectDetail?.project_completion_status) &&
                <div className='flex-1 flex gap-2xl sc-xs:items-end flex-col sc-xs:flex-row '>
                    <div className="flex-1 flex flex-col sc-xs:flex-row  gap-xl">
                        <div className='flex flex-col gap-2 flex-1 '>
                            <label className="text-f-m font-normal text-neutral-1200 "> Proponent Email </label> <input
                                type="email"
                                placeholder="Enter Email"
                                value={proponentEmail}
                                onChange={(e) => proponentEmailHandler(e.target.value.trimStart().slice(0, 50))}
                                className={`w-full px-l py-s text-f-m font-normal border border-gray-200 rounded-lg mt-s  hover:ring-brand1-500 hover:border-brand1-500 focus:outline-none focus:border-brand1-500 focus:ring-brand1-500 ${editErrorActive && "border-red-500"}`}
                            /> {emailError &&
                            <ErrorMessage message={emailError} />
                        }
                        </div>

                        <div className='flex flex-col gap-2 flex-1 '>
                            <label className="text-f-m font-normal text-neutral-1200 "> Proponent Contact Number </label>
                            <input
                                type="text"
                                placeholder="Enter Contact"
                                value={proponentContact}
                                onChange={(e) => proponentPhoneNumberHandler(e.target.value)}
                                className={`w-full px-l py-s text-f-m font-normal border border-gray-200 rounded-lg mt-s  hover:ring-brand1-500 hover:border-brand1-500 focus:outline-none focus:border-brand1-500 focus:ring-brand1-500 ${editErrorActive && "border-red-500"}`}
                            /> {contactError && <ErrorMessage message={contactError} />}
                        </div>

                    </div>
                    {editActive ? <button
                        onClick={handleAddProponent}
                        className="border border-brand1-500 h-fit py-s px-m text-black text-f-s rounded-lg mb-[2px]  hover:ring-brand1-600 hover:border-brand1-600"
                    >
                        Done
                    </button> : <button
                        onClick={handleAddProponent}
                        className="border border-brand1-500 h-fit  py-s px-m text-black text-f-s rounded-lg mb-[2px]  hover:ring-brand1-600 hover:border-brand1-600"
                    >
                        + <span className='ml-s'>Add</span>
                    </button>}
                </div>}

        {proponents && proponents.length > 0 && <div className="overflow-x-auto">
            <table className="w-full ">
                <thead className='bg-gray-200 '>
                    <tr className=' '>
                        <th className="py-m px-s text-f-m font-semibold p-2 border-b whitespace-nowrap text-left">Prop. Email</th>
                        <th className="py-m px-s text-f-m font-semibold p-2 border-b whitespace-nowrap text-left">Prop. Contact</th>
                        <th className="py-m px-s text-f-m font-semibold p-2 border-b whitespace-nowrap text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {proponents && proponents.map((proponent, index) => (<tr key={index} className="border-b ">
                        <td className="py-m px-s text-f-m whitespace-nowrap text-left">{proponent.email}</td>
                        <td className="py-m px-s text-f-m whitespace-nowrap text-left">{proponent.contact_number}</td>
                        <td className="py-m px-s text-f-m whitespace-nowrap text-left">
                            <button
                                onClick={() => handleEditProponent(index)}
                                className="text-negativeBold mr-xl"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M15 13.0006H1V14.0006H15V13.0006Z" fill="#4D4D4D" />
                                    <path d="M12.7 4.50061C13.1 4.10061 13.1 3.50061 12.7 3.10061L10.9 1.30061C10.5 0.90061 9.9 0.90061 9.5 1.30061L2 8.80061V12.0006H5.2L12.7 4.50061ZM10.2 2.00061L12 3.80061L10.5 5.30061L8.7 3.50061L10.2 2.00061ZM3 11.0006V9.20061L8 4.20061L9.8 6.00061L4.8 11.0006H3Z" fill="#4D4D4D" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleDeleteProponent(index)}
                                className="text-negativeBold"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M7 6.00061H6V12.0006H7V6.00061Z" fill="#4D4D4D" />
                                    <path d="M10 6.00061H9V12.0006H10V6.00061Z" fill="#4D4D4D" />
                                    <path d="M2 3.00061V4.00061H3V14.0006C3 14.2658 3.10536 14.5202 3.29289 14.7077C3.48043 14.8953 3.73478 15.0006 4 15.0006H12C12.2652 15.0006 12.5196 14.8953 12.7071 14.7077C12.8946 14.5202 13 14.2658 13 14.0006V4.00061H14V3.00061H2ZM4 14.0006V4.00061H12V14.0006H4Z" fill="#4D4D4D" />
                                    <path d="M10 1.00061H6V2.00061H10V1.00061Z" fill="#4D4D4D" />
                                </svg>
                            </button>
                        </td>
                    </tr>))}
                </tbody>
            </table>
        </div>}
        <hr />
        <div className=' flex justify-end gap-l'>
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
                <button className='px-xl py-l bg-brand1-500 text-white rounded-lg flex items-center' onClick={onClickNextHandler}>
                    <div className='text-f-m mr-l font-normal'>Next</div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10.9998 8.00061L5.9998 13.0006L5.2998 12.3006L9.5998 8.00061L5.2998 3.70061L5.9998 3.00061L10.9998 8.00061Z" fill="white" />
                        </svg>
                    </div>
                </button>)}
        </div>
    </div>);
};

export default Developer;
