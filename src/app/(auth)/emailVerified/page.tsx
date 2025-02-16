'use client'
import AuthLayout from "../../../layouts/AuthLayout";
import React, { useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { customToast } from "@/components/ui/customToast";
import axiosApi from "@/utils/axios-api";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import { Routes } from "@/config/routes";
import { AxiosError } from "axios";
import { encryptString } from "@/utils/enc-utils";

interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

const VerifyEmail = ({ searchParams }: PageProps) => {
    const router = useRouter();
    const token = searchParams.token as string;
    const toEmail = searchParams.email as string;
    const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failure' | 'missingToken'>('verifying');
    const hasCalledVerify = useRef(false);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const requestBody = { token: token };
                let encryptedData = {};
                if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                    encryptedData = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
                }
                const response = await axiosApi.auth.post(API_ENDPOINTS.VerifyMail, { data: encryptedData });

                if (response.status === 200) {
                    setVerificationStatus('success');
                    customToast.success('Email verification successful! Redirecting you to sign in...');
                    setTimeout(() => router.push(Routes.SignIn), 3000); // Delay redirection for better user experience
                } else {
                    setVerificationStatus('failure');
                    customToast.error('Email verification failed. Please try again.');
                }
            } catch (error: unknown) {

                if (error instanceof AxiosError && error.response) {
                    console.log(error.response.data.message || 'Email verification failed. Please try again.');
                } else {
                    console.log('An error occurred during email verification. Please try again later.');
                }

                setVerificationStatus('failure');
            }
        };

        if (token && !hasCalledVerify.current) {
            hasCalledVerify.current = true;
            verifyEmail();
        }
    }, [token, router]);


    switch (verificationStatus) {
        case 'verifying':
            return (
                <AuthLayout>
                    <div className="flex flex-col items-center text-center gap-8">
                        <p className="text-f-3xl font-semibold text-neutral-1400">Verifying your email</p>
                        <p className="text-base text-neutral-1200 ">
                            Please wait while we verify your email address...
                        </p>
                    </div>
                </AuthLayout>
            );

        case 'failure':
            return (
                <AuthLayout>
                    <div className="flex flex-col items-center text-center gap-y-3">
                        <p className="text-f-3xl font-semibold text-neutral-1400">Email verification failed</p>
                        <p className="text-base text-neutral-1200 ">
                            We couldn&apos;t verify your email. Please try again or contact our support team if the issue persists.
                        </p>
                        <p className="text-base text-neutral-1200 ">
                            <Link href='/signin' className="text-tertiary">Return to login</Link>
                            <br />or contact us through our
                            <Link href='/' className="text-tertiary"> help center</Link>
                            <br />if this issue persists.
                        </p>
                    </div>
                </AuthLayout>
            );

        case 'success':
            return (
                <AuthLayout>
                    <div className="flex flex-col items-center text-center gap-y-3">
                        <p className="text-f-3xl font-semibold text-neutral-1400">Email verified</p>
                        <p className="text-base text-neutral-1200 ">
                            Your email was successfully verified. You will be redirected to the sign-in page shortly.
                        </p>
                    </div>
                </AuthLayout>
            );

        case 'missingToken':
            return (
                <AuthLayout>
                    <div className="flex flex-col items-center text-center gap-y-3">
                        <p className="text-f-3xl font-semibold text-neutral-1400">Verification token is missing</p>
                        <p className="text-base text-neutral-1200 ">
                            We couldn&apos;t find a verification token. Please check the link you received or contact support.
                        </p>
                        <p className="text-base text-neutral-1200 ">
                            <Link href='/signin' className="text-tertiary">Return to login</Link>
                            <br />or contact us through our
                            <Link href='/' className="text-tertiary"> help center</Link>
                            <br />if this issue persists.
                        </p>
                    </div>
                </AuthLayout>
            );

        default:
            return null;
    }
};

export default VerifyEmail;
