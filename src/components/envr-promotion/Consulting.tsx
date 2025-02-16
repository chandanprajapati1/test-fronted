import Image from 'next/image';
import React from 'react'

const Consulting = () => {
    const features = [
        {
            title: 'Expert Advisory Team',
            imgSrc: '/promotion/member1.png', // Add your image paths
        },
        {
            title: 'Strategic Insights',
            imgSrc: '/promotion/member2.png',
        },
        {
            title: 'Market Analysis',
            imgSrc: '/promotion/member3.png',
        },
    ];

    return (
        <div className="relative flex items-center justify-start bg-cover bg-center h-auto text-white  bg-neutral-100">
            <div className='w-full bg-neutral-100 md:ml-[70px] border-l 2xl:ml-[142px] xl:ml-[400px] '>
                <div className='bg-neutral-100 w-full px-[50px] mt-[110px] border-t relative py-[71px] 2xl:px-[144.5px] xl:px-[75px]'>

                    <div className='h-full  absolute  -left-[42px]  top-0 w-[82px] hidden md:block'>
                        <div className='bg-white w-full flex flex-col items-center  gap-[10px] py-[11px] text-[40px] border'>
                            <div className='text-vertical text-[#6A6D74] rotate-180 py-[10px] font-normal'>CONSULTING</div>
                            <div className='text-vertical rotate-180 py-[5px] text-brand1-300 bg-brand1-500'>03</div>
                        </div>
                    </div>
                    <div className='h-full  relative  flex md:hidden'>
                        <div className='bg-white  flex  mb-xl items-center  gap-[10px] p-[11px] text-[24px] border'>
                            <div className=' p-[5px]  text-brand1-300 bg-brand1-500'>03</div>
                            <div className=' text-[#6A6D74]  py-[10px] font-normal'>CONSULTING</div>
                        </div>
                    </div>


                    <div >
                        <div className="text-sm text-green-500  font-semibold flex items-center gap-m ">

                            <div className='w-[10px] h-[10px] bg-brand1-500'></div>
                            <div className='text-[#6A6D74] text-f-m font-normal'>Connect With</div>
                        </div>
                        <h1 className="text-[30px] mt-2 mb-6 font-bold text-[#6A6D74]">For Smarter Decisions</h1>
                        <div className="flex flex-col justify-center items-center gap-[23.5px] bg-gray-100 md:flex-row ">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-transparent shadow-lg overflow-hidden flex flex-col flex-1 bg-neutral-100  w-full"
                                >
                                    <div className="relative h-[180px] xl:h-[392.48px] ">
                                        <Image
                                            src={feature.imgSrc}
                                            alt={feature.title}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                    <div className="text-center pt-[30px] pb-[52px] bg-white h-[150px]">
                                        <h3 className="text-xl font-semibold text-gray-700 flex items-center justify-center  px-s h-full">
                                            <div className="text-green-600 2xl:text-[25px] xl:text-[18px] ">
                                                —
                                            </div>
                                            <div className='text-[#6A6D74] px-s'>
                                                {feature.title}
                                            </div>
                                            <div className="text-green-600 ">
                                                —
                                            </div>
                                            {/* <span className="text-green-600 2xl:text-[25px] xl:text-[18px]">—</span> 
                                            <span className="text-green-600">—</span> */}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Consulting