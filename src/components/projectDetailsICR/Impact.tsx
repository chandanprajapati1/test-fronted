import React, { useState } from "react";

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
                                <div className="p-4 rounded-full border-4 border-solid border-[#E6E6E6]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M10.5 16.0605L6.75 12.3097L7.80976 11.25L10.5 13.9395L16.1888 8.25L17.25 9.31125L10.5 16.0605Z" fill="#808080" />
                                        <path d="M12 1.5C9.9233 1.5 7.89323 2.11581 6.16652 3.26957C4.4398 4.42332 3.09399 6.0632 2.29927 7.98182C1.50455 9.90045 1.29661 12.0116 1.70176 14.0484C2.1069 16.0852 3.10693 17.9562 4.57538 19.4246C6.04383 20.8931 7.91476 21.8931 9.95156 22.2982C11.9884 22.7034 14.0996 22.4955 16.0182 21.7007C17.9368 20.906 19.5767 19.5602 20.7304 17.8335C21.8842 16.1068 22.5 14.0767 22.5 12C22.5 9.21523 21.3938 6.54451 19.4246 4.57538C17.4555 2.60625 14.7848 1.5 12 1.5ZM12 21C10.22 21 8.47992 20.4722 6.99987 19.4832C5.51983 18.4943 4.36628 17.0887 3.68509 15.4442C3.0039 13.7996 2.82567 11.99 3.17294 10.2442C3.5202 8.49836 4.37737 6.89471 5.63604 5.63604C6.89472 4.37737 8.49836 3.5202 10.2442 3.17293C11.99 2.82567 13.7996 3.0039 15.4442 3.68508C17.0887 4.36627 18.4943 5.51983 19.4832 6.99987C20.4722 8.47991 21 10.22 21 12C21 14.3869 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.387 21 12 21Z" fill="#808080" />
                                    </svg>
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