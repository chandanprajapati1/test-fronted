import React, { forwardRef, useEffect, useState } from 'react';
import Select from 'react-select';
import { UseFormRegisterReturn } from "react-hook-form";
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';
import {ErrorMessage} from "@/components/ui/validationMsg";

interface Option {
    _id: string | number;
    name: string;
    [key: string]: any;
}

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps {
    label?: string;
    name?: string;
    error?: string;
    registration?: Partial<UseFormRegisterReturn>;
    options?: Option[];
    placeholder?: string;
    className?: string;
    selectClassName?: string;
    disabled?: boolean;
    variant?: 'normal';
    dimension?: 'small';
    isDependent?: boolean;
    dependentValue?: string | number;
    readOnly?: boolean;
    required?: boolean;
    inputBgColor?: string;
    value?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    selectBorderRadius?: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectProps>(({
    label,
    error,
    options = [],
    placeholder = 'Select an option',
    className,
    selectClassName,
    disabled,
    variant = 'normal',
    dimension = 'small',
    isDependent = false,
    readOnly = false,
    required = false,
    dependentValue,
    registration,
    value,
    onChange,
    selectBorderRadius="8px",
    ...rest
}, ref) => {
    const [internalValue, setInternalValue] = useState<SelectOption | null>(null);

    const transformedOptions = options.map(option => ({
        value: option._id,
        label: option.name
    }));

    useEffect(() => {
        if (value !== undefined) {
            const selectedOption = transformedOptions.find(option =>
                String(option.value) === String(value)
            );
            setInternalValue(selectedOption || null);
        }
    }, [value, options]);

    const handleChange = (selectedOption: SelectOption | null) => {
        if (readOnly) return;

        setInternalValue(selectedOption);

        if (onChange || registration?.onChange) {
            const syntheticEvent = {
                target: {
                    value: selectedOption?.value ?? '',
                    name: registration?.name
                }
            } as React.ChangeEvent<HTMLSelectElement>;

            if (registration?.onChange) {
                registration.onChange(syntheticEvent);
            }

            if (onChange) {
                onChange(syntheticEvent);
            }
        }
    };

    const isDisabled = disabled || (isDependent && !dependentValue) || readOnly;

    return (
        <div className={twMerge("flex flex-col  gap-2", className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <Select
                options={transformedOptions}
                value={internalValue}
                onChange={handleChange}
                isDisabled={isDisabled}
                placeholder={placeholder}
                className={twMerge("react-select-container ", selectClassName)}
                classNamePrefix="react-select"
                styles={{
                    dropdownIndicator: (base) => ({
                        ...base,
                        color: error ? '#EF4444' : '#6B7280',
                        '&:hover': {
                            color: '#374151'
                        }
                    }),
                    indicatorSeparator: () => ({
                        display: 'none'
                    }),
                    control: (base, state) => ({
                        ...base,
                        backgroundColor: readOnly ? '#F3F4F6' : 'white',
                        minHeight: dimension === 'small' ? '30px' : '48px',
                        padding: '4px 8px',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        borderColor: state.isFocused ? '#57cc99' : error ? '#EF4444' : '#D1D5DB',
                        borderRadius: selectBorderRadius ? selectBorderRadius : '45px',
                        boxShadow: 'none',
                        '&:hover': {
                            borderColor: isDisabled ? '#D1D5DB' : '#57cc99',  // Assuming #57cc99 is your primary color
                        },
                        '&:active': {
                            borderColor: '#57cc99'  // Primary color for active state
                        },
                    }),
                    menu: (base) => ({
                        ...base,
                        backgroundColor: 'white',
                        zIndex: 50,
                    }),
                    menuList: (base) => ({
                        ...base,
                        padding: '4px'
                    }),
                    option: (base, state) => ({
                        ...base,
                        //backgroundColor: state.isSelected ? '#EEF1F4' : state.isFocused ? '#F3F4F6' : 'white',
                        backgroundColor: state.isSelected ? '#EEF1F4'  : 'white',
                        color: '#374151',
                        fontSize: '14px',
                        cursor: 'pointer',
                        padding: '4px 6px',
                        '&:active': {
                            backgroundColor: '#E5E7EB'
                        }
                    }),
                    placeholder: (base) => ({
                        ...base,
                        color: '#9CA3AF',
                        fontSize: '14px',
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: '#374151',
                        fontSize: '14px'
                    }),
                }}
                components={{
                    DropdownIndicator: () => (
                        <ChevronDown className={twMerge(
                            "w-5 h-5 mr-2",
                            error ? "text-red-500" : "text-gray-500"
                        )} />
                    )
                }}
            />
            {error && <ErrorMessage message={error} />}
        </div>);
});

SelectField.displayName = 'SelectField';

export default SelectField;
