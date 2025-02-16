import React from 'react'

const Location = (props: any) => {
    return (
        <div className="w-full bg-white mt-xl rounded-xl">
            <div className='py-l flex border-b-[1px] justify-between px-xl'>
                <div className='flex justify-between'>
                    <div className='text-black text-f-3xl font-light'>Location</div>
                </div>

            </div>
            <div className='p-xl text-black flex-col'>
                <div className='flex-col flex gap-xl'>
                    {/* {props.data.locations && props.data.locations.map((data: any, index: any) => <LocationDiv key={index} address={data.address} />)} */}
                    <LocationDiv data={props.data.rawData.state} />
                </div>
            </div>
        </div>
    )
}

export default Location

const LocationDiv = (props: any) => {
    return <div className='flex w-fill flex-col gap-xs border-b-2 border-neutral-100 pb-l'>
        <div className='flex items-center ' >
            <div className='p-s border-2 border-neutral-200 rounded-full'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 12L4.955 7.7C4.45659 7.11153 4.13562 6.39358 4.02948 5.62975C3.92333 4.86591 4.03638 4.08764 4.35545 3.38558C4.67453 2.68351 5.18649 2.08654 5.83173 1.6642C6.47697 1.24185 7.22891 1.01151 8 1C9.06887 1.01056 10.09 1.4443 10.8397 2.20621C11.5894 2.96812 12.0067 3.9961 12 5.065C12.0004 5.99747 11.683 6.90222 11.1 7.63L8 12ZM8 2C7.19593 2.00923 6.42838 2.33719 5.86591 2.91185C5.30343 3.48652 4.992 4.26091 5 5.065C5.00335 5.79891 5.26739 6.50775 5.745 7.065L8 10.26L10.315 7C10.755 6.45072 10.9965 5.7688 11 5.065C11.008 4.26091 10.6966 3.48652 10.1341 2.91185C9.57162 2.33719 8.80407 2.00923 8 2Z" fill="#57CC99" />
                    <path d="M8 5.5C8.55228 5.5 9 5.05228 9 4.5C9 3.94772 8.55228 3.5 8 3.5C7.44772 3.5 7 3.94772 7 4.5C7 5.05228 7.44772 5.5 8 5.5Z" fill="#57CC99" />
                    <path d="M14 6H13V7H14V14H2V7H3V6H2C1.73478 6 1.48043 6.10536 1.29289 6.29289C1.10536 6.48043 1 6.73478 1 7V14C1 14.2652 1.10536 14.5196 1.29289 14.7071C1.48043 14.8946 1.73478 15 2 15H14C14.2652 15 14.5196 14.8946 14.7071 14.7071C14.8946 14.5196 15 14.2652 15 14V7C15 6.73478 14.8946 6.48043 14.7071 6.29289C14.5196 6.10536 14.2652 6 14 6Z" fill="#57CC99" />
                </svg>

            </div>
            <div className='flex-1 pl-s text-l font-semibold'>
                Address
            </div>
        </div>
        <div className='pl-3xl flex flex-col gap-s'>
            <div className='font-extralight'>{props.data}</div>
            {/* <div className='font-extralight'>Noida, Gautambududdha Nagar, Uttar Pradesh, 201305</div> */}
        </div>

    </div>
}