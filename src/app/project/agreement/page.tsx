'use client'
import React, { useRef, useState, useEffect } from 'react';
import Input from "@/components/ui/input";
import { customToast } from "@/components/ui/customToast";
import * as yup from 'yup';
import { Routes } from "@/config/routes";
import DatePicker, { DateObject } from "react-multi-date-picker";
import EditableTableCell from "@/app/project/agreement/components/editableCell";
import axiosApi from "@/utils/axios-api";
import Checkbox from "@/components/ui/checkbox";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import { useRouter } from "next/navigation";
import { PageProps } from "@/types";
import { encryptString } from '@/utils/enc-utils';
import { Edit } from '@carbon/icons-react';
import { Agreement } from "@/app/project/agreement/components/agreement";
import { isHtmlTagPresent } from '@/utils/input-utils';
import {formatNumber} from "@/utils/number-utils";
import {ErrorMessage} from "@/components/ui/validationMsg";

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
    start_date: string;
    end_date: string;
    vintages: Array<{
        _id: string;
        total_credit: number;
    }>;
}

const validationSchema = yup.object().shape({
    batch_id: yup.string().required('Batch ID is required'),
    total_credit: yup.number().required('Total credit is required').max(999999999999, 'Total credits can not exceed 12 digits').positive('Total credit must be positive'),
    per_credit_price: yup.number().required('Price per credit is required').max(9999999999, 'Price per credit can not exceed 10 digits').positive('Per Credit Price must be positive').typeError('Please enter a valid number') ,
    start_date: yup.string().required('Date range is required'),
    end_date: yup.string().required('Date range is required'),
    vintages: yup.array().of(
        yup.object().shape({
            _id: yup.string().required(),
            total_credit: yup.number().required().max(9999999999, 'Price per credit can not exceed 10 digits').positive('Per Credit Price must be positive')
        })
    )
});

