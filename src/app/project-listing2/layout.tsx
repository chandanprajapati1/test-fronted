'use client'
import Header from '@/components/common/Header';
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="h-screen grid grid-rows-layout bg-neutral-100">
            <Header />
            {children}
        </div>
    );
};

export default Layout;