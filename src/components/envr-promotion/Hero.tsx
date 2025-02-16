import ShowcaseCard from "./ShowcaseCard";

export default function Hero({ projectDetails }: any) {
    return (
        <div className="relative  pt-[50px] lg:pt-[160px] items-start flex flex-col lg:flex-row justify-start mt-[100px] lg:mt-0 min-h-screen bg-cover bg-center text-white xl:items-center xl:pt-0 "
            style={{ backgroundImage: "url('./promotion/background.png')" }}>

            <div className="text-center z-10lex flex-col justify-start items-start pl-[40px] pt-[12px] 2xl:pl-[141px]  xl:pl-[375px] flex-1">
                <div className="text-[50px] leading-[50px]  md:text-[80px] md:leading-[80px]  text-start font-semibold  xl:text-[80px] xl:leading-[90px] 2xl:text-[100px] 2xl:leading-[140px] ">
                    <div >
                        SHOWCASE
                    </div>
                    <div  >
                        NEGOTIATE
                    </div>
                    <div>
                        SELL
                    </div>
                </div>
                <div className="text-[25px] leading-[36px] md:text-[30px] text-start font-light xl:text-[30px] xl:leading-[60px] 2xl:text-[45px] " >
                    <div >You generate carbon credits.</div>
                    <div >
                        We help you sell them better.
                    </div>
                </div>
            </div>
            {projectDetails && <div className="my-xl flex flex-1 px-xl mx-auto items-center relative lg:hidden  ">
                <ShowcaseCard details={projectDetails} />
            </div>}
        </div>
    );
}
