import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMeQuery } from "@/data/user";
import { Routes } from "@/config/routes";
import { getAuthCredentials } from '@/utils/auth-utils';

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
    return function ProtectedRoute(props: P) {
        const router = useRouter();
        const pathname = usePathname();
        const { token } = getAuthCredentials();
        const [isAuthorized, setIsAuthorized] = useState(false);
        const [isChecking, setIsChecking] = useState(true);

        const { isLoading, data: me, error } = useMeQuery(!!token);

        useEffect(() => {
            if (!token) {
                setIsChecking(false);
                router.replace(Routes.SignIn);
                return;
            }

            if (error) {
                setIsChecking(false);
                router.replace(Routes.SignIn);
                return;
            }

            if (!isLoading && me?.data?.data) {
                const organizationStatus = me.data.data.organization?.status;
                const isOnboardingPage = pathname.includes(Routes.CompanyOnboard);
                const isDashboardPage = pathname.includes(Routes.Dashboard);

                // Case 1: Incomplete organization status and not on onboarding and not on dashboard
                if ((!organizationStatus || organizationStatus !== 2) && (!isOnboardingPage && !isDashboardPage)) {
                    setIsChecking(true);
                    router.replace(Routes.CompanyOnboard);
                    return;
                }

                // Case 2: On onboarding page with incomplete status
                if ((!organizationStatus || organizationStatus !== 2) && (isOnboardingPage || isDashboardPage)) {
                    setIsChecking(false);
                    setIsAuthorized(true);
                    return;
                }

                // Case 3: Complete organization status
                if (organizationStatus === 2) {
                    setIsChecking(false);
                    setIsAuthorized(true);
                    return;
                }
            }
        }, [token, isLoading, me, error, router, pathname]);

        if (isLoading || isChecking) {
            return (
                <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                </div>
            );
        }

        return isAuthorized ? <Component {...props} /> : null;
    };
}