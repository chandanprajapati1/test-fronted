'use client'
import React, { useState } from 'react'
import Stepper from '../ui/Stepper'
import { useSelector } from 'react-redux';
import About from "@/components/projectOnboarding/Details/About";
import DocumentUpload from "@/components/projectOnboarding/Details/DocumentUpload";

const steps: any = [
    { title: 'Basic Details', description: 'Details to validate your project' },
    { title: 'Documents', description: 'Legal document of the project' }
];

const stepComponents: Record<number, React.ReactNode> = {
    0: <About />,
    1: <DocumentUpload />
};

const Details = () => {
    const currentStep = useSelector((state: any) => state.projectOnboarding.detailStepper);
    return (
        <div className="text-neutral-1400 relative h-auto flex py-6 ">
            <div className='flex-1 sc-sm:mr-2xl '>
                {stepComponents[currentStep]}
            </div>
            <div className='flex-[0.4] hidden  sc-sm:block '>
                <Stepper steps={steps} currentStep={currentStep} />
            </div>
        </div>
    )
}

export default Details