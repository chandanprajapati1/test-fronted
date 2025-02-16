import React, { InputHTMLAttributes, forwardRef, ReactElement } from 'react';
import { UseFormRegisterReturn } from "react-hook-form";
import {ErrorMessage} from "@/components/ui/validationMsg";


export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    registration?: Partial<UseFormRegisterReturn>;
    showLabel?: boolean;
    label?: string;
    inputClassName?: string;
    icon?: any;
    onIconClick?: () => void;
    inputBgColor?: string;
}

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    inputClassName?: string;
    label?: string;
    note?: string;
    name: string;
    error?: string;
    type?: string;
    shadow?: boolean;
    variant?: 'normal' | 'solid' | 'outline';
    dimension?: 'small' | 'medium' | 'big';
    showLabel?: boolean;
    required?: boolean;
}

const classes = {
    root: 'w-full h-14 px-4 py-2 text-sm rounded-lg border border-[#57cc99] focus:outline-none',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className = '',
            inputClassName,
            registration,
            label,
            error,
            type = 'text',
            disabled,
            showLabel = true,
            readOnly = false,
            required = false,
            icon,
            onIconClick,
            inputBgColor,
            ...rest
        },
        ref
    ) => {
        return (
            <div className={`flex flex-col gap-y-2 ${className}`}>
                {showLabel && label && (
                    <label htmlFor={rest.name} className="block text-sm font-medium text-neutral-1200">
                        {label} {required && <span className="text-negativeBold">*</span>}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        type={type}
                        readOnly={readOnly}
                        className={`w-full h-14 px-4 py-2 text-sm rounded-lg border text-black hover:border-primary
                            ${error ? 'border-red-500' : ''}
                            ${readOnly ? 'bg-gray-100 text-gray-700' : inputBgColor || 'bg-white'}
                            ${icon ? 'pr-12' : ''}
                            focus:outline-none ${inputClassName}`}
                        disabled={disabled}
                        {...registration}
                        {...rest}
                    />
                    {icon && (
                        <button
                            type="button"
                            onClick={onIconClick}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center"
                            aria-label="Input action"
                        >
                            {icon}
                        </button>
                    )}
                </div>
                {error && <ErrorMessage message={error} />}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
