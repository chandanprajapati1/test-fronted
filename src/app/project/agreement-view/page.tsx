'use client'
import React, {  useState, useEffect } from 'react';
import Input from "@/components/ui/input";
import { customToast } from "@/components/ui/customToast";
import { Routes } from "@/config/routes";
import DatePicker, { DateObject } from "react-multi-date-picker";
import EditableTableCell from "@/app/project/agreement/components/editableCell";
import axiosApi from "@/utils/axios-api";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import { useRouter } from "next/navigation";
import { PageProps } from "@/types";
import {Agreement} from "@/app/project/agreement/components/agreement";
import {formatNumber} from "@/utils/number-utils";

interface Batch {
    _id: string;
    project_id: string;
    status: number;
    agreement_id: string;
    total_credit: number;
    per_credit_price: number;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
}

interface Vintage {
    _id: string;
    project_id: string;
    batch_id: string;
    total_credit: number;
    agreement_total_credit:number;
    per_credit_price: number;
    year: string;
    status: number;
    updated_at: string;
    created_at: string;
}

interface BatchResponse {
    batch: Batch;
    vintages: Vintage[];
}

interface FormData {
    batch_id: string;
    total_credit: number;
    per_credit_price: number;
    platform_fee_rate: number;
    start_date: string;
    end_date: string;
    vintages: Array<{
        _id: string;
        total_credit?: number;
        agreement_total_credit: number;
    }>;
}

