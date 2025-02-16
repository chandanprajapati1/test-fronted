import type { ChildrenProps } from '@/types';
import {siteSettings} from "@/config";
import Link from "next/link";
import 'react-toastify/dist/ReactToastify.css';
import {Routes} from "@/config/routes";
import React from "react";
export default function AuthLayout({ children }: ChildrenProps) {
    const logoUrl = siteSettings?.logo?.url || '/api/placeholder/64/32';
    const logoAlt = siteSettings?.logo?.alt || 'Company Logo';
    return (
        <div className="bg-brand1-10 flex flex-col items-center min-h-screen px-5 sc-sm:px-20 py-8 auth">
            <div className="flex-1 flex flex-col w-full justify-between sc-sm:px-24 sc-sm:pb-8 gap-y-20">
                <div className="flex justify-center pt-8">
                    <img src={logoUrl} alt={logoAlt} className="w-16 h-8"/>
                </div>
                <div className="flex justify-center items-center">
                    <div className="flex flex-col w-full max-w-[496px] gap-y-8">
                        {children}
                    </div>
                </div>
                <div className="flex justify-center">
                    <Link href={Routes.Terms} className="text-tertiary mx-2 underline">Terms of use</Link>
                    <span className="text-neutral-200 mx-2">|</span>
                    <Link href={Routes.PrivacyPolicy} className="text-tertiary mx-2 underline">Privacy Policy</Link>
                </div>
            </div>
        </div>
    );
}