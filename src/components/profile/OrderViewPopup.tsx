import React, { useState } from 'react';
import {Close} from "@carbon/icons-react";
import {formatNumber} from "@/utils/number-utils";

const OrderViewPopup: React.FC<any> = ({ setIsOpen, isOpen, details, role }: any) => {


    const handleClose = () => {
        setIsOpen(false);
    };

    const certificateDownloadHandler = (name: any) => {
        const certificateUrl = `${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/project-images/${name}`;

        // Create an anchor element dynamically and trigger the download
        const link = document.createElement('a');
        link.href = certificateUrl;
        link.download = name; // Forces the browser to download the file
        link.target = '_self'; // Ensures it doesn't open a new tab
        document.body.appendChild(link); // Append the anchor to the body
        link.click(); // Programmatically trigger a click
        document.body.removeChild(link);
    }

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 sc-md:p-0">
                    <div className="relative w-full max-w-2xl  bg-white rounded-lg shadow-lg">
                        <div className='flex justify-between p-xl rounded-t-lg border-b  items-center'>
                            <div className='text-black text-f-xl font-normal'>
                                Order Detail {role}
                            </div>
                            <button
                                className=" text-gray-500 hover:text-gray-700"
                                onClick={handleClose}
                            >
                                <Close className="w-6 h-6" />
                            </button>
                        </div>

                        <div className='p-xl  h-[65vh] overflow-y-scroll'>
                            {/* <div className="text-center flex flex-col gap-xl"> */}
                            {/* <div className="text-f-3xl font-bold text-black">Complete your order</div> */}
                            {/* <p className="text-gray-700">Order Success!</p> */}
                            {/* <div className="text-f-l text-gray-500">
                                    Kindly do the payment in 24 hours. <br />
                                    Check your registered email ID for more details.
                                </div>
                                <div className='text-f-m font-semibold text-black py-s'> Order Details</div>

                            </div> */}

                            <div className="border-gray-200 ">
                                <table className="w-full text-sm text-gray-700">
                                    <tbody>
                                        <tr className='py-3'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">Project Name</td>
                                            <td className="py-1 text-right text-neutral-1400">{details.project_name}</td>
                                        </tr>
                                        <tr className='border-t py-3'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">{role == "seller" ? "Buyer Name" : "Seller Name"}</td>
                                            <td className="py-1 text-right text-neutral-1400">{role == "seller" ? details.buyer_organization_name : details.seller_organization_name}</td>
                                        </tr>
                                        <tr className='border-t py-3'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">{role != "seller" ? "Invoice" : "Invoice"}</td>
                                            <td className="py-1 text-right text-neutral-1400">{role != "seller" ? details.buyer_invoice : details.seller_invoice}</td>
                                        </tr>
                                        <tr className='border-t py-3'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">Order Number</td>
                                            <td className="py-1 text-right text-neutral-1400">{details.order_id}</td>
                                        </tr>


                                        {/* no_of_credits
                                        platform_fees
                                        total_discount
                                        total_price_exclusive
                                        total_price_inclusive
                                        total_tax */}

                                    </tbody>
                                </table>
                            </div>
                            <div className='border-gray-200'>
                                <div className='flex w-full mt-xl items-center ju'>
                                    <div className='flex flex-1'>
                                        <div className='flex-1 bg-gray-300 text-center border border-gray-500'>Vintage Year</div>
                                        <div className='flex-1 bg-gray-300 text-center border border-gray-500'>Total Credit (tCO₂e)</div>
                                        <div className='flex-1 bg-gray-300 text-center border border-gray-500'>Total Price ($)</div>
                                    </div>
                                </div>
                                {details.vintages.map((vintage: any, index: any) => (
                                    <div className='flex w-full ' key={index}>
                                        <div className='flex flex-1'>
                                            <div className='flex-1 bg-white text-center border border-gray-500'>{vintage.year ? vintage.year : 'NA'}</div>
                                            <div className='flex-1 bg-white text-center border border-gray-500'>{formatNumber(vintage.total_credits, 3)}</div>
                                            <div className='flex-1 bg-white text-center border border-gray-500'>{formatNumber(vintage.total_price, 2)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>


                            <div className=" border-gray-200  mt-xl">
                                <table className="w-full text-sm text-gray-700">
                                    <tbody>

                                        <tr className='border-b py-s'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">Credits</td>
                                            <td className="py-1 text-right text-neutral-1400">{formatNumber(details.no_of_credits, 3)} tCO₂e</td>
                                        </tr>
                                        <tr className='border-b py-s'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">Sub Amount </td>
                                            <td className="py-1 text-right text-neutral-1400">${formatNumber(details.total_price_exclusive, 2)}</td>
                                        </tr>
                                        <tr className='border-b py-s'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">Service Fee </td>
                                            <td className="py-1 text-right text-neutral-1400">${formatNumber(details.platform_fees, 2)}</td>
                                        </tr>
                                        <tr className='border-b py-s'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">Service Fee Gst </td>
                                            <td className="py-1 text-right text-neutral-1400">${formatNumber(details.platform_fees_tax, 2)}</td>
                                        </tr>
                                        <tr className='border-b py-s'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">Discount </td>
                                            <td className="py-1 text-right text-neutral-1400">${formatNumber(details.total_discount, 2)}</td>
                                        </tr>
                                        <tr className='border-b py-s'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">Gst </td>
                                            <td className="py-1 text-right text-black"> ${formatNumber(details.total_tax, 2)}</td>
                                        </tr>
                                        <tr className='border-b py-s'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">Final Amount </td>
                                            <td className="py-1 text-right text-black">${formatNumber(details.total_price_inclusive, 2)}</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>



                        <div className='flex justify-end px-xl py-l border-t'>


                            <div className=" flex justify-end space-x-2">
                                {details.certificate_name && <button
                                    onClick={() => { certificateDownloadHandler(details.certificate_name) }}
                                    className="px-m py-s text-f-xs font-normal text-gray-700 bg-gray-100 border rounded hover:bg-gray-200"
                                >
                                    Download Certificate
                                </button>}
                                <button
                                    onClick={handleClose}
                                    className="px-m py-s text-f-xs font-normal text-gray-700 bg-gray-100 border rounded hover:bg-gray-200"
                                >
                                    Cancel
                                </button>

                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default OrderViewPopup;
