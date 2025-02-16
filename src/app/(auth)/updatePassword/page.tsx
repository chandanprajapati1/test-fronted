'use client'
import AuthLayout from "../../../layouts/AuthLayout";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Routes } from "@/config/routes";
import { customToast } from "@/components/ui/customToast";
import { AxiosError } from "axios";
import axiosApi from "@/utils/axios-api";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import { encryptString } from "@/utils/enc-utils";
import { View, ViewOff } from '@carbon/icons-react';
import { isHtmlTagPresent } from "@/utils/input-utils";

interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

const signInFormSchema = yup.object().shape({
    password: yup.string().required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords should match!')
        .required('Please confirm password!').test('no-spaces', 'Password must not contain spaces', (value) => !/\s/.test(value || ''))
        .min(8, 'Password length should be minimum 8 characters.'),
});


const UpdatePassword = ({ searchParams }: PageProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signInFormSchema),
    });
    const token = searchParams.token as string;
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: any) => {
        if (isHtmlTagPresent({ new_password: data.password })) {
            customToast.error("Invalid Input!");
            return;
        }

        try {
            const requestBody = { token: token, new_password: data.password };
            let encryptedPayload = {};
            if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            const response = await axiosApi.auth.post(API_ENDPOINTS.ResetPassword, {
                data: encryptedPayload
            });

            if (response.status === 200) {
                customToast.success(response.data.message || "Password reset successful!");
                router.push(Routes.SignIn);
            }
        } catch (error) {

            if (error instanceof AxiosError && error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error(error.response.data.message || "Password reset failed. Please try again.");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("An error occurred. Please try again later.");
            }
        }
    };

    const handleTogglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <AuthLayout>
            <h1 className="text-f-3xl font-semibold text-center text-neutral-1400">Forgot Password</h1>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-y-6">
                <Input
                    label='New Password'
                    required={true}
                    inputClassName={'border-primary'}
                    registration={register('password')}
                    type='password'
                    id="password"
                    placeholder="Password"
                    onKeyDown={(e) => {
                        if (e.key === ' ') e.preventDefault(); // Prevent space input
                    }}
                    error={errors.password?.message}
                />

                <Input
                    label='Confirm Password'
                    required={true}
                    registration={register('confirmPassword')}
                    type={isPasswordVisible ? 'text' : 'password'}
                    id="password"
                    placeholder="Confirm password"
                    error={errors.confirmPassword?.message}
                    icon={isPasswordVisible ?
                        <View className="w-6 h-6 text-[#161616]" /> :
                        <ViewOff className="w-6 h-6 text-[#161616]" />
                    }
                    onIconClick={handleTogglePasswordVisibility}
                />

                <button type="submit" className="w-full h-14 bg-brand1-500 text-white rounded-lg">
                    Submit
                </button>
            </form>
        </AuthLayout>
    )
        ;
};

export default UpdatePassword;