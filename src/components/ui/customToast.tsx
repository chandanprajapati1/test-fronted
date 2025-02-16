import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast, ToastContent, ToastOptions } from 'react-toastify';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const CustomToastContainer = () => {
    return (
        <ToastContainer

            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            // newestOnTop={false}
            icon={false}
            closeOnClick
            pauseOnHover
            limit={1}
            className=""
            toastClassName=""
            progressClassName="test"
            bodyClassName={({ type }: any) => `
        border-l-4 px-4 py-2
        ${type === 'success' ? 'border-[#07bc0c]' :
                    type === 'error' ? 'border-[#e74c3c]' :
                        type === 'warning' ? 'border-yellow-500' :
                            'border-blue-500'
                }
      `}
        />
    );
};

const createToast = (type: ToastType, title: string, Icon: React.ElementType) => (message: any, options?: ToastOptions) => {
    toast.dismiss();
    toast[type](
        <div className="flex items-start">
            <div className="flex-shrink-0 mr-4">
                <Icon className={`text-f-3xl ${type === 'success' ? 'text-green-500' :
                    type === 'error' ? 'text-negativeBold' :
                        type === 'warning' ? 'text-yellow-500' :
                            'text-blue-500'
                    }`} />
            </div>
            <div className="flex-1">
                {/*<h3 className="font-bold mb-1">{title}</h3>*/}
                <p>{message}</p>
            </div>
        </div>,
        {
            className: `${type === 'success' ? 'bg-green-100' :
                type === 'error' ? 'bg-red-100' :
                    type === 'warning' ? 'bg-yellow-100' :
                        'bg-blue-100'
                }`,
            ...options
        }
    );
};

const customToast = {
    success: createToast('success', 'Success', FaCheckCircle),
    error: createToast('error', 'Error', FaExclamationCircle),
    warning: createToast('warning', 'Warning', FaExclamationTriangle),
    info: createToast('info', 'Info', FaInfoCircle)
};

export { CustomToastContainer, customToast };
