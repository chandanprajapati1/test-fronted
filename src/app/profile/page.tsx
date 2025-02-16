'use client'
import React from 'react';
import Sidebar from "@/app/profile/components/sidebar";
import Cards from "@/app/profile/components/cards";
import { sidebarMenuItems } from "@/app/profile/components/menuItems";
import AdminLayout from "@/components/layouts/admin";
export default function Page() {
    return (
        <AdminLayout>
            <div className="flex flex-col w-full justify-center mx-auto max-w-screen-sc-2xl ">
                <div className="sc-sm:flex-row flex flex-col gap-6 p-6">
                    <Sidebar menuItems={sidebarMenuItems} />
                    <Cards menuItems={sidebarMenuItems} />
                </div>
            </div>
        </AdminLayout>
    );
};