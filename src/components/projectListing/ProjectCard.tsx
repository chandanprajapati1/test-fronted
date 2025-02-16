import { countries } from "@/data/countryCode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { WITHOUT_CREDITS_PROJECT_STATUS_IDS } from "@/utils/constants";
import toCapitalizedCase from "@/utils/capitalized-case";

// components/ProjectCard.js
export default function ProjectCard({ data, activeToken }: any) {
    const [price, setPrice] = useState();
    const router = useRouter()

    useEffect(() => {

        const prices = data.batches.vintages.map((vintage: any) => vintage.per_credit_price);
        let minPrice: any = Math.min(...prices);
        setPrice(minPrice)
    }, [])

    const profileData = useSelector((state: any) => state?.profileDetail?.profileDetails);
    const handleViewDetailsClick = (id: any) => {
        window.open(`/project/${id}`, '_blank');
    };

    const buyNowClickHandler = (id: any) => {
        // if (profileData?.organization?.status != 2) {
        //     router.push('/company-onboarding')
        // }
        // else {
        window.open(`/project/${id}`, '_blank');
        localStorage.setItem("buyCredit", "true")
        // }

    }

    const countryCode = countries[data.country_name as keyof typeof countries];
    const url = `https://flagsapi.com/${countryCode}/flat/64.png`;

    return (
        <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden border border-gray-300 hover:bg-neutral-50 hover:border hover:border-brand1-500">
            {/* Image Section */}
            <div className="relative h-[350px] bg-gray-400 rounded-xl border border-neutral-300 ">
                <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/project-images/${data.background_image}`}
                    alt="Solar Project"
                    className="w-full h-full object-cover rounded-xl "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent rounded-xl"/>
                {/* Badges */}
                <div className="absolute top-m left-m flex space-x-2">

                    {data.country_name && <Badge text={data.country_name} url={url}/>}
                    {data.ck_assisted && <Badge text="ENVR Verified" url='./ck.png'/>}
                    {!WITHOUT_CREDITS_PROJECT_STATUS_IDS.includes(data?.project_status?._id) && data.negotiation &&
                        <Badge text="Negotiable" url='./nego.png'/>}

                </div>
                <div className="absolute bottom-m left-m flex flex-col ">
                    <div className="mb-2xl text-f-3xl font-normal text-white font-instrument">
                        {data.name.length > 50 ? toCapitalizedCase(data.name.slice(0, 50) + "..") : toCapitalizedCase(data.name)}
                    </div>
                    <div className="pl-m border-l border-neutral-500">
                        <p className="text-sm text-white text-f-xs">Standard</p>
                        <p className="text-brand1-500 text-f-2xl font-light">{data.registry.name}</p>
                    </div>

                </div>

            </div>

            <div className="m-l flex flex-col h-[300px] justify-between">
                <div className="flex flex-col ">
                    <p className="font-normal text-neutral-1200 text-f-l w-full h-[100px]">
                        {data.details.length > 100 ? data.details.slice(0, 100) + "..." : data.details}
                    </p>
                    <div className="text-start">
                        <p className="text-f-s text-gray-500 font-light">Estimated Credits</p>
                        <p className="text-f-2xl font-light text-neutral-1400">{data.estimation_annual_estimated_reductions} tCO₂e</p>
                    </div>
                    {!WITHOUT_CREDITS_PROJECT_STATUS_IDS.includes(data?.project_status?._id) && (
                        <div className="text-start pb-s">
                            <p className="text-f-s text-gray-500 font-light">Price per Credit</p>
                            <p className="text-f-2xl font-light text-neutral-1400">{price ? `$${price}` : 'NA'}</p>
                        </div>
                    )}
                    {data.sdg_goals.length > 0 && <div className="flex space-x-2 w-xl h-xl bg-yellow-400">
                        {data.sdg_goals.map((sdg_goal_detail: any, index: any) => (
                            <img key={index} src={`${process.env.NEXT_PUBLIC_ESG_GOAL_ENDPOINT}/${sdg_goal_detail.hero_image.name}`} className='bg-conatain' />
                        ))}

                    </div>}
                </div>


                {/* Buttons */}
                <div className="flex justify-between gap-m">
                    <button className="flex-1 items-center text-brand1-500 py-l text-f-l border bg-white border-brand1-500  font-normal hover:border-brand1-600 hover:text-brand1-600 rounded-xl" onClick={() => { handleViewDetailsClick(data._id) }}>
                        View Details &rarr;
                    </button>
                    {!WITHOUT_CREDITS_PROJECT_STATUS_IDS.includes(data?.project_status?._id) && activeToken && <button className={`bg-brand1-500  font-normal text-white flex-1 py-l text-f-l rounded-xl ${data.batches.status == 2 ? Number(data.batches.total_credit) == 0 ? "cursor-default" : "hover:bg-brand1-600 " : "cursor-default"}`} onClick={() => data.batches.status == 2 ? Number(data.batches.total_credit) == 0 ? undefined : buyNowClickHandler(data._id) : undefined}>
                        {data.batches.status == 2 ? Number(data.batches.total_credit) == 0 ? "Out Of Stock" : "Buy Now " : "Expired"}
                    </button>}
                </div>
            </div>
        </div>
    );
}

// Badge Component
function Badge({ text, url }: any) {
    return (
        <div className="flex gap-s items-center justify-center py-xs px-l  relative">
            <div className="absolute w-full h-full bg-gray-800 opacity-70 rounded-xl" />
            <div className="flex items-center gap-s justify-start">
                <div className="w-xl z-10 h-xl  rounded-full flex items-center justify-center">
                    <img src={url} alt="text" className="bg-cover w-full h-full rounded-full " />
                </div>
                <div className="z-10 text-white text-s py-1  ">
                    {text}
                </div>
            </div>

        </div>

    );
}
