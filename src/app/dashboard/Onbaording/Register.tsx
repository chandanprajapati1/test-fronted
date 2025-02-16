'use client'
import React, { useState } from 'react'
import Overlay from './Overlay'
import { useDispatch } from 'react-redux';
import { hide } from '@/app/store/slices/onBoardingSlice';
import { getAuthCredentials } from '@/utils/auth-utils';

const Register = (props: any) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    function extractCountryDetails(data: any) {
        return data.data.Country.map((country: any) => ({
            ID: country.ID,
            Name: country.Name,
            RequiredDocuments: country.RequiredDocuments.map((doc: any) => ({
                Name: doc.Name,
                Description: doc.Description,
                Required: doc.Required
            }))
        }));
    }

    const processHanlder = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Example API URL - replace with your actual endpoint
            const token = getAuthCredentials();
            const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/auth/country`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // Handle the response data as needed
            console.log(data);
            const countryDetails = extractCountryDetails(data);
            // Optionally update parent component state
            console.log("countryDetails", countryDetails)
            props.setCountryData(countryDetails)
            props.setHideCompanyInfo(false);
            dispatch(hide())
        } catch (error: any) {
            setError(error.message);
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const closeHandler = () => {
        dispatch(hide())
    }

    return (
        <Overlay>
            <div className='flex flex-col w-[400px] bg-white mt-3xl relative pt-xl rounded-t-l rounded-b-xl'>
                <div className=" flex flex-col items-center pb-l  px-xl ">
                    <div className='flex justify-center bg-[#FBFBFB] w-4xl h-4xl items-center rounded-full'>
                        <div className='flex justify-center bg-[#F2F2F2] w-3xl h-3xl items-center rounded-full' >
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
                    <div className='text-black font-light text-xl font-inter mt-l'>Register your company to proceed</div>
                    <div className='text-black font-light text-m font-inter'>Click on proceed to sell or buy credits</div>
                    <div className='absolute top-3 right-3 cursor-pointer' onClick={closeHandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g opacity="0.5">
                                <path d="M18 7.05L16.95 6L12 10.95L7.05 6L6 7.05L10.95 12L6 16.95L7.05 18L12 13.05L16.95 18L18 16.95L13.05 12L18 7.05Z" fill="black" />
                            </g>
                        </svg>
                    </div>
                </div>
                <div className='bg-white flex justify-center rounded-b-l border-t-2'>
                    <div className='bg-brand1-500 my-l mx-l rounded-lg w-48 py-l px-l font-inter font-light text-m text-center cursor-pointer hover:bg-brand1-700' onClick={processHanlder}>
                        {isLoading ? 'Loading...' : 'Proceed to Register'}
                    </div>
                </div>
                {error && <div className="text-negativeBold text-center mt-2">{error}</div>}
            </div>
        </Overlay>
    )
}

export default Register