'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axiosApi from "@/utils/axios-api";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import { encryptString } from "@/utils/enc-utils";
import AdminLayout from "@/components/layouts/admin";
import { customToast } from "@/components/ui/customToast";

const Page = () => {
    const [accountNumber, setAccountNumber] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            const requestBody = { puro_account_number: accountNumber };
            let encryptedPayload = {};
            if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            const response = await axiosApi.auth.post(API_ENDPOINTS.puroAccount, {
                data: encryptedPayload
            });
            if (response.status === 200) {
                customToast.success(response.data.message);
                handleBack();
            } else {
                customToast.error(response.data.message || "Failed to resend verification email. Please try again.");
            }
        }
        catch (e) {
            console.error(e);
        }

        console.log("Submitted Account Number:", accountNumber);
        // Add your form submission logic here
    };

    const handleBack = () => {
        router.push('/project-onboarding');
    };

    return (
        <AdminLayout>
            <div className="flex flex-col items-center  min-h-screen pt-3xl overflow-hidden bg-white relative">
                <div className="w-1/2 p-xl flex flex-col items-center  gap-10xl ">
                    <div className="border-2 p-xl rounded-xl ">
                        <svg height="60" viewBox="0 0 147 79.5" xmlns="http://www.w3.org/2000/svg">
                            <circle fill="#0331C0" cx="141.2" cy="15.5" r="5.8" />
                            <path fill="#0331C0"
                                d="M78.8 49.9c-.6 0-1.2.1-1.2.1-.8.1-1.6.3-2.4.7-1 .5-1.8 1.1-2.6 1.9-1 1.1-1.7 2.4-1.9 3.9-.1.8-.1 2.3-.1 2.3v20.5h7.5v-23h7.9v-6.5h-7.2zM0 64.5c0-8.6 6.3-15 15.3-15s15.2 6.3 15.2 15v2.4H7.2c.9 4.1 4.1 6.3 8.1 6.3 3.1 0 5.3-.9 6.7-2.7h7.3c-2.1 5.4-7.3 8.9-14 8.9C6.3 79.4 0 73.1 0 64.5zm23.3-3.1c-1.1-3.8-4.2-5.7-7.9-5.7-3.9 0-6.9 2-7.9 5.7h15.8zM91.9 67.8V40.9h6.9v9h9.6v6.2h-9.6v11.6c0 3.8 2 5.3 4.8 5.3s4.8-1.4 4.8-5.3V67h6.9v.7c0 7.9-4.7 11.7-11.6 11.7-6.8 0-11.5-3.8-11.5-11.6zM145.9 57.1c-.7-2-2-3.7-3.8-4.9-1.8-1.2-3.9-1.8-6-2-2-.2-4-.2-6 0-1 .1-2 .4-2.9.7v-10h-7.5v38.6h7.5V63.1h12.1v22.4h7.4V68.6c0-1.9-.2-3.7-.8-5.5zM64.6 64.4c0-8.3-6.8-15.1-15.1-15.1s-15.1 6.8-15.1 15.1 6.8 15.1 15.1 15.1c3.3 0 6.3-1.1 8.8-2.9v2.9h6.3V64.4zm-15.1 7.9c-4.4 0-7.9-3.5-7.9-7.9s3.5-7.9 7.9-7.9 7.9 3.5 7.9 7.9-3.5 7.9-7.9 7.9zM76.9.7s-.6 0-1.2.1c-.8.1-1.6.3-2.4.7-1 .5-1.8 1.1-2.6 1.9-1 1.1-1.7 2.4-1.9 3.9-.1.8-.1 2.3-.1 2.3v20.5h7.4V7.2H84V.7h-7.1zM62.8.7h-7.5v22.4H43.3V.7h-7.4s0 11.3 0 16.9c0 1.9.2 3.8.8 5.6.7 2 2 3.7 3.8 4.9 1.8 1.2 3.9 1.8 6 2 2 .2 4 .2 6 0 2-.3 4-.9 5.7-2 1.8-1.2 3.1-2.8 3.8-4.9.6-1.8.8-3.7.8-5.6V.7M29.8 12.9c-.2-1.6-.7-3-1.4-4.5-.9-1.9-2.3-3.5-3.9-4.9-1.8-1.5-3.8-2.5-6-3-1.8-.4-3.7-.6-5.5-.3C11.2.3 9.6.9 8 1.8c-.2.1-.5.3-.7.5-.2.1-.4.2-.6.4V.6H0v41.5h7.4V27.7s1.7 1.4 3 1.8c2.3.7 4.6.8 7 .4 1.6-.3 3.2-.8 4.6-1.6 2.1-1.2 3.9-2.8 5.3-4.7 1.2-1.7 2.1-3.7 2.4-5.8.2-.6.2-2.3 0-3.9zM22 18.1c-.1.2-.1.3-.2.4-.1.2-.2.4-.3.5l-.1.2c-.4.6-.8 1.1-1.3 1.6l-.1.1c-.3.2-.5.5-.8.7-.3.2-.5.3-.8.5-.1.1-.2.1-.4.2-.2.1-.4.2-.6.2-.2.1-.3.1-.5.2-.2.1-.5.1-.7.2h-.3c-.4 0-.7.1-1.1.1-.4 0-.8 0-1.1-.1-2.4-.4-4.4-1.7-5.6-3.7v-.1c-.1-.2-.3-.5-.4-.7l-.1-.2c-.4-.9-.6-2-.6-3s.2-2.1.6-3v-.1c.1-.2.2-.4.3-.6l.1-.1.3-.4c1-1.6 2.5-2.7 4.3-3.3h.3c.2-.1.4-.1.6-.1.5-.1 1-.2 1.5-.2s1 .1 1.5.2h.1c.3.1.6.1.8.2.3.1.5.2.8.3h.1c1.3.6 2.4 1.6 3.2 2.8.3.4.5.8.7 1.2.4.9.6 2 .6 3s-.2 2.1-.6 3zM102.9 30.1c-8.3 0-15.1-6.8-15.1-15.1S94.6 0 102.9 0 118 6.8 118 15.1s-6.8 15-15.1 15zm0-22.9c-4.4 0-7.9 3.5-7.9 7.9s3.5 7.9 7.9 7.9c4.4 0 7.9-3.5 7.9-7.9s-3.5-7.9-7.9-7.9z" />
                        </svg>
                    </div>
                    <div className="w-[70%] min-w-[300px]">
                        <h2 className=" text-f-3xl font-semibold mb-4 text-black text-center">Enter Puro Account Number</h2>
                        <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="Enter Puro Account Number"
                            className="border mt-2xl border-gray-300 rounded-md py-s px-m text-black w-full focus:outline-none  hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500"
                        />
                        <div className="mt-2xl flex gap-4 w-full  justify-between">
                            <button
                                onClick={handleBack}
                                className="  px-2xl py-m rounded-md text-neutral-900 border border-neutral-500 hover:text-black hover:border-black">
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-brand1-400 text-white px-2xl py-m rounded-md hover:bg-brand1-500">
                                Submit
                            </button>

                        </div>
                    </div>

                </div>


            </div>
        </AdminLayout>
    );
};

export default Page;
