'use client'
import React from 'react';
import Header from '@/components/common/Header';
import Footer from "@/components/common/Footer";
import { withAuth } from "@/components/auth/withAuth";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-brand1-10 text-neutral-1400 ">
            <Header />
            <div className={` flex-grow`}>
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default withAuth(AdminLayout);