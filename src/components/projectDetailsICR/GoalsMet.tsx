import React, { useState } from "react";
import { Tooltip } from 'react-tooltip';

const TooltipContent = ({ goal, onViewMore, image }: any) => {
    return (
        <div className="flex flex-col items-center w-[467px] overflow-hidden gap-6 p-4 rounded-l ">
            <div className="flex items-start self-stretch overflow-hidden gap-3">
                <div className="flex-shrink-0 w-14 h-14 overflow-hidden rounded-xl border border-[#e6e6e6]">
                    <img
                        src={image}
                        className="w-full h-full object-cover bg-red-500"
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
    if (!isOpen) return null;

    const handleOverlayClick = (e: any) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
            <div className="w-full max-w-2xl max-h-[calc(100vh-2rem)] flex flex-col rounded-xl bg-white shadow-lg overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#E6E6E6] px-6 py-4">
                    <p className="text-xl font-light text-neutral-1400">{goal.title}</p>
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
                <div className="flex flex-col gap-4 overflow-y-auto p-6">
                    <div className="flex items-start gap-4">
                        <img
                            src='../icr/icrsdg.png'
                            className="w-20 h-20 object-cover rounded-xl"
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
    const goalCount = props.data.rawData.otherBenefits?.length || 0;
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                                fill="none">
                                <path d="M8.5 11V7H6.5V8H7.5V11H6V12H10V11H8.5Z" fill="#808080" />
                                <path
                                    d="M8 4C7.85167 4 7.70666 4.04399 7.58333 4.1264C7.45999 4.20881 7.36386 4.32595 7.30709 4.46299C7.25033 4.60004 7.23548 4.75084 7.26441 4.89632C7.29335 5.04181 7.36478 5.17544 7.46967 5.28033C7.57456 5.38522 7.7082 5.45665 7.85369 5.48559C7.99917 5.51453 8.14997 5.49968 8.28701 5.44291C8.42406 5.38615 8.54119 5.29002 8.6236 5.16668C8.70602 5.04334 8.75 4.89834 8.75 4.75C8.75 4.55109 8.67098 4.36033 8.53033 4.21967C8.38968 4.07902 8.19892 4 8 4Z"
                                    fill="#808080" />
                                <path
                                    d="M8 15C6.61553 15 5.26216 14.5895 4.11101 13.8203C2.95987 13.0511 2.06266 11.9579 1.53285 10.6788C1.00303 9.3997 0.86441 7.99224 1.13451 6.63437C1.4046 5.2765 2.07129 4.02922 3.05026 3.05026C4.02922 2.07129 5.2765 1.4046 6.63437 1.13451C7.99224 0.86441 9.3997 1.00303 10.6788 1.53285C11.9579 2.06266 13.0511 2.95987 13.8203 4.11101C14.5895 5.26216 15 6.61553 15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15ZM8 2C6.81332 2 5.65328 2.3519 4.66658 3.01119C3.67989 3.67047 2.91085 4.60755 2.45673 5.7039C2.0026 6.80026 1.88378 8.00666 2.11529 9.17054C2.3468 10.3344 2.91825 11.4035 3.75736 12.2426C4.59648 13.0818 5.66558 13.6532 6.82946 13.8847C7.99335 14.1162 9.19975 13.9974 10.2961 13.5433C11.3925 13.0892 12.3295 12.3201 12.9888 11.3334C13.6481 10.3467 14 9.18669 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2Z"
                                    fill="#808080" />
                            </svg>
                            <div className='text-black ml-s'>{goalCount}/17</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-start w-full gap-6 p-6">
                    {/* <p className="w-full text-base text-neutral-1200 text-justify">
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
                    <hr className="w-full border-t border-[#E6E6E6]" /> */}
                    <div className="flex gap-2">
                        {props.data.rawData.otherBenefits.map((goal: any, index: any) => (
                            <div
                                key={index}
                                className="flex justify-center items-center w-16 h-16 p-0.5 border-2 border-white"
                                // style={{ backgroundColor: goal.bg }}
                                data-tooltip-id={`Goal ${index + 1}`}
                            >
                                <img
                                    src={`../icr/icr_sdg_${index + 1}.png`}
                                    className="w-[60px] h-[60px] object-cover shadow bg-red-400"
                                    alt={`Goal ${index + 1}`}
                                />
                                <Tooltip
                                    id={`Goal ${index + 1}`}
                                    place="top-start"
                                    className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)] !bg-white"
                                    clickable={true}
                                >
                                    <TooltipContent goal={goal} onViewMore={() => openModal(goal)} image={`../icr/icr_sdg_${index + 1}.png`} />
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