// Main Component
const AgreementPage = ({ searchParams }: PageProps) => {
    const router = useRouter();
    const [isChecked, setIsChecked] = useState(false);
    const [data, setData] = useState<BatchResponse | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<any>({});
    const [dateRange, setDateRange] = useState<DateObject[]>([]);
    const [editingVintageId, setEditingVintageId] = useState<string | null>(null);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const handleEditClick = (vintageId: string) => {
        setEditingVintageId(vintageId);
    };
    const token = searchParams.token;
    console.log(token);
    const formatDate = (date: string): DateObject => {
        const [year, month, day] = date.split('-').map(Number);
        return new DateObject({ year, month, day });
    };
    const [formData, setFormData] = useState<FormData>({
        batch_id: '',
        total_credit: 0,
        per_credit_price: 0,
        start_date: '',
        end_date: '',
        vintages: []
    });

    useEffect(() => {
        const token = searchParams.token;
        if (!token) {
            console.log(token);
            customToast.error("No token ID found in URL.");
        }
        const fetchData = async () => {
            try {
                const response: any = await axiosApi.project.get(API_ENDPOINTS.ProjectAgreement, {
                    params: {
                        token: token
                    }
                });
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
                        end_date: responseData.batch.end_date,
                        vintages: responseData.vintages.map((v: Vintage) => ({
                            _id: v._id,
                            total_credit: v.total_credit
                        }))
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

    const handleSubmit = async () => {
        try {
            if (!isChecked) {
                customToast.error("Please agree to the terms first");
                return;
            }

            const hasInvalidVintages = formData.vintages.some(
                vintage => vintage.total_credit < 0 || vintage.total_credit > 9999999999
            );

            if (hasInvalidVintages) {
                customToast.error("Please correct all vintage credit values before submitting");
                return;
            }

            if ((!formData?.start_date || !formData?.end_date)) {

            }
            await validationSchema.validate(formData, { abortEarly: false });

            setIsSubmitting(true);

            const requestBody = {
                batch_id: formData.batch_id,
                total_credit: calculateTotalCredits(formData.vintages),
                per_credit_price: Number(formData.per_credit_price),
                start_date: formData.start_date,
                end_date: formData.end_date,
                vintages: formData.vintages.map(vintage => ({
                    _id: vintage._id,
                    total_credit: vintage.total_credit
                }))
            };
            console.log(requestBody);
            if (isHtmlTagPresent(requestBody)) {
                customToast.error("Invalid Input!");
                return;
            }

            const token = searchParams.token;
            let encryptedPayload = {};
            if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            const response: any = await axiosApi.project.patch(API_ENDPOINTS.AgreementSubmit(token), { data: encryptedPayload });
            if (response.status == 200) {
                customToast.success("Agreement updated successfully");
            } else {
                customToast.success('Failed to update agreement');
            }
            setAlreadySubmitted(true);
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const errors: { [key: string]: string } = {};
                error.inner.forEach(err => {
                    if (err.path) {
                        errors[err.path] = err.message;
                    }
                });
                setFormErrors(errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDateChange = (dates: DateObject[]) => {
        formData.start_date = "";
        formData.end_date = "";
        if (Array.isArray(dates) && dates.length === 2) {
            setDateRange(dates);

            // Update formData with the new dates
            setFormData(prev => ({
                ...prev,
                start_date: dates[0].format('YYYY-MM-DD'),
                end_date: dates[1].format('YYYY-MM-DD')
            }));

            if (formErrors.start_date || formErrors.end_date) {
                setFormErrors((prev: any) => ({
                    ...prev,
                    start_date: '',
                    end_date: ''
                }));
            }
        }
    };

    const handleCreditUpdate = (vintageId: string, newValue: number) => {
        if (newValue === null) {
            return;
        }

        setFormData(prev => {
            const updatedVintages = prev.vintages.map(vintage =>
                vintage._id === vintageId
                    ? { ...vintage, total_credit: newValue }
                    : vintage
            );

            return {
                ...prev,
                vintages: updatedVintages,
                vintageTotalCredits: calculateTotalCredits(updatedVintages)
            };
        });
    };

    const calculateTotalCredits = (vintages: Array<{ _id: string; total_credit: number }>) => {
        return vintages.reduce((sum, vintage) => sum + vintage.total_credit, 0);
    };

    return (
        <>
            {data && (
                <div className="flex flex-col justify-start items-start self-stretch max-w-screen-md  m-auto  p-8">
                    <div className="flex flex-col justify-start items-start self-stretch flex-grow gap-[72px] pb-6 rounded-lg">
                        {/* Logo Section */}
                        <div className="flex flex-col justify-start items-center self-stretch gap-3">
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
                                    <span className="text-neutral-1400">{formatNumber(calculateTotalCredits(formData.vintages), 3)}</span>
                                    <span className="text-neutral-1200"> Carbon Credits @ $</span>
                                    <span className="text-neutral-1400">{formatNumber(formData.per_credit_price, 2)} per </span>
                                    <span className="text-neutral-1200">credit</span>
                                    <br />
                                    <span className="text-neutral-1200">for the following vintage</span>
                                </p>

                                <Agreement />
                            </div>

                            {/* Table Section */}
                            <div className="flex flex-col justify-center items-start self-stretch overflow-x-scroll gap-3">
                                <table className="w-full border border-neutral-300">
                                    <thead>
                                        <tr className="border text-left border-neutral-300 h-[70px] ">
                                            <th className="flex-grow-1 px-2 py-3 text-sm font-semibold text-neutral-1400">Vintage</th>
                                            <th className="flex-grow-3 px-2 py-3 text-sm font-semibold text-neutral-1400 whitespace-nowrap">Credits (tCO₂e)</th>
                                            <th className="flex-grow-1 px-2 py-3 text-sm font-semibold text-neutral-1400">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.vintages.map((row, index) => (
                                            <tr
                                                key={index}
                                                className="h-[70px] border border-neutral-300"
                                            >
                                                <td className="flex-grow px-2 py-3 text-neutral-1200">{row.year}</td>
                                                <td className="flex-grow px-2 py-3">
                                                    <div className="flex flex-grow relative text-right gap-2">
                                                        <EditableTableCell
                                                            initialValue={row.total_credit}
                                                            onSubmit={(newValue) => handleCreditUpdate(row._id, newValue)}
                                                            isEditing={editingVintageId === row._id}
                                                            onFinishEditing={() => setEditingVintageId(null)}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="w-[100px] px-2 py-3">
                                                    <button
                                                        className="p-1 rounded-full "
                                                        onClick={() => handleEditClick(row._id)}
                                                    >
                                                        <Edit className="w-4 h-4 text-[#161616]" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="h-14 border border-neutral-300">
                                            <td className="flex-grow px-2 py-3">
                                                <p className="text-sm font-semibold text-neutral-1400  whitespace-nowrap">
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
                                    <label className="block text-sm font-medium text-neutral-1200 mb-2">
                                        Engagement Period
                                    </label>
                                    <DatePicker
                                        range
                                        value={dateRange}
                                        onChange={handleDateChange}
                                        dateSeparator=" - "
                                        rangeHover
                                        editable={false}
                                        format="YYYY-MM-DD"
                                        containerClassName={'flex w-full'}
                                        inputClass={`flex w-full justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-[42px] relative gap-2 px-[15px] py-2 rounded-lg bg-white border ${formErrors.start_date || formErrors.end_date
                                            ? 'border-danger'
                                            : 'border-neutral-300'
                                            } text-sm text-neutral-1200 outline-none`}
                                    />
                                    {(formErrors.start_date || formErrors.end_date) && (
                                        <ErrorMessage message={formErrors.start_date || formErrors.end_date} />
                                    )}
                                </div>

                                <div className="flex flex-col justify-start items-start self-stretch gap-2">
                                    <Input
                                        className="w-full"
                                        label="Price Per Credit ($)"
                                        type='text'
                                        inputClassName='text-black w-full'
                                        value={formData.per_credit_price}
                                        error={formErrors.per_credit_price}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            if (value.length > 10) return;

                                            // Allow empty value or value matching pattern (numbers with up to 2 decimals)
                                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    per_credit_price: value as unknown as number
                                                }));
                                                if (formErrors.per_credit_price) {
                                                    setFormErrors((prev: any) => ({
                                                        ...prev,
                                                        per_credit_price: ''
                                                    }));
                                                }
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (['e', 'E', '+', '-'].includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                </div>

                                 <Checkbox
                                    id="keepLoggedIn"
                                    onClick={() => setIsChecked(!isChecked)}
                                    className={`w-6 h-6 rounded bg-white border transition-colors ${isChecked ? 'border-primary bg-primary/10' : 'border-neutral-300 hover:border-primary'
                                        }`}
                                    label={"I agree ENVR agreement"}
                                />
                                {/* Action Buttons */}
                                <div className="flex justify-start items-start self-stretch gap-6">
                                    <button
                                        className="flex justify-center items-center flex-grow h-14 px-6 rounded-lg bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || alreadySubmitted}
                                    >
                                        <span className="text-base text-center text-white">
                                            {isSubmitting ? 'Submitting...' : 'Accept'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default AgreementPage;