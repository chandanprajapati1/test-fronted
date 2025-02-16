import { useRouter } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';

interface FloatingBarProps {
    scrollToSection: (id: string) => void;
    activeSection: string; // New prop to indicate active section
    openModal: any;
    activeToken: any;
}

const FloatingBar: React.FC<FloatingBarProps> = ({ scrollToSection, activeSection, openModal, activeToken }) => {
    const router = useRouter();
    const profileData = useSelector((state: any) => state?.profileDetail?.profileDetails);

    const buyNowClickHandler = () => {
        if (profileData?.organization?.status != 2) {
            router.push('/company-onboarding')
        }
        else {
            openModal
        }
    }

    return (
        <div className="hidden fixed bottom-6 left-0 right-0 z-50  lg:flex justify-end mx-xl space-x-2 items-end">
            {activeSection !== "footer" &&
                <div className='flex-1 bg-gray-900  bg-opacity-80  px-4 py-2 shadow-lg flex justify-evenly rounded-[150px]'>
                    <button
                        className={`text-white text-f-s px-4 py-2 rounded-[100px] text-base hover:bg-brand1-500 transition-all `}
                        onClick={() => scrollToSection('overview')}
                    >
                        Project Overview
                    </button>
                    <button
                        className={`text-white text-f-s px-4 py-2 rounded-[100px] text-base hover:bg-brand1-500 transition-all `}
                        onClick={() => scrollToSection('project-credits')}
                    >
                        Project Credits
                    </button>
                    <button
                        className={`text-white text-f-s px-4 py-2 rounded-[100px] text-base hover:bg-brand1-500 transition-all `}
                        onClick={() => scrollToSection('project-details')}
                    >
                        Project Details
                    </button>
                    <button
                        className={`text-white text-f-s px-4 py-2 rounded-[100px] text-base hover:bg-brand1-500 transition-all`}
                        onClick={() => scrollToSection('registry-details')}
                    >
                        Registry Details
                    </button>
                    <button
                        className={`text-white text-f-s px-4 py-2 rounded-[100px] text-base hover:bg-brand1-500 transition-all `}
                        onClick={() => scrollToSection('address')}
                    >
                        Address
                    </button>

                    <button
                        className={`text-white text-f-s px-4 py-2 rounded-[100px] text-base hover:bg-brand1-500 transition-all `}
                        onClick={() => scrollToSection('goals-met')}
                    >
                        Goals Met
                    </button>
                    <button
                        className={`text-white text-f-s px-4 py-2 rounded-[100px] text-base hover:bg-brand1-500 transition-all `}
                        onClick={() => scrollToSection('co-benefits')}
                    >
                        Co-benefits
                    </button>
                    <button
                        className={`text-white text-f-s px-4 py-2 rounded-[100px] text-base hover:bg-brand1-500 transition-all `}
                        onClick={() => scrollToSection('impacts')}
                    >
                        Impact & Performance
                    </button>
                    <button
                        className={`text-white text-f-s px-4 py-2 rounded-[100px] text-base hover:bg-brand1-500 transition-all `}
                        onClick={() => scrollToSection('location-gallery')}
                    >
                        Location
                    </button>
                    <button
                        className={`text-white text-f-s px-4 py-2 rounded-[100px] text-base hover:bg-brand1-500 transition-all `}
                        onClick={() => scrollToSection('carbon-impact')}
                    >
                        Carbon Impact
                    </button>
                    <button
                        className={`text-white text-f-s px-4 py-2 rounded-[100px] text-base hover:bg-brand1-500 transition-all `}
                        onClick={() => scrollToSection('documents')}
                    >
                        Documents
                    </button>
                </div>}
            {activeToken && <button className=' bg-brand1-500 w-7xl h-7xl flex justify-center items-center rounded-full hover:bg-brand1-400 shadow-sm shadow-brand1-200' onClick={buyNowClickHandler}>
                <svg className="w-8 h-8" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M5 15C5.55228 15 6 14.5523 6 14C6 13.4477 5.55228 13 5 13C4.44772 13 4 13.4477 4 14C4 14.5523 4.44772 15 5 15Z"
                        fill="currentColor" />
                    <path
                        d="M12 15C12.5523 15 13 14.5523 13 14C13 13.4477 12.5523 13 12 13C11.4477 13 11 13.4477 11 14C11 14.5523 11.4477 15 12 15Z"
                        fill="currentColor" />
                    <path
                        d="M2.4903 1.40195C2.46763 1.2886 2.40639 1.18661 2.317 1.11333C2.22761 1.04005 2.11559 0.999998 2 1H0V2H1.59L3.5097 11.5981C3.53237 11.7114 3.59361 11.8134 3.683 11.8867C3.77239 11.96 3.88441 12 4 12H13V11H4.41L4.01 9H13C13.1138 9 13.2241 8.96121 13.3129 8.89004C13.4016 8.81886 13.4634 8.71955 13.4881 8.6085L14.6222 3.5H13.5985L12.5991 8H3.81L2.4903 1.40195Z"
                        fill="currentColor" />
                    <path d="M10.793 3.293L9 5.086V1H8V5.086L6.207 3.293L5.5 4L8.5 7L11.5 4L10.793 3.293Z"
                        fill="currentColor" />
                </svg>
            </button>}
        </div >
    );
};

export default FloatingBar;
