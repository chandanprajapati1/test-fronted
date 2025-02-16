"use client";
import { customToast } from '@/components/ui/customToast';
import { API_ENDPOINTS } from '@/config/api-endpoint';
import axiosApi from '@/utils/axios-api';
import { encryptString } from '@/utils/enc-utils';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { setTimeout } from 'timers/promises';
import { formatNumber } from "@/utils/number-utils";
import AdminLayout from "@/components/layouts/admin";


const Page = () => {
    const pathname = usePathname();
    const [reloadKey, setReloadKey] = useState(0);
    const cartId = pathname.split("/").pop();
    const [negotiationDetail, setNegotiationDetail] = useState<any>();
    const [active, setActive] = useState(true);
    // const fetchCalledRef = useRef(false);
    const [hasChanged, setHasChanged] = useState(false);
    const router = useRouter();
    const fetchCalled = useRef(false);

    const fetchCartDetails = async () => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        try {
            const requestBody = { cart_id: cartId };
            let encryptedPayload = {};
            if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            const response = await axiosApi.project.post(API_ENDPOINTS.cart, {
                data: encryptedPayload,
            });

            if (response.status === 200) {
                console.log("fetchCartDetails", response.data.data.negotiation_details);
                setNegotiationDetail(response.data.data.negotiation_details);
            } else {
                customToast.error(response.data.message || "Unable to fetch Negotiation detail");
            }
        } catch (error) {
            console.error('Error during password reset request:', error);
        }
    };

    useEffect(() => {
        fetchCartDetails();
    }, [reloadKey])

    function backCartHandler() {
        router.push(`/cart`);
    }

    const handleAccept = (index: number) => {
        setNegotiationDetail((prevDetail: any) => {
            const updatedVintages = prevDetail.negotiation_vintages.map((vintage: any, i: number) =>
                i === index
                    ? {
                        ...vintage,
                        accepted: vintage.status == 2 ? true : !vintage.accepted, // Toggle accepted state
                        buyer_counter_price: !vintage.accepted
                            ? vintage.buyer_offer_price // Set counter price to offer price when checked
                            : '', // Retain counter price when unchecked
                    }
                    : vintage
            );

            const anyNonZero = updatedVintages.every((vintage: any) => parseFloat(vintage.status == 2 ? vintage.buyer_offer_price : vintage.buyer_counter_price) > 0);
            setHasChanged(anyNonZero); // Set `hasChanged` based on the condition

            return { ...prevDetail, negotiation_vintages: updatedVintages };
        });
    };

    const updatePriceHandler = async () => {

        if (!negotiationDetail) return;

        console.log("counterPriceChecker", negotiationDetail)
        let counterPriceChecker = negotiationDetail.negotiation_vintages.map((vintage: any, index: number) => {
            let value = Number(vintage.status === 2 ? vintage.buyer_offer_price : vintage.buyer_counter_price);
            console.log("value -- ", value)
            return value <= 0;
        });

        if (counterPriceChecker[0]) {
            customToast.info("Kindly confirm if you accept the offer or propose a counteroffer.")
            return;
        }

        const updates = negotiationDetail.negotiation_vintages.map((vintage: any, index: number) => ({
            vintage_id: vintage.vintage_id, // Use appropriate key for vintage ID
            offer_price: Number(vintage.buyer_offer_price),
            counter_price: Number(vintage.status == 2 ? vintage.buyer_offer_price : vintage.buyer_counter_price),
            status: vintage.status == 2 ? 2 : vintage.accepted ? 2 : 1, // Set status based on checkbox
        }));

        console.log("g--------", pathname)
        const allStatusTwoStatus = updates.every((update: any) => update.status === 2); // Check if all statuses are 2
        const payload = {
            negotiation_id: negotiationDetail._id,
            status: allStatusTwoStatus ? 3 : 2, // Add new status at negotiation level
            updates,
        };


        console.log("Payload to update:", payload);
        try {
            const requestBody = { ...payload };
            let encryptedPayload = {};
            if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            const response = await axiosApi.project.post(API_ENDPOINTS.buyer_update_negotiation, {
                data: encryptedPayload
            });

            if (response.status === 200) {
                console.log("updatePriceHandler", response, pathname)
                customToast.success("Price Updated Successfully.")
                setReloadKey(prevKey => prevKey + 1);
                fetchCalled.current = false;
                // setActive(false);
            } else {
                customToast.error(response.data.message || "Unable to fetch Negotiation detail");
            }
        } catch (error) {
            console.error('Error during password reset request:', error);
        }
    }

    function isNotZero(input: any) {
        // Convert the input to a number
        const number = parseFloat(input);

        // Check if it's a valid number and not zero
        return !isNaN(number) && number !== 0;
    }

    const handleInputChange = (index: number, value: string) => {
        // const newCounterPrice = Number(value);
        if (value as unknown as number > 999999) {
            return;
        }
        // Updated regex to allow only two decimal places
        const isValidDecimal = /^\d*\.?\d{0,2}$/.test(value);

        // Don't proceed if the input doesn't match our decimal pattern
        if (!isValidDecimal) {
            return;
        }

        setNegotiationDetail((prevDetail: any) => {


            const updatedVintages = prevDetail.negotiation_vintages.map((vintage: any, i: number) => {
                if (i === index && isValidDecimal) {
                    return { ...vintage, buyer_counter_price: value.trim() == "" ? 0 : value };
                }
                return vintage;
            });

            // Check if any `buyer_counter_price` is not zero
            const anyNonZero = updatedVintages.every((vintage: any) => Number(vintage.status == 2 ? vintage.buyer_offer_price : isNotZero(vintage.buyer_counter_price) ? vintage.buyer_counter_price : 0) !== 0);
            setHasChanged(anyNonZero); // Set `hasChanged` based on the condition
            console.log("handleInputChange", updatedVintages, anyNonZero)
            return { ...prevDetail, negotiation_vintages: updatedVintages };
        });
    };

    function validateBuyerCounterPrice(data: any) {
        console.log("validateBuyerCounterPrice", data)
        let allFieldsRequired = false;
        let counterShouldBeMore = false;

        for (let item of data) {
            if (item.status != 2 && ((item.buyer_counter_price === 0 && typeof item.buyer_counter_price === "number") || item.buyer_counter_price == "")) {
                allFieldsRequired = true;
            }
            if (item.status != 2 && item.buyer_counter_price === "0" && typeof item.buyer_counter_price === "string") {
                counterShouldBeMore = true;
            }
        }

        if (allFieldsRequired) {
            customToast.error("All field is required");
        } else if (counterShouldBeMore) {
            customToast.error("Counter will be more than 0");
        }

    }
    return (
        <AdminLayout>
            <div className='flex flex-col w-full justify-center mx-auto max-w-screen-sc-2xl text-black items-center p-6 '>
                <div className="flex flex-col gap-6 w-full">
                    <div className='text-f-5xl  text-neutral-1400 font-light'>

                        <span
                            className='pr-xl cursor-pointer'
                            onClick={() => {
                                backCartHandler();
                            }}
                        >
                            {`<-`}
                        </span> <span className='text-neutral-900'>Negotiations</span></div>
                    <div className='w-full p-xl bg-white border  rounded-lg'>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-neutral-1400">{negotiationDetail?.project_name.toUpperCase()}</h2>{/* 1 =created ,2= inprogress,3= completed,4=limitcorss, */} {negotiationDetail && (negotiationDetail.status != 1 || !active) &&
                                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm">{(negotiationDetail.status == 2 || !active) ? "In progress" : negotiationDetail.status == 3 ? "Completed" : negotiationDetail.status == 4 ? "Limit Crossed" : ""}</span>}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300 whitespace-nowrap">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="border text-neutral-1400 border-gray-300 px-s text-f-m text-start py-m">Vintage</th>
                                        <th className="border text-neutral-1400 border-gray-300 px-s text-f-m py-m text-start">No. of Credit (tCO₂e)</th>
                                        <th className="border text-neutral-1400 border-gray-300 px-s text-f-m text-start  py-m">Price per Credit ($)</th>
                                        {negotiationDetail && negotiationDetail.status != 3 &&
                                            <th className="border text-neutral-1400 border-gray-300 px-s text-f-m text-start  py-m">Counter Price ($)</th>}
                                        {active && negotiationDetail && negotiationDetail.status != 3 && negotiationDetail.nagotiation_count <= 3 && negotiationDetail.updated_by != "buyer" &&
                                            <th className="border text-neutral-1400 border-gray-300 px-s text-f-m text-start  py-m">Your Offer Price ($)</th>}
                                        {active && negotiationDetail && (negotiationDetail.status != 1 && negotiationDetail.status != 3) && negotiationDetail.nagotiation_count <= 3 && negotiationDetail.updated_by != "buyer" &&
                                            <th className="border text-neutral-1400 border-gray-300 px-s text-f-m text-start py-m">Status</th>}
                                    </tr>
                                </thead>
                                {negotiationDetail && <tbody>
                                    {negotiationDetail.negotiation_vintages.map((vintage: any, index: any) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 px-s text-f-m text-start py-m">{vintage.year}</td>
                                            <td className="border border-gray-300 px-s text-f-m text-start  py-m">{formatNumber(vintage.total_credit, 3)}</td>
                                            <td className={`border border-gray-300 px-s text-f-m text-start  py-m ${negotiationDetail.status == 3 && "bg-brand1-100"}`}>{formatNumber(vintage.buyer_offer_price, 2)}</td>
                                            {negotiationDetail && negotiationDetail.status != 3 &&
                                                <td className="border border-gray-300 px-s text-f-m text-start  py-m ">{vintage.status == 2 ? formatNumber(vintage.buyer_offer_price, 2) : formatNumber(vintage.buyer_counter_price, 2)}</td>} {active && negotiationDetail && negotiationDetail.status != 3 && negotiationDetail.nagotiation_count <= 3 && negotiationDetail.updated_by != "buyer" &&
                                                    <td className="border border-gray-300 px-s text-f-m text-start  py-m">
                                                        {vintage.status != 2 ? <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-brand1-500 hover:border-brand1-600"
                                                            placeholder="Enter Offer Price"
                                                            value={vintage.buyer_counter_price || ''}
                                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                                            disabled={vintage.accepted}
                                                        /> : formatNumber(vintage.buyer_offer_price, 2)}
                                                    </td>} {active && negotiationDetail && (negotiationDetail.status != 1 && negotiationDetail.status != 3) && negotiationDetail.nagotiation_count <= 3 && negotiationDetail.updated_by != "buyer" &&
                                                        <td className="border border-gray-300 px-s text-f-m text-start py-m">
                                                            {vintage.status != 2 ? <div className="flex items-center auth space-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    className="h-4 w-4 checked"
                                                                    checked={vintage.accepted}
                                                                    onChange={() => {
                                                                        setHasChanged(!vintage.accepted)
                                                                        handleAccept(index)
                                                                    }}
                                                                /> <span>{vintage.accepted ? 'Accepted' : 'Accept'}</span>
                                                            </div> : "Accepted"}
                                                        </td>}
                                        </tr>))}
                                </tbody>}
                            </table>
                        </div>
                        {active && negotiationDetail && negotiationDetail.status != 3 && negotiationDetail.nagotiation_count <= 3 && negotiationDetail.updated_by != "buyer" &&
                            <div className="mt-4 flex justify-end space-x-4">
                                {/* <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                Submit Offer
                            </button> */}
                                <button className={` text-white px-4 py-2 rounded ${hasChanged ? "bg-brand1-500 hover:bg-brand1-600" : "bg-brand1-500"} `} onClick={(!hasChanged) ? () => { validateBuyerCounterPrice(negotiationDetail.negotiation_vintages) } : updatePriceHandler}>
                                    Update Price
                                </button>

                            </div>}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default Page