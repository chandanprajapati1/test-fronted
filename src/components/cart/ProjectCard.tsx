import React, { FC, useEffect, useState } from 'react';
import OrderStatusPopup from './OrderStatusPopup';
import { useRouter } from 'next/navigation';
import axiosApi from '@/utils/axios-api';
import { API_ENDPOINTS } from '@/config/api-endpoint';
import { encryptString } from '@/utils/enc-utils';
import { Close, Partnership } from '@carbon/icons-react';
import { formatNumber } from "@/utils/number-utils";


interface ProjectCardProps {
	breakdown: any;
	carItem: any;
	details: any;
	countries: any
	refreshHandler: any
}

const ProjectCard: FC<ProjectCardProps> = ({ breakdown, carItem, details, countries, refreshHandler }) => {

	const [countryName, setCountryName] = useState()
	const [activeBuyButton, setActiveBuyButton] = useState(false);
	const [activeNegotiationButton, setActiveNegotiationButton] = useState();
	const [cartStatus, setCartStatus] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const [orderCreated, setOrderCreated] = useState(false)
	const [stockAvaliable, setStockAvaliable] = useState(true)
	const router = useRouter();

	useEffect(() => {
		setActiveBuyButton((details.cart_status == 1 || details.cart_status == 4) && details.stocks_available);
		setActiveNegotiationButton((details.cart_status == 1 || details.cart_status == 2 || details.cart_status == 3 || details.cart_status == 5) && details.stocks_available);
		setCartStatus(details.cart_status)
		setStockAvaliable(areStocksAvailable(details.vintages))
		getCountryNameById()
	}, [])

	function areStocksAvailable(vintages: any) {
		return vintages.every((vintage: any) => vintage.stocks_available !== false);
	}

	function getCountryNameById() {
		console.log("countries", countries)
		const country = countries.find((country: any) => country._id === details?.country_id);
		setCountryName(country ? country.name : 'Country not found')
	}

	function negotiationHandler(id: any) {
		router.push(`/negotiation/${id}`);
	}

	function initiateBuyingHandler() {
		setIsOpen(true)
	}

	const deleteHandler = async (id: any) => {
		try {
			const requestBody = { cart_id: id };
			let encryptedPayload = {};
			if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
				encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
			}
			const response = await axiosApi.project.post(API_ENDPOINTS.deleteCart, {
				data: encryptedPayload
			});

			if (response.status === 200) {
				refreshHandler()
			}
		} catch (error) {
			console.error(`Error : Unable to delete cart ${id}:`, error);
		}

	}

	return (<div className="fles sm:flex-col bg-white shadow-lg rounded-t-2xl rounded-b-2xl border  ">
		{/* Header Section */}
		<OrderStatusPopup setIsOpen={setIsOpen} isOpen={isOpen} details={details} setOrderCreated={setOrderCreated} />
		<div className="flex flex-col sc-sm:flex-row items-center m-xl h-full gap-l">
			<div className="w-full sc-sm:w-[230px] h-[160px] bg-blue-900 rounded-xl">
				<img src={`${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/project-images/${details?.project_background_image}`} alt="Project" className='w-full h-full bg-cover rounded-xl' />
			</div>
			<div className='flex w-full flex-1 flex-col gap-s '>
				<div className='flex items-start justify-between'>
					<div className="text-f-2xl text-neutral-1400 font-semibold">{details?.project_name}</div>
					{(cartStatus == 1 || cartStatus == 4 || !stockAvaliable) && !orderCreated &&
						<div className='flex gap-l items-center'>
							{/* <div className='flex gap-s items-center bg-white px-m py-s rounded-lg border border-brand1-500'>
                                <div className='text-black font-semibold text-f-m '>Download Estimation</div>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M6.5 10.5H13.085L11.795 11.795L12.5 12.5L15 10L12.5 7.50001L11.795 8.20501L13.085 9.50001H6.5V10.5Z" fill="black" />
                                        <path d="M11 7.00001V5.00001C11.0004 4.93421 10.9878 4.86897 10.9629 4.80806C10.938 4.74714 10.9013 4.69173 10.855 4.64501L7.355 1.14501C7.30828 1.09867 7.25287 1.06201 7.19195 1.03712C7.13103 1.01224 7.0658 0.999628 7 1.00001H2C1.73478 1.00001 1.48043 1.10537 1.29289 1.2929C1.10536 1.48044 1 1.73479 1 2.00001V14C1 14.2652 1.10536 14.5196 1.29289 14.7071C1.48043 14.8947 1.73478 15 2 15H10C10.2652 15 10.5196 14.8947 10.7071 14.7071C10.8946 14.5196 11 14.2652 11 14V13H10V14H2V2.00001H6V5.00001C6 5.26523 6.10536 5.51958 6.29289 5.70712C6.48043 5.89465 6.73478 6.00001 7 6.00001H10V7.00001H11ZM7 5.00001V2.20501L9.795 5.00001H7Z" fill="black" />
                                    </svg>
                                </div>
                            </div> */}
							<button className='flex gap-s items-center bg-neutral-100 px-l py-m rounded-lg ' onClick={() => deleteHandler(details._id)}>
								<div className='text-neutral-1400 font-semibold text-f-xs '>Remove</div>
								<Close className='w-4 h-4 text-neutral-1000' />
							</button>
						</div>}
				</div>

				<div className="text-f-m text-neutral-1400">{details?.country_name}</div>
				<div className="text-gray-600 text-sm mt-2 line-clamp-3">
					{details?.project_description ? details.project_description : ""}
				</div>
				<div className="flex gap-[2px]">
					{details && details?.sdg_goal && details?.sdg_goal.map((goal: any, index: any) => (
						<span key={index} className="bg-red-200 text-red-600  text-xs font-semibold w-xl h-xl">
							<img src={`${process.env.NEXT_PUBLIC_ESG_GOAL_ENDPOINT}/${goal.hero_image.name}`} />
						</span>))}
				</div>
			</div>
		</div>

		{/* Table Section */} {details.vintages && <div className="w-full overflow-x-auto">
			<table className="w-full text-left border-t border-b border-gray-200 ">
				<thead className="bg-[#F8FAFC] ">
					<tr className="font-semibold text-sm text-gray-700">
						<th className=" px-4 py-3 border border-l-0">Vintage</th>
						<th className=" px-4 py-3 border whitespace-nowrap ">Number of Credits (tCO₂e)</th>
						<th className=" px-4 py-3 border whitespace-nowrap ">Rate ($)</th>
						<th className=" px-4 py-3 border  border-r-0 whitespace-nowrap ">Amount ($)</th>
					</tr>
				</thead>
				<tbody>
					{details.vintages.map((vintage: any, index: any) => (
						<tr key={index} className="border-t border-gray-200 ">
							<td className={`px-4 py-3 text-start font-semibold text-gray-600 ${index % 2 == 0 ? 'bg-white' : 'bg-neutral-50'}`}>{vintage.year}</td>
							<td className={`px-4 py-3 text-start text-gray-600 ${index % 2 == 0 ? 'bg-white' : 'bg-neutral-50'}`}>{formatNumber(vintage.no_of_credits, 3)}</td>
							<td className={`px-4 py-3 text-start text-gray-600 ${index % 2 == 0 ? 'bg-white' : 'bg-neutral-50'}`}>{vintage.negotiation_price == 0 ? formatNumber(vintage.per_credit_price, 2) : formatNumber(vintage.negotiation_price, 2)}</td>
							<td className={`px-4 py-3 text-start text-gray-600 ${index % 2 == 0 ? 'bg-white' : 'bg-neutral-50'}`}>{formatNumber(vintage.total_price, 2)}</td>
						</tr>))}
				</tbody>
			</table>
		</div>}

		{/* Summary Section */}
		<div className="flex flex-col border-t border-neutral-300 items-start text-neutral-1400 bg-light sc-sm:py-4 py-0  rounded-b-2xl">
			<div className="flex flex-col sc-sm:flex-row w-full">
				<div
					className="flex sc-sm:flex-1 flex-col px-4 py-2 sc-sm:pl-l gap-2 border sc-sm:border-0 border-neutral-300">
					<p className='text-f-xl font-normal'>{formatNumber(details.total_credits, 3)}</p>
					<p className="text-f-m">Total Credits</p>
				</div>
				<div
					className="flex sc-sm:flex-1 flex-col sc-sm:border-0 sc-sm:border-x px-4 py-2 sc-sm:pl-l gap-2 border border-neutral-300">
					<p className='text-f-xl font-normal'>$ {formatNumber(details.total_price_exclusive, 2)}</p>
					<p className="text-f-m ">Buying Amount</p>
				</div>
				<div
					className="flex sc-sm:flex-1 flex-col px-4 py-2 sc-sm:pl-l gap-2 border sc-sm:border-0 border-neutral-300">
					<p className='text-f-xl font-normal'>$ {formatNumber(details.discount, 2)}</p>
					<p className="text-f-m">Discount</p>
				</div>
				<div
					className="flex sc-sm:flex-1 flex-col px-4 py-2 sc-sm:pl-l gap-2 border sc-sm:border-0 sc-sm:border-x border-neutral-300">
					<p className='text-f-xl font-normal'>$ {formatNumber(details.tax, 2)}</p>
					<p className=" text-f-m">GST/Vat</p>
				</div>
				{/*<div
					className="flex sc-sm:flex-1 flex-col px-4 py-2 sc-sm:pl-l gap-2 border sc-sm:border-0 border-neutral-300">
					<p className='text-f-xl font-normal'>$ {formatNumber(details.platform_fees, 2)}</p>
					<p className=" text-f-m">Service Fee</p>
				</div>
				<div
					className="flex sc-sm:flex-1 flex-col px-4 py-2 sc-sm:pl-l gap-2 border sc-sm:border-0 sc-sm:border-x  border-neutral-300">
					<p className='text-f-xl font-normal'>$ {formatNumber(details.platform_fees_tax, 2)}</p>
					<p className=" text-f-m">Service Fee GST</p>
				</div>*/}
				<div
					className="flex sc-sm:flex-1 flex-col px-4 py-2 sc-sm:pl-l gap-2 border sc-sm:border-0  border-neutral-300">
					<p className='text-f-xl font-normal'>$ {formatNumber(details.total_price_inclusive, 2)}</p>
					<p className="text-f-m">Net Total Amount</p>
				</div>
			</div>
			<hr className="w-full sc-sm:mt-2 border border-gray-200" />
			{(Number(cartStatus) >= 6 || stockAvaliable) ? <div className="flex  flex-col sc-xs:flex-row justify-end gap-2 p-4 w-full">
				<button className={`flex  gap-4 justify-center items-center bg-white px-xl py-4 rounded-lg border whitespace-nowrap min-w-[180px]  ${activeNegotiationButton ? 'border-brand1-500 cursor-pointer hover:border-brand1-600	' : 'border-neutral-300 '}`} onClick={() => activeNegotiationButton ? negotiationHandler(details._id) : undefined}>
					<Partnership className="h-4 w-4" />
					<div className='text-neutral-1400 font-normal text-f-m  '>{(cartStatus == 1 && !orderCreated) ? "Start Negotiation" : (cartStatus == 2 && !orderCreated) ? "Offer send" : (cartStatus == 3 && !orderCreated) ? "New Offer" : (cartStatus == 4 || orderCreated) ? "Negotiation Done" : (cartStatus == 5 && !orderCreated) ? "Limit Crossed" : "Negotiation Done"}</div>
				</button>
				<button className={`flex gap-s justify-center  items-center px-xl py-4 rounded-lg whitespace-nowrap ${(activeBuyButton && !orderCreated) ? 'bg-brand1-500 hover:bg-brand1-600 text-white' : (cartStatus == 6 || orderCreated) ? 'bg-brand1-500 text-white ' : 'bg-neutral-300 text-black'}`} onClick={(activeBuyButton && !orderCreated) ? initiateBuyingHandler : undefined}>
					<div className='font-normal text-f-m'>{((cartStatus == 1 || cartStatus == 4) && !orderCreated) ? "Start Purchase Process" : (cartStatus == 6 || orderCreated) ? "Order Created" : (cartStatus == 7 && !orderCreated) ? "Payment Done" : "Start Purchase Process"}</div>
				</button>
			</div> : <div className="flex flex-col sc-xs:flex-row justify-end gap-2 p-4 w-full">
				<button className={` flex gap-s justify-center  items-center px-xl py-4 rounded-lg whitespace-nowrap  bg-brand1-500 text-white font-normal text-f-m`}>
					Out Of Stock
				</button>
			</div>}

		</div>
	</div>);
};

export default ProjectCard;
