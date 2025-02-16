import React, { useEffect } from 'react';
import Input from "@/components/ui/input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { customToast } from "@/components/ui/customToast";
import axiosApi from "@/utils/axios-api";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import { BankAccount } from "@/types";
import { encryptString } from '@/utils/enc-utils';
import { Close } from "@carbon/icons-react";
import { isHtmlTagPresent } from '@/utils/input-utils';

interface BankDetailModalProps {
	onClose: () => void;
	initialData?: BankAccount | null;
}

const formSchema = yup.object().shape({
	bank_name: yup.string().required('Bank name is required'),
	account_holder_name: yup.string().required('Account holder name is required'),
	account_number: yup.string().required('Account number is required'),
	ifsc_code: yup.string().required('IFSC Code is required'),
});

const BankDetails: React.FC<BankDetailModalProps> = ({ onClose, initialData }) => {
	const { register, handleSubmit, formState: { errors }, reset } = useForm({
		resolver: yupResolver(formSchema), defaultValues: {
			bank_name: '', account_holder_name: '', account_number: '', ifsc_code: ''
		}
	});

	// Implement scroll prevention when modal mounts
	useEffect(() => {
		// Save current scroll position and prevent scrolling
		const scrollY = window.scrollY;
		document.body.style.position = 'fixed';
		document.body.style.top = `-${scrollY}px`;
		document.body.style.width = '100%';
		document.body.style.overflowY = 'scroll'; // Prevent layout shift
		document.body.style.paddingRight = 'var(--scrollbar-width)'; // Prevent layout shift

		// Cleanup function when modal unmounts
		return () => {
			const scrollY = document.body.style.top;
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.width = '';
			document.body.style.overflowY = '';
			document.body.style.paddingRight = '';
			window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
		};
	}, []);

	useEffect(() => {
		if (initialData) {
			reset({
				bank_name: initialData.bank_name,
				account_holder_name: initialData.account_holder_name,
				account_number: initialData.account_number,
				ifsc_code: initialData.ifsc_code
			});
		}
	}, [initialData, reset]);

	const onSubmit = async (data: any) => {
		if (isHtmlTagPresent(data)) {
			customToast.error("Invalid Input!");
			return;
		}
		try {
			const requestBody = data;
			let encryptedPayload = {};
			if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
				encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
			}
			if (initialData) {

				const response = await axiosApi.auth.patch(`${API_ENDPOINTS.BankList}/${initialData.id}`, { data: encryptedPayload });
				customToast.success("Bank details updated successfully.");
			} else {
				await axiosApi.auth.post(API_ENDPOINTS.BankList, { data: encryptedPayload });
				customToast.success("Bank details added successfully.");
			}
			onClose();
		} catch (error) {
			console.error('Error saving bank details:', error);
			customToast.error("Failed to save bank details. Please try again.");
		}
	};

	return (<div className="fixed inset-0 z-50 flex items-center bg-black justify-center  bg-opacity-50 p-4 sc-md:p-0">
		<div className="relative w-full max-w-2xl  bg-white rounded-lg shadow-lg">
			<div className='flex justify-between p-xl rounded-t-lg border-b  items-center'>
				<div className='text-neutral-1400 text-f-xl font-normal'>
					{initialData ? 'Edit Bank Details' : 'Add Bank Details'}
				</div>
				<button
					className=" text-gray-500 hover:text-gray-700"
					onClick={onClose}
				>
					<Close className="w-6 h-6" />
				</button>
			</div>
			<div className="px-xl flex-1 overflow-y-auto pt-4" style={{ maxHeight: 'calc(100vh - 180px)' }}>
				<form onSubmit={handleSubmit(onSubmit)} noValidate
					className="flex flex-col items-center w-full gap-6 mx-auto">
					<Input
						registration={register('bank_name')}
						label="Bank Name"
						placeholder="Bank Name"
						className='flex flex-col gap-2 w-full'
						inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[42px]'
						error={errors.bank_name?.message}
						required
					/> <Input
						registration={register('account_holder_name')}
						label="Account Holder Name"
						placeholder="Account holder name"
						className='flex flex-col gap-2 w-full'
						inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[42px]'
						error={errors.account_holder_name?.message}
						required
					/> <Input
						registration={register('account_number')}
						label="Account Number"
						placeholder="Account Number"
						className='flex flex-col gap-2 w-full'
						inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[42px]'
						error={errors.account_number?.message}
						required
					/> <Input
						registration={register('ifsc_code')}
						label="IFSC Code"
						placeholder="IFSC code"
						className='flex flex-col gap-2 w-full'
						inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[42px]'
						error={errors.ifsc_code?.message}
						required
					/>
					<div className="w-full flex justify-end gap-2 py-4 border-t border-neutral-200">
						<button
							type="button"
							onClick={onClose}
							className="h-9 px-3 py-2 rounded-lg bg-neutral-1000 text-sm text-white"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="h-9 px-3 py-2 rounded-lg bg-primary text-sm text-white"
						>
							{initialData ? 'Update' : 'Submit'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>);
};

export default BankDetails;