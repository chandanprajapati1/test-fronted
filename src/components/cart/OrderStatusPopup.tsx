import {useEffect, useState} from 'react';
import { customToast } from '../ui/customToast';
import axiosApi from '@/utils/axios-api';
import { API_ENDPOINTS } from '@/config/api-endpoint';
import toCapitalizedCase from '@/utils/capitalized-case';
import { encryptString } from '@/utils/enc-utils';
import {formatNumber} from "@/utils/number-utils";

const OrderStatusPopup: React.FC<any> = ({ setIsOpen, isOpen, details, setOrderCreated }: any) => {
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (isOpen){
            const scrollPosition = window.scrollY;

            // Save current scroll position and prevent scrolling
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflowY = 'scroll';
            document.body.style.paddingRight = 'var(--scrollbar-width)';

            // Cleanup function when modal unmounts
            return () => {
                const scrollY = document.body.style.top;
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflowY = '';
                document.body.style.paddingRight = '';
                // window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'instant' // This prevents any smooth scrolling
                });
            };
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
    };
    const OrderHandler = async () => {
        try {
            const requestBody = { cart_item_id: details._id };
            let encryptedPayload = {};
            if(Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0){
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            const response = await axiosApi.project.post(API_ENDPOINTS.order, {
                data: encryptedPayload
            });

            if (response.status === 200) {
                setIsOpen(false);
                setOrderCreated(true)
                customToast.success("Order placed Successfully.");

            } else {
                customToast.error(response.data.message || "Order placed Failed.");
            }
        } catch (error) {
            console.error('Error during password reset request:', error);
        }
    }

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="relative w-full max-w-md  bg-white rounded-lg shadow-lg">
                        <div className='flex justify-between p-xl rounded-t-lg border-b  items-center'>
                            <div className='text-neutral-1400 text-f-xl font-normal'>
                                Order status
                            </div>
                            <button
                                className=" text-gray-500 hover:text-gray-700"
                                onClick={handleClose}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className='p-xl  h-[65vh] overflow-y-scroll'>
                            <div className="text-center flex flex-col gap-xl">
                                <div className="text-f-3xl font-bold text-neutral-1400">Complete your order</div>
                                {/* <p className="text-gray-700">Order Success!</p> */}
                                <div className="text-f-l text-gray-500">
                                    Kindly do the payment in 24 hours. <br />
                                    Check your registered email ID for more details.
                                </div>
                                <div className='text-f-m font-semibold text-neutral-1400 py-s'> Order Details</div>

                            </div>

                            <div className="mx-l  border-gray-200">
                                <table className="w-full text-sm text-gray-700">
                                    <tbody>
                                        <tr className='border-t py-s'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">Project</td>
                                            <td className="py-1 text-right text-neutral-1400">{details.project_name.length > 20 ? toCapitalizedCase(details.project_name.slice(0, 20) + "..") : toCapitalizedCase(details.project_name)}</td>
                                        </tr>

                                        <tr className='border-t py-s'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">Total Credits (tCO₂e)</td>
                                            <td className="py-1 text-right text-neutral-1400">{formatNumber(details.total_credits, 3)}</td>
                                        </tr>
                                        <tr className='border-t py-s'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">Credits Price</td>
                                            <td className="py-1 text-right text-neutral-1400">${formatNumber(details.total_price_exclusive, 2)} </td>
                                        </tr>
                                        <tr className='border-t py-s'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">Service Fee</td>
                                            <td className="py-1 text-right text-neutral-1400">${formatNumber(details.platform_fees, 2)}</td>
                                        </tr>
                                        <tr className='border-t py-s'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">Service Fee GST</td>
                                            <td className="py-1 text-right text-neutral-1400">${formatNumber(details.platform_fees_tax, 2)}</td>
                                        </tr>
                                        <tr className='border-t py-s'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">GST</td>
                                            <td className="py-1 text-right text-neutral-1400">${formatNumber(details.tax, 2)}</td>
                                        </tr>
                                        <tr className='border-t py-s'>
                                            <td className="py-1 font-normal text-f-m text-gray-500">Net Total Amount</td>
                                            <td className="py-1 text-right text-neutral-1400">${formatNumber(details.total_price_inclusive, 2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className='flex flex-col sc-xs:flex-row  justify-between px-xl py-l gap-6  border-t'>
                            <div className=" flex auth  items-center">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="w-6 h-6 mr-2 border border-neutral-300 rounded text-green-600 focus:ring-green-500"
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                />
                                <label htmlFor="terms" className="ml-s text-f-m text-gray-700">
                                    Agree with terms & conditions
                                </label>
                            </div>

                            <div className=" flex justify-end space-x-2">
                                <button
                                    onClick={handleClose}
                                    className="px-m py-s text-f-xs font-normal text-gray-700 bg-gray-100 border rounded hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={OrderHandler}
                                    disabled={!isChecked}
                                    className={`px-m py-s text-f-xs font-normal text-white rounded ${isChecked
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-gray-300 cursor-not-allowed'
                                        }`}

                                >
                                    Ok
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default OrderStatusPopup;
