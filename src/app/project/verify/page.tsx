'use client'
import AuthLayout from "../../../layouts/AuthLayout";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { customToast } from "@/components/ui/customToast";
import axiosApi from "@/utils/axios-api";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import { Routes } from "@/config/routes";
import { AxiosError } from "axios";

interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

const VerifyICR = ({ searchParams }: PageProps) => {
    const router = useRouter();
    const state = searchParams.state as string;
    const installationId = searchParams.installationId as string;
    const event = searchParams.event as string;
    const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failure' | 'timer' | 'missingToken'>('verifying');
    const [timeLeft, setTimeLeft] = useState(15); // 5 minutes in seconds

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response: any = await axiosApi.icr.get(API_ENDPOINTS.ICRAuth, {
                    params: {
                        installationId,
                        event,
                        state
                    }
                });

                if (response.status === 200) {
                    setVerificationStatus('timer');
                    customToast.success('Email verification successful! Fetching data...');
                } else {
                    setVerificationStatus('failure');
                    customToast.error('Email verification failed. Please try again.');
                }
            } catch (error) {
                console.error('Error during email verification:', error);

                if (error instanceof AxiosError && error.response) {
                    customToast.error(error.response.data.message || 'Email verification failed. Please try again.');
                } else {
                    customToast.error('An error occurred during email verification. Please try again later.');
                }

                setVerificationStatus('failure');
            }
        };

        verifyEmail();
    }, [event, installationId, router, state]);

    // Timer countdown
    useEffect(() => {
        if (verificationStatus === 'timer' && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearInterval(timer); // Cleanup on unmount
        }

        // Redirect when timer hits 0
        if (timeLeft === 0) {
            router.push(Routes.ICRproject);
        }
    }, [verificationStatus, timeLeft, router]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    switch (verificationStatus) {
        case 'verifying':
            return (
                <AuthLayout>
                    <div className="flex flex-col items-center text-center gap-8">
                        <p className="text-f-3xl font-semibold text-neutral-1400">Verifying your data</p>
                        <p className="text-base text-neutral-1200 w-[496px]">
                            Please wait while we verify data...
                        </p>
                    </div>
                </AuthLayout>
            );

        case 'failure':
            return (
                <AuthLayout>
                    <div className="flex flex-col items-center text-center gap-8">
                        <p className="text-f-3xl font-semibold text-neutral-1400">Email verification failed</p>
                        <p className="text-base text-neutral-1200 w-[496px]">
                            We could not verify your email. Please try again or contact our support team if the issue persists.
                        </p>
                        <p className="text-base text-neutral-1200 w-[496px]">
                            <Link href='/signin' className="text-tertiary">Return Back</Link>
                        </p>
                    </div>
                </AuthLayout>
            );

        case 'timer':
            return (
                <AuthLayout>
                    <div className="flex flex-col items-center text-center gap-8">
                        <p className="text-f-3xl font-semibold text-neutral-1400">Fetching Data</p>
                        <p className="text-base text-neutral-1200 w-[496px]">
                            Your email was successfully verified. Fetching data in {formatTime(timeLeft)}...
                        </p>
                    </div>
                </AuthLayout>
            );

        case 'success':
            return (
                <AuthLayout>
                    <div className="flex flex-col items-center text-center gap-8">
                        <p className="text-f-3xl font-semibold text-neutral-1400">Email verified</p>
                        <p className="text-base text-neutral-1200 w-[496px]">
                            Your email was successfully verified. You will be redirected shortly.
                        </p>
                    </div>
                </AuthLayout>
            );

        default:
            return null;
    }
};

export default VerifyICR;
