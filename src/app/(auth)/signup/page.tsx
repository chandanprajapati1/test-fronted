'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import AuthLayout from '@/layouts/AuthLayout';
import Input from '@/components/ui/input';
import Checkbox from '@/components/ui/checkbox';
import { useRouter } from "next/navigation";
import { getAuthCredentials, isAuthenticated } from "@/utils/auth-utils";
import { Routes } from "@/config/routes";
import { customToast } from "@/components/ui/customToast";
import axiosApi from "@/utils/axios-api";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import { AxiosError } from "axios";
import { encryptString } from '@/utils/enc-utils';
import { Edit, View, ViewOff } from '@carbon/icons-react';
import { isHtmlTagPresent } from '@/utils/input-utils';

const signUpFormSchema = yup.object().shape({
    email: yup.string()
        .required('This field is required') // Required message
        .matches(
            /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Invalid email format"
        )
        .max(100, 'Email must not exceed 255 characters'),
    password: yup.string()
        .required('This field is required') // Required message
        .min(8, "Password must be at least 8 characters"),
    terms: yup.boolean()
        .oneOf([true], 'You must accept the terms and conditions'), // Ensures checkbox is checked
});

const Home = () => {
    const router = useRouter();
    const { token } = getAuthCredentials();

    if (isAuthenticated({ token })) {
        router.replace(Routes.Dashboard);
    }

    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isEmailReadOnly, setIsEmailReadOnly] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        trigger,
        clearErrors,
        setValue
    } = useForm({
        resolver: yupResolver(signUpFormSchema),
    });

    const handleTogglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleEmailEdit = () => {
        setIsEmailReadOnly(!isEmailReadOnly);
    };

    const onSubmit = async (data: any) => {
        if (data.password.length < 8) {
            customToast.warning("Password length should be minimum 8 characters.");
            return;
        }

        if (!data.terms) {
            customToast.error("Please accept the terms and conditions.");
            return;
        }
        if (isHtmlTagPresent({ email: data.email, password: data.password })) {
            customToast.error("Invalid Input!");
            return;
        }

        try {
            const requestBody = { email: data.email, password: data.password };
            let encryptedPayload = {};
            if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            const response = await axiosApi.auth.post(API_ENDPOINTS.SignUp, {
                data: encryptedPayload
            });

            if (response.status === 200 || response.status === 201) {
                customToast.success("Please verify your account");
                router.push(`${Routes.VerifyEmail}?email=${encodeURIComponent(data.email)}`);
            } else {
                customToast.error(response.data.message || "Sign up failed. Please try again.");
            }
        } catch (error: any) {
            console.error('Error during sign up:', error);
            if (error instanceof AxiosError && error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // customToast.error(error.response.data.message || "Sign up failed. Please try again.");
            }
        }
    };

    const handleContinue = async () => {
        const result = await trigger('email');
        if (result) {
            setIsEmailReadOnly(true);
            setShowPassword(true);
        }
    };

    return (
        <AuthLayout>
            <h1 className="text-f-3xl font-semibold text-center text-neutral-1400">Create your account</h1>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className={`flex flex-col w-full ${showPassword ? 'gap-y-6' : 'gap-y-8'}`}>
                <Input
                    label='Email Address'
                    required={true}
                    inputClassName={'border-primary'}
                    registration={register('email')}
                    type="email"
                    id="email"
                    placeholder="Email Address"
                    readOnly={isEmailReadOnly}
                    icon={showPassword ? <Edit className="w-6 h-6 text-[#161616]" /> : undefined}
                    onIconClick={handleEmailEdit}
                    error={errors.email?.message}
                    onChange={(e) => {
                        setValue("email", e.target.value);
                        if (errors.email) clearErrors("email");
                    }}
                />

                {!showPassword ? (
                    <button type="button" onClick={handleContinue} className="w-full h-14 bg-brand1-500 text-white rounded-lg mb-6">
                        Continue
                    </button>
                ) : (
                    <>
                        <Input
                            label='Password'
                            required={true}
                            inputClassName={'border-primary'}
                            registration={register('password')}
                            type={isPasswordVisible ? 'text' : 'password'}
                            id="password"
                            error={errors.password?.message}
                            onChange={(e) => {
                                setValue("password", e.target.value);
                                if (errors.password) clearErrors("password");
                            }}
                            icon={isPasswordVisible ? <View className="w-6 h-6 text-[#161616]" /> : <ViewOff className="w-6 h-6 text-[#161616]" />}
                            onIconClick={handleTogglePasswordVisibility}
                        />

                        <Checkbox
                            registration={register('terms')}
                            id="terms"
                            error={errors.terms?.message}
                            label={
                                <span>I agree to the{' '} <Link href={Routes.Terms} className="text-tertiary underline">terms and conditions</Link></span>
                            }
                        />

                        <button type="submit" className="w-full h-14 bg-brand1-500 text-white rounded-lg">
                            Create Account
                        </button>
                    </>
                )}
            </form>
            <p className="text-center text-neutral-1200">
                Already have an account? <Link href={Routes.SignIn} className="text-tertiary underline">Login</Link>
            </p>
        </AuthLayout>
    );
};

export default Home;
