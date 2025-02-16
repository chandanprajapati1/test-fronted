'use client'
import { Routes } from '@/config/routes'
import { AUTH_CRED } from '@/utils/constants'
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import { getAuthCredentials } from '@/utils/auth-utils';
import axiosApi, { getBaseUrl } from '@/utils/axios-api';
import { useDispatch, useSelector } from 'react-redux';
import { addcart } from '@/app/store/slices/addCartSlice';
import { API_ENDPOINTS } from '@/config/api-endpoint';
import { profileDetail } from "@/app/store/slices/profileDetailReducer";
import { PiWarningOctagonBold } from "react-icons/pi";
import { TiWarning } from "react-icons/ti";
import { User, TextAlignJustify, Store, ObjectStorage, Dashboard, ShoppingCart, Close } from '@carbon/icons-react';
type NavRoute = 'dashboard' | 'marketplace' | 'profile' | 'cart' | '';

interface NavItemProps {
    text: string;
    isActive?: boolean;
    hasDropdown?: boolean;
    route: NavRoute;
    onClick: any
}

interface NavItemStuct {
    text: string;
    route: NavRoute;
    hasDropdown?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ text, isActive, hasDropdown, route, onClick }) => (
    <div
        onClick={() => onClick != undefined && onClick(route)}
        className={`flex justify-start items-center flex-grow-0 flex-shrink-0 h-[38px] relative gap-${hasDropdown ? '4' : '2'} px-4 py-2 rounded-[999px] ${isActive ? 'bg-[#22577a] border-b-2 border-[#22577a]' : 'bg-transparent'
            } cursor-pointer hover:bg-opacity-90 transition-all duration-200`}
    >
        <div className={`flex justify-start items-center ${hasDropdown ? 'relative' : 'flex-grow-0 flex-shrink-0'} gap-2`}>
            {text == "Dashboard" && <Dashboard className="w-[17px h-4]" color={isActive ? '#ffffff' : '#22577a'} />}
            {
                text === "Market Place" && <Store className="w-[17px h-4]" color={isActive ? '#ffffff' : '#22577a'} />
            }
            {
                text === "My Profile" && <ObjectStorage className="w-[17px] h-4" color={isActive ? '#ffffff' : '#22577a'} />
            }
            <p className={`flex-grow-0 flex-shrink-0 text-sm ${isActive ? 'font-semibold text-[#ffffff]' : 'text-tertiary'}`}>
                {text}
            </p>
        </div>
        {hasDropdown && isActive && (
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-grow-0 flex-shrink-0 w-4 h-4 relative">
                <path d="M8.71973 11L3.71973 6.00002L4.41973 5.30002L8.71973 9.60002L13.0197 5.30002L13.7197 6.00002L8.71973 11Z" fill="white" />
            </svg>
        )}
    </div>
);

