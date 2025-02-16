import React, {useEffect} from 'react';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

type StatusType = 'success' | 'warning' | 'danger' | 'info';

interface StatusBarProps {
    type?: StatusType;
    message: string;
    showIcon?: boolean;
    classess?: string;
}

const StatusBar = ({ type = 'info', message, showIcon = true, classess='' }: StatusBarProps) => {
    const statusConfig = {
        success: {
            bgColor: 'bg-btnSuccess',
            textColor: 'text-neutral-1400',
            borderColor: 'border-success',
            Icon: CheckCircle
        },
        warning: {
            bgColor: 'bg-btnWarning',
            textColor: 'text-notice',
            borderColor: 'border-warning',
            Icon: AlertCircle
        },
        danger: {
            bgColor: 'bg-btnDanger',
            textColor: 'text-neutral-1400',
            borderColor: 'border-danger',
            Icon: XCircle
        },
        info: {
            bgColor: 'bg-info/10',
            textColor: 'text-info',
            borderColor: 'border-info',
            Icon: Info
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { bgColor, textColor, borderColor, Icon } = statusConfig[type];

    return (
        <div className={` flex items-start gap-2 px-4 py-3 rounded-m ${bgColor} ${textColor} border ${borderColor} ${classess} `}>
            {showIcon && <Icon className="w-5 h-5" />}
            <span className="text-sm font-medium min-w-0 break-words">{message}</span>
        </div>
    );
};

export default StatusBar;