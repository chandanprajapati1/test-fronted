'use client'
import React, { useEffect } from 'react'
import Stepper from '../ui/Stepper'
import Description from './Enrichment/Description';
import Developer from './Enrichment/Developer';
import SDGGoal from './Enrichment/SDGGoal';
import ImpactAtGlance from './Enrichment/ImpactAtGlance';
import CarbonImpact from './Enrichment/CarbonImpact';
import Gallery from './Enrichment/Gallery';
import CoBenefits from './Enrichment/CoBenefits';
import { useDispatch, useSelector } from 'react-redux';
import { initialEnrichmentStepper } from '@/app/store/slices/projectOnboardingSlice';

const steps: any = [
    { title: 'Project Description', description: 'Details that describe your project' },
    { title: 'Project Developer', description: 'Developers related details' },
    { title: 'SDG Goal', description: 'Enrich the SDG goal content' },
    { title: 'Co-benefits', description: 'Benefits from your project' },
    { title: 'Impact at Glance', description: 'Impacts related details' },
    { title: 'Carbon Impact', description: 'Impacts related details' },
    { title: 'Gallery', description: 'Image from your project' },
];

const stepComponents: Record<number, React.ReactNode> = {
    0: <Description />,
    1: <Developer />,
    2: <SDGGoal />,
    3: <CoBenefits />,
    4: <ImpactAtGlance />,
    5: <CarbonImpact />,
    6: <Gallery />,
};

const Enrichment = () => {
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(initialEnrichmentStepper(0))
    // }, [dispatch]);


    const currentStep = useSelector((state: any) => state.projectOnboarding.enrichmentStepper);

    return (
        <div className="text-neutral-1400 relative h-auto flex py-6 ">
            <div className='flex-1 w-full  sc-sm:mr-2xl'>
                {stepComponents[currentStep]}
            </div>
            <div className='flex-[0.4]  hidden  sc-sm:block'>
                <Stepper steps={steps} currentStep={currentStep} />
            </div>
        </div>
    )
}

export default Enrichment