import { useState } from "react";
import { SlMenu } from "react-icons/sl";
export default function Sidebar({ SetShowSideBar, activeSection }: any) {
    const handleScroll = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="bg-greenPrimary z-20 text-white  xl:flex  xl:flex-col  xl:fixed xl:z-10 xl:top-0 xl:left-0 xl:h-screen " >
            <div className="hidden bg-green-900 py-[50px] px-[92px] xl:block">
                <div className="w-[156px] h-[121px]  relative flex justify-center items-center">
                    <div className="absolute   ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="246" height="121" viewBox="0 0 246 121" fill="none">
                            <g >
                                <path d="M55.0033 95.4711L54.1932 121H0.54895V119.965H1.35909C3.94165 119.965 5.93467 119.745 5.93467 114.58V53.5567C5.93467 48.3916 3.86938 48.171 1.21076 48.171H0.54895V47.1365H52.3485L53.4553 69.5694L52.4208 69.6416C51.8312 57.6151 48.4347 48.171 29.8433 48.171H19.2164C16.7822 48.171 14.9375 48.6883 14.9375 53.5567V83.589H35.8947C43.7907 83.589 45.3387 79.3824 45.3387 74.145H46.2972V93.9953H45.3387C45.3387 88.8302 43.7907 84.5513 35.8947 84.5513H14.9375V114.584C14.9375 119.6 16.9305 119.969 19.437 119.969H31.7603C50.3555 119.969 53.4553 107.425 54.0448 95.3988L55.0033 95.4711Z" fill="white" />
                                <path d="M117.281 47.1404V48.1749H116.471C113.889 48.1749 111.896 48.3955 111.896 53.5607V121.004H107.027L64.0099 52.3816V114.584C64.0099 119.749 66.003 119.969 68.6578 119.969H69.3957V121.004H57.5897V119.969H58.3998C60.9824 119.969 62.9754 119.749 62.9754 114.584V53.5607C62.9754 48.3955 60.9101 48.1749 58.2515 48.1749H57.5859V47.1404H71.3849L110.861 110.156V53.5607C110.861 48.3955 108.868 48.1749 106.213 48.1749H105.475V47.1404H117.281Z" fill="white" />
                                <path d="M125.691 52.2332C124.364 48.9128 122.443 48.1749 119.86 48.1749V47.1404H139.711V48.1749C137.425 48.1749 135.283 48.6922 135.283 51.2748C135.283 51.9404 135.432 52.7505 135.801 53.709L156.461 110.453L178.377 53.6367C178.746 52.6022 178.894 51.792 178.894 51.1264C178.894 48.6922 176.901 48.1749 174.687 48.1749V47.1404H186.493V48.1749C183.542 48.1749 181.549 48.6922 179.78 52.7505L153.513 121.004H150.71L125.695 52.2332H125.691Z" fill="white" />
                                <path d="M245.451 116.649C245.451 116.649 244.493 121.004 237.631 121.004C217.708 121.004 226.046 82.562 208.264 82.562H203.541V114.587C203.541 119.752 205.534 119.973 208.116 119.973H208.926V121.008H189.076V119.973H189.886C192.541 119.973 194.534 119.752 194.534 114.587V53.5643C194.534 48.3992 192.469 48.1786 189.738 48.1786H189.072V47.144H223.456C235.851 47.144 242.123 55.1123 242.123 64.853C242.123 74.5937 235.851 82.562 223.456 82.562H215.636C233.862 88.465 232.827 118.277 241.83 118.277C244.264 118.277 244.782 116.135 244.782 116.135L245.447 116.653L245.451 116.649ZM203.537 81.5997H215.415C227.293 81.5997 233.124 74.0727 233.124 64.8492C233.124 55.6258 227.293 48.1748 215.415 48.1748H207.816C205.381 48.1748 203.537 48.616 203.537 53.5605V81.5997Z" fill="white" />
                                <path d="M130.966 59.513C154.015 46.4975 152.726 23.3191 130.966 0C109.207 23.3191 107.917 46.4975 130.966 59.513Z" fill="#ABE063" />
                                <path d="M130.97 59.5092C137.546 35.8668 121.507 21.5163 91.9541 20.4932C92.9772 50.0462 107.328 66.0854 130.97 59.5092Z" fill="#D1E063" />
                                <path d="M115.444 25.2437C111.576 39.0351 116.422 51.2975 130.966 59.5092C130.966 59.5092 130.97 59.5092 130.974 59.5092C135.493 43.2645 129.335 31.4053 115.448 25.2437H115.444Z" fill="#57CC99" />
                                <path d="M136.44 71.2429C148.135 73.137 154.164 64.6743 153.076 50.4417C138.95 52.5107 132.02 60.2508 136.44 71.2429Z" fill="#8BD1BF" />
                            </g>
                            <defs>
                                <>
                                    <rect width="244.902" height="121" fill="white" transform="translate(0.54895)" />
                                </>
                            </defs>
                        </svg>
                    </div>

                </div>

            </div>

            <nav className="hidden bg-neutral-50 flex-1 xl:bg-opacity-50 2xl:bg-opacity-100 xl:block">
                <ul>
                    <li onClick={() => handleScroll("hero")} className="px-[30px] py-[15px] cursor-pointer hover:text-gray-300 border-b border-neutral-300 hover:bg-neutral-300">
                        <div className={`text-black font-bold text-f-l py-[20px] mr-2xl  border-r-4 ${activeSection == "hero" ? 'border-brand1-500' : "border-neutral-500-500"}`}>Home</div>
                    </li>
                    <li onClick={() => handleScroll("whyUs")} className="px-[30px] py-[15px] cursor-pointer hover:text-gray-300 border-b border-neutral-300 hover:bg-neutral-300">
                        <div className={`text-black font-bold text-f-l py-[20px] mr-2xl  border-r-4 ${activeSection == "whyUs" ? 'border-brand1-500' : "border-neutral-500-500"}`}>Why Us</div>
                    </li>
                    <li onClick={() => handleScroll("consulting")} className="px-[30px] py-[15px] cursor-pointer hover:text-gray-300 border-b border-neutral-300 hover:bg-neutral-300">
                        <div className={`text-black font-bold text-f-l py-[20px] mr-2xl  border-r-4 ${activeSection == "consulting" ? 'border-brand1-500' : "border-neutral-500-500"}`}>Consulting</div>
                    </li>
                    <li onClick={() => handleScroll("registries")} className="px-[30px] py-[15px] cursor-pointer hover:text-gray-300 border-b border-neutral-300 hover:bg-neutral-300">
                        <div className={`text-black font-bold text-f-l py-[20px] mr-2xl  border-r-4 ${activeSection == "registries" ? 'border-brand1-500' : "border-neutral-500-500"}`}>Registries</div>
                    </li>
                    <li onClick={() => handleScroll("contact")} className="px-[30px] py-[15px] cursor-pointer hover:text-gray-300 hover:bg-neutral-300">
                        <div className={`text-black font-bold text-f-l py-[20px] mr-2xl  border-r-4 ${activeSection == "contact" ? 'border-brand1-500' : "border-neutral-500-500"}`}>Contact</div>
                    </li>
                </ul>
            </nav>

            <div className=" bg-green-900 fixed top-0 left-0  w-screen py-[24px] px-[40px] flex justify-between items-center xl:hidden ">
                <div><svg xmlns="http://www.w3.org/2000/svg" width="122" height="60" viewBox="0 0 122 60" fill="none">
                    <g >
                        <path d="M27.0022 47.3411L26.6004 60.0001H0V59.4871H0.401723C1.68233 59.4871 2.67061 59.3777 2.67061 56.8165V26.5571C2.67061 23.9959 1.6465 23.8865 0.328168 23.8865H0V23.3735H25.6857L26.2346 34.4973L25.7216 34.5331C25.4292 28.5695 23.745 23.8865 14.5261 23.8865H9.25659C8.04954 23.8865 7.13482 24.143 7.13482 26.5571V41.4492H17.5268C21.4422 41.4492 22.2098 39.3632 22.2098 36.7662H22.6851V46.6093H22.2098C22.2098 44.0481 21.4422 41.9263 17.5268 41.9263H7.13482V56.8184C7.13482 59.306 8.12309 59.489 9.36598 59.489H15.4767C24.6974 59.489 26.2346 53.2689 26.5269 47.3053L27.0022 47.3411Z" fill="white" />
                        <path d="M57.8838 23.3752V23.8882H57.4821C56.2015 23.8882 55.2132 23.9976 55.2132 26.5588V60.0018H52.7991L31.4682 25.9742V56.8182C31.4682 59.3794 32.4565 59.4888 33.7729 59.4888H34.1388V60.0018H28.2846V59.4888H28.6863C29.9669 59.4888 30.9552 59.3794 30.9552 56.8182V26.5588C30.9552 23.9976 29.9311 23.8882 28.6128 23.8882H28.2827V23.3752H35.1252L54.7002 54.6228V26.5588C54.7002 23.9976 53.7119 23.8882 52.3955 23.8882H52.0296V23.3752H57.8838Z" fill="white" />
                        <path d="M62.0539 25.9006C61.3956 24.2541 60.4432 23.8882 59.1626 23.8882V23.3752H69.0057V23.8882C67.8722 23.8882 66.8104 24.1447 66.8104 25.4253C66.8104 25.7554 66.884 26.1571 67.0669 26.6324L77.3118 54.77L88.179 26.5966C88.362 26.0836 88.4355 25.6818 88.4355 25.3518C88.4355 24.1447 87.4473 23.8882 86.3496 23.8882V23.3752H92.2038V23.8882C90.7403 23.8882 89.752 24.1447 88.875 26.1571L75.8501 60.0018H74.4601L62.0558 25.9006H62.0539Z" fill="white" />
                        <path d="M121.439 57.8424C121.439 57.8424 120.964 60.0019 117.561 60.0019C107.682 60.0019 111.816 40.9398 102.999 40.9398H100.657V56.8201C100.657 59.3813 101.645 59.4907 102.926 59.4907H103.327V60.0037H93.4843V59.4907H93.886C95.2025 59.4907 96.1907 59.3813 96.1907 56.8201V26.5608C96.1907 23.9996 95.1666 23.8902 93.8125 23.8902H93.4824V23.3772H110.532C116.679 23.3772 119.789 27.3284 119.789 32.1585C119.789 36.9886 116.679 40.9398 110.532 40.9398H106.654C115.692 43.8669 115.179 58.6496 119.643 58.6496C120.85 58.6496 121.107 57.5877 121.107 57.5877L121.437 57.8442L121.439 57.8424ZM100.655 40.4627H106.545C112.435 40.4627 115.326 36.7302 115.326 32.1566C115.326 27.583 112.435 23.8883 106.545 23.8883H102.777C101.57 23.8883 100.655 24.1071 100.655 26.5589V40.4627Z" fill="white" />
                        <path d="M64.6699 29.5106C76.0992 23.0566 75.4598 11.5632 64.6699 0C53.8799 11.5632 53.2406 23.0566 64.6699 29.5106Z" fill="#ABE063" />
                        <path d="M64.6718 29.5087C67.9327 17.7852 59.9793 10.6692 45.325 10.1619C45.8323 24.8163 52.9482 32.7696 64.6718 29.5087Z" fill="#D1E063" />
                        <path d="M56.9729 12.5176C55.0549 19.3563 57.4577 25.4368 64.6698 29.5087C64.6698 29.5087 64.6717 29.5087 64.6736 29.5087C66.9142 21.4535 63.8607 15.5729 56.9748 12.5176H56.9729Z" fill="#57CC99" />
                        <path d="M67.3839 35.3271C73.1834 36.2663 76.1728 32.0699 75.6334 25.0125C68.6287 26.0384 65.1924 29.8765 67.3839 35.3271Z" fill="#8BD1BF" />
                    </g>
                    <defs>
                        <>
                            <rect width="121.439" height="60" fill="white" />
                        </>
                    </defs>
                </svg></div>
                <div className=" cursor-pointer">
                    <SlMenu size={40} onClick={() => { SetShowSideBar((prev: any) => !prev) }} />
                </div>
            </div>
        </div>
    );
}
