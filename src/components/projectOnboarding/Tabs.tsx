"use client";
import { currentTabHandler } from '@/app/store/slices/projectOnboardingSlice';
import React, {useEffect, useRef, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TabType } from "@/types";
import {hideManagementStatuses} from "@/utils/constants";
import {ScrollableContainer} from "@/components/ui/scrollableContainer";

interface TabData {
    icon: React.ReactNode;
    title: string;
    value: TabType
}

const tabsData: TabData[] = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 4.00037H4V6.00037H5V4.00037Z" fill="#161616" />
            <path d="M5 7.00037H4V9.00037H5V7.00037Z" fill="#161616" />
            <path d="M8 4.00037H7V6.00037H8V4.00037Z" fill="#161616" />
            <path d="M8 7.00037H7V9.00037H8V7.00037Z" fill="#161616" />
            <path d="M5 10.0004H4V12.0004H5V10.0004Z" fill="#161616" />
            <path d="M8 10.0004H7V12.0004H8V10.0004Z" fill="#161616" />
            <path d="M15 7.00037C15 6.73515 14.8946 6.4808 14.7071 6.29326C14.5196 6.10572 14.2652 6.00037 14 6.00037H11V2.00037C11 1.73515 10.8946 1.4808 10.7071 1.29326C10.5196 1.10572 10.2652 1.00037 10 1.00037H2C1.73478 1.00037 1.48043 1.10572 1.29289 1.29326C1.10536 1.4808 1 1.73515 1 2.00037V15.0004H15V7.00037ZM2 2.00037H10V14.0004H2V2.00037ZM11 14.0004V7.00037H14V14.0004H11Z" fill="#161616" />
        </svg>,
        title: "Project Details",
        value: "details"
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M15.5 12.0004H13.5V10.0004H12.5V12.0004H10.5V13.0004H12.5V15.0004H13.5V13.0004H15.5V12.0004Z" fill="#161616" />
            <path d="M12.5 2.50037H11V2.00037C10.9992 1.73539 10.8936 1.48148 10.7063 1.2941C10.5189 1.10673 10.265 1.00113 10 1.00037H6C5.73502 1.00113 5.48111 1.10673 5.29374 1.2941C5.10637 1.48148 5.00077 1.73539 5 2.00037V2.50037H3.5C3.23502 2.50113 2.98111 2.60673 2.79374 2.7941C2.60637 2.98148 2.50077 3.23538 2.5 3.50037V14.0004C2.50077 14.2653 2.60637 14.5193 2.79374 14.7066C2.98111 14.894 3.23502 14.9996 3.5 15.0004H8.5V14.0004H3.5V3.50037H5V5.00037H11V3.50037H12.5V8.00037H13.5V3.50037C13.4992 3.23538 13.3936 2.98148 13.2063 2.7941C13.0189 2.60673 12.765 2.50113 12.5 2.50037ZM10 4.00037H6V2.00037H10V4.00037Z" fill="#161616" />
        </svg>,
        title: "Project Specifications",
        value: "specifications"
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g >
                <path d="M15 6.50037H14V7.50037H15V6.50037Z" fill="#161616" />
                <path d="M12.5961 1.69175L11.889 2.39885L12.5961 3.10595L13.3032 2.39885L12.5961 1.69175Z" fill="#161616" />
                <path d="M8.5 0.000366211H7.5V1.00037H8.5V0.000366211Z" fill="#161616" />
                <path d="M2.6967 2.40959L3.4038 3.11669L4.1109 2.40959L3.4038 1.70249L2.6967 2.40959Z" fill="#161616" />
                <path d="M2 6.50037H1V7.50037H2V6.50037Z" fill="#161616" />
                <path d="M10 6.50037H8.5V5.00037H7.5V6.50037H6V7.50037H7.5V9.00037H8.5V7.50037H10V6.50037Z" fill="#161616" />
                <path d="M9.5 15.0004H6.5V16.0004H9.5V15.0004Z" fill="#161616" />
                <path d="M10.5 13.0004H5.5V14.0004H10.5V13.0004Z" fill="#161616" />
                <path d="M8 2.00037C5.25 2.00037 3 4.25037 3 7.00037C3 9.20037 4 10.1504 4.75 10.8004C5.25 11.2504 5.5 11.5504 5.5 12.0004H6.5C6.5 11.1004 5.95 10.5504 5.4 10.0504C4.7 9.45037 4 8.75037 4 7.00037C4 4.80037 5.8 3.00037 8 3.00037C10.2 3.00037 12 4.80037 12 7.00037C12 8.75037 11.3 9.45037 10.6 10.0504C10.05 10.5504 9.5 11.0504 9.5 12.0004H10.5C10.5 11.5504 10.75 11.2504 11.25 10.8004C12 10.1504 13 9.20037 13 7.00037C13 4.25037 10.75 2.00037 8 2.00037Z" fill="#161616" />
            </g>
        </svg>,
        title: "Project Enrichment",
        value: "enrichment"
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M15 12.0004V11.0004H13.9494C13.885 10.6874 13.7607 10.3898 13.5835 10.1239L14.3285 9.37892L13.6215 8.67192L12.8765 9.41692C12.6106 9.23967 12.313 9.1154 12 9.05092V8.00037H11V9.05092C10.687 9.11539 10.3894 9.23964 10.1236 9.41687L9.37855 8.67187L8.67155 9.37887L9.41655 10.1239C9.2393 10.3898 9.11503 10.6874 9.05055 11.0004H8V12.0004H9.05055C9.11502 12.3133 9.23928 12.6109 9.4165 12.8768L8.6715 13.6218L9.3785 14.3288L10.1235 13.5838C10.3894 13.7611 10.687 13.8853 11 13.9498V15.0004H12V13.9498C12.313 13.8853 12.6106 13.7611 12.8764 13.5839L13.6215 14.3289L14.3285 13.6219L13.5835 12.8769C13.7607 12.611 13.885 12.3134 13.9494 12.0004H15ZM11.5 13.0004C11.2033 13.0004 10.9133 12.9124 10.6666 12.7476C10.42 12.5827 10.2277 12.3485 10.1142 12.0744C10.0006 11.8003 9.97094 11.4987 10.0288 11.2077C10.0867 10.9168 10.2296 10.6495 10.4393 10.4397C10.6491 10.2299 10.9164 10.0871 11.2074 10.0292C11.4983 9.97131 11.7999 10.001 12.074 10.1145C12.3481 10.2281 12.5824 10.4203 12.7472 10.667C12.912 10.9137 13 11.2037 13 11.5004C12.9996 11.8981 12.8414 12.2793 12.5602 12.5605C12.279 12.8418 11.8977 12.9999 11.5 13.0004Z" fill="#161616" />
            <path d="M14 2.00037H2C1.73486 2.00063 1.48066 2.10607 1.29319 2.29355C1.10571 2.48103 1.00026 2.73523 1 3.00037V13.0004C1.0003 13.2655 1.10576 13.5197 1.29323 13.7071C1.4807 13.8946 1.73488 14.0001 2 14.0004H7V13.0004H2V6.00037H14V7.50037H15V3.00037C14.9997 2.73524 14.8942 2.48107 14.7068 2.2936C14.5193 2.10613 14.2651 2.00067 14 2.00037ZM14 5.00037H2V3.00037H14V5.00037Z" fill="#161616" />
            <path d="M10 4.50037C10.2761 4.50037 10.5 4.27651 10.5 4.00037C10.5 3.72422 10.2761 3.50037 10 3.50037C9.72386 3.50037 9.5 3.72422 9.5 4.00037C9.5 4.27651 9.72386 4.50037 10 4.50037Z" fill="#161616" />
            <path d="M11.5 4.50037C11.7761 4.50037 12 4.27651 12 4.00037C12 3.72422 11.7761 3.50037 11.5 3.50037C11.2239 3.50037 11 3.72422 11 4.00037C11 4.27651 11.2239 4.50037 11.5 4.50037Z" fill="#161616" />
            <path d="M13 4.50037C13.2761 4.50037 13.5 4.27651 13.5 4.00037C13.5 3.72422 13.2761 3.50037 13 3.50037C12.7239 3.50037 12.5 3.72422 12.5 4.00037C12.5 4.27651 12.7239 4.50037 13 4.50037Z" fill="#161616" />
        </svg>,
        title: "Current Status",
        value: "management"
    }
];



