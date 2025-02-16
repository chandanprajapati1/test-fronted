import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosApi from "@/utils/axios-api";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import Input from "@/components/ui/input";
import React from "react";
import { encryptString } from "@/utils/enc-utils";
import { isHtmlTagPresent } from "@/utils/input-utils";
import { customToast } from "@/components/ui/customToast";

const formSchema = yup.object().shape({
    address: yup.string().required('Address is required'),
});

const AddressChangeRequestModal = ({ onClose, initialData }: {
    onClose: () => void;
    initialData?: null;
}) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: initialData || {
            address: '',
        }
    });

    const onSubmit = async (data: any) => {
        if (isHtmlTagPresent(data)) {
            customToast.error("Invalid Input!");
            return;
        }
        try {
            const requestBody = data;
            let encryptedPayload = {};
            if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            await axiosApi.auth.patch(API_ENDPOINTS.Address, { data: encryptedPayload });
            onClose();
        } catch (error) {
            console.error('Error saving address details:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[95%]">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-neutral-1400">
                        Request for change in address
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        &#x2715;
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4">
                    <Input
                        registration={register('address')}
                        label="Corporate Address"
                        placeholder="Enter address"
                        className='flex flex-col gap-2 w-full'
                        inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[42px]'
                        error={errors.address?.message}
                        required
                    />
                    <div className="w-full flex justify-end gap-2 px-6 py-4 border-t border-neutral-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-9 px-3 py-2 rounded-lg bg-neutral-1000 text-sm text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="h-9 px-3 py-2 rounded-lg bg-primary text-sm text-white"
                        >
                            {initialData ? 'Update' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressChangeRequestModal;