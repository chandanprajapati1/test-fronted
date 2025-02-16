'use client'
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { AUTH_CRED } from "@/utils/constants";
import { Routes } from "@/config/routes";
import Cookies from 'js-cookie';
import AuthLayout from "@/layouts/AuthLayout";
import { customToast } from "@/components/ui/customToast";

function SignOut() {
    const router = useRouter();
    const logout = () => {
        Cookies.remove(AUTH_CRED);
        customToast.success('successfully logged out');
        router.replace(Routes.SignIn);
    };
    useEffect(() => {
        logout();
    }, []);

    return <AuthLayout>
        <div></div>
    </AuthLayout>;
}

export default SignOut;
