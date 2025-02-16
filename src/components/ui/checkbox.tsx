import React, { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from "react-hook-form";
import { twMerge } from 'tailwind-merge';
import Link from "next/link";
import {Routes} from "@/config/routes";
import {ErrorMessage} from "@/components/ui/validationMsg";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    registration?: Partial<UseFormRegisterReturn>;
    label?: string | React.ReactNode;
}


const defaultClasses = {
    root: 'w-6 h-6 mr-2 border border-neutral-300 rounded',
    error: 'border-danger focus:ring-danger',
    disabled: 'cursor-not-allowed opacity-50 bg-neutral-100',
};

const Checkbox = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, registration, name, error, disabled, label, ...rest }, ref) => {
        // Combine classes using twMerge
        const rootClasses = twMerge(
            defaultClasses.root,
            error && defaultClasses.error,
            disabled && defaultClasses.disabled,
            className // Custom classes will override defaults
        );

        return (
            <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-start">
                        <input
                            id={name}
                            name={name}
                            type="checkbox"
                            ref={ref}
                            disabled={disabled}
                            className={rootClasses}{...registration} {...rest}/>
                    </div>
                    <label htmlFor="terms" className="text-f-m text-neutral-1200">{label}</label>
                </div>
                {error && (<ErrorMessage  message={error} />)}
            </div>


        );
    });

Checkbox.displayName = 'Checkbox';

export default Checkbox;