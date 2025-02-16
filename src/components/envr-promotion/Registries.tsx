import React from 'react'

const Registries = () => {

    const cards = [
        {
            id: 1,
            logo: './promotion/frame3.png', // Update with your image path
            title: 'Carbon Registry',
        },
        {
            id: 2,
            logo: './promotion/frame1.png', // Update with your image path
            title: 'Puro Earth',
        },
        {
            id: 3,
            logo: './promotion/frame2.png', // Update with your image path
            title: 'Verra',
        },
    ];

    return (
        <div className="relative flex items-center justify-start bg-cover bg-center h-auto text-white bg-neutral-100">
            <div className='w-full bg-neutral-100 md:ml-[70px] border-l 2xl:ml-[142px] xl:ml-[400px]'>
                <div className='bg-neutral-100 w-full px-[50px]  mt-[110px] border-t relative py-[71px] 2xl:px-[144.5px] xl:px-[75px] '>
                    {/* <div className='h-full  absolute  -left-[42px]  top-0 w-[82px]'>
                        <div className='bg-white w-full flex flex-col items-center  gap-[10px] py-[11px] text-[40px] border'>

                            <div className='text-vertical text-[#6A6D74] rotate-180 py-[10px] font-normal'>REGISTRIES</div>
                            <div className='text-vertical rotate-180 py-[5px] text-brand1-300 bg-brand1-500'>04</div>
                        </div>
                    </div> */}
                    <div className='h-full  absolute  -left-[42px]  top-0 w-[82px] hidden md:block'>
                        <div className='bg-white w-full flex flex-col items-center  gap-[10px] py-[11px] text-[40px] border'>
                            <div className='text-vertical text-[#6A6D74] rotate-180 py-[10px] font-normal'>REGISTRIES</div>
                            <div className='text-vertical rotate-180 py-[5px] text-brand1-300 bg-brand1-500'>04</div>
                        </div>
                    </div>
                    <div className='h-full  relative  flex md:hidden'>
                        <div className='bg-white  flex  mb-xl items-center  gap-[10px] p-[11px] text-[24px] border'>
                            <div className=' p-[5px]  text-brand1-300 bg-brand1-500'>04</div>
                            <div className=' text-[#6A6D74]  py-[10px] font-normal'>REGISTRIES</div>
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-green-500  font-semibold flex items-center gap-m">

                            <div className='w-[10px] h-[10px] bg-brand1-500'></div>
                            <div className='text-[#6A6D74] text-f-m font-normal'>Tie Ups</div>
                        </div>
                        <h1 className="text-[30px] mt-2 mb-6 font-bold text-[#6A6D74]">With Registries</h1>
                        <div className="flex justify-center items-center flex-1 bg-gray-100 ">
                            <div className="flex flex-col flex-1 gap-1 md:flex-row">
                                {cards.map((card) => (
                                    <div
                                        key={card.id}
                                        className="bg-white p-[30px] pt-[60px] flex flex-1 flex-col items-center justify-between text-center gap-[24px]"
                                    >
                                        <div className=" ">
                                            <img src={card.logo} alt={card.title} className="w-full h-full object-contain" />
                                        </div>

                                        <div className=' w-full  h-[130px] flex flex-col justify-between'>
                                            <div className="flex items-center justify-center w-[56px] h-[56px] rounded-full border-[10px] border-gray-300 mb-[10px]">
                                                <span className="text-gray-600 text-[24px] font-normal ">{card.id}</span>
                                            </div>
                                            <div className='flex items-center gap-[26px] '>
                                                <hr className="w-[56px] border-t-2 border-black" />
                                                <h2 className="text-f-xl font-semibold text-[#3B3B3B]">{card.title}</h2>
                                            </div>


                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default Registries