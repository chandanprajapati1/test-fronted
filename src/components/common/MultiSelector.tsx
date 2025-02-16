import { useEffect, useRef, useState } from "react";

export default function MultiSelector({ data, placeholder, selectedValues, onChange, error, allfieldsValue }: any) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [values, setValues] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    useEffect(() => {
        console.log("MultiSelector ============", allfieldsValue, data);
        if (selectedValues && data) {
            const result = data
                .filter((item: any) => selectedValues.includes(item._id))
                .map((item: any) => item.name);
            setValues(result);
        }
    }, [selectedValues, data]);

    const handleSelect = (item: string, name: string) => {
        let updatedValues;
        if (selectedValues.includes(item)) {
            updatedValues = selectedValues.filter((value: any) => value !== item);
            setValues((prev: any) => prev.filter((value: any) => value !== name));
        } else {
            updatedValues = [...selectedValues, item];
            setValues((prev) => [...prev, name]);
        }
        onChange(updatedValues); // Update parent state with new values
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false); // Close dropdown if clicked outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={toggleDropdown}
                className={`w-full px-l max-h-[38px] text-f-m py-s text-left overflow-y-auto my-s ${!error &&
                    "hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500"
                    } focus:outline-none ${error ? "border-red-500" : "border-neutral-300"
                    } bg-white border rounded-md shadow-sm ${selectedValues.length > 0 ? "text-neutral-1400" : "text-gray-400"
                    }`}
            >
                {values.length > 0 ? values.join(", ") : placeholder}
            </button>

            {isOpen && data && data.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border rounded-md shadow-lg">
                    <ul className="max-h-60 overflow-y-auto">
                        {data.map((value: any) => (
                            <li
                                key={value._id}
                                onClick={() => handleSelect(value._id, value.name)}
                                className={`flex items-center px-4 py-2 cursor-pointer hover:bg-blue-100 ${selectedValues.includes(value._id) ? "bg-blue-100" : ""
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedValues.includes(value._id)}
                                    readOnly
                                />
                                {value.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
