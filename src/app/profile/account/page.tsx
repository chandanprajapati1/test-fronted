"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from "@/app/profile/components/sidebar";
import { sidebarMenuItems } from "@/app/profile/components/menuItems";
import { Card } from "@/components/ui/card";
import AdminLayout from "@/components/layouts/admin";
import axiosApi from "@/utils/axios-api";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import BankDetailModal from "@/app/profile/account/components/BankDetailModal";
import { BankAccount } from "@/types";
import { AddIcon, SwitchOffIcon, SwitchOnIcon } from "@/components/ui/icons";
import { customToast } from "@/components/ui/customToast";
import { ProfileHeader } from "@/app/profile/components/ProfileHeader";
import toCapitalizedCase from '@/utils/capitalized-case';
import { encryptString } from '@/utils/enc-utils';
import {Edit} from "@carbon/icons-react";

const BankDetailsPage = () => {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showBankDetailPopup, setBankDetailPopup] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const response = await axiosApi.auth.get(API_ENDPOINTS.BankList);
            setAccounts(response.data.data.bank_details);
        } catch (error) {
            console.error('Error fetching bank details:', error);
            setError('Failed to load bank accounts');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleEditAccount = (account: BankAccount) => {
        setSelectedAccount(account);
        setBankDetailPopup(true);
    };

    const handleCloseModal = () => {
        setBankDetailPopup(false);
        setSelectedAccount(null);
        fetchAccounts();
    };

    const handleToggleActive = async (account: BankAccount) => {
        try {
            const requestBody = { default: true };
            let encryptedPayload = {};
            if(Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0){
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            await axiosApi.auth.patch(`/organization/bank-details/${account.id}`, {
                data: encryptedPayload
            });
            customToast.success("Default bank account updated successfully");
            fetchAccounts();
        } catch (error) {
            console.error('Error updating default bank account:', error);
            customToast.error("Failed to update default bank account. Please try again.");
        }
    };

    return (
        <AdminLayout>
            {showBankDetailPopup && (
                <BankDetailModal
                    onClose={handleCloseModal}
                    initialData={selectedAccount}
                />
            )}
                <div className="flex flex-col w-full justify-center mx-auto max-w-screen-sc-2xl ">
                    <div className="sc-sm:flex-row flex flex-col gap-6 p-6">
                        <Sidebar menuItems={sidebarMenuItems}/>
                        <div className="flex flex-col gap-6 flex-1">
                            <ProfileHeader title='Bank Details'/>
                            <Card
                                className="flex flex-col rounded-2xl bg-white shadow-[0px_1.5px_23px_3px_rgba(0,0,0,0.08)]">
                                <div
                                    className="flex justify-between items-center px-6 py-4 border-b border-neutral-200">
                                    <h2 className="text-f-3xl font-light text-neutral-1400">Bank Details</h2>
                                    <button
                                        onClick={() => {
                                            setBankDetailPopup(true)
                                        }}
                                        className="flex items-center gap-2 h-9 px-3 py-2 rounded-lg border border-primary hover:bg-primary/10 transition-colors"
                                    >
                                        <AddIcon/>
                                        <span className="text-sm text-neutral-1400">Add Account</span>
                                    </button>
                                </div>

                                <div className="p-6 flex flex-col gap-4">
                                    {isLoading && <div className="p-6">Loading...</div>}
                                    {accounts?.map((account, index) => (
                                        <div key={account.id} className="flex flex-col gap-1">
                                            {index > 0 && <div className="h-px bg-neutral-200 my-4"/>}

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="flex justify-center items-center w-8 h-8 rounded-full border border-neutral-200">
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M8.25 7H10V6H9V5.5H8V6.0254C7.69665 6.08751 7.42714 6.25999 7.24369 6.50945C7.06025 6.7589 6.97591 7.06757 7.00704 7.37564C7.03816 7.68372 7.18252 7.96928 7.41216 8.17701C7.64179 8.38473 7.94035 8.49983 8.25 8.5H8.75C8.8163 8.5 8.87989 8.52634 8.92678 8.57322C8.97366 8.62011 9 8.6837 9 8.75C9 8.8163 8.97366 8.87989 8.92678 8.92678C8.87989 8.97366 8.8163 9 8.75 9H7V10H8V10.5H9V9.9746C9.30335 9.9125 9.57286 9.74001 9.75631 9.49055C9.93976 9.2411 10.0241 8.93243 9.99296 8.62436C9.96184 8.31628 9.81747 8.03072 9.58784 7.823C9.35821 7.61527 9.05965 7.50018 8.75 7.5H8.25C8.1837 7.5 8.12011 7.47366 8.07322 7.42678C8.02634 7.37989 8 7.3163 8 7.25C8 7.1837 8.02634 7.12011 8.07322 7.07322C8.12011 7.02634 8.1837 7 8.25 7Z"
                                                                fill="#57CC99"/>
                                                            <path
                                                                d="M14.5 6.5H13.49C13.4756 6.10501 13.3803 5.71717 13.21 5.36048C13.0397 5.00378 12.7981 4.68582 12.5 4.42625V2.5C12.5 2.40714 12.4741 2.31612 12.4253 2.23713C12.3765 2.15815 12.3067 2.09431 12.2236 2.05279C12.1406 2.01126 12.0476 1.99368 11.9551 2.00202C11.8626 2.01036 11.7743 2.04429 11.7 2.1L9.83325 3.5H7.5C4.74525 3.5 2.7683 5.1206 2.52575 7.5H2.5C2.36743 7.49988 2.24032 7.44716 2.14658 7.35342C2.05284 7.25968 2.00012 7.13257 2 7V6H1V7C1.00044 7.39769 1.15861 7.77897 1.43982 8.06018C1.72103 8.34139 2.10231 8.49956 2.5 8.5H2.535C2.60755 9.1556 2.82065 9.78783 3.15975 10.3536C3.49886 10.9193 3.95601 11.4053 4.5 11.7783V13.5C4.5 13.6326 4.55268 13.7598 4.64645 13.8536C4.74021 13.9473 4.86739 14 5 14H7C7.13261 14 7.25979 13.9473 7.35355 13.8536C7.44732 13.7598 7.5 13.6326 7.5 13.5V12.5H9V13.5C9 13.6326 9.05268 13.7598 9.14645 13.8536C9.24021 13.9473 9.36739 14 9.5 14H11.5C11.6326 14 11.7598 13.9473 11.8536 13.8536C11.9473 13.7598 12 13.6326 12 13.5V11.8186C12.3612 11.6474 12.677 11.3935 12.9218 11.0776C13.1667 10.7616 13.3337 10.3925 13.4094 10H14.5C14.6326 10 14.7598 9.94732 14.8536 9.85355C14.9473 9.75979 15 9.63261 15 9.5V7C15 6.86739 14.9473 6.74021 14.8536 6.64645C14.7598 6.55268 14.6326 6.5 14.5 6.5ZM14 9H12.562C12.4094 10.3764 12.1502 10.7427 11 11.1577V13H10V11.5H6.5V13H5.5V11.1889C4.89796 10.9025 4.39005 10.4504 4.03582 9.8856C3.68159 9.32078 3.49572 8.66669 3.5 8C3.5 5.5823 5.50905 4.5 7.5 4.5H10.1667L11.5 3.5V4.8882C12.7091 5.81785 12.4563 6.4812 12.5091 7.5H14V9Z"
                                                                fill="#57CC99"/>
                                                        </svg>
                                                    </div>
                                                    <span
                                                        className="text-base font-semibold text-neutral-1400">{toCapitalizedCase(account.bank_name)} {account.default ? '(Primary)' : ''}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {/* Toggle Switch */}
                                                    {accounts.length > 1 && (
                                                        <button
                                                            onClick={() => handleToggleActive(account)}
                                                            className="relative w-[42px] h-5 flex items-center justify-center transition-colors focus:outline-none"
                                                            aria-pressed={account.default}
                                                        >
                                                            {account.default ? <SwitchOnIcon/> : <SwitchOffIcon/>}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleEditAccount(account)}
                                                        className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200/20 flex items-center justify-center transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4 text-[#161616]" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="pl-10 flex flex-col gap-1">
                                                <p className="text-base">
                                                    <span className="text-neutral-1200">Account Holder: </span>
                                                    <span
                                                        className="text-neutral-1400">{toCapitalizedCase(account.account_holder_name)}</span>
                                                </p>
                                                <p className="text-base">
                                                    <span className="text-neutral-1200">Account Number: </span>
                                                    <span className="text-neutral-1400">{account.account_number}</span>
                                                </p>
                                                <p className="text-base">
                                                    <span className="text-neutral-1200">IFSC Code: </span>
                                                    <span className="text-neutral-1400">{account.ifsc_code}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {!isLoading && !error && accounts?.length === 0 && (
                                        <div className="p-6">No bank accounts found</div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
        </AdminLayout>
    );
};

export default BankDetailsPage;