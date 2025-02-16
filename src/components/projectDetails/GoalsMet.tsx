import React, {useEffect, useState} from "react";
import { Tooltip } from 'react-tooltip';
import {Information} from "@carbon/icons-react";

const TooltipContent = ({ goal, onViewMore, image }: any) => {
    return (
        <div className="flex flex-row items-start  overflow-hidden gap-6 p-4 rounded-l ">
                <div className="flex-shrink-0 w-14 h-14 overflow-hidden rounded-xl border border-[#e6e6e6]">
                    <img
                        src={`${process.env.NEXT_PUBLIC_ESG_GOAL_ENDPOINT}/${image}`}
                        className="w-full h-full object-cover"
                        alt="Sustainable cities icon"
                    />
                </div>
                <div className="flex flex-col gap-2 flex-grow">
                    <p className="text-sm font-semibold text-neutral-1400">
                        {goal.title}
                    </p>
                    <p className="text-sm text-neutral-1200">
                        {goal.description.length > 250 ? goal.description.slice(0, 250) + "..." : goal.description}
                    </p>
                    {goal.description.length > 250 && <ViewMoreButton onClick={onViewMore} />}
                </div>
        </div>
    )
};

const ViewMoreButton = ({ onClick }: any) => (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-transparent cursor-pointer" onClick={onClick}>
        <p className="text-sm text-center text-tertiary">View More</p>
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
        >
            <path
                d="M13 14H3C2.73489 13.9996 2.48075 13.8942 2.29329 13.7067C2.10583 13.5193 2.00036 13.2651 2 13V3C2.00036 2.73489 2.10583 2.48075 2.29329 2.29329C2.48075 2.10583 2.73489 2.00036 3 2H8V3H3V13H13V8H14V13C13.9996 13.2651 13.8942 13.5193 13.7067 13.7067C13.5193 13.8942 13.2651 13.9996 13 14Z"
                fill="#22577A"
            />
            <path d="M10 1V2H13.293L9 6.293L9.707 7L14 2.707V6H15V1H10Z" fill="#22577A" />
        </svg>
    </div>
);

const Modal = ({ isOpen, onClose, goal }: any) => {

    // Implement scroll prevention when modal mounts
    useEffect(() => {
        if (isOpen){
            const scrollPosition = window.scrollY;

            // Save current scroll position and prevent scrolling
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflowY = 'scroll';
            document.body.style.paddingRight = 'var(--scrollbar-width)';

            // Cleanup function when modal unmounts
            return () => {
                const scrollY = document.body.style.top;
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflowY = '';
                document.body.style.paddingRight = '';
                // window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'instant' // This prevents any smooth scrolling
                });
            };
        }
    }, [isOpen]);
    if (!isOpen) return null;


    const handleOverlayClick = (e: any) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden  bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
            <div className="w-full max-w-2xl  max-h-[calc(100vh-2rem)] flex flex-col rounded-xl bg-white shadow-lg ">
                <div className="flex items-center justify-between border-b border-[#E6E6E6] px-6 py-4 ">
                    <p className="text-xl font-normal text-neutral-1400">{goal.goal_name}</p>
                    <button className="rounded-lg p-2.5" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="Close" opacity="0.5">
                                <path id="Vector"
                                    d="M18 7.05L16.95 6L12 10.95L7.05 6L6 7.05L10.95 12L6 16.95L7.05 18L12 13.05L16.95 18L18 16.95L13.05 12L18 7.05Z"
                                    fill="black" />
                            </g>
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto  p-6">
                    <div className="flex items-start gap-4">
                        <img
                            src={`${process.env.NEXT_PUBLIC_ESG_GOAL_ENDPOINT}/${goal.hero_image.name}`}
                            className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                            alt={goal.title}
                        />
                        <p className="text-sm text-neutral-1200">{goal.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GoalsMet = (props: any) => {
    const goalCount = props.data.sdg_goals?.length || 0;
    const [readMore, setReadMore] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    const readMoreHandler = () => {
        setReadMore(!readMore);
    };

    const openModal = (goal: any) => {
        setSelectedGoal(goal);
    };

    const closeModal = () => {
        setSelectedGoal(null);
    };

    return (
        <div className="flex items-center self-stretch gap-2.5 mt-xl">
            <div className="flex flex-col items-start self-stretch grow rounded-2xl bg-white shadow-lg">
                <div className="flex justify-between items-center w-full px-6 py-4 border-b border-[#e6e6e6]">
                    <p className="text-f-3xl font-light text-neutral-1400">Goals met</p>
                    <div className="flex items-center gap-2">
                        <div className='flex py-s px-m bg-neutral-100 items-center rounded-lg'>
                            <Information className="h-4 w-4" color="#808080" />
                            <div className='text-black ml-s'>{goalCount}/17</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-start w-full gap-6 p-6">
                    <p className="w-full text-base text-neutral-1200 text-justify">
                        {props.data.sdg_description && props.data.sdg_description.length > 350 && !readMore
                            ? props.data.sdg_description.slice(0, 350) + "..."
                            : props.data.sdg_description}
                    </p>
                    {props.data.sdg_goals.length > 350 && <button className='px-m py-s flex items-center' onClick={readMoreHandler}>
                        <div className='px-s text-tertiary'>
                            {!readMore ? "View More" : "Hide"}
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8.5 7.5V4H7.5V7.5H4V8.5H7.5V12H8.5V8.5H12V7.5H8.5Z" fill="#22577A" />
                        </svg>
                    </button>}
                    <hr className="w-full border-t border-[#E6E6E6]" />
                    <div className="flex gap-2">
                        {props.data.sdg_goals.map((goal: any, index: any) => (
                            <div
                                key={index}
                                className="flex justify-center items-center w-16 h-16 p-0.5 border-2 border-white"
                                style={{ backgroundColor: goal.bg }}
                                data-tooltip-id={`Goal ${index + 1}`}
                            >
                                <img
                                    src={`${process.env.NEXT_PUBLIC_ESG_GOAL_ENDPOINT}/${goal.hero_image.name}`}
                                    className="w-[60px] h-[60px] object-cover shadow"
                                    alt={`Goal ${index + 1}`}
                                />
                                <Tooltip
                                    id={`Goal ${index + 1}`}
                                    place="top-start"
                                    className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)] !bg-white overflow-x-hidden w-full max-w-[90vw] "
                                    clickable={true}
                                >
                                    <TooltipContent goal={goal} onViewMore={() => openModal(goal)} image={goal.hero_image.name} />
                                </Tooltip>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Modal isOpen={!!selectedGoal} onClose={closeModal} goal={selectedGoal} />
        </div>
    );
};

export default GoalsMet;