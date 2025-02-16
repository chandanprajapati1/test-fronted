import React from 'react';
import Image from "next/image";
import {CheckmarkOutline, Document, WarningAlt} from "@carbon/icons-react";

// Enum for possible status types
enum StatusType {
    EMPTY = '',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error'
}

// Enum for status codes
enum ProjectStatusCode {
    AGREEMENT_SENT = 6,
    AGREEMENT_APPROVED = 7,
    CREDIT_TRANSFER = 8,
    OWNERSHIP_CERTIFICATE = 9,
    PRICE_LOCK = 10
}

// Type for border colors
type BorderColorType = 'border-[#e6e6e6]' | 'border-[#57cc99]' | 'border-[#fcc603]' | 'border-red-500';

// Interface for status card props
interface StatusCardProps {
    title: string;
    description: string;
    status: StatusType;
    borderColor: BorderColorType;
}

// Interface for status data
interface StatusData extends StatusCardProps {
    statusCode: ProjectStatusCode;
}

// Interface for dynamic status data
interface DynamicStatusData {
    status: StatusType;
    description: string;
    borderColor: BorderColorType;
}



const ProjectStatus: React.FC<any> = ({ projectData }) => {

    const statusConfigs: Array<Omit<StatusData, keyof DynamicStatusData>> = [
        {
            title: "Agreement sent",
            statusCode: ProjectStatusCode.AGREEMENT_SENT,
        },
        {
            title: "Agreement approved",
            statusCode: ProjectStatusCode.AGREEMENT_APPROVED,
        },
        {
            title: "Credit transfer",
            statusCode: ProjectStatusCode.CREDIT_TRANSFER,
        },
        {
            title: "Ownership Certificate Upload",
            statusCode: ProjectStatusCode.OWNERSHIP_CERTIFICATE,
        },
        {
            title: "Price Lock",
            statusCode: ProjectStatusCode.PRICE_LOCK,
        }
    ];

    const getBorderColor = (code: ProjectStatusCode): string => {
        switch (code) {
            case ProjectStatusCode.AGREEMENT_SENT:
                if(projectData.batches.status == 3){
                    return "border-red-500";
                }else if(projectData.batches.status == 1){
                    return 'border-warning';
                }else if(projectData.batches.status == 2){
                    return 'border-brand1-500';
                }
                return 'border-neutral-200';
            case ProjectStatusCode.AGREEMENT_APPROVED:
                if ([4].includes(projectData.project_completion_status)){
                    return 'border-neutral-200'
                }
                return 'border-brand1-500';
            case ProjectStatusCode.CREDIT_TRANSFER:
                if ([4,7].includes(projectData.project_completion_status)){
                    return 'border-neutral-200'
                }
                return 'border-brand1-500';
            case ProjectStatusCode.OWNERSHIP_CERTIFICATE:
                if ([4,7,8].includes(projectData.project_completion_status)){
                    return 'border-neutral-200'
                }
                return 'border-brand1-500';
            case ProjectStatusCode.PRICE_LOCK:
                if ([4,7,8,9].includes(projectData.project_completion_status)){
                    return 'border-neutral-200'
                }
                return 'border-brand1-500';
            default:
                return 'border-neutral-200';
        }


        // cardStatusCode === ProjectStatusCode.AGREEMENT_SENT ? 'Initiated' : 'Successfully Done',
    };

    const getDescription = (code: ProjectStatusCode): string => {
        switch (code) {
            case ProjectStatusCode.AGREEMENT_SENT:
                if(projectData.batches.status == 3){
                    return 'Initiated but Expired';
                }else if(projectData.batches.status == 1){
                    return 'Initiated';
                }else if(projectData.batches.status == 2){
                    return 'Accepted';
                }
                return 'Not Initiated';
            case ProjectStatusCode.AGREEMENT_APPROVED:
                if ([4].includes(projectData.project_completion_status)){
                    return 'Not Initiated';
                }
                return 'Successfully Done';
            case ProjectStatusCode.CREDIT_TRANSFER:
                if ([4,7].includes(projectData.project_completion_status)){
                    return 'Not Initiated';
                }
                return 'Successfully Done';
            case ProjectStatusCode.OWNERSHIP_CERTIFICATE:
                if ([4,7,8].includes(projectData.project_completion_status)){
                    return 'Not Initiated';
                }
                return 'Successfully Done';
            case ProjectStatusCode.PRICE_LOCK:
                if ([4,7,8,9].includes(projectData.project_completion_status)){
                    return 'Not Initiated';
                }
                return 'Successfully Done';
            default:
                return 'Successfully Done';
        }


        // cardStatusCode === ProjectStatusCode.AGREEMENT_SENT ? 'Initiated' : 'Successfully Done',
    };


    const getStatusIcon = (status:any) => {

        switch (status) {
            case StatusType.SUCCESS:
                return (
                    <div className="flex justify-center items-center w-8 h-8 p-2 rounded-full bg-[#EAFFF6]">
                        <CheckmarkOutline className="text-brand1-500" />
                    </div>
                );
            case StatusType.WARNING:
                return (
                    <div className="flex justify-center items-center w-8 h-8 p-2 rounded-full bg-[#FFF8DE]">
                        <CheckmarkOutline />
                    </div>
                );
            case StatusType.ERROR:
                return (
                    <div className="flex justify-center items-center w-8 h-8 p-2 rounded-full bg-[#FFF1F1]">
                        <WarningAlt  className="w-4 h-4" />
                    </div>
                );
            default:
                return '';

        }
    };

    const getStatus = (status:any) => {
        switch (status) {
            case ProjectStatusCode.AGREEMENT_SENT:
                if(projectData.batches.status == 3){
                    return getStatusIcon('error');
                }else if(projectData.batches.status == 1){
                    return getStatusIcon('warning');
                }else if(projectData.batches.status == 2){
                    return getStatusIcon('success');
                }
                return '';
            case ProjectStatusCode.AGREEMENT_APPROVED:
                if ([4].includes(projectData.project_completion_status)){
                    return '';
                }
                return getStatusIcon('success');
            case ProjectStatusCode.CREDIT_TRANSFER:
                if ([4,7].includes(projectData.project_completion_status)){
                    return '';
                }
                return getStatusIcon('success');
            case ProjectStatusCode.OWNERSHIP_CERTIFICATE:
                if ([4,7,8].includes(projectData.project_completion_status)){
                    return '';
                }
                return getStatusIcon('success');
            case ProjectStatusCode.PRICE_LOCK:
                if ([4,7,8,9].includes(projectData.project_completion_status)){
                    return '';
                }
                return getStatusIcon('success');
            default:
                return '';
        }

    };

    return (
        <div className="text-black relative max-w-screen-sc-2xl mx-auto">
            <div className="flex flex-col justify-start items-start flex-grow gap-6 py-6">
                <div>
                    <h2 className="text-f-5xl font-light">Status</h2>
                    <div className="text-f-l text-neutral-1200 font-normal">
                        Status of your project agreement
                    </div>
                </div>
                <div className="text-neutral-1400 flex flex-col gap-6 w-full">
                    {statusConfigs.map((status, index) => (
                        <div className={`flex justify-center items-center gap-2 p-3 rounded-lg border ${getBorderColor(status.statusCode)}`}>
                            <div className="bg-light w-8 h-8 rounded-full flex justify-center items-center">
                                <Document className="w-4 h-4"/>
                            </div>
                            <div className="flex flex-col justify-center items-start flex-grow gap-2">
                                <p className="text-sm text-left text-neutral-1400">{status.title}</p>
                                <p className="self-stretch text-xs text-left text-neutral-1200">{getDescription(status.statusCode)}</p>
                            </div>
                            {getStatus(status.statusCode)}
                        </div>))}
                </div>
            </div>
        </div>);
};

export default ProjectStatus;