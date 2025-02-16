import { countries } from "@/data/countryCode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WITHOUT_CREDITS_PROJECT_STATUS_IDS } from "@/utils/constants";
import toCapitalizedCase from "@/utils/capitalized-case";

export default function ProjectCard2({ data, activeToken }: any) {
    const [price, setPrice] = useState();
    const router = useRouter()

    useEffect(() => {

        const prices = data.batches.vintages.map((vintage: any) => vintage.per_credit_price);
        let minPrice: any = Math.min(...prices);
        setPrice(minPrice)
    }, [])

    const handleViewDetailsClick = (id: any) => {
        window.open(`/project/${id}`, '_blank');
    };

    const buyNowClickHandler = (id: any) => {
        window.open(`/project/${id}`, '_blank');
        localStorage.setItem("buyCredit", "true")
    }

    const countryCode = countries[data.country_name as keyof typeof countries];
    const url = `https://flagsapi.com/${countryCode}/flat/64.png`;

    const InfoBox = ({ label, value, unit }:{label:any, value:any, unit:any}) => (
        <div className="relative w-full">
            <div className="w-full h-14 border rounded-2xl mt-2">
                    <p className="absolute left-[16px] top-[3px] px-3 text-[10px] font-semibold text-left text-[#064a1c] bg-white">{label}</p>
                    <p className="font-semibold py-3 px-5">
                        <span className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-900">{value} </span>
                        <span className="text-sm text-neutral-1200">{unit}</span>
                    </p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-[#e6e6e6] justify-between shadow-lg">
            {/* Header Section */}
            <div className="flex flex-col gap-7">
                {/* Project Image */}
                <div className="w-full aspect-square sc-sm:w-auto sc-sm:h-auto bg-black/20 rounded-2xl flex relative">
                    <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/project-images/${data.background_image}`}
                        alt="Solar Project"
                        className="absolute w-full h-full object-cover rounded-xl "
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-xl"></div>
                    <div className="flex flex-col z-20  p-4">
                        <p className="text-sm text-[#eafff6]">Standard</p>
                        <p className="text-xl font-semibold text-white">{data.registry.name}</p>
                    </div>
                </div>

                {/* Project Details */}
                <div className="flex flex-col gap-2 flex-1">
                    <div className="flex flex-wrap gap-2 justify-end">
                        {data.country_name &&
						    <div className="flex items-center gap-2 px-4 py-1 rounded-lg bg-black/40 h-[30px]">
							    <img src={url} alt="Flag" className="w-4 h-4"/>
							    <span className="text-sm text-white uppercase">{data.country_name}</span>
						    </div>
                        }
                        <div className="flex items-center gap-2 px-4 py-1 rounded-lg bg-black/40 h-[30px]">
                            <img src='/ck.png' alt="Flag" className="w-4 h-4"/>
                            <span className="text-sm text-white">CK Verified</span>
                        </div>
                        {!WITHOUT_CREDITS_PROJECT_STATUS_IDS.includes(data?.project_status?._id) && data.negotiation &&
                            <div className="flex items-center gap-2 px-4 py-1 rounded-lg bg-black/40 h-[30px]">
                                <img src='/nego.png' alt="Flag" className="w-4 h-4"/>
                                <span className="text-sm text-white">Negotiable</span>
                            </div>
                        }
                    </div>

                    <h2 className="text-2xl text-[#064a1c] font-instrument line-clamp-2">{data.name.length > 50 ? toCapitalizedCase(data.name.slice(0, 50) + "..") : toCapitalizedCase(data.name)}</h2>
                    <p className="text-base text-neutral-1200 line-clamp-4">{data.details}</p>
                </div>
            </div>

            <div>
                {/* Info Boxes */}
                <div className="flex flex-col ">
                    <InfoBox label="ESTIMATED CREDITS" value={data.estimation_annual_estimated_reductions} unit="tCO2e"/>
                    <InfoBox label="PRICE" value={`$${price}`} unit="tCO2e"/>
                </div>

                {/* ESG Goals */}
                <div className="w-full border rounded-2xl p-4 mt-2 relative">
                    <p className="text-xs font-semibold uppercase absolute left-[16px] top-[-6px] px-3 text-[10px] text-[#064a1c]">ESG Goals</p>
                    <div className="flex gap-1">
                        {data.sdg_goals.map((sdg_goal_detail: any, index: any) => (
                            <div key={index}
                                 className={`w-8 h-8 border border-white flex items-center justify-center rounded-sm`}>
                                <img src={`${process.env.NEXT_PUBLIC_ESG_GOAL_ENDPOINT}/${sdg_goal_detail.hero_image.name}`}
                                     alt={`SDG ${index}`} className="w-6 h-6"/>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-[#E6E6E6] w-full my-4"/>


                {/* Action Buttons */}
                <div className="flex justify-between gap-m">
                    <button
                        className="flex-1 items-center text-brand1-500 py-l text-f-m border bg-white border-brand1-500  font-normal hover:border-brand1-600 hover:text-brand1-600 rounded-xl"
                        onClick={() => {
                            handleViewDetailsClick(data._id)
                        }}>
                        View Details &rarr;
                    </button>
                    {!WITHOUT_CREDITS_PROJECT_STATUS_IDS.includes(data?.project_status?._id) && activeToken && <button
			            className={`bg-brand1-500  font-normal text-white flex-1 py-l text-f-m rounded-xl ${Number(data.batches.total_credit) == 0 ? "cursor-default" : "hover:bg-brand1-600 "}`}
			            onClick={() => Number(data.batches.total_credit) == 0 ? undefined : buyNowClickHandler(data._id)}>
                        {Number(data.batches.total_credit) == 0 ? "Out Of Stock" : "Buy Now "}
		            </button>}
                </div>
            </div>
        </div>
    );
}

