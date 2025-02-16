import React, { useEffect, useRef, useState } from "react";

const SingleSelector = ({ data, placeholder, selectedValue, onChange, error, allfieldsValue }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        const selectedOption = data.find((item: any) => item._id == value) || null;
        const newData = { id: value, name: selectedOption?.name };
        onChange(newData);
        setIsOpen(false); // Close dropdown when selection is made
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false); // Close dropdown when clicking outside
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        console.log("Selected value:", selectedValue, "Data:", data);
    }, [selectedValue, data]);

    return (<div ref={dropdownRef} className="relative">
            <select
                value={selectedValue || ''}
                onChange={handleChange}
                onClick={() => setIsOpen(true)} // Open dropdown on click
                className={`my-s py-s px-l text-f-m border block w-full rounded-md shadow-sm sm:text-sm focus:outline-none  appearance-none  ${!error && ' hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500'} ${error ? 'border-red-500' : 'border-neutral-300'} ${!selectedValue && 'text-gray-400'}`}
            >
                <option value="" disabled hidden>
                    {placeholder}
                </option>
                {data && data.length > 0 && data.map((value: any) => (<option key={value._id} value={value._id}>
                        {value.name}
                    </option>))}
            </select>

            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"/>
                </svg>
            </div>
        </div>);
};

export default SingleSelector;