// Main Component
const AgreementPage = ({ searchParams }: PageProps) => {
    const router = useRouter();
    const [data, setData] = useState<BatchResponse | null>(null);
    const [formErrors, setFormErrors] = useState<any>({});
    const [dateRange, setDateRange] = useState<DateObject[]>([]);
    const [editingVintageId, setEditingVintageId] = useState<string | null>(null);
    const projectId = searchParams.id;
    const formatDate = (date: string): DateObject => {
        const [year, month, day] = date.split('-').map(Number);
        return new DateObject({ year, month, day });
    };
    const [formData, setFormData] = useState<FormData>({
        batch_id: '',
        total_credit: 0,
        per_credit_price: 0,
        platform_fee_rate:0,
        start_date: '',
        end_date: '',
        vintages: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: any = await axiosApi.project.get(`${API_ENDPOINTS.AgreementGet}/${projectId}`);
                if (response.status != 200) {
                    if (response.status === 401) {
                        customToast.error("Your session has expired. Please log in again.");
                        router.replace(Routes.SignIn);
                        return;
                    } else {
                        const errorData = await response.json().catch(() => null);
                        customToast.error(errorData?.message || 'Failed to fetch agreement data');

                    }
                }

                let responseData = response.data;
                setData(responseData);
                if (responseData?.batch) {
                    setFormData(({
                        batch_id: responseData.batch._id,
                        total_credit: responseData.batch.total_credit,
                        per_credit_price: responseData.batch.per_credit_price,
                        start_date: responseData.batch.start_date,
                        platform_fee_rate: responseData.batch.platform_fee_rate,
                        end_date: responseData.batch.end_date,
                        vintages: responseData.vintages.map((v: Vintage) => ({
                            _id: v._id,
                            total_credit: v.total_credit,
                            agreement_total_credit: v.agreement_total_credit
                        })),
                    }));
                    const startDate = formatDate(responseData.batch.start_date);
                    const endDate = formatDate(responseData.batch.end_date);
                    setDateRange([startDate, endDate]);
                }
            } catch (e: any) {
                console.log(e);
            } finally {
                console.log("finally");
            }
        };
        fetchData();
    }, [router, searchParams]);


    const handleCreditUpdate = (vintageId: string, newValue: number) => {
        if (newValue === null) {
            return;
        }

        setFormData(prev => {
            const updatedVintages = prev.vintages.map(vintage =>
                vintage._id === vintageId
                    ? { ...vintage, agreement_total_credit: newValue }
                    : vintage
            );

            return {
                ...prev,
                vintages: updatedVintages,
                vintageTotalCredits: calculateTotalCredits(updatedVintages)
            };
        });
    };

    const calculateTotalCredits = (vintages: Array<{ _id: string; agreement_total_credit: number }>) => {
        console.log(vintages);
        return vintages.reduce((sum, vintage) => sum + vintage.agreement_total_credit, 0);
    };

    const getStatusColor = (status:any) => {
        switch (status) {
            case 1: return 'bg-btnWarning hover:bg-blue-600/90 text-black';
            case 2: return 'bg-btnSuccess hover:bg-green-600/90 text-black';
            case 3: return 'bg-btnDanger hover:bg-btnDanger/90 text-black';
            default: return 'bg-notice hover:bg-gray-600/90 text-black';
        }
    };

    const getStatusText = (status:any) => {
        switch (status) {
            case 1: return 'Pending';
            case 2: return 'Accepted';
            case 3: return 'Expired';
            default: return 'Status Unknown';
        }
    };

    return (
        <>
            {data && (
                <div className="flex flex-col justify-start items-start self-stretch max-w-screen-md  m-auto p-8">
                    <div className="flex flex-col justify-start items-start self-stretch flex-grow gap-[72px] pb-6 rounded-lg">
                        {/* Logo Section */}
                        <div className="flex flex-col justify-start items-center self-stretch gap-3 ">
                            <div className="h-[45px]">
                                <img src='/logo.svg' className='cursor-pointer w-[80px] ' />
                            </div>
                        </div>

                        <div className="flex flex-col justify-start items-center self-stretch gap-8">
                            {/* Agreement Content */}
                            <div className="flex flex-col justify-start items-center self-stretch gap-3">
                                <p className="text-base text-center">
                                    <span className="text-neutral-1200">Dear, </span>
                                    <span className="text-neutral-1400">Project Owner</span>
                                </p>

                                <p className="text-base text-center text-neutral-1200">
                                    Kindly review and confirm your agreement so we can proceed to close the deal.
                                </p>

                                <p className="text-base font-semibold text-center">
                                    <span className="text-neutral-1200">Agree to sell - </span>
                                    <span className="text-neutral-1400">{formatNumber(calculateTotalCredits(formData.vintages), 3)} tCO₂e</span>
                                    <span className="text-neutral-1200"> Carbon Credits @ $</span>
                                    <span className="text-neutral-1400">{formatNumber(formData.per_credit_price,2)} per </span>
                                    <span className="text-neutral-1200">credit</span>
                                    <br />
                                    <span className="text-neutral-1200">for the following vintage</span>
                                </p>

                                <Agreement />
                            </div>

                            {/* Table Section */}
                            <div className="flex flex-col justify-center items-start self-stretch overflow-hidden gap-3">
                                <table className="w-full border border-neutral-300">
                                    <thead>
                                    <tr className="h-14 border text-left border-neutral-300">
                                        <th className="flex-grow px-2 py-3 text-sm font-semibold text-neutral-1400 whitespace-nowrap">Vintage</th>
                                        <th className="flex-grow px-2 py-3 text-sm font-semibold text-neutral-1400 whitespace-nowrap">Credits (tCO₂e)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {data?.vintages.map((row, index) => (
                                        <tr
                                            key={index}
                                            className="min-h-[64px] border border-neutral-300"
                                        >
                                            <td className="flex-grow px-2 py-3 text-neutral-1200">{row.year}</td>
                                            <td className="flex-grow px-2 py-3">
                                                <div className="flex flex-grow relative gap-2">
                                                    <EditableTableCell
                                                        initialValue={formatNumber(row.agreement_total_credit, 3)}
                                                        onSubmit={(newValue) => handleCreditUpdate(row._id, newValue)}
                                                        isEditing={editingVintageId === row._id}
                                                        onFinishEditing={() => setEditingVintageId(null)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="h-14 border border-neutral-300">
                                        <td className="flex-grow px-2 py-3 whitespace-nowrap">
                                            <p className="text-sm font-semibold text-neutral-1400">
                                                Total Credits (tCO₂e)
                                            </p>
                                        </td>
                                        <td className="flex-grow px-2 py-3" colSpan={2}>
                                            <p className="text-sm font-semibold text-neutral-1400">
                                                {formatNumber(calculateTotalCredits(formData.vintages), 3)}
                                            </p>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer Section */}
                            <div className="flex flex-col justify-center items-start self-stretch gap-8">
                                {/* Date Picker */}
                                <div className="flex flex-col justify-start items-start self-stretch gap-2">
                                    <label className="block text-sm font-medium text-neutral-1200 mb-2"> Engagement Period </label>
                                    <DatePicker
                                        range
                                        value={dateRange}
                                        disabled={true}
                                        dateSeparator=" - "
                                        rangeHover
                                        editable={false}
                                        format="YYYY-MM-DD"
                                        containerClassName={'flex w-full'}
                                        inputClass={`flex w-full justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-[42px] relative gap-2 px-[15px] py-2 rounded-lg bg-white border ${formErrors.start_date || formErrors.end_date ? 'border-danger' : 'border-neutral-300'} text-sm text-neutral-1200 outline-none`}
                                    />
                                </div>

                                <div className="flex flex-col justify-start items-start self-stretch gap-2">
                                    <Input
                                        className="w-full"
                                        label="Price Per Credit ($)"
                                        type='text'
                                        inputClassName='text-black w-full'
                                        value={formatNumber(formData.per_credit_price, 2)}
                                        readOnly={true}
                                    />
                                </div>
                                {/*<div className="flex flex-col justify-start items-start self-stretch gap-2">
                                    <Input
                                        className="w-full"
                                        label="Service Fee (%)"
                                        type='text'
                                        readOnly={true}
                                        inputClassName='text-black w-full'
                                        value={formatNumber(formData.platform_fee_rate,2)}
                                    />
                                </div>*/}

                                {/* Action Buttons */}
                                <div className="flex justify-start items-start self-stretch gap-6">
                                    <button
                                        className={`flex justify-center ${getStatusColor(data.batch?.status)}  items-center flex-grow h-14 px-6 rounded-lg  transition-colors disabled:opacity-90 disabled:cursor-not-allowed text-base text-center `}
                                        disabled={true}
                                    >
                                        {getStatusText(data.batch?.status)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}

        </>);
};

export default AgreementPage;