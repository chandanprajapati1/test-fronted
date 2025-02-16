import Link from "next/link";
import React from "react";
import {ChevronLeft} from "@carbon/icons-react";

interface ProfileHeaderProps {
    title: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title }) => {
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-3">
                <Link
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-neutral-100/20"
                    href={"/profile"}>
                    <ChevronLeft className="w-5 h-5 text-tertiary"/>
                </Link>
                <div className="flex flex-col gap-1">
                    <h1 className="text-[32px] font-light text-neutral-1400">My Profile</h1>
                    <h2 className="text-sm font-semibold text-neutral-1200">{title}</h2>
                </div>
            </div>
        </div>
    )
};