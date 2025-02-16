import { useEffect, useState } from "react";

// components/ProjectCard.js
export default function ProjectCardMiniWithTag({ data }: any) {
    const [price, setPrice] = useState();


    const handleViewDetailsClick = (id: any) => {
        // Redirects to the project details page in a new tab
        window.open(`/project/${id}`, '_blank');
    };

    return (
        <div className="flex-1 bg-blue-50 rounded-xl shadow-md overflow-hidden border border-gray-300 ">

            <div className="relative ">
                <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/${data.background_image}`}
                    alt="Solar Project"
                    className="w-full h-96 object-cover rounded-xl"
                />
                <div className="absolute top-m left-m flex flex-col gap-xs">
                    <Badge text={data.country_name} />
                    {data.ck_assisted && <Badge text="ENVR Verified" />}
                    {data.negotiation && <Badge text="Negotiation" />}
                </div>
                <div className="absolute bottom-m left-m flex flex-col ">
                    <div className="mb-2xl text-f-3xl font-normal text-white font-instrument">
                        {data.name}
                    </div>
                    <div className="pl-m border-l border-neutral-500">
                        <p className="text-sm text-white text-f-xs">Standard</p>
                        <p className="text-brand1-500 text-f-2xl font-light">{data.registry ? data.registry.name : "NA"}</p>
                    </div>
                </div>
            </div>


            <div className="m-l flex flex-col gap-m justify-between h-[300px]">
                <div className="">
                    <p className="font-normal text-neutral-1200 text-f-m w-[70%]">
                        {(data.details && data.details.length > 100) ? data.details.slice(0, 100) + "..." : data.details}
                    </p>
                    <div className="text-start">
                        <p className="text-f-s text-gray-500 font-light">Estimated Credits</p>
                        <p className="text-f-2xl font-light text-black">{data.estimation_annual_estimated_reductions}  tCO₂e</p>
                    </div>
                    <div className="text-start">
                        <p className="text-f-s text-gray-500 font-light">Price</p>
                        <p className="text-f-2xl font-light text-black">{data.credit_price ? `$${data.credit_price}` : 'NA'}</p>
                    </div>

                    {data.sdg_goal_details?.length > 0 && <div className="flex space-x-2 w-xl h-xl bg-yellow-400">
                        {data.sdg_goal_details.map((sdg_goal_detail: any, index: any) => (
                            <img key={index} src={`${process.env.NEXT_PUBLIC_ESG_GOAL_ENDPOINT}/${sdg_goal_detail.hero_image.name}`} className='bg-conatain' />
                        ))}

                    </div>}
                </div>
                <div className="flex justify-between gap-m">
                    <button className="flex-1 items-center text-brand1-500 py-m text-f-xs border border-brand1-500 rounded-xl" onClick={() => { handleViewDetailsClick(data._id) }}>
                        View Details &rarr;
                    </button>
                    <button className="bg-brand1-500 text-white flex-1 py-m text-f-xs  hover:bg-brand1-600 rounded-xl">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}

// Badge Component
function Badge({ text }: any) {
    return (
        <div className="flex gap-s items-center justify-start py-xs  relative w-fit">
            <div className="absolute w-full h-full bg-gray-800 opacity-50 rounded-xl" />
            <div className="flex items-center pl-l">
                <div className="w-l z-10 h-l p-2xs  bg-pink-200"></div>
                <div className="z-10 text-white text-f-m px-2 py-1 rounded-full">
                    {text}
                </div>
            </div>

        </div>

    );
}
