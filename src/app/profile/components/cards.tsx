'use client'
import React from 'react';
import { Card } from '@/components/ui/card';
import { SidebarProps } from "@/types";
import { useRouter } from 'next/navigation';
import { Address } from "@/components/ui/icons";
import { useSelector } from 'react-redux';
import { FaUser } from "react-icons/fa";


const Cards: React.FC<SidebarProps> = ({ menuItems }) => {
    const router = useRouter();
    const profileData = useSelector((state: any) => state?.profileDetail?.profileDetails);
    console.log("CardsCardsCardsCards", profileData)
    const handleCardClick = (path: string) => {
        if (path) {
            router.push(path);
        }
    };
    return (
        <div className="flex flex-col flex-grow gap-6 ">
            <div className='flex flex-col sc-sm:flex-row  justify-between sc-sm:items-center '>
                <h1 className="text-[32px] font-light text-neutral-1400">
                    My Profile
                </h1>
                <div className='bg-gray-300 rounded-lg flex items-center px-m gap-s'>
                    <FaUser />
                    <h1 className="text-f-xl font-light text-neutral-1400 ">
                        {profileData.email}
                    </h1>
                </div>

            </div>

            <div className="grid grid-cols-2 sc-xs:grid-cols-3 sc-md:grid-cols-4 w-full gap-6 ">
                {menuItems?.map((item, index) => (
                    <div key={index} className="flex flex-col justify-center items-center p-4 cursor-pointer rounded-md border shadow-none bg-white" onClick={() => handleCardClick(item.url as string)}>
                        <div className="flex justify-center items-center p-2.5 rounded-full">
                            <span className="text-neutral-600 p-2.5"> {/* Use valid Tailwind color */}
                                {item.icon}
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5">
                            <p className="text-sm font-semibold text-center text-neutral-1400">
                                {item.title}
                            </p>
                            <p className="text-sm text-center text-wrap text-neutral-1200">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cards;