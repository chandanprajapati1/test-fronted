import { countries } from '@/data/countryCode';
import toCapitalizedCase from '@/utils/capitalized-case';
import React from 'react'
import { CheckmarkFilled } from '@carbon/icons-react';

const Overview = (props: any) => {

    const countryCode = countries[props.data.country_name as keyof typeof countries];
    const url = `https://flagsapi.com/${countryCode}/flat/64.png`;
    return (
        <div className='w-full flex flex-col pb-xl relative'>
            <div id="header" className=' flex justify-between items-center'>
                <div className='text-black text-f-3xl leading-lh-3xl font-semibold'>{toCapitalizedCase(props.data.name)}</div>
                <div className='flex flex-row'>
                    <div id="ck_verified" className='flex flex-row items-center px-m py-s bg-positiveSubtitle rounded-3xl'>
                        <CheckmarkFilled className="h-4 w-4" color="#0D9438"/>
                        <span className='ml-s  text-black text-f-xs font-semibold'>ENVR Verified</span>
                    </div>
                    {/*<button id="start_negotiation" className='flex flex-row items-center px-m py-s border-2 border-brand1-400 rounded-lg ml-l' onClick={startNegotiation}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M15 11H1V12H15V11Z" fill="#1A1A1A" />
                            <path d="M15 13H1V14H15V13Z" fill="#1A1A1A" />
                            <path d="M12 5C11.8022 5 11.6089 5.05865 11.4444 5.16853C11.28 5.27841 11.1518 5.43459 11.0761 5.61732C11.0004 5.80004 10.9806 6.00111 11.0192 6.19509C11.0578 6.38907 11.153 6.56725 11.2929 6.70711C11.4327 6.84696 11.6109 6.9422 11.8049 6.98079C11.9989 7.01937 12.2 6.99957 12.3827 6.92388C12.5654 6.84819 12.7216 6.72002 12.8315 6.55557C12.9414 6.39112 13 6.19778 13 6C13 5.73478 12.8946 5.48043 12.7071 5.29289C12.5196 5.10536 12.2652 5 12 5Z" fill="#1A1A1A" />
                            <path d="M8 8C7.60444 8 7.21776 7.8827 6.88886 7.66294C6.55996 7.44318 6.30362 7.13082 6.15224 6.76537C6.00087 6.39991 5.96126 5.99778 6.03843 5.60982C6.1156 5.22186 6.30608 4.86549 6.58579 4.58579C6.86549 4.30608 7.22186 4.1156 7.60982 4.03843C7.99778 3.96126 8.39991 4.00087 8.76537 4.15224C9.13082 4.30362 9.44318 4.55996 9.66294 4.88886C9.8827 5.21776 10 5.60444 10 6C9.9994 6.53025 9.7885 7.03861 9.41356 7.41356C9.03861 7.7885 8.53025 7.9994 8 8ZM8 5C7.80222 5 7.60888 5.05865 7.44443 5.16853C7.27998 5.27841 7.15181 5.43459 7.07612 5.61732C7.00043 5.80004 6.98063 6.00111 7.01921 6.19509C7.0578 6.38907 7.15304 6.56725 7.29289 6.70711C7.43275 6.84696 7.61093 6.9422 7.80491 6.98079C7.99889 7.01937 8.19996 6.99957 8.38268 6.92388C8.56541 6.84819 8.72159 6.72002 8.83147 6.55557C8.94135 6.39112 9 6.19778 9 6C8.99974 5.73486 8.89429 5.48066 8.70681 5.29319C8.51934 5.10571 8.26514 5.00026 8 5Z" fill="#1A1A1A" />
                            <path d="M4 5C3.80222 5 3.60888 5.05865 3.44443 5.16853C3.27998 5.27841 3.15181 5.43459 3.07612 5.61732C3.00043 5.80004 2.98063 6.00111 3.01921 6.19509C3.0578 6.38907 3.15304 6.56725 3.29289 6.70711C3.43275 6.84696 3.61093 6.9422 3.80491 6.98079C3.99889 7.01937 4.19996 6.99957 4.38268 6.92388C4.56541 6.84819 4.72159 6.72002 4.83147 6.55557C4.94135 6.39112 5 6.19778 5 6C5 5.73478 4.89464 5.48043 4.70711 5.29289C4.51957 5.10536 4.26522 5 4 5Z" fill="#1A1A1A" />
                            <path d="M14 10H2C1.73499 9.99933 1.48103 9.89375 1.29364 9.70636C1.10625 9.51897 1.00067 9.26501 1 9V3C1.00067 2.73499 1.10625 2.48103 1.29364 2.29364C1.48103 2.10625 1.73499 2.00067 2 2H14C14.265 2.00067 14.519 2.10625 14.7064 2.29364C14.8938 2.48103 14.9993 2.73499 15 3V9C14.9996 9.26511 14.8942 9.51925 14.7067 9.70671C14.5193 9.89417 14.2651 9.99964 14 10ZM14 3H2V9H14V3Z" fill="#1A1A1A" />
                        </svg>
                        <span className='ml-s text-black'>Start Negotiation</span>
                    </button>*/}
                </div>
            </div>
            <img src={`${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/project-images/${props.data.background_image}`} className='bg-cover my-l min-h-[300px] w-full max-h-[400px] bg-gray-500' />
            {/* <div id="follow" className='flex justify-end  items-center '>
                <div className='text-white font-semibold text-f-m py-s px-l bg-brand1-500 rounded-lg'>
                    {props.data.status.toUpperCase()}
                </div>
                <div id="start_negotiation" className='flex flex-row items-center px-m py-s border-2 border-brand1-400 rounded-lg ml-l'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 4H9.00004C9.00004 3.33696 8.73665 2.70107 8.26781 2.23223C7.79897 1.76339 7.16308 1.5 6.50004 1.5C5.837 1.5 5.20111 1.76339 4.73227 2.23223C4.26343 2.70107 4.00004 3.33696 4.00004 4H3.00004C3.00004 3.07174 3.36879 2.1815 4.02517 1.52513C4.68154 0.868749 5.57178 0.5 6.50004 0.5C7.4283 0.5 8.31854 0.868749 8.97491 1.52513C9.63129 2.1815 10 3.07174 10 4Z" fill="black" />
                        <path d="M12.5 7.5C12.2417 7.50093 11.9882 7.56991 11.765 7.7C11.6302 7.48619 11.4436 7.30992 11.2224 7.18754C11.0013 7.06516 10.7528 7.00065 10.5 7C10.2417 7.00093 9.98821 7.06991 9.76504 7.2C9.58313 6.91376 9.30959 6.69762 8.98904 6.58684C8.6685 6.47606 8.31987 6.47717 8.00004 6.59V4C8.00004 3.60218 7.84201 3.22064 7.5607 2.93934C7.2794 2.65804 6.89787 2.5 6.50004 2.5C6.10222 2.5 5.72069 2.65804 5.43938 2.93934C5.15808 3.22064 5.00004 3.60218 5.00004 4V9.55L3.88504 8.79C3.62944 8.59964 3.31873 8.49783 3.00004 8.5C2.70253 8.49927 2.41152 8.58702 2.16401 8.7521C1.9165 8.91719 1.72368 9.15215 1.61005 9.4271C1.49642 9.70206 1.46713 10.0046 1.52589 10.2963C1.58464 10.5879 1.72881 10.8555 1.94004 11.065L5.94004 14.715C6.50634 15.2219 7.24004 15.5015 8.00004 15.5H10.5C11.4283 15.5 12.3185 15.1313 12.9749 14.4749C13.6313 13.8185 14 12.9283 14 12V9C14 8.60217 13.842 8.22064 13.5607 7.93934C13.2794 7.65804 12.8979 7.5 12.5 7.5ZM13 12C13 12.663 12.7366 13.2989 12.2678 13.7678C11.799 14.2366 11.1631 14.5 10.5 14.5H8.00004C7.49464 14.5061 7.00423 14.3284 6.62004 14L2.64504 10.35C2.55267 10.2569 2.50059 10.1312 2.50004 10C2.50004 9.90714 2.5259 9.81612 2.57472 9.73713C2.62353 9.65815 2.69338 9.59431 2.77643 9.55279C2.85949 9.51126 2.95246 9.49368 3.04494 9.50202C3.13742 9.51036 3.22576 9.54429 3.30004 9.6L6.00004 11.45V4C6.00004 3.86739 6.05272 3.74021 6.14649 3.64645C6.24026 3.55268 6.36743 3.5 6.50004 3.5C6.63265 3.5 6.75983 3.55268 6.85359 3.64645C6.94736 3.74021 7.00004 3.86739 7.00004 4V9.5H8.00004V8C8.00004 7.86739 8.05272 7.74021 8.14649 7.64645C8.24025 7.55268 8.36743 7.5 8.50004 7.5C8.63265 7.5 8.75983 7.55268 8.85359 7.64645C8.94736 7.74021 9.00004 7.86739 9.00004 8V9.5H10V8.5C10 8.36739 10.0527 8.24021 10.1465 8.14645C10.2403 8.05268 10.3674 8 10.5 8C10.6326 8 10.7598 8.05268 10.8536 8.14645C10.9474 8.24021 11 8.36739 11 8.5V9.5H12V9C12 8.86739 12.0527 8.74021 12.1465 8.64645C12.2403 8.55268 12.3674 8.5 12.5 8.5C12.6326 8.5 12.7598 8.55268 12.8536 8.64645C12.9474 8.74021 13 8.86739 13 9V12Z" fill="black" />
                    </svg>
                    <span className='ml-s text-black text-f-m'>Follow for updates</span>
                </div>

            </div> */}
            <div className='sc-xs:max-w-[488px] w-full h-[236px] p-xl bg-brand3 absolute bottom-0 text-white sc-xs:left-3xl rounded-2xl flex flex-col ' >
                <div className='pb-l border-b border-neutral-100 text-f-m flex-1'>
                    {props.data.details ? props.data.details.length > 250 ? props.data.details.slice(0, 250) + "..." : props.data.details : "No details available"}
                </div>
                <div className='flex flex-row mt-l justify-between'>
                    <div id="ck_verified" className='flex flex-row items-center px-m py-s '>
                        <div className="w-xl z-10 h-xl  rounded-full flex items-center justify-center">
                            <img src={url} alt="text" className="bg-cover w-full h-full rounded-full " />
                        </div>
                        <span className='ml-s  text-white font-semibold'>{props.data.country_name}</span>
                    </div>
                    {props.data.details && props.data.details.length > 250 &&
                        <button id="start_negotiation" className='flex flex-row items-center py-s px-m bg-brand1-500 rounded-lg' onClick={() => { props.setShowProjectDetails(true) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M15.47 7.83C14.882 6.30882 13.861 4.99331 12.5334 4.04604C11.2058 3.09878 9.62977 2.56129 8.00003 2.5C6.37029 2.56129 4.79423 3.09878 3.46663 4.04604C2.13904 4.99331 1.11811 6.30882 0.530031 7.83C0.490315 7.93985 0.490315 8.06015 0.530031 8.17C1.11811 9.69118 2.13904 11.0067 3.46663 11.954C4.79423 12.9012 6.37029 13.4387 8.00003 13.5C9.62977 13.4387 11.2058 12.9012 12.5334 11.954C13.861 11.0067 14.882 9.69118 15.47 8.17C15.5097 8.06015 15.5097 7.93985 15.47 7.83ZM8.00003 12.5C5.35003 12.5 2.55003 10.535 1.53503 8C2.55003 5.465 5.35003 3.5 8.00003 3.5C10.65 3.5 13.45 5.465 14.465 8C13.45 10.535 10.65 12.5 8.00003 12.5Z" fill="white" />
                                <path d="M8.00003 5C7.40669 5 6.82667 5.17595 6.33332 5.50559C5.83997 5.83524 5.45546 6.30377 5.22839 6.85195C5.00133 7.40013 4.94192 8.00333 5.05768 8.58527C5.17343 9.16721 5.45915 9.70176 5.87871 10.1213C6.29827 10.5409 6.83282 10.8266 7.41476 10.9424C7.9967 11.0581 8.5999 10.9987 9.14808 10.7716C9.69626 10.5446 10.1648 10.1601 10.4944 9.66671C10.8241 9.17336 11 8.59334 11 8C11 7.20435 10.684 6.44129 10.1214 5.87868C9.55874 5.31607 8.79568 5 8.00003 5ZM8.00003 10C7.60447 10 7.21779 9.8827 6.88889 9.66294C6.55999 9.44318 6.30365 9.13082 6.15227 8.76537C6.0009 8.39991 5.96129 7.99778 6.03846 7.60982C6.11563 7.22186 6.30611 6.86549 6.58582 6.58579C6.86552 6.30608 7.22189 6.1156 7.60985 6.03843C7.99781 5.96126 8.39995 6.00087 8.7654 6.15224C9.13085 6.30362 9.44321 6.55996 9.66297 6.88886C9.88273 7.21776 10 7.60444 10 8C10 8.53043 9.78932 9.03914 9.41424 9.41421C9.03917 9.78929 8.53046 10 8.00003 10Z" fill="white" />
                            </svg>
                            <span className='ml-s text-white'>View More</span>
                        </button>}
                </div>
            </div>
        </div >
    )
}

export default Overview