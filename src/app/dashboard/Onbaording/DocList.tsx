import React, { useEffect, useRef, useState } from 'react'
import CheckIcon from './CheckIcon';
import { getAuthCredentials } from '@/utils/auth-utils';
interface FileInfo {
    name: string;
    size: number; // size in bytes
    type: string;
}

const DocList = (props: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<FileInfo | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileStatus, setFileStatus] = useState("")
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files;
        if (selectedFile && selectedFile.length > 0) {
            const formData = new FormData();
            formData.append('file', selectedFile[0]);
            formData.append('folder', 'company-documents');
            // console.log("formData", formData, selectedFile[0]);
            try {
                const token = getAuthCredentials();
                const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_IMAGE_ENDPOINT}/auth/file-upload`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }

                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Files uploaded successfully:', result);
                    const fileData = {
                        id: props.id,
                        data: {
                            "type": props.doc.Name,
                            "name": selectedFile[0].name,
                            "path": result.data.file_path,
                            "notes": props.id
                        }
                    }
                    props.addFiles(fileData)
                    setFileStatus("process")
                    // Additional actions based on success
                } else {
                    console.error('Failed to upload files:', response.statusText);
                }
            } catch (error) {
                console.error('Error uploading files:', error);
            }
            const url = URL.createObjectURL(selectedFile?.[0]);
            setFileUrl(url);
            setFile({
                name: selectedFile[0].name,
                size: selectedFile[0].size,
                type: selectedFile[0].type
            });
        }
    };

    const handleCloseClick = () => {

        // Revoke the object URL to free up resources
        if (fileUrl) {
            URL.revokeObjectURL(fileUrl);
        }
        // Reset file and fileUrl state
        setFile(null);
        setFileUrl(null);
        props.removeFile();
        setFileStatus("")
    };


    useEffect(() => {
        return () => {
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl);
            }
        };
    }, [fileUrl]);


    return (
        <div className='text-black  p-m rounded-lg flex items-center justify-between ' style={{
            border: file ? '2px solid #57cc99' : '2px solid #D8D8D8'
        }}>
            <div className='flex justify-center bg-brand1-10 w-4xl h-4xl items-center rounded-full'>
                <div className='flex justify-center bg-brand1-100 w-3xl h-3xl items-center rounded-full'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12.85 4.65L9.35 1.15C9.25 1.05 9.15 1 9 1H4C3.45 1 3 1.45 3 2V14C3 14.55 3.45 15 4 15H12C12.55 15 13 14.55 13 14V5C13 4.85 12.95 4.75 12.85 4.65ZM9 2.2L11.8 5H9V2.2ZM12 14H4V2H8V5C8 5.55 8.45 6 9 6H12V14Z" fill="#57CC99" />
                        <path d="M11 11H5V12H11V11Z" fill="#57CC99" />
                        <path d="M11 8H5V9H11V8Z" fill="#57CC99" />
                    </svg>
                </div>
            </div>

            <div className='flex flex-col flex-1 ml-s'>
                <div className='flex items-center'>
                    <div className='text-black font-extralight text-m font-inter mr-s'> {file != null ? file.name.length > 20 ? file.name.slice(0, 20) + "..." : file.name : 'Name of the document'}</div>
                    <CheckIcon value={fileStatus} />
                </div>
                <div className='text-black font-extralight text-s font-inter'>{props.doc.Name}</div>
            </div>
            <div className='flex '>
                <>
                    {file == null && (
                        <div id="upload" className='p-m cursor-pointer' onClick={() => handleUploadClick()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 9L3.705 9.705L7.5 5.915V15H8.5V5.915L12.295 9.705L13 9L8 4L3 9Z" fill="#4D4D4D" />
                                <path d="M3 4V2H13V4H14V2C14 1.73478 13.8946 1.48043 13.7071 1.29289C13.5196 1.10536 13.2652 1 13 1H3C2.73478 1 2.48043 1.10536 2.29289 1.29289C2.10536 1.48043 2 1.73478 2 2V4H3Z" fill="#4D4D4D" />
                            </svg>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </>
                {file != null && <a href={fileUrl || undefined} download={file?.name || "downloaded_file"} className='p-m cursor-pointer' id="view">

                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11 13C11.5523 13 12 12.5523 12 12C12 11.4477 11.5523 11 11 11C10.4477 11 10 11.4477 10 12C10 12.5523 10.4477 13 11 13Z" fill="#4D4D4D" />
                        <path d="M14.8884 11.7393C14.5795 10.9522 14.0464 10.2732 13.3552 9.78629C12.664 9.29937 11.8451 9.02598 11 9C10.1549 9.02598 9.33603 9.29937 8.64484 9.78629C7.95365 10.2732 7.42052 10.9522 7.11155 11.7393L7 12L7.11155 12.2607C7.42052 13.0478 7.95365 13.7268 8.64484 14.2137C9.33603 14.7006 10.1549 14.974 11 15C11.8451 14.974 12.664 14.7006 13.3552 14.2137C14.0464 13.7268 14.5795 13.0478 14.8884 12.2607L15 12L14.8884 11.7393ZM11 14C10.6044 14 10.2178 13.8827 9.88886 13.6629C9.55996 13.4432 9.30362 13.1308 9.15224 12.7654C9.00087 12.3999 8.96126 11.9978 9.03843 11.6098C9.1156 11.2219 9.30608 10.8655 9.58579 10.5858C9.86549 10.3061 10.2219 10.1156 10.6098 10.0384C10.9978 9.96126 11.3999 10.0009 11.7654 10.1522C12.1308 10.3036 12.4432 10.56 12.6629 10.8889C12.8827 11.2178 13 11.6044 13 12C12.9994 12.5303 12.7885 13.0386 12.4136 13.4136C12.0386 13.7885 11.5303 13.9994 11 14Z" fill="#4D4D4D" />
                        <path d="M6 8.5H3.5V9.5H6V8.5Z" fill="#4D4D4D" />
                        <path d="M9.5 6H3.5V7H9.5V6Z" fill="#4D4D4D" />
                        <path d="M9.5 3.5H3.5V4.5H9.5V3.5Z" fill="#4D4D4D" />
                        <path d="M11 1H2C1.73502 1.00077 1.48111 1.10637 1.29374 1.29374C1.10637 1.48111 1.00077 1.73502 1 2V14C1.00077 14.265 1.10637 14.5189 1.29374 14.7063C1.48111 14.8936 1.73502 14.9992 2 15H6V14H2V2H11V7.5H12V2C11.9992 1.73502 11.8936 1.48111 11.7063 1.29374C11.5189 1.10637 11.265 1.00077 11 1Z" fill="#4D4D4D" />
                    </svg>
                </a>}
                <div id="close" className='p-m cursor-pointer' onClick={handleCloseClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12 4.7L11.3 4L8 7.3L4.7 4L4 4.7L7.3 8L4 11.3L4.7 12L8 8.7L11.3 12L12 11.3L8.7 8L12 4.7Z" fill="#4D4D4D" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default DocList