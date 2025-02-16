'use client'
import React, { useEffect, useState } from 'react';
import axiosApi from '@/utils/axios-api';
import { API_ENDPOINTS } from '@/config/api-endpoint';
import { customToast } from '@/components/ui/customToast';
import { ShoppingCart, Store } from "lucide-react";
import { useRouter } from 'next/navigation';
import { countries } from '@/data/countryCode';
import {ChevronLeft} from "@carbon/icons-react";

const TABS = [
    { id: 'all', label: 'All' },
    { id: 'inProgress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
];

interface RoleToggleProps {
    activeRole: 'buyer' | 'seller';
    onRoleChange: (role: 'buyer' | 'seller') => void;
}

const ProjectCard: React.FC<any> = ({ data, setActiveCart, activeRole, setRole }: any) => {
    const NegotiationsHandler = (cart_id: any) => {
        setActiveCart(cart_id)
        setRole(activeRole)
    }

    const getCountryUrl = (country_name: any) => {
        const countryCode = countries[country_name as keyof typeof countries];
        const url = `https://flagsapi.com/${countryCode}/flat/64.png`;
        return url
    }

    return (
        <div className="flex flex-col gap-3 p-m rounded-2xl border border-[#f5f2f2]  min-w-[290px] justify-between">
            <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-2  w-full">
                    <p className="text-xl font-semibold text-neutral-1400">{activeRole == "buyer" ? data.seller_organization_name?.slice(0, 20).toUpperCase() : data.buyer_organization_name.slice(0, 20).toUpperCase()}</p>
                    <p className="h-[50px] text-base text-neutral-1200 ">{data.project_name.length > 40 ? data.project_name.slice(0, 40).toUpperCase() + '...' : data.project_name.toUpperCase()}</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex h-[30px] items-center gap-2 rounded-lg bg-black/[0.44] pl-3 pr-3 py-1">
                        <div className="w-xl z-10 h-xl  rounded-full flex items-center justify-center">
                            <img src={getCountryUrl(data.country_name)} alt="text" className="bg-cover w-full h-full rounded-full " />
                        </div>
                        <p className={` uppercase text-white ${(data.country_name).length > 10 ? "text-f-xs" : "text-f-s"}`}>{data.country_name}</p>
                    </div>

                    <div className="flex h-[30px] items-center gap-2 rounded-lg bg-black/[0.44] pl-3 pr-3 py-1">
                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M7.656 16.0327C7.048 16.0327 6.584 15.8407 6.264 15.4567C5.944 15.0727 5.784 14.6407 5.784 14.1607C5.784 13.6487 5.88 13.1847 6.072 12.7687C6.296 12.3207 6.52 11.8247 6.744 11.2807C7 10.7047 7.176 10.0167 7.272 9.21673C7.304 9.02473 7.256 8.91273 7.128 8.88073C7.032 8.81673 6.904 8.84873 6.744 8.97673C5.784 9.77673 5.112 10.5127 4.728 11.1847C4.376 11.8567 3.88 12.3687 3.24 12.7207C2.824 12.9447 2.376 13.0247 1.896 12.9607C1.416 12.8647 1.016 12.5607 0.696 12.0487C0.408 11.5047 0.344 10.9927 0.504 10.5127C0.664 10.0327 0.952 9.68073 1.368 9.45673C1.816 9.20073 2.28 9.05673 2.76 9.02473C3.272 8.99273 3.816 8.94473 4.392 8.88073C5 8.81673 5.672 8.62473 6.408 8.30473C6.6 8.24073 6.696 8.14473 6.696 8.01673C6.696 7.88873 6.6 7.79273 6.408 7.72873C5.672 7.37673 5 7.18473 4.392 7.15273C3.816 7.08873 3.272 7.04073 2.76 7.00873C2.28 6.97673 1.816 6.83273 1.368 6.57673C0.952 6.32073 0.664 5.95273 0.504 5.47273C0.344 4.99273 0.408 4.49673 0.696 3.98473C1.016 3.47273 1.416 3.16873 1.896 3.07273C2.376 2.97673 2.824 3.05673 3.24 3.31273C3.688 3.56873 4.056 3.90473 4.344 4.32073C4.632 4.70473 4.952 5.13673 5.304 5.61673C5.656 6.09673 6.152 6.59273 6.792 7.10473C6.952 7.23273 7.08 7.26473 7.176 7.20073C7.272 7.13673 7.304 7.00873 7.272 6.81673C7.176 5.98473 7 5.29673 6.744 4.75273C6.52 4.20873 6.296 3.71273 6.072 3.26473C5.88 2.81673 5.784 2.35273 5.784 1.87273C5.784 1.39273 5.944 0.960732 6.264 0.576731C6.584 0.19273 7.048 0.000729561 7.656 0.000729561C8.264 0.000729561 8.728 0.19273 9.048 0.576731C9.368 0.960732 9.528 1.39273 9.528 1.87273C9.528 2.35273 9.416 2.81673 9.192 3.26473C9 3.71273 8.776 4.20873 8.52 4.75273C8.296 5.29673 8.136 5.98473 8.04 6.81673C8.008 7.00873 8.04 7.13673 8.136 7.20073C8.264 7.26473 8.392 7.23273 8.52 7.10473C9.192 6.59273 9.688 6.09673 10.008 5.61673C10.36 5.13673 10.68 4.70473 10.968 4.32073C11.256 3.90473 11.624 3.56873 12.072 3.31273C12.488 3.05673 12.936 2.97673 13.416 3.07273C13.896 3.16873 14.296 3.47273 14.616 3.98473C14.904 4.49673 14.968 4.99273 14.808 5.47273C14.648 5.95273 14.36 6.32073 13.944 6.57673C13.496 6.83273 13.016 6.97673 12.504 7.00873C12.024 7.04073 11.48 7.08873 10.872 7.15273C10.296 7.18473 9.64 7.37673 8.904 7.72873C8.712 7.79273 8.616 7.88873 8.616 8.01673C8.616 8.14473 8.712 8.24073 8.904 8.30473C9.64 8.62473 10.296 8.81673 10.872 8.88073C11.48 8.94473 12.024 8.99273 12.504 9.02473C13.016 9.05673 13.496 9.20073 13.944 9.45673C14.36 9.68073 14.648 10.0327 14.808 10.5127C14.968 10.9927 14.904 11.5047 14.616 12.0487C14.296 12.5607 13.896 12.8647 13.416 12.9607C12.936 13.0247 12.488 12.9447 12.072 12.7207C11.464 12.3687 10.968 11.8567 10.584 11.1847C10.2 10.5127 9.528 9.77673 8.568 8.97673C8.44 8.84873 8.312 8.81673 8.184 8.88073C8.056 8.91273 8.008 9.02473 8.04 9.21673C8.136 10.0167 8.296 10.7047 8.52 11.2807C8.776 11.8247 9 12.3207 9.192 12.7687C9.416 13.1847 9.528 13.6487 9.528 14.1607C9.528 14.6407 9.368 15.0727 9.048 15.4567C8.728 15.8407 8.264 16.0327 7.656 16.0327Z"
                                fill="#10B946" />
                        </svg>
                        <p className={` text-white ${(data.country_name).length > 10 ? "text-f-xs" : "text-f-s"}`}>ENVR Verified</p>
                    </div>
                </div>
            </div>
            <div className=''>
                <div className="h-[0.5px] bg-[#e6e6e6]"></div>
                <div className="flex flex-col gap-s">
                    <div className="flex pt-xl gap-m ">
                        <div className="w-[23px] relative  ">
                            <svg width="7" height="37" viewBox="0 0 7 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="4" y="6.50073" width="30" height="1" transform="rotate(90 4 6.50073)"
                                    fill="#E6E6E6" />
                                <circle cx="3.5" cy="4.00073" r="3" fill="#FAFAFA" stroke="#E6E6E6" />
                            </svg>
                        </div>
                        <div className="flex flex-1 flex-col relative pb-xl  items-start">
                            <p className="text-base text-neutral-1200">Updated By</p>
                            <div className="flex items-center gap-1">
                                <svg width="14" height="15" viewBox="0 0 14 15" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M11.375 2.25073H9.625V1.37573H8.75V2.25073H5.25V1.37573H4.375V2.25073H2.625C2.39294 2.25073 2.17038 2.34292 2.00628 2.50701C1.84219 2.67111 1.75 2.89367 1.75 3.12573V11.8757C1.75 12.1078 1.84219 12.3304 2.00628 12.4945C2.17038 12.6585 2.39294 12.7507 2.625 12.7507H11.375C11.6071 12.7507 11.8296 12.6585 11.9937 12.4945C12.1578 12.3304 12.25 12.1078 12.25 11.8757V3.12573C12.25 2.89367 12.1578 2.67111 11.9937 2.50701C11.8296 2.34292 11.6071 2.25073 11.375 2.25073ZM11.375 11.8757H2.625V5.75073H11.375V11.8757ZM2.625 4.87573V3.12573H4.375V4.00073H5.25V3.12573H8.75V4.00073H9.625V3.12573H11.375V4.87573H2.625Z"
                                        fill="#808080" />
                                </svg>
                                <p className="text-sm text-[#808080]">{data.updated_by}</p>
                            </div>
                        </div>
                    </div>
                    {/* <div className="flex items-center gap-3 bg-purple-500"> */}
                    {/* <div className="w-[23px] h-14 relative">
                            <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                className="absolute left-[-0.5px] top-[15.5px]">
                                <circle cx="11.5" cy="12.0007" r="11" stroke="#E6E6E6" />
                            </svg>
                            <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg"
                                className="absolute left-[0.5px] top-[16.5px]">
                                <circle cx="10.5" cy="11.0007" r="10" fill="#FBFBFB" stroke="#57CC99" />
                            </svg>
                            <p className="absolute left-[7px] top-[18px] text-sm text-neutral-1400">3</p>
                        </div> */}
                    {/* </div> */}
                    <div className="w-full flex gap-m ">
                        <div className="w-[23px] relative">
                            <svg width="7" height="37" viewBox="0 0 7 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="4" y="6.50073" width="30" height="1" transform="rotate(90 4 6.50073)"
                                    fill="#E6E6E6" />
                                <circle cx="3.5" cy="4.00073" r="3" fill="#FAFAFA" stroke="#E6E6E6" />
                            </svg>
                        </div>
                        <div className="w-full flex flex-col pb-xl ">
                            <p className="text-base text-neutral-1200">Negotiation Count</p>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-1">
                                    <svg width="14" height="15" viewBox="0 0 14 15" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M11.375 2.25073H9.625V1.37573H8.75V2.25073H5.25V1.37573H4.375V2.25073H2.625C2.39294 2.25073 2.17038 2.34292 2.00628 2.50701C1.84219 2.67111 1.75 2.89367 1.75 3.12573V11.8757C1.75 12.1078 1.84219 12.3304 2.00628 12.4945C2.17038 12.6585 2.39294 12.7507 2.625 12.7507H11.375C11.6071 12.7507 11.8296 12.6585 11.9937 12.4945C12.1578 12.3304 12.25 12.1078 12.25 11.8757V3.12573C12.25 2.89367 12.1578 2.67111 11.9937 2.50701C11.8296 2.34292 11.6071 2.25073 11.375 2.25073ZM11.375 11.8757H2.625V5.75073H11.375V11.8757ZM2.625 4.87573V3.12573H4.375V4.00073H5.25V3.12573H8.75V4.00073H9.625V3.12573H11.375V4.87573H2.625Z"
                                            fill="#808080" />
                                    </svg>
                                    <p className="text-sm text-[#808080]">{data.nagotiation_count}</p>
                                </div>
                                {/* <div className="ml-auto">
                                    <svg width="14" height="15" viewBox="0 0 14 15" fill="none"
                                        className='text-right relative'
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M6.99877 4.87573C6.47959 4.87573 5.97207 5.02969 5.54039 5.31812C5.10872 5.60656 4.77226 6.01653 4.57358 6.49619C4.3749 6.97584 4.32292 7.50364 4.4242 8.01284C4.52549 8.52204 4.7755 8.98978 5.14261 9.35689C5.50972 9.724 5.97745 9.97401 6.48665 10.0753C6.99585 10.1766 7.52365 10.1246 8.00331 9.92592C8.48297 9.72724 8.89293 9.39078 9.18137 8.9591C9.46981 8.52743 9.62376 8.01991 9.62376 7.50073C9.62376 6.80454 9.3472 6.13686 8.85492 5.64458C8.36264 5.15229 7.69496 4.87573 6.99877 4.87573ZM6.99877 9.25073C6.65265 9.25073 6.3143 9.1481 6.02652 8.9558C5.73873 8.76351 5.51443 8.4902 5.38198 8.17043C5.24952 7.85066 5.21487 7.49879 5.28239 7.15932C5.34992 6.81986 5.51659 6.50804 5.76133 6.2633C6.00607 6.01855 6.31789 5.85188 6.65736 5.78436C6.99682 5.71683 7.34869 5.75149 7.66846 5.88394C7.98823 6.0164 8.26154 6.2407 8.45384 6.52848C8.64613 6.81627 8.74877 7.15461 8.74877 7.50073C8.74877 7.96486 8.56439 8.40998 8.2362 8.73817C7.90801 9.06636 7.46289 9.25073 6.99877 9.25073ZM13.1238 7.32573C13.01 7.15073 11.1725 3.12573 6.99877 3.12573C2.82502 3.12573 0.987516 7.15073 0.873766 7.32573C0.829838 7.43826 0.829838 7.5632 0.873766 7.67573C0.952516 7.85073 2.79002 11.8757 6.99877 11.8757C11.2075 11.8757 13.01 7.85073 13.1238 7.67573C13.1677 7.5632 13.1677 7.43826 13.1238 7.32573ZM6.99877 11.0007C3.86627 11.0007 2.18627 8.23573 1.80127 7.50073C2.18627 6.76573 3.86627 4.00073 6.99877 4.00073C10.1313 4.00073 11.8113 6.76573 12.1963 7.50073C11.8113 8.23573 10.1313 11.0007 6.99877 11.0007Z"
                                            fill="#808080" />
                                    </svg>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-[0.5px] bg-[#e6e6e6]"></div>

            </div>

            <div className="flex items-center justify-between  ">
                <button className="flex h-9 items-center justify-center rounded-lg border border-[#57cc99] px-3 py-2" onClick={() => { NegotiationsHandler(data.cart_id) }}>
                    <p className="text-sm text-neutral-1400">Negotiate</p>
                </button>
                <div className="flex items-center overflow-hidden rounded bg-[#fef4cd] px-3 py-2">
                    <p className=" text-sm font-semibold text-[#977702]">{data.status === 1 ? "Created" : data.status === 2 ? "In Progress" : data.status === 3 ? "Completed" : data.status === 4 ? "Limit Crossed " : "No Status Found"}</p>
                </div>
            </div>
        </div>
    );
};

const RoleToggle: React.FC<RoleToggleProps> = ({ activeRole, onRoleChange }) => (
    <div className="flex flex-wrap sc-sm:flex-row w-full sc-sm:w-auto gap-3">
        <button
            onClick={() => onRoleChange('buyer')}
            className={`flex flex-1 justify-center items-center gap-2.5 px-8 py-3 cursor-pointer transition-all
                ${activeRole === 'buyer'
                    ? 'border-b-[3px] border-primary shadow-lg bg-brand1-100'
                    : 'hover:bg-neutral-50'}`}
        >
            <ShoppingCart className={`w-6 h-6 ${activeRole === 'buyer' ? 'text-primary' : 'text-neutral-600'}`} />
            <p className={`text-xl ${activeRole === 'buyer' ? 'text-primary font-light' : 'text-neutral-600'}`}>
                Buyer
            </p>
        </button>
        <button
            onClick={() => onRoleChange('seller')}
            className={`flex flex-1 justify-center items-center gap-2.5 px-8 py-3 cursor-pointer transition-all
                ${activeRole === 'seller'
                    ? 'border-b-[3px] border-primary shadow-lg bg-brand1-100'
                    : 'hover:bg-neutral-50'}`}
        >
            <Store className={`w-6 h-6 ${activeRole === 'seller' ? 'text-primary' : 'text-neutral-600'}`} />
            <p className={`text-xl ${activeRole === 'seller' ? 'text-primary font-light' : 'text-neutral-600'}`}>
                Seller
            </p>
        </button>
    </div>
);

export default function NegotiationsPage(props: any) {
    const [activeTab, setActiveTab] = useState('all');
    const [negotiationList, setNegotiationList] = useState([]);
    const [activeRole, setActiveRole] = useState<'buyer' | 'seller'>('buyer');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const router = useRouter();

    const nextHandler = () => {
        if (currentPage < totalPage) {
            setCurrentPage(prev => prev + 1)
        }
    }

    const previousHandler = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        const fetchProject = async () => {
            try {
                const state: number = activeTab === "all" ? 1 : activeTab === "inProgress" ? 2 : 3
                const endpoint = activeRole === 'buyer'
                    ? API_ENDPOINTS.BuyerNegotiation(state, currentPage)
                    : API_ENDPOINTS.SellerNegotiation(state, currentPage);
                const response = await axiosApi.project.get(endpoint);

                if (response.status === 200) {
                    setNegotiationList(response.data.data.negotiations_list)
                    setTotalPage(response.data.data.pages)

                } else {
                    customToast.error(response.data.message || "Unable to fetch Negotiation detail");
                }
            } catch (error) {
                console.error('Error during password reset request:', error);
            }
        }
        fetchProject()
    }, [activeTab, activeRole, currentPage])

    const ProjectListHandler = async (role: 'buyer' | 'seller') => {
        setActiveRole(role);
    }


    return (
        <div className="flex flex-col w-full justify-center mx-auto max-w-screen-sc-2xl ">
            <div className="flex flex-col sc-sm:flex-row gap-6 p-6">
                <div className="flex flex-col w-full gap-6">
                    <div className="flex flex-wrap sc-sm:flex-row gap-1 justify-between">
                        <div className='flex gap-4'>
                            <button className='flex gap-s pr-l border-r items-center text-tertiary'
                                    onClick={() => router.push('/profile')}>
                                <ChevronLeft className="w-4 h-4 "/>
                                <div className='text-f-xl '>Back</div>
                            </button>
                            <h1 className="text-f-5xl  text-neutral-1400 font-light">
                                Negotiations
                            </h1>
                        </div>
                        <RoleToggle
                            activeRole={activeRole}
                            onRoleChange={ProjectListHandler}
                        />
                    </div>

                    <div className="flex flex-col bg-white rounded-2xl shadow-lg gap-y-6 p-6">
                        {/* Tab Navigation */}
                        <div className="flex border-b border-neutral-200">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`px-4 py-2 text-sm ${activeTab === tab.id
                                        ? 'border-b-[1.5px] border-secondary font-semibold text-neutral-900'
                                        : 'text-neutral-700'
                                    }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Project Cards Grid */} {(negotiationList && negotiationList.length > 0) ?
                        <div className="">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {negotiationList.map((data, index) => (
                                    <ProjectCard key={index} data={data} setActiveCart={props.setActiveCart} activeRole={activeRole} setRole={props.setRole}/>
                                ))}
                            </div>
                            {totalPage > 1 && <div className="flex pt-xl justify-end gap-m items-center  w-full">
                                <button className={`${currentPage > 1 ? "text-brand1-500" : "text-gray-400"}`} onClick={previousHandler}>
                                    Prev
                                </button>
                                <div className="bg-brand1-500 px-m text-white rounded-md">
                                    {currentPage}
                                </div>
                                <button className={`${currentPage < totalPage ? "text-brand1-500" : "text-gray-400"}`} onClick={nextHandler}>
                                    Next
                                </button>
                            </div>}
                        </div> : <div className="p-xl text-gray-500">No Record Found</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}