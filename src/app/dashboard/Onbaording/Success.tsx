import React, { useEffect } from 'react'
import Overlay from './Overlay'

const Success = (props: any) => {
    const closeHandler = () => {
        props.setHideSuccess(true)
    }

    useEffect(() => {
        setTimeout(() => {
            props.setHideSuccess(true)
        }, 2000)
    }, [])

    return (
        <Overlay>
            <div className='flex flex-col'>
                <div className=" bg-white mt-3xl relative px-xl pt-xl w-[452px] flex flex-col items-center rounded-lg pb-l">
                    <div className='flex justify-center bg-brand1-50  w-6xl h-6xl items-center rounded-full'>
                        <div className='flex justify-center bg-brand1-100 w-5xl h-5xl items-center rounded-full' >
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                                <rect width="50" height="50" fill="transparent" />
                                <path d="M25 3.125C20.6735 3.125 16.4442 4.40795 12.8469 6.8116C9.24959 9.21526 6.44581 12.6317 4.79014 16.6288C3.13448 20.6259 2.70128 25.0243 3.54533 29.2676C4.38938 33.5109 6.47277 37.4087 9.53205 40.468C12.5913 43.5272 16.4891 45.6106 20.7324 46.4547C24.9757 47.2987 29.3741 46.8655 33.3712 45.2099C37.3683 43.5542 40.7848 40.7504 43.1884 37.1531C45.5921 33.5558 46.875 29.3265 46.875 25C46.875 19.1984 44.5703 13.6344 40.468 9.53204C36.3656 5.42968 30.8016 3.125 25 3.125ZM21.875 33.7356L14.0625 25.9231L16.5478 23.4375L21.875 28.7644L33.4531 17.1875L35.9464 19.6655L21.875 33.7356Z" fill="#57CC99" />
                            </svg>
                        </div>
                    </div>
                    <div className='text-black font-light text-xl font-inter mt-l'>Your company has been registered successfully!</div>
                    <div className='text-black font-light text-m font-inter'>Your document is now under verification process.</div>
                    <div className='absolute top-3 right-3 cursor-pointer' onClick={closeHandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g opacity="0.5">
                                <path d="M18 7.05L16.95 6L12 10.95L7.05 6L6 7.05L10.95 12L6 16.95L7.05 18L12 13.05L16.95 18L18 16.95L13.05 12L18 7.05Z" fill="black" />
                            </g>
                        </svg>
                    </div>
                </div>

            </div>
        </Overlay>
    )
}

export default Success