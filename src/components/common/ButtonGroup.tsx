import React from "react";
import { Routes } from "@/config/routes";

interface ButtonGroupProps {
    onSubmit: () => void;
    onBack: () => void;
    onSkip?: () => void;
    submitText?: string;
    backText?: string;
    submitType?: 'button' | 'submit' | 'reset';
    backType?: 'button' | 'submit' | 'reset';
    isLoading?: boolean;
    isDisabled?: boolean;
    isSkipVisible?: boolean;
    isBackVisible?: boolean;
}

export const ButtonGroup = ({
    onSubmit,
    onBack,
    onSkip,
    submitText = 'Next',
    backText = 'Back',
    submitType = 'button',
    backType = 'button',
    isLoading = false,
    isDisabled = false,
    isSkipVisible = false,
    isBackVisible = false,
}: ButtonGroupProps) => {

    return (
        <>
            <hr className="flex w-full flex-col items-start mx-auto" />
            <div className="flex justify-end gap-4">
                {!isSkipVisible || isBackVisible  && <button
                    type={backType}
                    className="flex h-12 min-w-12 px-6 py-4 justify-end items-center gap-4 rounded-lg text-tertiary focus:outline-none focus:border focus:border-brand1-500 focus:border-1"
                    onClick={onBack}
                    disabled={isLoading}
                >
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 5.00061L5 0.000610352L5.7 0.70061L1.4 5.00061L5.7 9.30061L5 10.0006L0 5.00061Z"
                            fill="#22577A" />
                    </svg>
                    {backText}
                </button>}
                {!isSkipVisible && (
                    <button
                        type={submitType}
                        className={`flex h-12 min-w-12 px-6 py-4 justify-end items-center gap-4 rounded-lg ${isLoading || isDisabled
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-brand1-500 text-white cursor-pointer'
                            } focus:outline-none focus:border focus:border-brand1-500 focus:border-1`}
                        onClick={onSubmit}
                        disabled={isLoading || isDisabled}
                    >
                        {isLoading ? 'Submitting...' : submitText}
                        {!isLoading && (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.9998 8L5.9998 13L5.2998 12.3L9.5998 8L5.2998 3.7L5.9998 3L10.9998 8Z"
                                    fill="currentColor" />
                            </svg>
                        )}
                    </button>
                )}

                {isSkipVisible && (
                    <button
                        type='button'
                        className={`flex h-12 min-w-12 px-6 py-4 justify-end items-center gap-4 rounded-lg ${isLoading || isDisabled
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-brand1-500 text-white cursor-pointer'
                            } focus:outline-none focus:border focus:border-brand1-500 focus:border-1`}
                        onClick={onSkip}
                        disabled={isLoading || isDisabled}
                    >
                        Skip
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.9998 8L5.9998 13L5.2998 12.3L9.5998 8L5.2998 3.7L5.9998 3L10.9998 8Z"
                                fill="currentColor" />
                        </svg>
                    </button>
                )}
            </div>
        </>

    );
};