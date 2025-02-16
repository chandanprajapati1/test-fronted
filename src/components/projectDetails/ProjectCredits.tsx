import React from "react";
import { PROJECT_STATUS } from "@/utils/constants";
import { useMeQuery } from "@/data/user";
import { useRouter } from "next/navigation";
import { Routes } from "@/config/routes";
import { useSelector } from "react-redux";
import { CheckmarkOutline } from "@carbon/icons-react";

const ProjectCredits = (props: any) => {
    const router = useRouter()
    const profileData = useSelector((state: any) => state?.profileDetail?.profileDetails);

    const addCreditHandler = () => {

        if (props.activeToken) {
            // if (profileData?.organization?.status != 2) {
            //     router.push('/company-onboarding')
            // }
            // else {
            props.openModal()
            // }
        }
        else {
            router.push(Routes.SignIn)
        }
    }
    return (
        <>
            <div className="flex flex-col rounded-2xl w-full bg-white shadow-lg mt-xl">
                <div className="flex justify-between items-center px-6 py-4 border-b border-[#e6e6e6]">
                    <h2 className="text-f-3xl font-light text-neutral-1400">Project Credits</h2>
                    <div className="flex gap-2">
                        {/* <button
                            className="flex items-center gap-2 h-9 px-3 py-2 rounded-lg bg-white border border-[#b2b2b2]"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13 2H11V1H10V2H6V1H5V2H3C2.45 2 2 2.45 2 3V13C2 13.55 2.45 14 3 14H13C13.55 14 14 13.55 14 13V3C14 2.45 13.55 2 13 2ZM13 13H3V6H13V13ZM13 5H3V3H5V4H6V3H10V4H11V3H13V5Z"
                                    fill="#4D4D4D" />
                            </svg>
                            <span className="text-sm text-neutral-1200" >View Details</span>
                        </button> */}
                        {props.data.batches.status == 2 ? props.data.total_credit !== 0 ? (
                            <button className="flex items-center gap-2 h-9 px-3 py-2 rounded-lg bg-[#57cc99] text-white" onClick={addCreditHandler}>
                                <CheckmarkOutline className="w-4 h-4" />
                                <span className="text-sm font-normal">Add Credits</span>
                            </button>
                        ) : <div className="flex items-center gap-2 h-9 px-3 py-2 rounded-lg bg-[#57cc99] text-white" >Out Of Stock</div> :
                            <div className="flex items-center gap-2 h-9 px-3 py-2 rounded-lg bg-[#57cc99] text-white" >Expired</div>
                        }
                    </div>
                </div>
                <div className='flex p-xl gap-xl flex-col md:flex-row'>
                    {/*<CarbonCard title="Validated Total" value="Value"/>*/}
                    <CarbonCard title="Total" value={props.data.total_credit + " tCO₂e"} />
                    {props.data.active_credit && <CarbonCard title="Active credits" value={`${props.data?.active_credit?.start_date} - ${props.data?.active_credit?.end_date}`} />}
                    {props.data.crediting_period && < CarbonCard title="Credit period" value={`${props.data?.crediting_period?.start_date} - ${props.data?.crediting_period?.end_date}`} />}
                </div>
            </div>
        </>
    );
};

export default ProjectCredits;

const CarbonCard = (props: any) => {
    return <div className='flex-1 flex items-center flex-grow gap-3 px-4 py-xl border-l first:border-l-0 border-[#F2F2F2]'>
        <div className='flex-1 flex'>
            <div
                className="flex justify-center items-center w-4xl h-4xl rounded-[50px] border-4 border-[#FBFBFB] bg-[#F5F5F5]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M10.5 16.0605L6.75 12.3097L7.80976 11.25L10.5 13.9395L16.1888 8.25L17.25 9.31125L10.5 16.0605Z" fill="#808080" />
                    <path d="M12 1.5C9.9233 1.5 7.89323 2.11581 6.16652 3.26957C4.4398 4.42332 3.09399 6.0632 2.29927 7.98182C1.50455 9.90045 1.29661 12.0116 1.70176 14.0484C2.1069 16.0852 3.10693 17.9562 4.57538 19.4246C6.04383 20.8931 7.91476 21.8931 9.95156 22.2982C11.9884 22.7034 14.0996 22.4955 16.0182 21.7007C17.9368 20.906 19.5767 19.5602 20.7304 17.8335C21.8842 16.1068 22.5 14.0767 22.5 12C22.5 9.21523 21.3938 6.54451 19.4246 4.57538C17.4555 2.60625 14.7848 1.5 12 1.5ZM12 21C10.22 21 8.47992 20.4722 6.99987 19.4832C5.51983 18.4943 4.36628 17.0887 3.68509 15.4442C3.0039 13.7996 2.82567 11.99 3.17294 10.2442C3.5202 8.49836 4.37737 6.89471 5.63604 5.63604C6.89472 4.37737 8.49836 3.5202 10.2442 3.17293C11.99 2.82567 13.7996 3.0039 15.4442 3.68508C17.0887 4.36627 18.4943 5.51983 19.4832 6.99987C20.4722 8.47991 21 10.22 21 12C21 14.3869 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.387 21 12 21Z" fill="#808080" />
                </svg>
            </div>
            <div className='ml-m flex flex-col justify-between'>
                <div className='text-f-s font-semibold text-tertiary'>
                    {props.title.toUpperCase()}
                </div>
                <div className='text-f-2xl font-light text-neutral-1000'>
                    {props.value}
                </div>
            </div>
        </div>
        {/*<div className='flex'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8.5 11V7H6.5V8H7.5V11H6V12H10V11H8.5Z" fill="#808080" />
                <path d="M8 4C7.85167 4 7.70666 4.04399 7.58333 4.1264C7.45999 4.20881 7.36386 4.32595 7.30709 4.46299C7.25033 4.60004 7.23548 4.75084 7.26441 4.89632C7.29335 5.04181 7.36478 5.17544 7.46967 5.28033C7.57456 5.38522 7.7082 5.45665 7.85369 5.48559C7.99917 5.51453 8.14997 5.49968 8.28701 5.44291C8.42406 5.38615 8.54119 5.29002 8.6236 5.16668C8.70602 5.04334 8.75 4.89834 8.75 4.75C8.75 4.55109 8.67098 4.36033 8.53033 4.21967C8.38968 4.07902 8.19892 4 8 4Z" fill="#808080" />
                <path d="M8 15C6.61553 15 5.26216 14.5895 4.11101 13.8203C2.95987 13.0511 2.06266 11.9579 1.53285 10.6788C1.00303 9.3997 0.86441 7.99224 1.13451 6.63437C1.4046 5.2765 2.07129 4.02922 3.05026 3.05026C4.02922 2.07129 5.2765 1.4046 6.63437 1.13451C7.99224 0.86441 9.3997 1.00303 10.6788 1.53285C11.9579 2.06266 13.0511 2.95987 13.8203 4.11101C14.5895 5.26216 15 6.61553 15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15ZM8 2C6.81332 2 5.65328 2.3519 4.66658 3.01119C3.67989 3.67047 2.91085 4.60755 2.45673 5.7039C2.0026 6.80026 1.88378 8.00666 2.11529 9.17054C2.3468 10.3344 2.91825 11.4035 3.75736 12.2426C4.59648 13.0818 5.66558 13.6532 6.82946 13.8847C7.99335 14.1162 9.19975 13.9974 10.2961 13.5433C11.3925 13.0892 12.3295 12.3201 12.9888 11.3334C13.6481 10.3467 14 9.18669 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2Z" fill="#808080" />
            </svg>
        </div>*/}
    </div>
};