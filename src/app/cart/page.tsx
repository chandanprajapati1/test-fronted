'use client';
import Cart from "@/components/cart/Cart";
import Footer from "@/components/common/Footer";
import React from "react";
import AdminLayout from "@/components/layouts/admin";

const Page: React.FC = () => {

    return (
        <AdminLayout>
            <Cart />
        </AdminLayout>
    );
};

export default Page;
