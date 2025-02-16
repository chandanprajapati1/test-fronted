import { countries } from "@/data/countryCode";

export default function ShowcaseCard({ details }: any) {
    const countryCode = countries[details.country as keyof typeof countries];
    const url = `https://flagsapi.com/${countryCode}/flat/64.png`;
    return (
        <div className="bg-white w-full shadow-md text-black lg:w-[375.75px] p-[24px] rounded-xl ">
            <div className="rounded-xl  mb-4 w-full h-[258px] bg-neutral-400 relative ">
                {/* {details.image} */}
                {details.image && <img src={details.image} alt="" className="w-full h-full rounded-xl bg-neutral-400" />}
                {details.registry && <div className="absolute m-l top-0 left-0 text-white">
                    <div className="font-normal font-semibold  text-f-m ">Standard</div>
                    <div className="font-semibold  text-f-2xl">{details.registry ? details.registry : 'NA'}</div>
                </div>}
                {details.url && <div className="absolute m-l bottom-0 right-0  ">
                    <div className="w-[60px] h-[60px] bg-black flex justify-center items-center bg-opacity-50 rounded-full hover:bg-opacity-70" onClick={() => {
                        window.open(details.url)
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                            <rect width="24" height="24" transform="translate(0.875)" />
                            <path d="M14.375 4.5L13.3025 5.54475L18.9875 11.25H3.875V12.75H18.9875L13.3025 18.4298L14.375 19.5L21.875 12L14.375 4.5Z" fill="white" />
                        </svg>
                    </div>
                </div>}
                {details.country && <div className=" absolute m-l top-0 right-0  ">
                    <div className="bg-neutral-800 bg-opacity-50 flex px-m py-s gap-m rounded-xl items-center">
                        <div className="w-xl z-0 h-xl  rounded-full flex items-center justify-center">
                            <img src={url} alt="text" className="bg-cover w-full h-full rounded-full " />
                        </div>
                        <span className="text-f-m text-white"> {details.country ? details.country : "NA"}</span>
                    </div>

                </div>}
            </div>



            {details.description && <div className="mt-m">
                <h2 className="text-[#064A1C] font-serif text-xl font-bold">{details.project_name ? details.project_name.replace('_', " ") : 'NA'}</h2>
                <p className="text-gray-600 text-sm mt-xs">
                    {details.description.length > 100 ? details.description.slice(0, 100) + "..." : details.description}
                </p>
            </div>}
            <div className="flex flex-col sm:flex-row gap-l lg:flex-col mt-3xl">
                {details.er && <div className="flex flex-1 justify-between items-center relative  py-l px-3xl rounded-2xl border border-brand1-200">
                    <div className="text-green-900 font-semibold -top-2 px-xl left-[15px] text-xs absolute bg-white ">ESTIMATED CREDITS</div>
                    <div className="flex gap-s items-end">
                        <div className=" font-bold text-xl estimated">{details.er}</div>
                        <div className=" font-bold text-m text-neutral-1200 ">tCO₂e</div>

                    </div>

                </div>}
                {details.sdg && <div className="flex flex-1 justify-between items-center py-l relative px-xl rounded-2xl  border border-brand1-200 ">
                    <div className="text-green-900 font-semibold -top-2 px-s left-[15px] text-xs absolute bg-white">ESG GOALS</div>
                    <div className="w-full  overflow-x-scroll hide-scrollbar ">
                        <div className="flex text-greenPrimary font-bold text-xl w-2xl h-2xl gap-[4px] ">
                            {details.sdg.map((data: any, index: any) => (
                                <img key={index} src={`${process.env.NEXT_PUBLIC_ESG_GOAL_ENDPOINT}/${data.image}`} alt="text" className="bg-cover w-full h-full" />
                            ))}
                        </div>
                    </div>

                </div>}
            </div>

        </div>
    );
}
