import React, { useEffect } from 'react'
import { Routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import { currentTabHandler, setDetailStepper } from "@/app/store/slices/projectOnboardingSlice";
import { useDispatch } from "react-redux";

interface ThankYouProps {
    projectDetails?: any
}

const ThankYou = ({ projectDetails }: ThankYouProps) => {
    const hasRejectedDocuments = projectDetails?.documents?.some((doc: any) => doc.status === 2);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const handleHomeClick = () => {
        router.push(Routes.Dashboard)
    }

    const handleDocumentClick = () => {
        dispatch(currentTabHandler("details"));
        dispatch(setDetailStepper(1));
    }


    return (
        <>
            <div className="text-black h-screen py-12xl items-center flex flex-col bg-white">
                <div className='text-f-5xl font-light text-center'>Thank you for submitting your documents.</div>
                <div className={`text-l my-xl font-normal text-center ${hasRejectedDocuments ? 'text-danger' : 'text-neutral-1200'}`}>
                    {hasRejectedDocuments
                        ? "Some of your documents have been rejected. Please review and reupload the required documents."
                        : "Our verification team is reviewing your submission. We will notify you once the approval process is complete."}
                </div>
                <div className='flex justify-center items-center gap-l w-full'>
                    {hasRejectedDocuments ? (
                        <button
                            className='py-l px-10xl mt-xl bg-brand1-500 text-f-m rounded-xl text-white hover:bg-brand1-300'
                            onClick={handleDocumentClick}>
                            GoTo Uploaded Documents
                        </button>
                    ) : (
                        <button
                            className='py-l px-10xl mt-xl bg-brand1-500 text-f-m rounded-xl text-white hover:bg-brand1-300'
                            onClick={handleHomeClick}>
                            Home
                        </button>
                    )}
                </div>

            </div>
        </>
    )
}

export default ThankYou;