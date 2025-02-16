import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { API_ENDPOINTS } from "@/config/api-endpoint";
import axiosApi from "@/utils/axios-api";
import { useRouter, useSearchParams } from 'next/navigation';
import {
    currentProjectDetail,
    currentStatusHandler,
    currentTabHandler,
    currentTypeHandler,
    decrementDetailStepper,
    updateAllowedTabs
} from "@/app/store/slices/projectOnboardingSlice";
import { useDispatch, useSelector } from "react-redux";
import { ButtonGroup } from "@/components/common/ButtonGroup";
import DocumentItem from "@/components/projectOnboarding/Details/DocumentItem";
import { customToast } from "@/components/ui/customToast";
import { getAuthCredentials } from '@/utils/auth-utils';
import { sub } from 'date-fns';
import { encryptString } from '@/utils/enc-utils';

const DocumentUpload: NextPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [documentUploads, setDocumentUploads] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const projectDetail = useSelector((state: any) =>
        state.projectOnboarding?.projectDetail
    );

    // Check if any document has error status
    const hasErrorDocuments = () => {
        return documentUploads.some(doc => doc.approvalStatus === 2);
    };

    // Check if all required documents are uploaded
    const areAllDocumentsUploaded = () => {
        return documentUploads.every(doc => doc.path !== null);
    };

    // Check if skip button should be visible
    const shouldShowSkipButton = () => {
        return projectDetail?.project_completion_status >= 2 && projectDetail?.project_completion_status != 5;
    };

    useEffect(() => {
        const projectId = searchParams.get('id');
        if (!projectId) {
            console.error('Project ID is missing from the URL');
            return;
        }

        const fetchProjectDetailsAndDocuments = async () => {
            try {
                const projectResponse = await axiosApi.project.get(API_ENDPOINTS.ProjectCurrentStatus(projectId));
                const projectData = projectResponse.data.data.project_details;
                dispatch(currentTypeHandler(projectData.project_status.project_status_name));
                dispatch(currentProjectDetail(projectData));
                dispatch(currentStatusHandler(projectData.project_completion_status));
                let existingDocuments = [];
                if (projectData.documents && projectData.documents.length > 0) {
                    existingDocuments = projectData.documents.map((doc: any) => ({
                        name: doc.name,
                        file: doc.path ? `${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/project-documents/${doc.path}` : '',
                        path: doc.path,
                        isRequired: true,
                        approvalStatus: doc.status,
                        type: doc.type,
                        description: doc.description,
                        existingDocument: doc
                    }));
                }

                const documentsResponse = await axiosApi.project.get(API_ENDPOINTS.DocumentNeedToUpload(projectData.project_status._id));
                const requiredDocuments = documentsResponse.data.data.project_status.documents;

                const mergedDocuments = requiredDocuments.map((reqDoc: any) => {
                    const existingDoc = Array.isArray(existingDocuments)
                        ? existingDocuments.find(doc => doc.name === reqDoc.name)
                        : undefined;
                    return existingDoc || {
                        ...reqDoc,
                        file: null,
                        path: null,
                        isRequired: true,
                        approvalStatus: 0
                    };
                });

                setDocumentUploads(mergedDocuments);
            } catch (error: any) {
                console.error('Error in fetchProjectDetailsAndDocuments:', error);
            }
        };

        fetchProjectDetailsAndDocuments();
    }, [searchParams, router, dispatch]);

    const handleUpload = async (index: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'project-documents');
        const token = getAuthCredentials();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_IMAGE_ENDPOINT}/auth/file-upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            });
            const responseData = await response.json();

            console.log("responseDataresponseData", responseData)
            setDocumentUploads(prevDocs => prevDocs.map((doc, i) =>
                i === index ? {
                    ...doc,
                    approvalStatus: 0,
                    file: file,
                    path: responseData.data.file_path
                } : doc
            ));

        } catch (error) {
            console.error('Error uploading file:', error);
            setDocumentUploads(prevDocs => prevDocs.map((doc, i) =>
                i === index ? {
                    ...doc,
                    approvalStatus: 2,
                    file: null,
                    path: null
                } : doc
            ));
        }
    };

    const handleView = (index: number) => {
        const doc = documentUploads[index];
        if (doc.file) {
            let url;
            if (doc.file instanceof File) {
                url = URL.createObjectURL(doc.file);
            } else if (typeof doc.file === 'string') {
                url = doc.file;
            } else {
                console.error('Invalid file type');
                return;
            }
            window.open(url, '_blank');
        }
    };

    const handleDelete = (index: number) => {
        setDocumentUploads(prevDocs => prevDocs.map((doc, i) =>
            i === index ? {
                ...doc,
                approvalStatus: 0,
                file: null,
                path: null
            } : doc
        ));
    };

    const handleBack = () => {
        dispatch(decrementDetailStepper());
    };

    const onSkip = () => {
        dispatch(currentTabHandler("specifications"));
    };

    const handleSubmit = async () => {
        if (!areAllDocumentsUploaded() || hasErrorDocuments()) {
            customToast.error("Please ensure all documents are uploaded and valid before submitting.");
            return;
        }
        setIsSubmitting(true);
        const documents = documentUploads
            .filter(doc => doc.path)
            .map(doc => ({
                name: doc.name,
                path: doc.path,
                type: doc.file instanceof File ? doc.file.type : (doc.type || 'unknown'),
                description: `Uploaded document for ${doc.name}`,
                status: doc.approvalStatus
            }));

        const submissionData = {
            documents,
            onboarding_status: {
                step_number: 1,
                step_name: "specifications",
                is_complete: false,
            }
        };

        try {
            const projectId = searchParams.get('id');
            if (!projectId) {
                console.log("No project ID found in URL. Skipping project details fetch.");
                return;
            }
            const requestBody =  submissionData;
            let encryptedPayload = {};
            if(Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0){
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            const response = await axiosApi.project.put(
                API_ENDPOINTS.ProjectUpdate(projectId),
                { data: encryptedPayload }
            );
            dispatch(updateAllowedTabs({ isDetailsComplete: true }));
            dispatch(currentTabHandler("specifications"))
            dispatch(currentStatusHandler(2));
            dispatch(currentProjectDetail(response.data.data.project))
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full flex flex-col gap-6 ">
            <div className="flex flex-col gap-1">
                <h1 className="text-[32px] font-light text-neutral-1400">Project documents</h1>
                <p className="text-sm text-neutral-1200">Upload and attach documents of the company. All documents are
                    required.</p>
            </div>

            <div className="flex flex-col gap-4 py-4">
                <hr className="border-t border-[#D8D8D8]" />
                {documentUploads.map((doc, index) => (
                    <DocumentItem
                        key={index}
                        title={doc.name}
                        onUpload={(file) => handleUpload(index, file)}
                        onView={() => handleView(index)}
                        onDelete={() => handleDelete(index)}
                        extAllowed={['.pdf', '.doc', '.docx']}
                        file={doc.file}
                        isRequired={doc.isRequired}
                        status={doc.approvalStatus}
                    />
                ))}
            </div>

            <ButtonGroup
                onBack={handleBack}
                onSubmit={handleSubmit}
                onSkip={onSkip}
                isSkipVisible={shouldShowSkipButton()}
                submitType="button"
                isLoading={isSubmitting}
                isDisabled={!areAllDocumentsUploaded() || hasErrorDocuments()}
                isBackVisible={true}
            />
        </div>
    );
};

export default DocumentUpload;