import { API_ENDPOINTS } from '@/config/api-endpoint';
import axiosApi from '@/utils/axios-api';
import React, { useState } from 'react'
import { FaHandPointUp } from "react-icons/fa";
import { customToast } from '../ui/customToast';

const FloationButton = ({ token, status }: any) => {
    const [intent, setIntent] = useState(false)
    const onClickIntent = async () => {
        try {
            const response = await axiosApi.project.get(API_ENDPOINTS.ShowIntent(token));

            if (response.status === 200) {
                setIntent(true)
                customToast.success(`Thanks for showing you interest.`)
            }

        } catch (error) {
            customToast.error(`Show intent Error : ${error}`)
        }
    }
    return (
        <button className='fixed z-20 right-5 bottom-28 bg-brand1-500 bg-opacity-80 px-l py-m rounded-2xl hover:bg-opacity-100 hover:scale-105 shadow-lg border-2 border-white flex items-center gap-s shadow-brand1-200' onClick={status == 1 ? onClickIntent : undefined}>
            <div className='text-f-l font-semibold'>
                {status == 2 || intent ? "Intented" : "Intent"}
            </div>
            {status == 1 && !intent && <FaHandPointUp size={20} />}

        </button>
    )
}

export default FloationButton