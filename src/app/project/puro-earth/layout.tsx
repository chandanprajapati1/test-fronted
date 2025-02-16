'use client'
import Header from '@/components/common/Header';
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen grid grid-rows-layout bg-neutral-100 relative">
            <Header />
            <div className={``}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
