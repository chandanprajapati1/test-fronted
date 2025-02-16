import React, { useState } from "react";
import {CheckmarkOutline} from "@carbon/icons-react";

const Impact = ({ data }: any) => {
    const [expandedItems, setExpandedItems] = useState<any>({});

    const toggleReadMore = (index: any) => {
        setExpandedItems((prev: any) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const truncateText = (text: any, limit: any) => {
        if (!text) {
            return;
        }
        if (text.length <= limit) return text;
        return text.slice(0, limit) + "...";
    };

    return (
        <div className="flex items-center self-stretch gap-2.5 mt-xl">
            <div className="flex flex-col items-start self-stretch grow rounded-2xl bg-white shadow-lg">
                <div className="flex flex-col items-start w-full gap-2 px-6 py-4 border-b border-[#e6e6e6]">
                    <div className="flex flex-col items-start">
                        <h2 className="text-f-3xl font-light text-neutral-1400">Impact at a glance</h2>
                    </div>
                    <p className="w-full text-base font-light text-neutral-1400 text-justify">
                        {expandedItems['main']
                            ? data.impact_at_glance_description
                            : truncateText(data.impact_at_glance_description, 350)}
                    </p>
                    {data.impact_at_glance_description && data.impact_at_glance_description.length > 350 && (
                        <button className='px-m py-s flex items-center' onClick={() => toggleReadMore('main')}>
                            <div className='px-s text-tertiary'>
                                {expandedItems['main'] ? "Hide" : "View More"}
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8.5 7.5V4H7.5V7.5H4V8.5H7.5V12H8.5V8.5H12V7.5H8.5Z" fill="#22577A" />
                            </svg>
                        </button>
                    )}
                </div>
                <div className="flex flex-col items-start w-full gap-6 p-6">
                    <div className="flex flex-col items-start w-full gap-4">
                        {data.impact_at_glance && data.impact_at_glance.map((benefit: any, index: any) => (
                            <div key={index} className="flex items-start w-full gap-3 p-4 rounded-xl bg-neutral-100">
                                <div className="flex justify-center items-center h-5xl w-5xl rounded-full border-2 border-solid border-white">
                                    <CheckmarkOutline className="h-6 w-6" color="#808080"/>
                                </div>
                                <div className="flex flex-col items-start grow gap-2">
                                    <p className="w-full text-sm font-semibold text-neutral-1400">{benefit.header}</p>
                                    <p className="flex items-center w-full text-sm">
                                        <span className="text-neutral-1200 mr-2 text-justify">
                                            {expandedItems[index] ? benefit.text : truncateText(benefit.text, 350)}
                                        </span>
                                    </p>
                                    {benefit.text.length > 350 && (
                                        <button className='px-m py-s flex items-center' onClick={() => toggleReadMore(index)}>
                                            <div className='px-s text-tertiary'>
                                                {expandedItems[index] ? "Hide" : "View More"}
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M8.5 7.5V4H7.5V7.5H4V8.5H7.5V12H8.5V8.5H12V7.5H8.5Z" fill="#22577A" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Impact;