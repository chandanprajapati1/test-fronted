'use client'
import React, { useState } from 'react'
import Overlay from './Overlay'
import DocList from './DocList';
import OtherDocList from './OtherDocList';
import { getAuthCredentials } from '@/utils/auth-utils';
import { encryptString } from '@/utils/enc-utils';

interface CustomFile {
    id: string;
    file_path: string;
    file_url: string;
    // Add other properties you expect to have
}

const Details = (props: any) => {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [next, setNext] = useState(false);
    const [otherDocs, setOtherDocs] = useState<{ id: number }[]>([]);
    const [nextId, setNextId] = useState(0);
    const [error, setError] = useState<{ company: string, country: string, uid: string }>({ company: '', country: '', uid: '' });
    const [requiredDoc, setRequiredDoc] = useState([])
    const [files, setFiles] = useState<CustomFile[]>([]);
    const [requiredDocStatus, setRequiredDocStatus] = useState({})
    const [uid, setUid] = useState('');

    const addFiles = (newFiles: any) => {
        if (newFiles.id.split('-')[0] === "M") {
            setRequiredDocStatus((prev: any) => ({ ...prev, [newFiles.id]: true }))
        }
        setFiles(prevFiles => [...prevFiles, newFiles]);
        console.log("files==============", files)
        console.log("requiredDocStatus", requiredDocStatus)
    };

    const removeFile = (fileId: any) => {
        console.log("removeFile === ", fileId)
        if (fileId.split('-')[0] === "M") {
            setRequiredDocStatus((prev: any) => ({ ...prev, [fileId]: false }))
        }
        console.log("Current files before removal:", files, fileId);
        setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
        console.log("requiredDocStatus", requiredDocStatus)

    };

    const closeHandler = () => {
        props.setHideCompanyInfo(true);
    }

    const onClickNextHandler = () => {
        let isValid = true;
        if (!companyName) {
            setError(prev => ({ ...prev, company: 'Company name is required.' }));
            isValid = false;
        }

        if (!selectedCountry) {
            setError(prev => ({ ...prev, country: 'Country is required.' }));
            isValid = false;
        }



        if (isValid) {
            // Find the country object that matches the selectedCountry ID
            const selectedCountryData = props.countryData.find((country: any) => country.ID === selectedCountry);

            if (selectedCountryData) {
                // Access the RequiredDocuments from the selected country data
                const requiredDocuments = selectedCountryData.RequiredDocuments;

                // Example usage: You can store this in a state or perform further actions
                console.log('Required Documents:', requiredDocuments);
                setRequiredDoc(requiredDocuments)
                const newStatus = requiredDocuments.reduce((status: any, doc: any, index: any) => {
                    status[`M-${index}`] = false;
                    return status;
                }, {});
                setRequiredDocStatus(newStatus)
                console.log("newStatus ========", newStatus)

                setNext(true);
                setError({ company: '', country: '', uid: '' });
            } else {
                console.error('No country data found for the selected ID');
            }
        }
    }

    const onSubmitClick = async () => {
        let isValid = true;
        if (!companyName) {
            setError(prev => ({ ...prev, company: 'Company name is required.' }));
            isValid = false;
        }

        if (!selectedCountry) {
            setError(prev => ({ ...prev, country: 'Country is required.' }));
            isValid = false;
        }

        if (!uid) { // Check if UID is empty
            setError(prev => ({ ...prev, uid: 'UID is required.' }));
            isValid = false;
        }

        if (isValid) {
            console.log("files reuire ---", files)
            const requiredDocImag = files.reduce((acc: any[], file: any) => {
                acc.push(file.data); // Add the data object to the accumulator array
                return acc;          // Return the updated array for the next iteration
            }, []);

            const requestBody = {
                name: companyName,
                country_id: selectedCountry,
                companyNumber: uid,
                documents: requiredDocImag
                // Include other relevant data
            };
            console.log("===========================", requiredDocImag)

            const token = getAuthCredentials();
            try {
                let encryptedData = {};
                if(Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0){
                    encryptedData = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
                }
                const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/auth/onboard-organization`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token.token}`
                        // Include other necessary headers like authorization tokens
                    },
                    body: JSON.stringify({data: encryptedData})
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Success:', data);
                    props.setHideCompanyInfo(true);
                    props.setHideSuccess(false)
                    // Handle successful submission (e.g., navigating to another page, showing a success message)
                } else {
                    throw new Error(data.message); // Assuming the API responds with an error message
                }
            } catch (error) {
                console.error('Error:', error);
                // Handle errors (e.g., showing error messages to the user)
            }
        }
    }

    // Add validation utilities
    const validateCompanyName = (name: string): { isValid: boolean; error: string } => {
        // Remove leading/trailing spaces for validation
        const trimmedName = name.trim();

        // Check for empty or just spaces
        if (!trimmedName) {
            return { isValid: false, error: 'Company name is required.' };
        }

        // Check for special characters using regex (allows only letters, numbers and spaces)
        const specialCharRegex = /^[a-zA-Z0-9\s]*$/;
        if (!specialCharRegex.test(name)) {
            return { isValid: false, error: 'Company name should only contain letters, numbers and spaces.' };
        }

        // Check for consecutive spaces
        if (/\s\s/.test(name)) {
            return { isValid: false, error: 'Consecutive spaces are not allowed.' };
        }

        // Check for minimum length (after trim)
        if (trimmedName.length < 2) {
            return { isValid: false, error: 'Company name must be at least 2 characters long.' };
        }

        return { isValid: true, error: '' };
    };

    const validateGST = (gst: string): { isValid: boolean; error: string } => {
        // Remove all spaces for GST validation
        const cleanGST = gst.replace(/\s/g, '');

        // Basic GST format: 2 letters + 10 digits + 2 letters + 1 letter/number
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

        if (!cleanGST) {
            return { isValid: false, error: 'GST number is required.' };
        }

        if (!gstRegex.test(cleanGST)) {
            return { isValid: false, error: 'Please enter a valid GST number.' };
        }

        return { isValid: true, error: '' };
    };

    const handleCompanyNameChange = (value: string) => {
        const validation = validateCompanyName(value);
        if (!validation.isValid) {
            setError(prev => ({ ...prev, company: validation.error }));
        } else {
            setError(prev => ({ ...prev, company: '' }));
        }
        setCompanyName(value);
    };

    const handleUIDChange = (value: string) => {
        const validation = validateGST(value);
        if (!validation.isValid) {
            setError(prev => ({ ...prev, uid: validation.error }));
        } else {
            setError(prev => ({ ...prev, uid: '' }));
        }
        setUid(value);
    };

    const handleCountryChange = (value: string) => {
        setSelectedCountry(value);
        setError(prev => ({ ...prev, country: '' })); // Clear the country error if any
    }

    const addOtherDocHandler = () => {
        const newDoc = {
            id: nextId // Assign the current value of nextId as the unique ID
        };
        setOtherDocs(prevDocs => [...prevDocs, newDoc]);
        setNextId(prevId => prevId + 1); // Increment the ID counter
    }

    const removeOtherDocHandler = (id: number) => {
        setOtherDocs(prevDocs => prevDocs.filter(doc => doc.id !== id));
    }

    return (
        <Overlay>
            <div className='w-[452px] relative max-h-[90vh] bg-white flex justify-center flex-col mt-3xl rounded-lg'>
                <div className='w-full py-xl px-xl border-b-[1px] '>
                    <div className='flex justify-center bg-[#FBFBFB] w-4xl h-4xl items-center rounded-full'>
                        <div className='flex justify-center bg-[#F2F2F2] w-3xl h-3xl items-center rounded-full'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M7.5 6H6V9H7.5V6Z" fill="#808080" />
                                <path d="M7.5 10.5H6V13.5H7.5V10.5Z" fill="#808080" />
                                <path d="M12 6H10.5V9H12V6Z" fill="#808080" />
                                <path d="M12 10.5H10.5V13.5H12V10.5Z" fill="#808080" />
                                <path d="M7.5 15H6V18H7.5V15Z" fill="#808080" />
                                <path d="M12 15H10.5V18H12V15Z" fill="#808080" />
                                <path d="M22.5 10.5C22.5 10.1022 22.342 9.72064 22.0607 9.43934C21.7794 9.15804 21.3978 9 21 9H16.5V3C16.5 2.60218 16.342 2.22064 16.0607 1.93934C15.7794 1.65804 15.3978 1.5 15 1.5H3C2.60218 1.5 2.22064 1.65804 1.93934 1.93934C1.65804 2.22064 1.5 2.60218 1.5 3V22.5H22.5V10.5ZM3 3H15V21H3V3ZM16.5 21V10.5H21V21H16.5Z" fill="#808080" />
                            </svg>
                        </div>
                    </div>
                    <div className='text-black font-extralight text-xl font-inter mt-l'>Company Details</div>
                    <div className='text-black font-extralight text-m font-inter'>Fill in the details</div>
                </div>
                <div className={`overflow-scroll mx-xl hide-scrollbar ${next ? 'flex-1' : 'h-auto'}`}>
                    <div className='py-l pb-xl '>
                        <div className='w-auto  '>
                            <label htmlFor="company" className="block text-sm font-light text-gray-700">
                                Company name<span className='pl-xs text-negativeBold'>*</span>
                            </label>
                            <input
                                id="company"
                                type='text'
                                className={`w-full mt-s py-s px-[15px] text-black  border-b-2 focus:outline-none focus:ring-transparent  ${error.company ? 'border-red-500' : 'border-gray-300'}`}
                                value={companyName}
                                onChange={(e) => handleCompanyNameChange(e.target.value)}
                            />
                            {error.company && <div className="text-xs text-negativeBold">{error.company}</div>}
                        </div>
                        <div className='w-auto mt-xl'>
                            <label htmlFor="country" className="block text-sm font-light text-gray-700">
                                Country of Origin<span className='pl-xs text-negativeBold'>*</span>
                            </label>
                            <select
                                id="country"
                                value={selectedCountry}
                                onChange={(e) => handleCountryChange(e.target.value)}
                                className={`mt-s block w-full font-light pl-3 pr-10 py-2 border-b-2 text-black text-base ${error.country ? 'border-red-500' : 'border-brand1-500'} focus:outline-none focus:ring-transparent  sm:text-sm `}
                            >
                                <option value="">Select Country</option>
                                {props.countryData.map((country: any) => (
                                    <option key={country.ID} value={country.ID}>
                                        {country.Name}
                                    </option>
                                ))}
                            </select>
                            {error.country && <div className="text-xs text-negativeBold">{error.country}</div>}
                        </div>
                    </div>
                    {next && <>
                        <div className='py-l border-t-[1px]'>
                            <div className='text-black font-extralight text-xl font-inter mt-l  '>Enter following details</div>
                            <div className='w-auto mt-m' id="UID">
                                <label htmlFor="country" className="block text-sm font-extralight text-gray-700">
                                    Enter your UID <span className='pl-xs text-negativeBold'>*</span>
                                </label>
                                <input type='text' placeholder='GST Number' className='w-full mt-s py-s px-[15px] text-black  border-b-2 focus:outline-none focus:ring-transparent ' onChange={(e) => handleUIDChange(e.target.value)} />
                                {error.uid && <div className="text-xs text-negativeBold">{error.uid}</div>}
                            </div>
                        </div>
                        <div className='py-l border-b-2 '>
                            <div className='text-black font-extralight text-xl font-inter'>List of documents</div>
                            <div className='w-auto mt-s'>
                                <label htmlFor="country" className="block text-sm font-extralight text-gray-700">
                                    Upload and attach documents of the company.<span className='pl-xs text-negativeBold'>*</span>
                                </label>
                            </div>
                        </div>
                        <div className='flex flex-col gap-l my-l'>
                            {requiredDoc.map((doc: any, index: any) => (
                                <DocList doc={doc} key={index} id={"M-" + index} files={files} addFiles={addFiles} removeFile={() => removeFile("M-" + index)} status={requiredDocStatus} />
                            ))}
                        </div>
                        <div className='py-l border-b-2 '>
                            <div className='text-black font-extralight text-xl font-inter'>Other documents</div>
                            <div className='w-auto mt-s'>
                                <label htmlFor="country" className="block text-sm font-extralight text-gray-700">
                                    Upload and attach documents of the company.
                                </label>
                            </div>
                        </div>
                        <div className='flex flex-col gap-l my-l'>
                            {otherDocs.map(doc => (
                                <OtherDocList key={doc.id} id={"O-" + doc.id} addFiles={addFiles} removeFile={() => removeFile("O-" + doc.id)} removeDoc={() => removeOtherDocHandler(doc.id)} />
                            ))}
                        </div>
                        <div id="add-other-doc" className='bg-neutral-300 px-l cursor-pointer py-m flex flex-col items-center justify-center mb-l rounded-lg border-2 border-dashed' onClick={addOtherDocHandler}>
                            <div className='flex justify-center bg-[#FBFBFB] w-4xl h-4xl items-center rounded-full'>
                                <div className='flex justify-center bg-[#F2F2F2] w-3xl h-3xl items-center rounded-full'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 9L3.705 9.705L7.5 5.915V15H8.5V5.915L12.295 9.705L13 9L8 4L3 9Z" fill="#1A1A1A" />
                                        <path d="M3 4V2H13V4H14V2C14 1.73478 13.8946 1.48043 13.7071 1.29289C13.5196 1.10536 13.2652 1 13 1H3C2.73478 1 2.48043 1.10536 2.29289 1.29289C2.10536 1.48043 2 1.73478 2 2V4H3Z" fill="#1A1A1A" />
                                    </svg>
                                </div>
                            </div>
                            <div className=' font-semibold text-tertiary text-m font-inter mt-l'>Click to upload and attach documents</div>
                            <div className='text-neutral-1000 font-extralight text-m font-inter'>PDF, DOC, jpeg, png (max. 200mb)</div>
                        </div>
                    </>}

                </div>

                <div className='flex py-l px-xl gap-l  border-t-2 justify-end'>
                    <button className='px-xl py-l bg-neutral-1000 rounded-xl hover:bg-neutral-1200' onClick={closeHandler}>Cancel</button>
                    <button className='px-xl py-l bg-brand1-500 rounded-xl hover:bg-brand1-700' onClick={next ? onSubmitClick : onClickNextHandler}>
                        {next ? 'Submit' : 'Next'}
                    </button>
                </div>
                <div className='absolute top-3 right-3 cursor-pointer' onClick={closeHandler}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g opacity="0.5">
                            <path d="M18 7.05L16.95 6L12 10.95L7.05 6L6 7.05L10.95 12L6 16.95L7.05 18L12 13.05L16.95 18L18 16.95L13.05 12L18 7.05Z" fill="black" />
                        </g>
                    </svg>
                </div>
            </div>
        </Overlay>
    )
}

export default Details