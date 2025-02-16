'use client'
import AuthLayout from "../../../layouts/AuthLayout";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import { Routes } from "@/config/routes";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { customToast } from "@/components/ui/customToast";
import axiosApi from "@/utils/axios-api";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import { encryptString } from "@/utils/enc-utils";
import { isHtmlTagPresent } from "@/utils/input-utils";


interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

const signInFormSchema = yup.object().shape({
    email: yup.string().required('Email is required')
});

const ForgotPassword = ({ searchParams }: PageProps) => {
    const [verificationStatus, setVerificationStatus] = useState<'mailSent' | 'error'>('error');
    const { register, handleSubmit, formState: { errors }, getValues, trigger, watch, setValue } = useForm({
        resolver: yupResolver(signInFormSchema),
    });
    const [email, setEmail] = useState<any>(null)
    const router = useRouter();

    useEffect(() => {
        const emailParam = searchParams?.email;
        setEmail(emailParam)

        if (emailParam && typeof emailParam === 'string') {
            setValue('email', emailParam);
        }
    }, [searchParams?.email, setValue]);

    const onSubmit = async (data: any) => {
        if (isHtmlTagPresent({ email: data.email })) {
            customToast.error("Invalid Input!");
            return;
        }
        try {
            const requestBody = { email: data.email };
            console.log("email", data.email)
            console.log("email", data.email)
            console.log("email", data.email)
            console.log("email", data.email)
            console.log("email", data.email)
            console.log("email", data.email)
            console.log("email", data.email)
            let encryptedData = {};
            if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                encryptedData = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            const response = await axiosApi.auth.post(API_ENDPOINTS.SendPasswordReset, {
                data: encryptedData
            });
            if (response.status === 200) {
                setEmail(data.email)
                customToast.success("Please check your email.");
                setVerificationStatus('mailSent');
            } else {
                // This else block might not be necessary as non-200 responses will be caught in the catch block
                customToast.error(response.data.message || "Password reset request failed. Please try again.");
                setVerificationStatus('error');
            }
        } catch (error) {
            console.error('Error during password reset request:', error);
            // setVerificationStatus('error');
        }
    };

    const redirectToLogin = async (data: any) => {
        router.push(Routes.SignIn);
    }

    switch (verificationStatus) {
        case 'mailSent':
            return (
                <AuthLayout>
                    <img src='/mail.svg' className="flex items-center justify-center mx-auto mb-6 text-[#57cc99]"
                        alt="Edit" />
                    <div className="flex flex-col items-center text-center gap-8">
                        <p className="text-f-3xl font-semibold text-neutral-1400">Check Your Email</p>
                        <p className="text-base text-neutral-1200">
                            Please check the email address {email} for instructions to reset your password.
                        </p>
                        {/* <button type="submit" className="w-full h-14 bg-brand1-500 text-white rounded-lg mb-6">
                            Resend email
                        </button>*/}
                        <button onClick={redirectToLogin} className="w-full h-14 bg-brand1-500 text-white rounded-lg ">Sign In</button>
                    </div>
                </AuthLayout>
            );

        default:
            return (
                <AuthLayout>
                    <div className="flex flex-col items-center text-center gap-3">
                        <h1 className="text-f-3xl font-semibold text-center text-neutral-1400 mb-2">Reset Password</h1>
                        <p className="text-base text-center text-neutral-1200">
                            Enter your email address and we will send you instructions to reset your password.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
                        <Input
                            label='Email Address'
                            required={true}
                            registration={register('email')}
                            type="email"
                            inputClassName={'border-primary'}
                            id="email"
                            placeholder="Email Address"
                            onKeyDown={(e) => {
                                if (e.key === ' ') e.preventDefault();
                            }}
                            error={errors.email?.message}
                        />

                        <button type="submit" className="w-full h-14 bg-brand1-500 text-white rounded-lg">
                            Submit
                        </button>
                    </form>
                </AuthLayout>
            );
    }
};

export default ForgotPassword;