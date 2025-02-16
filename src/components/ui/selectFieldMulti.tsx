import React, { forwardRef, useEffect, useState } from 'react';
import Select, { components, OptionProps, StylesConfig, GroupBase, MultiValue } from 'react-select';
import { UseFormRegisterReturn } from "react-hook-form";
import { twMerge } from 'tailwind-merge';
import { ChevronDown, Check } from 'lucide-react';
import { ErrorMessage } from "@/components/ui/validationMsg";

export interface Option {
    _id: string | number;
    name: string;
    [key: string]: any;
}

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface MultiSelectProps {
    label?: string;
    name?: string;
    error?: string;
    registration?: Partial<UseFormRegisterReturn>;
    options?: Option[];
    placeholder?: string;
    className?: string;
    selectClassName?: string;
    disabled?: boolean;
    dimension?: 'small';
    isDependent?: boolean;
    dependentValue?: string | number;
    readOnly?: boolean;
    required?: boolean;
    value?: (string | number)[];
    onChange?: (selectedValues: (string | number)[]) => void;
    selectBorderRadius?: string;
}

interface CustomOptionProps extends OptionProps<SelectOption, true> {
    children: React.ReactNode;
    isSelected: boolean;
    isFocused: boolean;
    innerProps: JSX.IntrinsicElements['div'];
}

const CustomOption: React.FC<CustomOptionProps> = ({
    children,
    isSelected,
    isFocused,
    innerProps
}) => {
    return (
        <div
            className={twMerge(
                "px-3 py-2 cursor-pointer flex items-center gap-2",
                (isSelected || isFocused) && "bg-gray-100"
            )}
            {...innerProps}
        >
            <div className={twMerge(
                "w-4 h-4 border rounded flex items-center justify-center",
                isSelected ? "border-green-500 bg-green-500" : "border-gray-300"
            )}>
                {isSelected && (
                    <Check className="w-3 h-3 text-white" />
                )}
            </div>
            <span>{children}</span>
        </div>
    );
};

const MultiSelectField = forwardRef<HTMLDivElement, MultiSelectProps>(({
    label,
    error,
    options = [],
    placeholder = 'Select options',
    className,
    selectClassName,
    disabled,
    dimension = 'small',
    isDependent = false,
    readOnly = false,
    required = false,
    dependentValue,
    registration,
    value = [],
    onChange,
    selectBorderRadius = "8px",
    ...rest
}, ref) => {
    const transformedOptions: SelectOption[] = options.map(option => ({
        value: option._id,
        label: option.name
    }));

    const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);
    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

    useEffect(() => {
        if (Array.isArray(value)) {
            const selectedValues = transformedOptions.filter(option =>
                value.some(v => String(v) === String(option.value))
            );
            setSelectedOptions(selectedValues);
        }
    }, [value, options]);

    const handleChange = (selected: MultiValue<SelectOption>) => {
        if (readOnly) return;

        const selectedArray = Array.isArray(selected) ? selected : [selected];
        setSelectedOptions(selectedArray);

        if (onChange) {
            const selectedValues = selectedArray.map(option => option.value);
            onChange(selectedValues);
        }

        if (registration?.onChange) {
            const selectedValues = selectedArray.map(option => option.value);
            const syntheticEvent = {
                target: {
                    value: selectedValues,
                    name: registration.name
                }
            } as unknown as React.ChangeEvent<HTMLSelectElement>;
            registration.onChange(syntheticEvent);
        }
    };

    const handleBlur = () => {
        setMenuIsOpen(false);
    };

    const handleMenuOpen = () => {
        setMenuIsOpen(true);
    };

    const isDisabled = disabled || (isDependent && !dependentValue) || readOnly;

    const customStyles: StylesConfig<SelectOption, true, GroupBase<SelectOption>> = {
        control: (base, state) => ({
            ...base,
            backgroundColor: readOnly ? '#F3F4F6' : 'white',
            minHeight: dimension === 'small' ? '30px' : '48px',
            padding: '4px 8px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            borderColor: state.isFocused ? '#57cc99' : error ? '#EF4444' : '#D1D5DB',
            borderRadius: selectBorderRadius,
            boxShadow: 'none',
            '&:hover': {
                borderColor: isDisabled ? '#D1D5DB' : '#57cc99',
            },
        }),
        placeholder: (base) => ({
            ...base,
            color: '#9CA3AF',
            fontSize: '14px',
        }),
        valueContainer: (base) => ({
            ...base,
            whiteSpace: 'nowrap',
            overflowX: 'auto',
            overflowY: 'hidden',
            flexWrap: 'nowrap',
            padding: '2px 0',
            gap: '4px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
                display: 'none'
            },
            '& > div': {
                flex: '0 0 auto'
            }
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: '#EEF1F4',
            borderRadius: '4px',
            margin: '0 2px',
            minWidth: 'fit-content',
            flexShrink: 0
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#374151',
            padding: '2px 6px',
            fontSize: '14px'
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#6B7280',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#E5E7EB',
                color: '#374151',
            },
        }),
        menu: (base) => ({
            ...base,
            zIndex: 50,
            marginTop: '4px',
            backgroundColor: 'white',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }),
        menuList: (base) => ({
            ...base,
            padding: '4px',
            maxHeight: '250px'
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: 'transparent',
            cursor: 'pointer',
            padding: 0,
            '&:hover': {
                backgroundColor: '#F3F4F6'
            }
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: error ? '#EF4444' : '#6B7280',
            padding: '0 4px'
        }),
        indicatorSeparator: () => ({
            display: 'none'
        }),
        container: (base) => ({
            ...base,
            '& .react-select__value-container': {
                whiteSpace: 'nowrap',
                overflowX: 'auto',
                overflowY: 'hidden',
                display: 'flex',
                flexWrap: 'nowrap',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                    display: 'none'
                },
                '& > div': {
                    flex: '0 0 auto'
                }
            }
        }),
    };

    return (
        <div ref={ref} className={twMerge("flex flex-col gap-2", className)} {...rest}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <Select<SelectOption, true>
                isMulti
                menuIsOpen={menuIsOpen}
                value={selectedOptions}
                onChange={handleChange}
                onBlur={handleBlur}
                onMenuOpen={handleMenuOpen}
                options={transformedOptions}
                isDisabled={isDisabled}
                placeholder={placeholder}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                blurInputOnSelect={false}
                className={twMerge("react-select-container", selectClassName)}
                classNamePrefix="react-select"
                styles={customStyles}
                components={{
                    Option: CustomOption,
                    DropdownIndicator: () => (
                        <ChevronDown className={twMerge(
                            "w-5 h-5 mr-2",
                            error ? "text-red-500" : "text-gray-500"
                        )} />
                    )
                }}
            />
            {error && <ErrorMessage message={error} />}
        </div>
    );
});

MultiSelectField.displayName = 'MultiSelectField';

export default MultiSelectField;