interface RootState {
    projectOnboarding: {
        currentTab: TabType;
        allowedTabs: TabType[];
    };
}

interface TabsProps {
    currentTab: 'details' | 'specifications' | 'enrichment' | 'management';
}

const Tabs: React.FC<TabsProps> = () => {
    const { currentTab, allowedTabs } = useSelector((state: RootState) => state.projectOnboarding);
    const [selectedTab, setSelectedTab] = useState<TabType>(currentTab);
    const dispatch = useDispatch();
    const currentType = useSelector((state: any) => state.projectOnboarding.projectTypeId);



    useEffect(() => {
        setSelectedTab(currentTab);
    }, [currentTab]);

    const visibleTabs = tabsData.filter(tab => {
        if (tab.value === 'management') {
            return !hideManagementStatuses.includes(currentType);
        }
        return true;
    });

    const tabHandler = (tabId: TabType) => {
        if (allowedTabs.includes(tabId)) {
            setSelectedTab(tabId);
            dispatch(currentTabHandler(tabId));
        }
    };

    return (<div className="border-b-2 border-neutral-400">
        <ScrollableContainer>
            {visibleTabs.map((tab) => (<div
                    key={tab.value}
                    role="tab"
                    aria-selected={selectedTab === tab.value}
                    className={`
                            flex-shrink-0 text-black px-4 py-2
                            ${selectedTab === tab.value ? 'border-b-2 border-brand1-600' : ''}
                            ${allowedTabs.includes(tab.value) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                        `}
                    onClick={() => allowedTabs.includes(tab.value) && tabHandler(tab.value)}
                >
                    <div className="flex items-center space-x-2">
                        {tab.icon} <span className="text-md">{tab.title}</span>
                    </div>
                </div>))}
        </ScrollableContainer>
    </div>);
};

export default Tabs;