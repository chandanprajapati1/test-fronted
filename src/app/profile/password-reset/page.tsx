'use client'
import { useRouter } from "next/navigation";
import Input from '@/components/ui/input';
import { customToast } from "@/components/ui/customToast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/app/profile/components/sidebar";
import { sidebarMenuItems } from "@/app/profile/components/menuItems";
import React, { useState } from "react";
import AdminLayout from "@/components/layouts/admin";
import axiosApi from "@/utils/axios-api";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import { ProfileHeader } from "@/app/profile/components/ProfileHeader";
import { encryptString } from "@/utils/enc-utils";
import { View, ViewOff } from '@carbon/icons-react';
import Cookies from "js-cookie";
import { AUTH_CRED } from "@/utils/constants";
import { isHtmlTagPresent } from "@/utils/input-utils";

const formSchema = yup.object().shape({
    old_password: yup.string().required('Old password is required'),
    new_password: yup.string().required('New password is required').min(8, 'Password length should be minimum 8 characters.'),
    confirm_password: yup.string().required('Confirm password is required').oneOf([yup.ref('new_password')], 'Passwords should match!'),
});

const ResetPasswordPage = () => {
    const router = useRouter();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: yupResolver(formSchema)
    });

    const handleTogglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };


    const handlePasswordReset = async (data: any) => {
        if (isHtmlTagPresent(data)) {
            customToast.error("Invalid Input!");
            return;
        }
        try {
            const requestBody = data;
            let encryptedPayload = {};
            if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            const response = await axiosApi.auth.post(API_ENDPOINTS.ChangePassword, { data: encryptedPayload });
            if (response.status === 200) {
                Cookies.remove(AUTH_CRED);
                customToast.success('Password updated successfully, please login again');
            }
            console.log(data, response);
        } catch (error) {
            //  customToast.error('Failed to update password');
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <AdminLayout>
            <div className="flex flex-col w-full justify-center mx-auto max-w-screen-sc-2xl ">
                <div className="flex flex-col sc-sm:flex-row gap-6 p-6">
                    <Sidebar menuItems={sidebarMenuItems} />
                    <div className="flex flex-col gap-6 flex-1">
                        <ProfileHeader title='Login Security' />
                        <div className="flex justify-start items-start">
                            <div className="flex-grow">
                                <Card
                                    className="flex flex-col rounded-2xl bg-white shadow-[0px_1.5px_23px_3px_rgba(0,0,0,0.08)]">
                                    <div className="px-6 py-4 border-b border-neutral-200">
                                        <h2 className="text-f-3xl font-light text-neutral-1400">
                                            Reset Password
                                        </h2>
                                    </div>

                                    <form
                                        onSubmit={handleSubmit(handlePasswordReset)}
                                        className="flex flex-col gap-6 p-6"
                                    >
                                        <div className="space-y-6">
                                            <Input
                                                label="Old Password"
                                                type={isPasswordVisible ? 'text' : 'password'}
                                                placeholder="Enter Old Password"
                                                registration={register('old_password')}
                                                error={errors.old_password?.message}
                                                inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[42px]'
                                                icon={isPasswordVisible ?
                                                    <View className="w-6 h-6 text-[#161616]" /> :
                                                    <ViewOff className="w-6 h-6 text-[#161616]" />
                                                }
                                                onIconClick={handleTogglePasswordVisibility}
                                                className='text-black'
                                            />
                                            <Input
                                                label="New Password"
                                                type={isPasswordVisible ? 'text' : 'password'}
                                                placeholder="Enter New Password"
                                                registration={register('new_password')}
                                                error={errors.new_password?.message}
                                                inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[42px]'
                                            />

                                            <Input
                                                label="Re-Enter New Password"
                                                type={isPasswordVisible ? 'text' : 'password'}
                                                placeholder="Re-Enter New Password"
                                                registration={register('confirm_password')}
                                                error={errors.confirm_password?.message}
                                                inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[42px]'
                                            />
                                        </div>

                                        <div className="h-px bg-neutral-200" />

                                        <div className="flex justify-end gap-4">
                                            {/*<Button
                                                    type="button"
                                                    onClick={handleCancel}
                                                    variant="secondary"
                                                    className="h-12 px-6 bg-neutral-1000 text-white hover:bg-neutral-900"
                                                >
                                                    Cancel
                                                </Button>*/}
                                            <Button
                                                type="submit"
                                                className="h-12 px-6 bg-primary text-white hover:bg-primary/90"
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                    </form>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>

    );
};

export default ResetPasswordPage;