import React from "react";

const CarbonCard1 = (props: any) => {
    return <div className=' flex-1 flex px-l py-xl  border rounded-xl' >
        <div className="">
            <div className='flex-1 flex'>
                <div className=" flex justify-center items-center">
                    <div className='p-m rounded-full border w-4xl h-4xl'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M15 4H8V5H15V4Z" fill="#808080" />
                            <path d="M15 11H8V12H15V11Z" fill="#808080" />
                            <path
                                d="M5 7H2C1.73488 6.9997 1.4807 6.89424 1.29323 6.70677C1.10576 6.5193 1.0003 6.26512 1 6V3C1.0003 2.73488 1.10576 2.4807 1.29323 2.29323C1.4807 2.10576 1.73488 2.0003 2 2H5C5.26512 2.0003 5.5193 2.10576 5.70677 2.29323C5.89424 2.4807 5.9997 2.73488 6 3V6C5.9997 6.26512 5.89424 6.5193 5.70677 6.70677C5.5193 6.89424 5.26512 6.9997 5 7ZM2 3V6H5.0006L5 3H2Z"
                                fill="#808080" />
                            <path
                                d="M5 14H2C1.73488 13.9997 1.4807 13.8942 1.29323 13.7068C1.10576 13.5193 1.0003 13.2651 1 13V10C1.0003 9.73488 1.10576 9.4807 1.29323 9.29323C1.4807 9.10576 1.73488 9.0003 2 9H5C5.26512 9.0003 5.5193 9.10576 5.70677 9.29323C5.89424 9.4807 5.9997 9.73488 6 10V13C5.9997 13.2651 5.89424 13.5193 5.70677 13.7068C5.5193 13.8942 5.26512 13.9997 5 14ZM2 10V13H5.0006L5 10H2Z"
                                fill="#808080" />
                        </svg>
                    </div>
                </div>

                <div className='ml-m flex flex-col justify-start'>
                    <div className='text-f-s font-semibold text-tertiary'>
                        {props.title.toUpperCase()}
                    </div>
                    <div className='text-f-2xl font-light text-neutral-700'>
                        {props.value}
                    </div>
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
}

const RegistryDetails = (props: any) => {
    const typeNames = props.data.rawData.validators.map((item: any) => item.fullName);
    const formattedType = typeNames.join(', ');
    return (
        <div className="flex items-start self-stretch gap-[18px] mt-xl">
            <div className="flex flex-col items-start grow rounded-2xl bg-white shadow-lg">
                <div
                    className="flex justify-between items-start w-full px-6 py-4 border-b border-[#e6e6e6]">
                    <h2 className="text-f-3xl font-light text-neutral-1400">Registry Details</h2>
                    <div className="flex items-center gap-2">
                        {/* <div className='flex py-s px-m bg-neutral-100 items-center rounded-lg'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8.5 11V7H6.5V8H7.5V11H6V12H10V11H8.5Z" fill="#808080" />
                                <path d="M8 4C7.85167 4 7.70666 4.04399 7.58333 4.1264C7.45999 4.20881 7.36386 4.32595 7.30709 4.46299C7.25033 4.60004 7.23548 4.75084 7.26441 4.89632C7.29335 5.04181 7.36478 5.17544 7.46967 5.28033C7.57456 5.38522 7.7082 5.45665 7.85369 5.48559C7.99917 5.51453 8.14997 5.49968 8.28701 5.44291C8.42406 5.38615 8.54119 5.29002 8.6236 5.16668C8.70602 5.04334 8.75 4.89834 8.75 4.75C8.75 4.55109 8.67098 4.36033 8.53033 4.21967C8.38968 4.07902 8.19892 4 8 4Z" fill="#808080" />
                                <path d="M8 15C6.61553 15 5.26216 14.5895 4.11101 13.8203C2.95987 13.0511 2.06266 11.9579 1.53285 10.6788C1.00303 9.3997 0.86441 7.99224 1.13451 6.63437C1.4046 5.2765 2.07129 4.02922 3.05026 3.05026C4.02922 2.07129 5.2765 1.4046 6.63437 1.13451C7.99224 0.86441 9.3997 1.00303 10.6788 1.53285C11.9579 2.06266 13.0511 2.95987 13.8203 4.11101C14.5895 5.26216 15 6.61553 15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15ZM8 2C6.81332 2 5.65328 2.3519 4.66658 3.01119C3.67989 3.67047 2.91085 4.60755 2.45673 5.7039C2.0026 6.80026 1.88378 8.00666 2.11529 9.17054C2.3468 10.3344 2.91825 11.4035 3.75736 12.2426C4.59648 13.0818 5.66558 13.6532 6.82946 13.8847C7.99335 14.1162 9.19975 13.9974 10.2961 13.5433C11.3925 13.0892 12.3295 12.3201 12.9888 11.3334C13.6481 10.3467 14 9.18669 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2Z" fill="#808080" />
                            </svg>
                            <div className='text-black ml-s'>By Verra</div>
                        </div> */}
                    </div>
                </div>
                <div className="flex flex-col items-start w-full gap-6 p-6">
                    <div className="parent h-full flex items-stretch w-full gap-6 flex-wrap ">
                        <CarbonCard1 title="Project Registry" value={props.data.rawData.registry} />
                        <CarbonCard1 title="Methodology" value={props.data.rawData.methodology.id} />
                        <CarbonCard1 title="Project Validator" value={formattedType} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistryDetails;