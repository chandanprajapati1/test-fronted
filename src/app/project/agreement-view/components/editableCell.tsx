import React, { useState, useEffect } from 'react';

interface EditableTableCellProps {
    initialValue: number;
    onSubmit: (value: number) => void;
    isEditing: boolean;
    onFinishEditing: () => void;
}

const EditableTableCell = ({ initialValue, onSubmit, isEditing, onFinishEditing }: EditableTableCellProps) => {
    const [value, setValue] = useState(initialValue);
    const [tempValue, setTempValue] = useState(initialValue.toString());
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (isEditing) {
            setTempValue(value.toString());
            setError('');
        }
    }, [isEditing, value]);

    const validateNumber = (input: string): boolean => {
        // Allow empty input for temporary state
        if (input === '') return true;
        const numericRegex = /^\d+(\.\d{0,3})?$/;
        return numericRegex.test(input);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;
        newValue = newValue.slice(0, 10);
        if (validateNumber(newValue)) {
            setTempValue(newValue);
            setError('');
        }
    };

    const handleSubmit = () => {
        // Handle empty input
        if (tempValue === '') {
            setError('Value cannot be empty');
            return;
        }

        const newValue = parseFloat(tempValue);

        // Validate the parsed number
        if (isNaN(newValue)) {
            setError('Please enter a valid number');
            return;
        }

        if (newValue <= 0) {
            setError('Value must be greater than 0');
            return;
        }

        if (newValue > 9999999999) {
            setError('Value cannot exceed 10 digits');
            return;
        }

        // No need to round since we're only accepting integers
        setValue(newValue);
        onSubmit(newValue);
        setError('');
        onFinishEditing();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        } else if (e.key === 'Escape') {
            setTempValue(value.toString());
            setError('');
            onFinishEditing();
        }
    };

    const handleBlur = () => {
        handleSubmit();
    };

    if (isEditing) {
        return (
            <div className="relative w-full">
                <input
                    type="text"
                    value={tempValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    className={`w-full px-2 py-1 text-sm text-neutral-1200 border rounded-md focus:outline-none focus:ring-1 
                        ${error ? 'border-red-500 focus:ring-red-500' : 'border-primary focus:ring-primary'}`}
                    placeholder="Enter Credits"
                    autoFocus
                />
                {error && (
                    <div className="absolute left-0 -bottom-5">
                        <span className="text-xs text-negativeBold">{error}</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex w-full text-sm text-neutral-1200">
            {value.toString()}
        </div>
    );
};

export default EditableTableCell;