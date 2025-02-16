'use client'
import React, { useEffect, useState } from 'react';
import { countries } from '@/data/countryCode';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import toCapitalizedCase from '@/utils/capitalized-case';

const ProjectHeader = (props: any) => {
    const [price, setPrice] = useState();
    const router = useRouter()

    useEffect(() => {
        const prices = props.data.batches.vintages.map((vintage: any) => vintage.per_credit_price);
        let minPrice: any = Math.min(...prices);
        setPrice(minPrice)
    }, [])

    const handleViewDetailsClick = (id: any) => {
        window.open(`/project/${id}`, '_blank');
    };

    const countryCode = countries[props.data.country_name as keyof typeof countries];
    const url = `https://flagsapi.com/${countryCode}/flat/64.png`;

    const buyNowClickHandler = (id: any) => {
        window.open(`/project/${id}`, '_blank');
        localStorage.setItem("buyCredit", "true")
    }

    return (
        <div className='w-full h-[522px]  '>
            <img src={`${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/project-images/${props.data.background_image}`} className='bg-cover w-full h-full ' />
            <div className='top-0 z-10 h-full w-full absolute bg-black bg-opacity-30'>
                <div className='py-4xl w-full flex justify-between max-w-[1540px] mx-auto  sc-sm:px-6 sc-sm:py-6'>
                    <div className='max-w-[629px] sc-sm:flex flex-col flex-1 hidden '>
                        <div className="flex flex-wrap gap-1">
                            {props.data.country_name && <Badge text={props.data.country_name} url={url} />}
                            {props.data.ck_assisted && <Badge text="ENVR Verified" url='./ck.png' />}
                            {props.data.negotiation && <Badge text="Negotiable" url='./nego.png' />}
                        </div>
                        <p className="text-f-2xl mt-4xl text-[#FDD135] font-light">{props.data.registry ? props.data.registry.name : 'NA'}</p>
                        <div className=" text-f-6xl font-normal text-white font-instrument line-clamp-1">
                            {toCapitalizedCase(props.data.name)}
                        </div>
                        <p className="font-normal text-white mt-m text-f-l w-[90%] line-clamp-4">
                            {props.data.details}
                        </p>
                        <button className="flex-1 items-center mt-5xl text-brand1-500 text-f-l w-fit  font-normal hover:text-brand1-600" onClick={() => { handleViewDetailsClick(props.data._id) }}>
                            View Details &rarr;
                        </button>
                    </div>
                    <div className='flex flex-col sc-sm:max-w-[400px] w-full px-5 py-10 sc-sm:p-0'>
                        <div className='p-4 gap-[21px] sc-sm:px-l bg-opacity-50 bg-black'>
                            <div className='flex justify-between items-center '>
                                <div className="line-clamp-1 text-f-3xl font-normal text-white font-instrument">
                                    {toCapitalizedCase(props.data.name)}
                                </div>
                                {/* <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M8 2L3 7L3.705 7.705L7.5 3.915V14H8.5V3.915L12.295 7.705L13 7L8 2Z" fill="white" />
                                    </svg>
                                </div> */}
                            </div>
                            <div className='flex mt-xl'>
                                <div className="flex-1 text-start">
                                    <p className="text-f-m text-gray-300 font-light">Estimated Credits</p>
                                    <p className="text-f-3xl font-normal text-white">{props.data.estimation_annual_estimated_reductions} tCO₂e</p>
                                </div>
                                <div className="flex-1 text-start">
                                    <p className="text-f-m text-gray-300 font-light">Price per Credit</p>
                                    <p className="text-f-3xl font-normal text-white">{price ? `$${price}` : 'NA'}</p>
                                </div>
                            </div>
                            {props.activeToken && <button className={`bg-brand1-500 text-white font-normal flex-1 py-l text-f-l w-full mt-l  ${props.data.batches.status == 2 ? Number(props.data.batches.total_credit) == 0 ? "cursor-default" : "hover:bg-brand1-600 " : "cursor-default"}`} onClick={() => props.data.batches.status == 2 ? Number(props.data.batches.total_credit) == 0 ? undefined : buyNowClickHandler(props.data._id) : undefined}>
                                {props.data.batches.status == 2 ? Number(props.data.batches.total_credit) == 0 ? "Out Of Stock" : "Buy Now " : "Expired"}
                            </button>}

                            {!props.activeToken && <button
                                className="block sc-sm:hidden mt-l flex-1 w-full items-center text-brand1-500 py-l text-f-l border bg-white bg-opacity-30 hover:bg-opacity-10 border-brand1-500  font-normal hover:border-brand1-600 hover:text-brand1-600 rounded-xl"
                                onClick={() => {
                                    router.push(`/project/${props.data._id}`);
                                }}>
                                View Details &rarr;
                            </button>}
                        </div>

                        <div className='w-full flex gap-l  mt-xl py-l px-l bg-opacity-50 bg-black'>
                            {props.data.sdg_goals.map((sdg_goal_detail: any, index: any) => (
                                <SdgGoal key={index} name={sdg_goal_detail.hero_image.name} />
                            ))}
                        </div>

                    </div>
                </div>

            </div>


        </div>
    )
}

export default ProjectHeader;

function SdgGoal({ name }: any) {
    return <div className='w-4xl h-4xl bg-red-500'>
        <img src={`${process.env.NEXT_PUBLIC_ESG_GOAL_ENDPOINT}/${name}`} className='bg-conatain' />
    </div>
}

function Badge({ text, url }: any) {
    return (
        <div className="flex gap-s items-center justify-center py-xs px-l  relative">
            <div className="absolute w-full h-full bg-gray-800 opacity-70 rounded-xl" />
            <div className="w-xl z-10 h-xl  rounded-full flex items-center justify-center">
                <img src={url} alt="text" className="bg-cover" />
            </div>
            <div className="z-10 text-white text-f-m ">
                {text}
            </div>
        </div>

    );
}

