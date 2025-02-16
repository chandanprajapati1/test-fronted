'use client'
import { useRouter } from "next/navigation";
import { customToast } from "@/components/ui/customToast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Sidebar from "@/app/profile/components/sidebar";
import { sidebarMenuItems } from "@/app/profile/components/menuItems";
import React from "react";
import AdminLayout from "@/components/layouts/admin";

const formSchema = yup.object().shape({
    oldPassword: yup.string().required('Company name is required'),
    newPassword: yup.string().required('Country is required'),
    confirmPassword: yup.string().required('Country is required'),
});

const Orders = () => {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: yupResolver(formSchema),
    });
    const handlePasswordReset = async (data: any) => {
        try {
            // Call your API to reset password
            //await resetPassword(data);
            customToast.success('Password updated successfully');
            await router.push('/settings');
        } catch (error) {
            customToast.error('Failed to update password');
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <AdminLayout>
            <div className="flex flex-col w-full justify-center mx-auto max-w-screen-sc-2xl ">
                <div className="sc-sm:flex-row flex flex-col gap-6 p-6">
                    <Sidebar menuItems={sidebarMenuItems}/>
                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex flex-col gap-1">
                        <h1 className="text-[32px] font-light text-neutral-1400">My Profile</h1>
                            <h2 className="text-sm font-semibold text-neutral-1200">Orders</h2>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>

    )
        ;
};

export default Orders;