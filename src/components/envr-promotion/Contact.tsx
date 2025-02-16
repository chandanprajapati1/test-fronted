"use client"
import React, { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = {
    width: '100%',
    height: '400px',
}

const center = {
    lat: 28.50110034329038,
    lng: 77.41024015767212,
}

const Contact = () => {


    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyCzlLupoNEHwRQPQM35rVdrc-PYgE1HU44',
    })

    const [map, setMap] = useState(null)

    const onLoad = React.useCallback(function callback(map: any) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center)
        map.fitBounds(bounds)
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map: any) {
        setMap(null)
    }, [])

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <div className="relative flex items-center justify-start bg-cover bg-center h-auto text-white bg-neutral-100">
            <div className='w-full bg-neutral-100 md:ml-[70px] border-l 2xl:ml-[140px] xl:ml-[400px]'>
                <div className='bg-neutral-100 w-full px-[50px] mt-[110px] border-t relative py-[71px] 2xl:px-[144.5px] xl:px-[75px] '>
                    {/* <div className='h-full  absolute  -left-[42px]  top-0 w-[82px]'>
                        <div className='bg-white w-full flex flex-col items-center  gap-[10px] py-[11px] text-[40px] border'>

                            <div className='text-vertical text-[#6A6D74] rotate-180 py-[10px] font-normal'>CONTACT</div>
                            <div className='text-vertical rotate-180 py-[5px] text-brand1-300 bg-brand1-500'>05</div>
                        </div>
                    </div> */}
                    <div className='h-full  absolute  -left-[42px]  top-0 w-[82px] hidden md:block'>
                        <div className='bg-white w-full flex flex-col items-center  gap-[10px] py-[11px] text-[40px] border'>
                            <div className='text-vertical text-[#6A6D74] rotate-180 py-[10px] font-normal'>CONTACT</div>
                            <div className='text-vertical rotate-180 py-[5px] text-brand1-300 bg-brand1-500'>05</div>
                        </div>
                    </div>
                    <div className='h-full  relative  flex md:hidden'>
                        <div className='bg-white  flex  mb-xl items-center  gap-[10px] p-[11px] text-[24px] border'>
                            <div className=' p-[5px]  text-brand1-300 bg-brand1-500'>05</div>
                            <div className=' text-[#6A6D74]  py-[10px] font-normal'>CONTACT</div>
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-green-500  font-semibold flex items-center gap-m">

                            <div className='w-[10px] h-[10px] bg-brand1-500'></div>
                            <div className='text-[#6A6D74] text-f-m font-normal'>Contact Info</div>
                        </div>
                        <h1 className="text-[30px] mt-2 mb-6 font-bold text-[#6A6D74]">Get in touch to list & sell</h1>
                        <div className=' flex flex-col gap-s text-black bg-neutral-100 lg:flex-row lg:gap-0'>
                            <div className='flex flex-1  px-[26px] py-[26px] items-center gap-[18.5px]  xl:pl-[43px] bg-white'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <path d="M26 29H25.83C6.18 27.87 3.39 11.29 3 6.23C2.96857 5.83658 3.01508 5.44082 3.13687 5.06541C3.25866 4.69 3.45332 4.3423 3.70971 4.04225C3.9661 3.7422 4.27918 3.49569 4.63101 3.31684C4.98283 3.13799 5.36649 3.03032 5.76 3H11.27C11.6706 2.99961 12.062 3.11951 12.3936 3.34416C12.7253 3.56881 12.9818 3.88787 13.13 4.26L14.65 8C14.7963 8.36355 14.8327 8.76208 14.7544 9.14609C14.6762 9.5301 14.4869 9.88267 14.21 10.16L12.08 12.31C12.4127 14.2007 13.3182 15.9437 14.6739 17.303C16.0296 18.6622 17.7701 19.5723 19.66 19.91L21.83 17.76C22.1115 17.4862 22.4674 17.3013 22.8533 17.2283C23.2392 17.1554 23.638 17.1977 24 17.35L27.77 18.86C28.1365 19.0129 28.4492 19.2714 28.6683 19.6027C28.8873 19.9339 29.0028 20.3229 29 20.72V26C29 26.7956 28.6839 27.5587 28.1213 28.1213C27.5587 28.6839 26.7956 29 26 29ZM6 5C5.73478 5 5.48043 5.10536 5.29289 5.29289C5.10535 5.48043 5 5.73478 5 6V6.08C5.46 12 8.41 26 25.94 27C26.0714 27.0081 26.2031 26.9902 26.3275 26.9473C26.4519 26.9045 26.5667 26.8374 26.6652 26.7501C26.7637 26.6628 26.8439 26.5568 26.9014 26.4384C26.9588 26.32 26.9923 26.1914 27 26.06V20.72L23.23 19.21L20.36 22.06L19.88 22C11.18 20.91 10 12.21 10 12.12L9.94 11.64L12.78 8.77L11.28 5H6Z" fill="#57CC99" />
                                    </svg>
                                </div>
                                <div className='flex flex-col gap-[6px]'>
                                    <div className='font-normal text-[19px] text-[#6A6D74]'>Reception Desk</div>
                                    <div className='font-normal text-f-m text-[#6A6D74]'>(+91) 9818483987</div>
                                </div>
                            </div>
                            <div className='flex flex-1 px-[26px]  py-[26px] items-center gap-[18.5px] xl:pl-[43px] bg-white'>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <path d="M16 30C13.2311 30 10.5243 29.1789 8.22202 27.6406C5.91973 26.1022 4.12532 23.9157 3.06569 21.3576C2.00607 18.7994 1.72882 15.9845 2.26901 13.2687C2.80921 10.553 4.14258 8.05845 6.10051 6.10051C8.05845 4.14258 10.553 2.80921 13.2687 2.26901C15.9845 1.72882 18.7994 2.00607 21.3576 3.06569C23.9157 4.12532 26.1022 5.91973 27.6406 8.22202C29.1789 10.5243 30 13.2311 30 16C30 19.713 28.525 23.274 25.8995 25.8995C23.274 28.525 19.713 30 16 30ZM16 4.00001C13.6266 4.00001 11.3066 4.70379 9.33316 6.02237C7.35977 7.34095 5.8217 9.21509 4.91345 11.4078C4.0052 13.6005 3.76756 16.0133 4.23058 18.3411C4.69361 20.6689 5.83649 22.8071 7.51472 24.4853C9.19296 26.1635 11.3312 27.3064 13.6589 27.7694C15.9867 28.2325 18.3995 27.9948 20.5922 27.0866C22.7849 26.1783 24.6591 24.6402 25.9776 22.6668C27.2962 20.6935 28 18.3734 28 16C28 12.8174 26.7357 9.76516 24.4853 7.51472C22.2348 5.26429 19.1826 4.00001 16 4.00001Z" fill="#57CC99" />
                                        <path d="M20.59 22L15 16.41V7.00001H17V15.58L22 20.59L20.59 22Z" fill="#57CC99" />
                                    </svg>
                                </div>
                                <div className='flex flex-col gap-[6px]'>
                                    <div className='font-normal text-[19px] text-[#6A6D74]'>Working Hours</div>
                                    <div className='font-normal text-f-m text-[#6A6D74]'>Monday - Friday / 08:00-17:00</div>
                                </div>
                            </div>
                            <div className='flex flex-1 px-[26px]  py-[26px] items-center gap-[18.5px]  xl:pl-[43px] bg-white'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <path d="M16 18C15.0111 18 14.0444 17.7068 13.2222 17.1573C12.3999 16.6079 11.7591 15.827 11.3806 14.9134C11.0022 13.9998 10.9032 12.9945 11.0961 12.0245C11.289 11.0546 11.7652 10.1637 12.4645 9.46447C13.1637 8.7652 14.0547 8.289 15.0246 8.09607C15.9945 7.90315 16.9998 8.00216 17.9134 8.3806C18.8271 8.75904 19.608 9.3999 20.1574 10.2221C20.7068 11.0444 21 12.0111 21 13C20.9985 14.3256 20.4712 15.5965 19.5339 16.5339C18.5965 17.4712 17.3256 17.9985 16 18ZM16 10C15.4067 10 14.8266 10.1759 14.3333 10.5056C13.84 10.8352 13.4554 11.3038 13.2284 11.8519C13.0013 12.4001 12.9419 13.0033 13.0577 13.5853C13.1734 14.1672 13.4591 14.7018 13.8787 15.1213C14.2982 15.5409 14.8328 15.8266 15.4147 15.9424C15.9967 16.0581 16.5999 15.9987 17.1481 15.7716C17.6962 15.5446 18.1648 15.1601 18.4944 14.6667C18.8241 14.1734 19 13.5933 19 13C18.9991 12.2046 18.6828 11.4421 18.1204 10.8796C17.5579 10.3172 16.7954 10.0009 16 10Z" fill="#57CC99" />
                                        <path d="M16 30L7.56451 20.0513C7.51661 19.9942 7.21631 19.5998 7.21631 19.5998C5.77521 17.7017 4.99663 15.3832 5.00001 13C5.00001 10.0826 6.15894 7.28473 8.22184 5.22183C10.2847 3.15893 13.0826 2 16 2C18.9174 2 21.7153 3.15893 23.7782 5.22183C25.8411 7.28473 27 10.0826 27 13C27.0036 15.3822 26.2255 17.6998 24.7852 19.5973L24.7837 19.5998C24.7837 19.5998 24.4837 19.9942 24.439 20.0472L16 30ZM8.81251 18.395C8.81251 18.395 9.04591 18.7032 9.09911 18.7694L16 26.9079L22.91 18.7579C22.9539 18.7027 23.1888 18.3922 23.1888 18.3922C24.3661 16.8413 25.0023 14.9471 25 13C25 10.6131 24.0518 8.32387 22.364 6.63604C20.6761 4.94821 18.387 4 16 4C13.6131 4 11.3239 4.94821 9.63605 6.63604C7.94822 8.32387 7.00001 10.6131 7.00001 13C6.9978 14.9482 7.63449 16.8433 8.81251 18.395Z" fill="#57CC99" />
                                    </svg>
                                </div>
                                <div className='flex flex-col gap-[6px]'>
                                    <div className='font-normal text-[19px] text-[#6A6D74]'>Address</div>
                                    <div className='font-normal text-f-m text-[#6A6D74]'> B1002, 10th Floor, Advant Navis Business Park, Sector 142, Noida, Uttar Pradesh</div>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white flex text-black mt-[50px]'>

                            <div className='flex-[1] bg-neutral-200'>
                                {isLoaded ? (
                                    <GoogleMap
                                        mapContainerStyle={containerStyle}
                                        center={center}
                                        onLoad={onLoad}
                                        onUnmount={onUnmount}
                                        zoom={1}
                                    >
                                        {/* Child components, such as markers, info windows, etc. */}
                                        <Marker position={center} />
                                    </GoogleMap>
                                ) : (
                                    <></>
                                )}

                            </div>
                        </div>
                    </div >
                </div >
            </div >

        </div >
    )
}

export default Contact