const Header = (props: any) => {

    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const cartValue = useSelector((state: any) => state.cartLength.cart_value);
    const [tokenActive, setTokenActive] = useState(true);
    const [organizationStatus, setOrganizationStatus] = useState(3)
    const profileData = useSelector((state: any) => state?.profileDetail?.profileDetails);
    const [info, setInfo] = useState(false);
    const [activeMenu, setActiveMenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveMenu(false); // Close the menu
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setOrganizationStatus(profileData?.organization?.status);
        setTimeout(() => {
            if (profileData?.organization?.status != 2) {
                setInfo(true)
            }
        }, 1000)
    }, [profileData])

    const getStatusBadge = () => {
        switch (organizationStatus) {
            case 1:
                return (
                    <span className="text-f-m text-neutral-1400 font-semibold">is under review.</span>
                );
            case 2:
                return "";
            case 3:
                return (
                    <span className="text-f-m font-semibold text-white">has been rejected.</span>
                );
            default:
                return (
                    <span className="text-f-m text-neutral-1400 font-semibold">is pending.</span>
                );
        }
    };
    const navItems: NavItemStuct[] = [
        {
            text: "Dashboard",
            route: "dashboard"
        },
        {
            text: "Market Place",
            route: "marketplace"
        },
        {
            text: "My Profile",
            route: "profile",
            hasDropdown: true
        }
    ];

    const handleNavClick = (route: NavRoute) => {
        const routes = {
            dashboard: '/dashboard',
            marketplace: '/project-listing',
            profile: '/profile',
            cart: '/cart'
        };
        console.log(route);
        route != '' && router.push(routes[route]);
    };

    const getActiveRoute = (path: string): NavRoute => {
        if (path?.includes('dashboard')) return 'dashboard';
        if (path?.includes('profile')) return 'profile';
        if (path?.includes('project')) return 'marketplace';
        if (path?.includes('company-onboarding')) return 'profile';
        return tokenActive ? 'dashboard' : ""; // default route
    };

    const activeRoute = getActiveRoute(pathname ?? '');

    const fetchCartLength = async () => {
        const token = getAuthCredentials();
        console.log("Token:", token);
        if (!token.token) {
            setTokenActive(false)
            return;
        }

        try {
            const apiEndpoint = `${getBaseUrl('project')}/fetch-cart`;
            console.log("API Endpoint:", apiEndpoint);

            const response = await fetch(apiEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token?.token}`
                }
            });

            if (!response.ok) {
                console.error(`Fetch failed with status: ${response.status} ${response.statusText}`);
                return;
            }

            const result = await response.json();
            console.log("Response Data:", result);
            const cartLength = (result?.data?.cart_list && result?.data?.cart_list.length) || 0;
            dispatch(addcart(cartLength));

        } catch (error: any) {
            console.error("Error fetching cart details:", error.message || error);
        }
    };

    const fetchOrgansitionStatus = async () => {
        const token = getAuthCredentials();
        console.log("fetchOrgansitionStatus", token)
        if (!token.token) {
            return;
        }
        try {
            const response = await axiosApi.auth.get(API_ENDPOINTS.ME);
            console.log("fetchOrgansitionStatus", response)
            dispatch(profileDetail(response.data.data));

        } catch (error) {
            console.error('Error fetching project details:', error);
        }

    };

    useEffect(() => {
        fetchOrgansitionStatus()
        fetchCartLength()
    }, [])

    const clickHereHandler = () => {
        router.push('/company-onboarding')
    }
    return (<>
        <div className='fixed bg-white w-full z-50 flex flex-col opacity-12 shadow-md'>
            <div className='h-6xl w-full justify-center flex  shadow-md'>
                <div className='w-full px-4 flex justify-between items-center mx-auto max-w-screen-sc-2xl '>
                    <div className='flex-1 '>
                        <img src='/logo.svg' className='cursor-pointer h-[45px] '/>
                    </div>

                    <div className="sc-sm:flex hidden justify-start items-center flex-grow-0 flex-shrink-0 gap-0.5">
                        {navItems.map((item) => ((!tokenActive) ? (item.text == "Market Place") && <NavItem
                            key={item.route}
                            text={item.text}
                            route={item.route}
                            isActive={true}
                            hasDropdown={item.hasDropdown}
                            onClick={handleNavClick}
                        /> : <NavItem
                            key={item.route}
                            text={item.text}
                            route={item.route}
                            isActive={activeRoute === item.route}
                            hasDropdown={item.hasDropdown}
                            onClick={tokenActive ? handleNavClick : undefined}
                        />))}

                    </div>

                    <div className='flex flex-1 justify-end w-auto cursor-pointer items-center gap-xs'>
                        {tokenActive && <div
                            className='w-unit-10 bg-red p-2xs flex justify-center items-center px-s cursor-pointer relative  h-[40px] '
                            onClick={() => handleNavClick('cart')}>
                            <ShoppingCart className="h-4 w-4" color="#1A1A1A"/> {Number(cartValue) > 0 && <div
                            className='absolute w-l h-l p-xs bg-red-500 rounded-full -top-0 -right-0 flex justify-center items-center'>
                            <div className='text-[10px] text-white'>
                                {cartValue}
                            </div>
                        </div>}
                        </div>} {tokenActive && <div
                        className='w-unit-10 bg-red p-2xs flex justify-center items-center px-s cursor-pointer relative '>
                        <div
                            className='w-unit-10 bg-red  hidden sc-sm:flex p-2xs justify-center items-center px-s cursor-pointer relative'
                            onClick={() => setActiveMenu((prev) => !prev)}
                        >
                            <User className='text-black'/>
                        </div>
                        {activeMenu && <div
                            className='w-[300px] items-end absolute top-2xl right-s rounded-md bg-white border shadow-lg z-50'
                            ref={dropdownRef}>
                            {tokenActive && (<div className="flex flex-col">
                                <button
                                    onClick={() => {
                                        handleNavClick("dashboard");
                                    }}
                                    className="block sc-sm:hidden w-full px-4 py-3 border-b border-neutral-200 text-left hover:bg-neutral-50"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Dashboard className="text-neutral-500"/>
                                        <span className="text-sm font-medium text-neutral-1400 ">Dashboard</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => {
                                        handleNavClick("marketplace");
                                    }}
                                    className="block sc-sm:hidden w-full px-4 py-3 border-b border-neutral-200 text-left hover:bg-neutral-50"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Store size={20} className="text-neutral-500"/>
                                        <span className="text-sm font-medium text-neutral-1400 ">Market Place</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => {
                                        handleNavClick("profile");
                                    }}
                                    className="block sc-sm:hidden w-full px-4 py-3 border-b border-neutral-200 text-left hover:bg-neutral-50"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ObjectStorage size={20} className="text-neutral-500"/>
                                        <span className="text-sm font-medium text-neutral-1400 ">Profile</span>
                                    </div>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        Cookies.remove(AUTH_CRED);
                                        router.replace(Routes.SignIn);
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm hover:bg-neutral-50 text-neutral-700"
                                >
                                    Sign out
                                </button>
                            </div>)}

                        </div>}
                        <div className='sc-sm:hidden flex w-unit-10 bg-red p-2xs justify-center items-center px-s cursor-pointer relative' onClick={() => setActiveMenu((prev) => !prev)}>
                            <TextAlignJustify className='text-black'/>
                        </div>
                    </div>}

                        {!tokenActive && <div className='text-black p-s font-light text-md cursor-pointer'
                            onClick={(e) => {
                                e.stopPropagation();
                                Cookies.remove(AUTH_CRED);
                                router.replace(Routes.SignIn);
                            }}
                        >
                            Sign In
                        </div>}

                    </div>
                </div>

            </div>
        </div>
        <div className={`pt-6xl`}>
            {tokenActive && !pathname.includes('/company-onboarding') && info && <div
                className={`flex relative items-center  justify-center ${organizationStatus == 1 ? "bg-brand1-500" : organizationStatus == 3 ? "bg-red-500" : "bg-yellow-400"} bg-brand1-500`}>
                {organizationStatus !== 2 && (<div className="flex items-center gap-2 py-s pl-4 pr-12">
                    {organizationStatus == 4 &&
                        <PiWarningOctagonBold className="text-black"/>} {organizationStatus == 3 &&
                    <TiWarning className="text-white"/>} <span
                    className={`text-f-m font-semibold ${organizationStatus == 1 ? "text-black" : organizationStatus == 3 ? "text-white" : "text-black"}`}>Your company's KYC {getStatusBadge()}
                    <a className={`underline font-f-m font-normal pl-m cursor-pointer ${organizationStatus == 1 ? "text-white" : organizationStatus == 3 ? "text-white" : "text-blue-500"}`}
                        onClick={clickHereHandler}>{organizationStatus == 1 ? "Check Here" : organizationStatus == 3 ? "Check Here" : "Click Here"}</a></span>
                </div>)} {organizationStatus !== 2 &&
                <div className='absolute right-xl cursor-pointer ' onClick={() => {
                    setInfo(false)
                }}>
                    <Close color="black"/>
                </div>}
            </div>}
        </div>
        </>

        ) }

        export default Header