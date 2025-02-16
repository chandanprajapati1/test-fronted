import React from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import { ErrorMessage } from "@/components/ui/validationMsg";

interface DatePickerProps {
	value: string | null;
	onChange: (date: string | null) => void;
	error?: string;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	label?: string;
	required?: boolean;
	instruction?: string;
}

const SingleDatePicker = ({
	value,
	onChange,
	error,
	placeholder = "Select date",
	disabled = false,
	className = '',
	label,
	required = false,
	instruction,
}: DatePickerProps) => {
	const dateValue = value ? new Date(value) : null;

	const getInputClassName = () => {
		const baseClass = "flex w-full justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2 py-s h-[46px] px-xl rounded-lg bg-white border text-sm text-[#333] focus:outline-none";
		const errorClass = "border-red-500";
		const normalClass = "hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500 border-neutral-300";
		const disabledClass = disabled ? "bg-neutral-100 cursor-not-allowed" : "";

		return `${baseClass} ${error ? errorClass : normalClass} ${disabledClass} ${className}`;
	};

	const handleDateChange = (date: DateObject | null) => {
		if (date) {
			const jsDate = date.toDate();
			const formattedDate = jsDate.toISOString().split('T')[0];
			onChange(formattedDate);
		} else {
			onChange(null);
		}
	};

	return (
		<div className="flex flex-col gap-2">
			{label && (
				<div className="flex items-center gap-1">
					<label className="block text-sm font-medium text-neutral-1200">
						{label}
						{required && <span className="text-red-500 ml-1">*</span>}
					</label>
					{instruction && (
						<span className="text-xs text-neutral-1000">({instruction})</span>
					)}
				</div>
			)}
			<DatePicker
				value={dateValue}
				onChange={handleDateChange}
				editable={false}
				disabled={disabled}
				placeholder={placeholder}
				inputClass={getInputClassName()}
			/>
			{error && (
				<ErrorMessage message={error} />
			)}
		</div>
	);
};

export default SingleDatePicker;