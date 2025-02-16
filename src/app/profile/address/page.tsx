"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from "@/app/profile/components/sidebar";
import { sidebarMenuItems } from "@/app/profile/components/menuItems";
import { Card } from "@/components/ui/card";
import AdminLayout from "@/components/layouts/admin";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import axiosApi from "@/utils/axios-api";
import { RequestChangeIcon } from "@/components/ui/icons";
import { Address } from '@/types';
import AddressModal from "@/app/profile/components/AddressCard";
import AddressChangeRequestModal from "@/app/profile/components/AddressRequestChangeModal";
import { ProfileHeader } from "@/app/profile/components/ProfileHeader";
import toCapitalizedCase from '@/utils/capitalized-case';
import {LocationCompany, View, ViewOff} from "@carbon/icons-react";
import Input from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useSelector} from "react-redux";

const AddressPage = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showRequestChangeModal, setShowRequestChangeModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
    const profileData = useSelector((state: any) => state?.profileDetail?.profileDetails);
    const fetchAddresses = async () => {
        try {
            setIsLoading(true);
            const response = await axiosApi.auth.get(API_ENDPOINTS.Address);
            setAddresses(response.data.data.addresses);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            setError('Failed to load addresses');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleEditAddress = (address: Address) => {
        setSelectedAddress(address);
        setShowAddressModal(true);
    };

    const handleCloseModal = () => {
        setShowAddressModal(false);
        setSelectedAddress(undefined);
        setShowRequestChangeModal(false);
        fetchAddresses();
    };

    const handleRequestChange = () => {
        setShowRequestChangeModal(true);
    }

    return (
        <AdminLayout>
            {showAddressModal && (
                <AddressModal
                    onClose={handleCloseModal}
                    initialData={selectedAddress}
                />
            )}
            {showRequestChangeModal && (
                <AddressChangeRequestModal
                    onClose={handleCloseModal}
                    initialData={null}
                />
            )}
            <div className="flex flex-col w-full justify-center mx-auto max-w-screen-sc-2xl">
                <div className="sc-sm:flex-row flex flex-col gap-6 p-6">
                    <Sidebar menuItems={sidebarMenuItems}/>
                    <div className="flex flex-col gap-6 flex-1">
                        <ProfileHeader title='Addresses'/>

                            <div className="flex flex-col gap-4">
                                {isLoading && (
                                    <div className="p-6 text-center">Loading addresses...</div>
                                )}

                                {!isLoading && !error && addresses.length > 0 &&
                                    addresses
                                        .sort((a, b) => {
                                            if (a.address_type.toLowerCase() == 'corporate' && b.address_type.toLowerCase() === 'billing') return -1;
                                            if (a.address_type.toLowerCase() == 'billing' && b.address_type.toLowerCase() === 'corporate') return 1;
                                            return 0;
                                        })
                                        .map((address, index) => (
                                            <>
                                                <Card className="flex flex-col rounded-2xl bg-white shadow-[0px_1.5px_23px_3px_rgba(0,0,0,0.08)]">
                                                    <div className="px-6 py-4 border-b border-neutral-200">
                                                        <h2 className="text-f-3xl font-light text-neutral-1400">
                                                            {address.address_type.toLowerCase() === 'billing' ? 'Billing Address' : 'Corporate Address'}
                                                        </h2>
                                                    </div>
                                                    <div key={address._id} className="flex flex-col gap-1 p-6">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex justify-center flex-shrink-0 items-center w-8 h-8 rounded-full border border-inside">
                                                                    <LocationCompany className="w-4 h-4 text-primary"/>
                                                                </div>
                                                                <span className="text-base font-semibold text-neutral-1400 w-full">
                                                                    {profileData?.organization?.name}
                                                                </span>
                                                            </div>
                                                            {address.address_type.toLowerCase() === 'billing' && (
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => handleEditAddress(address)}
                                                                        className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200/20 flex items-center justify-center transition-colors"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                                                             height="16" viewBox="0 0 16 16" fill="none">
                                                                            <path d="M15 13H1V14H15V13Z" fill="#161616"/>
                                                                            <path
                                                                                d="M12.7 4.5C13.1 4.1 13.1 3.5 12.7 3.1L10.9 1.3C10.5 0.9 9.9 0.9 9.5 1.3L2 8.8V12H5.2L12.7 4.5ZM10.2 2L12 3.8L10.5 5.3L8.7 3.5L10.2 2ZM3 11V9.2L8 4.2L9.8 6L4.8 11H3Z"
                                                                                fill="#161616"/>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="pl-10 flex flex-col gap-1">
                                                            {address.address1 && (
                                                                <p className="text-base text-neutral-1200">
                                                                    {toCapitalizedCase(address.address1)}
                                                                </p>
                                                            )} {address.address2 && (
                                                            <p className="text-base text-neutral-1200">
                                                                {toCapitalizedCase(address.address2)}
                                                            </p>
                                                        )}<p className="text-base text-neutral-1200">
                                                            {[
                                                                address.city,
                                                                address.state,
                                                                address.country,
                                                                address.pincode && `(${address.pincode})`
                                                            ].filter(Boolean).join(', ')}
                                                        </p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </>
                                        ))
                                }

                                {!isLoading && !error && addresses.length === 0 && (
                                    <div className="p-6 text-center">No addresses found</div>
                                )}
                            </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AddressPage;