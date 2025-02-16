'use client'
import React, { useState } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import "react-circular-progressbar/dist/styles.css";

const CarbonImpactndPerf = (props: any) => {
    const [readMore, setReadMore] = useState(false)

    const readMoreHandler = () => {
        setReadMore(!readMore);
    }


    return (
        <div className="w-full bg-white mt-xl rounded-xl">
            <div className='py-l flex border-b-[1px] justify-between px-xl'>
                <div className='flex justify-between'>
                    <div className='text-black text-f-3xl font-light'>Carbon impact and performance to carbon performance</div>
                </div>
                {/* <div className='flex py-s px-m bg-neutral-100 items-center rounded-lg'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8.5 11V7H6.5V8H7.5V11H6V12H10V11H8.5Z" fill="#808080" />
                        <path d="M8 4C7.85167 4 7.70666 4.04399 7.58333 4.1264C7.45999 4.20881 7.36386 4.32595 7.30709 4.46299C7.25033 4.60004 7.23548 4.75084 7.26441 4.89632C7.29335 5.04181 7.36478 5.17544 7.46967 5.28033C7.57456 5.38522 7.7082 5.45665 7.85369 5.48559C7.99917 5.51453 8.14997 5.49968 8.28701 5.44291C8.42406 5.38615 8.54119 5.29002 8.6236 5.16668C8.70602 5.04334 8.75 4.89834 8.75 4.75C8.75 4.55109 8.67098 4.36033 8.53033 4.21967C8.38968 4.07902 8.19892 4 8 4Z" fill="#808080" />
                        <path d="M8 15C6.61553 15 5.26216 14.5895 4.11101 13.8203C2.95987 13.0511 2.06266 11.9579 1.53285 10.6788C1.00303 9.3997 0.86441 7.99224 1.13451 6.63437C1.4046 5.2765 2.07129 4.02922 3.05026 3.05026C4.02922 2.07129 5.2765 1.4046 6.63437 1.13451C7.99224 0.86441 9.3997 1.00303 10.6788 1.53285C11.9579 2.06266 13.0511 2.95987 13.8203 4.11101C14.5895 5.26216 15 6.61553 15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15ZM8 2C6.81332 2 5.65328 2.3519 4.66658 3.01119C3.67989 3.67047 2.91085 4.60755 2.45673 5.7039C2.0026 6.80026 1.88378 8.00666 2.11529 9.17054C2.3468 10.3344 2.91825 11.4035 3.75736 12.2426C4.59648 13.0818 5.66558 13.6532 6.82946 13.8847C7.99335 14.1162 9.19975 13.9974 10.2961 13.5433C11.3925 13.0892 12.3295 12.3201 12.9888 11.3334C13.6481 10.3467 14 9.18669 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2Z" fill="#808080" />
                    </svg>

                </div> */}
            </div>
            <div className='p-xl text-black flex-col'>
                <div className='flex-col'>
                    <div className='font-light'>
                        {props.data.carbon_performance_description && props.data.carbon_performance_description.length > 250 && !readMore ? props.data.carbon_performance_description.slice(0, 250) + "..." : props.data.carbon_performance_description}
                    </div>
                    {props.data.carbon_performance_description && props.data.carbon_performance_description.length > 250 && <button className='mt-s px-m py-s flex items-center' onClick={readMoreHandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13 14H3C2.73489 13.9996 2.48075 13.8942 2.29329 13.7067C2.10583 13.5193 2.00036 13.2651 2 13V3C2.00036 2.73489 2.10583 2.48075 2.29329 2.29329C2.48075 2.10583 2.73489 2.00036 3 2H8V3H3V13H13V8H14V13C13.9996 13.2651 13.8942 13.5193 13.7067 13.7067C13.5193 13.8942 13.2651 13.9996 13 14Z" fill="#4D4D4D" />
                            <path d="M10 1V2H13.293L9 6.293L9.707 7L14 2.707V6H15V1H10Z" fill="#4D4D4D" />
                        </svg>
                        <div className='px-s text-tertiary'>
                            {!readMore ? "Read more" : "Hide"}
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8.5 7.5V4H7.5V7.5H4V8.5H7.5V12H8.5V8.5H12V7.5H8.5Z" fill="#22577A" />
                        </svg>
                    </button>}
                </div>
                <div className='flex flex-col md:flex-row gap-xl mt-xl'>
                    <CarbonCard title="Estimated Annual Reductions" value={props.data.estimation_annual_estimated_reductions + " tCO₂e"} />
                    {props.data.actual_annual_estimated_reductions && <CarbonCard title="Actual Annual Reductions" value={props.data.actual_annual_estimated_reductions ? props.data.actual_annual_estimated_reductions + " tCO₂e" : "NA"} />}
                </div>
            </div>

        </div>
    )
}

export default CarbonImpactndPerf


const CarbonCard = (props: any) => {
    return <div className='flex flex-grow px-l py-xl  border rounded-xl' >
        <div className='flex-1 flex'>
            <div className='p-m rounded-full border w-4xl h-4xl flex justify-center items-center' >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3C10.22 3 8.47991 3.52784 6.99987 4.51677C5.51983 5.50571 4.36628 6.91131 3.68509 8.55585C3.0039 10.2004 2.82567 12.01 3.17294 13.7558C3.5202 15.5016 4.37737 17.1053 5.63604 18.364C6.89472 19.6226 8.49836 20.4798 10.2442 20.8271C11.99 21.1743 13.7996 20.9961 15.4442 20.3149C17.0887 19.6337 18.4943 18.4802 19.4832 17.0001C20.4722 15.5201 21 13.78 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.387 3 12 3ZM19.5 11.25H12.75V4.5375C14.4781 4.70231 16.0956 5.46149 17.3265 6.68557C18.5574 7.90965 19.3256 9.52283 19.5 11.25ZM11.565 19.5C9.66554 19.4117 7.87053 18.6051 6.54316 17.2436C5.21578 15.882 4.45513 14.0671 4.41511 12.166C4.37509 10.2649 5.05867 8.41953 6.32757 7.0033C7.59647 5.58708 9.35594 4.70571 11.25 4.5375V11.2875C11.25 11.6853 11.408 12.0669 11.6893 12.3482C11.9706 12.6295 12.3522 12.7875 12.75 12.7875H19.5C19.3005 14.7146 18.3629 16.4898 16.8837 17.7411C15.4046 18.9923 13.4986 19.6227 11.565 19.5Z" fill="#808080" />
                </svg>
            </div>
            <div className='ml-m flex flex-col justify-between'>
                <div className='text-f-s font-semibold text-tertiary'>
                    {props.title}
                </div>
                <div className='text-f-2xl font-light text-neutral-1000'>
                    {props.value}
                </div>
            </div>
        </div>
        {/* <div className='flex'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8.5 11V7H6.5V8H7.5V11H6V12H10V11H8.5Z" fill="#808080" />
                <path d="M8 4C7.85167 4 7.70666 4.04399 7.58333 4.1264C7.45999 4.20881 7.36386 4.32595 7.30709 4.46299C7.25033 4.60004 7.23548 4.75084 7.26441 4.89632C7.29335 5.04181 7.36478 5.17544 7.46967 5.28033C7.57456 5.38522 7.7082 5.45665 7.85369 5.48559C7.99917 5.51453 8.14997 5.49968 8.28701 5.44291C8.42406 5.38615 8.54119 5.29002 8.6236 5.16668C8.70602 5.04334 8.75 4.89834 8.75 4.75C8.75 4.55109 8.67098 4.36033 8.53033 4.21967C8.38968 4.07902 8.19892 4 8 4Z" fill="#808080" />
                <path d="M8 15C6.61553 15 5.26216 14.5895 4.11101 13.8203C2.95987 13.0511 2.06266 11.9579 1.53285 10.6788C1.00303 9.3997 0.86441 7.99224 1.13451 6.63437C1.4046 5.2765 2.07129 4.02922 3.05026 3.05026C4.02922 2.07129 5.2765 1.4046 6.63437 1.13451C7.99224 0.86441 9.3997 1.00303 10.6788 1.53285C11.9579 2.06266 13.0511 2.95987 13.8203 4.11101C14.5895 5.26216 15 6.61553 15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15ZM8 2C6.81332 2 5.65328 2.3519 4.66658 3.01119C3.67989 3.67047 2.91085 4.60755 2.45673 5.7039C2.0026 6.80026 1.88378 8.00666 2.11529 9.17054C2.3468 10.3344 2.91825 11.4035 3.75736 12.2426C4.59648 13.0818 5.66558 13.6532 6.82946 13.8847C7.99335 14.1162 9.19975 13.9974 10.2961 13.5433C11.3925 13.0892 12.3295 12.3201 12.9888 11.3334C13.6481 10.3467 14 9.18669 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2Z" fill="#808080" />
            </svg>
        </div> */}
    </div>
}