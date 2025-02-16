'use client';
import React, { useEffect, useState } from 'react';
import Input from "@/components/ui/input";
import Checkbox from "@/components/ui/checkbox";
import Link from "next/link";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { getAuthCredentials, isAuthenticated, setAuthCredentials } from "@/utils/auth-utils";
import { Routes } from "@/config/routes";
import { customToast } from "@/components/ui/customToast";
import { encryptString } from '@/utils/enc-utils';
import { Edit, View, ViewOff } from '@carbon/icons-react';
import { isHtmlTagPresent } from '@/utils/input-utils';

const signInFormSchema = yup.object().shape({
    email: yup
        .string()
        .required('This field is required') // Show error when empty
        .matches(
            /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Invalid email format" // Show error when invalid
        )
        .max(100, 'Email must not exceed 100 characters'),
    password: yup
        .string()
        .required('This field is required') // Show error when empty
        .min(8, "Password must be at least 8 characters"), // Show error when too short
    keepLoggedIn: yup.boolean(),
});

const Login = () => {
    const router = useRouter();
    const { token } = getAuthCredentials();
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
        resolver: yupResolver(signInFormSchema),
    });

    useEffect(() => {
        if (isAuthenticated({ token })) {
            router.replace(Routes.Dashboard);
        }
    }, [router, token]);

    const handleTogglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleEmailEdit = () => {
        setIsEmailReadOnly(!isEmailReadOnly);
    };

    const onSubmit = async (data: any) => {
        if (data.password.length < 8) {
            customToast.warning("Password Length should be minimum 8 Char.");
            return;
        }
        if (isHtmlTagPresent({
            email: data.email,
            password: data.password,
        })) {
            customToast.error("Invalid Input!");
            return;
        }
        let encryptedData = {};
        if (data.email && data.password && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
            encryptedData = encryptString(JSON.stringify({
                email: data.email,
                password: data.password,
            }), process.env.EMAIL_CHECK);
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/auth/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ data: encryptedData }),
            });

            if (response.ok) {
                localStorage.clear();
                sessionStorage.clear();
                const responseData = await response.json();
                if (responseData.data.email_verified === false) {
                    router.push(Routes.VerifyEmail + "?email=" + data.email);
                } else if (responseData.data.auth_token) {
                    setAuthCredentials(responseData.data.auth_token, responseData.data.refresh_token);
                    customToast.success("Logged in successfully.");
                    router.push(Routes.Dashboard);
                }

            } else {
                const errorData = await response.json();
                customToast.error(errorData.message || "Sign in failed. Please try again.");
                if (errorData.data && !errorData.data.if_verified) {
                    router.push(Routes.VerifyEmail + "?email=" + data.email);
                }
            }
        } catch (error) {
            if (error instanceof TypeError && error.message.includes('CORS')) {
                console.log('This appears to be a CORS error. Check the server configuration.');
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

    const handleForgotPassword = () => {
        const formData = getValues();
        router.push(`${Routes.forgotPassword}?email=${encodeURIComponent(formData.email || '')}`);
    };

    return (
        <AuthLayout>
            <h1 className="text-f-3xl font-semibold text-center text-neutral-1400">Welcome back</h1>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className={`flex flex-col w-full ${showPassword ? 'gap-y-6' : 'gap-y-8'}`}>
                <Input
                    label='Email Address'
                    required={true}
                    registration={register('email')}
                    type="email"
                    inputClassName={'border-primary'}
                    id="email"
                    placeholder="Email Address"
                    readOnly={isEmailReadOnly}
                    icon={showPassword ? <Edit className="w-6 h-6 text-[#161616]" /> : undefined}
                    onIconClick={handleEmailEdit}
                    onKeyDown={(e) => e.key === ' ' && e.preventDefault()}
                    error={errors.email?.message}
                    onChange={(e) => {
                        setValue("email", e.target.value);
                        if (errors.email) clearErrors("email");
                    }}
                />
                {!showPassword ? (
                    <button type="button" onClick={handleContinue}
                        className="w-full h-14 bg-brand1-500 text-white rounded-lg">
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
                            placeholder="Enter your password"
                            icon={isPasswordVisible ? <View className="w-6 h-6 text-[#161616]" /> : <ViewOff className="w-6 h-6 text-[#161616]" />}
                            onIconClick={handleTogglePasswordVisibility}
                            onKeyDown={(e) => e.key === ' ' && e.preventDefault()}
                            error={errors.password?.message}
                            onChange={(e) => {
                                setValue("password", e.target.value);
                                if (errors.password) clearErrors("password");
                            }}
                        />
                        <div className="flex flex-wrap gap-2  items-center justify-between w-full">
                            <Checkbox
                                registration={register('keepLoggedIn')}
                                error={errors.keepLoggedIn?.message}
                                label={"Keep me logged in"}
                            />
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className='text-tertiary underline'
                            >
                                Forgot Password
                            </button>
                        </div>
                        <button type="submit" className="w-full h-14 bg-brand1-500 text-white rounded-lg">
                            Continue
                        </button>
                    </>
                )}
            </form>
            <p className="text-center text-neutral-1200">
                Don’t have an account? <Link href={Routes.SignUp} className="text-tertiary underline">Sign Up</Link>
            </p>
        </AuthLayout>
    );
}

export default Login;
