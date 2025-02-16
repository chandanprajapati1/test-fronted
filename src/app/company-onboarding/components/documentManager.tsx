import React, { useEffect, useState } from 'react';
import { getAuthCredentials } from '@/utils/auth-utils';
import { CloseIcon, DownloadDocumentIcon, UploadIcon } from "@/components/ui/icons";
import Image from "next/image";
import { customToast } from "@/components/ui/customToast";

interface DocumentData {
    created_at?: string;
    updated_at?: string;
    name: string;
    path: string;
    status?: number | string;
    type: string;
}

interface DocumentManagerProps {
    required?: boolean;
    docType: string;
    onDocumentUpdate: (doc: DocumentData) => void;
    error?: string;
    existingDocument?: DocumentData;
    folder: string;
    extAllowed?: string[];
    removable?: boolean;
    maxSizeMB?: number;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ required = false, docType, onDocumentUpdate, error, existingDocument, folder, extAllowed, removable = true, maxSizeMB = 50 }) => {
    const [file, setFile] = useState<File | null>(null);
    const getStatus = (approvalStatus: number) => {
        switch (approvalStatus) {
            case 0: return 'idle';
            case 1: return 'success';
            case 2: return 'error';
            default: return 'idle';
        }
    };

    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>(
        existingDocument ? getStatus(existingDocument?.status as number) : 'idle'
    );

    const [document, setDocument] = useState<DocumentData | null>(existingDocument || null);

    useEffect(() => {
        if (existingDocument) {
            setDocument(existingDocument);
            setStatus('success');
        }
    }, [existingDocument]);

    const validateFile = (file: File): { isValid: boolean; error?: string } => {
        // Check file size
        const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
        if (file.size > maxSize) {
            return {
                isValid: false,
                error: `File size exceeds ${maxSizeMB}MB limit. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
            };
        }

        // Check file extension if restrictions exist
        if (extAllowed && extAllowed.length > 0) {
            const fileExt = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
            if (!extAllowed.includes(fileExt.toLowerCase())) {
                return {
                    isValid: false,
                    error: `Invalid file type. Allowed types: ${extAllowed.join(', ')}`
                };
            }
        }

        // Check if file is empty
        if (file.size === 0) {
            return {
                isValid: false,
                error: 'File is empty'
            };
        }

        return { isValid: true };
    };

    const handleUpload = async (file: File) => {
        const validation = validateFile(file);

        if (!validation.isValid) {
            customToast.error(validation.error || 'Invalid file');
            setStatus('error');
            return;
        }

        setStatus('uploading');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        try {
            const token = getAuthCredentials();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_REST_API_IMAGE_ENDPOINT}/auth/file-upload`,
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }
                }
            );
            const result = await response.json();

            const newDocument: DocumentData = {
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                name: file.name,
                path: result.data.file_path,
                type: docType,
                status: 0
            };

            setDocument(newDocument);
            onDocumentUpdate(newDocument);
            setStatus('success');
            setFile(file);
            customToast.success("Document uploaded successfully.");
        } catch (error) {
            console.error('Upload error:', error);
            setStatus('error');
        }
    };

    const statusIcons = {
        0: '/project/Document.svg',      // Pending
        1: '/project/success.svg',      // Approved
        2: '/project/error.svg',        // Rejected
        deleted: '/project/error.svg'   // Deleted
    };

    const getStatusIcon = (status: number | string) => {
        if (status === 'deleted') return statusIcons.deleted;
        const numericStatus = typeof status === 'string' ? parseInt(status) : status;
        return statusIcons[numericStatus as keyof typeof statusIcons] || statusIcons[0];
    };

    const handleDelete = () => {
        if (document) {
            const deletedDocument: DocumentData = {
                ...document,
                status: 'deleted',
                updated_at: new Date().toISOString()
            };
            onDocumentUpdate(deletedDocument);
        }
        setFile(null);
        setDocument(null);
        setStatus('idle');
    };

    const displayName = document?.name || (file ? file.name : docType);
    const documentPath = document?.path || '';
    const documentStatus = document?.status ?? 0;
    const getBorderColor = () => {
        if (status === 'error') return 'border-red-500';
        if (status === 'success') {
            const numericStatus = typeof documentStatus === 'string' ?
                parseInt(documentStatus) : documentStatus;
            switch (numericStatus) {
                case 0:
                    return 'border-brand1-500';     // Pending
                case 1:
                    return 'border-brand1-500';  // Approved
                case 2:
                    return 'border-red-500';     // Rejected
                default:
                    return 'border-neutral-300';
            }
        }
        return 'border-neutral-300';
    };

    return (
        <div className={`rounded-lg p-3 border ${getBorderColor()}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div
                        className="flex justify-center items-center w-8 h-8 p-2 rounded-full border-2 border-neutral-100 bg-neutral-100">
                        <Image
                            src={getStatusIcon(documentStatus)}
                            className="w-full h-full object-contain"
                            alt="Document Status"
                            width={32}
                            height={32}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-1400">
                                {displayName}
                            </span>
                            {required && status !== 'success' && (
                                <span className="text-xs text-negativeBold">*</span>
                            )}
                        </div>
                        {error && (
                            <span className="text-xs text-negativeBold">{error}</span>
                        )}
                        {document?.updated_at && (
                            <span className="text-xs text-neutral-600">
                                Updated: {new Date(document.updated_at).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    {(!document || documentStatus === 'deleted') && (
                        <>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUpload(file);
                                }}
                                accept={extAllowed?.join(',')}
                                id={`file-${docType}`}
                            />
                            <label
                                htmlFor={`file-${docType}`}
                                className="p-2 hover:bg-neutral-100 rounded-full cursor-pointer"
                            >
                                <div className="w-4 h-4 text-neutral-1000">
                                    <UploadIcon />
                                </div>
                            </label>
                        </>
                    )}

                    {document && documentStatus !== 'deleted' && (
                        <>
                            <a
                                href={`${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/${folder}/${documentPath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-neutral-100 rounded-full"
                            >
                                <div className="w-4 h-4 text-neutral-1000">
                                    <DownloadDocumentIcon />
                                </div>
                            </a>
                            {!removable && (
                                <button
                                    onClick={handleDelete}
                                    className="p-2 hover:bg-neutral-100 rounded-full"
                                >
                                    <div className="w-4 h-4 text-neutral-1000">
                                        <CloseIcon />
                                    </div>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentManager;