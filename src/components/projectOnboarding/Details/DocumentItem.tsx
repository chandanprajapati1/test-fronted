import React, { useRef } from 'react';
import Image from 'next/image';
import { customToast } from "@/components/ui/customToast";

interface DocumentItemProps {
    title: string;
    onUpload: (file: File) => void;
    onView: () => void;
    onDelete: () => void;
    file: File | null;
    isRequired: boolean;
    status: 0 | 1 | 2; // 0 = pending, 1 = approved, 2 = rejected,
    extAllowed?: string[];
}

const DocumentItem: React.FC<DocumentItemProps> = ({
    title,
    onUpload,
    onView,
    onDelete,
    file,
    isRequired,
    status = 0, extAllowed
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const statusColors = {
        default: 'border-neutral-300',
        success: 'border-primary',
        warning: 'border-warning',
        error: 'border-danger',
    };

    const statusIcons = {
        default: '/project/Document.svg',
        success: '/project/success.svg',
        warning: '/project/warning.svg',
        error: '/project/error.svg',
    };

    const getStatus = (approvalStatus: number) => {
        switch (approvalStatus) {
            case 0: return 'default';
            case 1: return 'success';
            case 2: return 'error';
            default: return 'default';
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };


    const isValidFileExtension = (fileName: string): boolean => {
        if (!extAllowed || extAllowed.length === 0) {
            return true; // Allow all extensions if no restrictions
        }
        const extension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
        return extAllowed.includes(extension.toLowerCase());
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            if (!isValidFileExtension(selectedFile.name)) {
                customToast.error(`Invalid file type. Allowed types: ${extAllowed?.join(', ')}`);
                event.target.value = ''; // Reset input
                return;
            }

            const maxSize = 50 * 1024 * 1024; // 13MB in bytes
            if (selectedFile.size > maxSize) {
                customToast.error('File size should not exceed 50MB');
                event.target.value = ''; // Reset input
                return;
            }

            onUpload(selectedFile);
        }
    };

    const getDisplayName = (file: string | File): string => {
        if (typeof file === 'string') {
            return file.split('/').pop() || '';
        } else if (file instanceof File) {
            return file.name;
        }
        return title;
    };

    // Only hide buttons when status is approved (1)
    const hideButtons = status === 1;


    return (
        <button className={`flex items-center gap-2 p-3 rounded-lg border ${statusColors[getStatus(status)]} hover:border-brand1-500 focus:outline-none focus:border-brand1-500 transition-colors duration-200`}>
            <div className="flex justify-center items-center w-8 h-8 p-2 rounded-full border-2 border-neutral-100 bg-neutral-100 flex-shrink-0">
                <Image
                    src={statusIcons[getStatus(status)]}
                    className="w-full h-full object-contain"
                    alt="Document Status"
                    width={32}
                    height={32}
                />
            </div>

            <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-neutral-1400 text-left">
                        {getDisplayName(title)}
                        {isRequired && <span className="text-danger ml-1">*</span>}
                    </p>
                    <div className="flex flex-shrink-0">
                        {!hideButtons && !file && (
                            <button
                                onClick={handleUploadClick}
                                type="button"
                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200 shrink-0"
                            >
                                <Image src="/project/upload.svg" alt="Upload" width={32} height={32} />
                            </button>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept={extAllowed?.join(',')}
                            onChange={handleFileChange}
                        />
                        {file && (
                            <>
                                <button
                                    onClick={onView}
                                    type="button"
                                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200 shrink-0"
                                >
                                    <Image src="/project/view.svg" alt="View" width={32} height={32} />
                                </button>
                                {!hideButtons && (
                                    <button
                                        onClick={() => {
                                            onDelete()
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = '';
                                            }
                                        }}
                                        type="button"
                                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200 shrink-0"
                                    >
                                        <Image src="/project/close.svg" alt="Delete" width={32} height={32} />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </button>
    );
};

export default DocumentItem;