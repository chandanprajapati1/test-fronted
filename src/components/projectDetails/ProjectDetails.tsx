import React from "react";
import { ListBoxes } from '@carbon/icons-react';

const ProjectDetailItem = (props: any) => {
    if (!props.value) return null;

    return (
        <div className={`flex-1 ${props.tw} flex px-l py-xl  border rounded-xl `}>
            <div className='flex'>
                <div className='p-m rounded-full shrink-0 border w-4xl h-4xl flex justify-center items-center'>
                    <ListBoxes className="w-4 h-4" color="#808080" />
                </div>
                <div className='ml-m flex flex-col justify-start'>
                    <div className='text-f-s font-semibold text-tertiary'>
                        {props.label.toUpperCase()}
                    </div>
                    <div className='text-f-2xl font-light text-neutral-1000'>
                        {props.value}
                    </div>
                </div>
            </div>
            {/* <div className='flex'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8.5 11V7H6.5V8H7.5V11H6V12H10V11H8.5Z" fill="#808080" />
                    <path d="M8 4C7.85167 4 7.70666 4.04399 7.58333 4.1264C7.45999 4.20881 7.36386 4.32595 7.30709 4.46299C7.25033 4.60004 7.23548 4.75084 7.26441 4.89632C7.29335 5.04181 7.36478 5.17544 7.46967 5.28033C7.57456 5.38522 7.7082 5.45665 7.85369 5.48559C7.99917 5.51453 8.14997 5.49968 8.28701 5.44291C8.42406 5.38615 8.54119 5.29002 8.6236 5.16668C8.70602 5.04334 8.75 4.89834 8.75 4.75C8.75 4.55109 8.67098 4.36033 8.53033 4.21967C8.38968 4.07902 8.19892 4 8 4Z" fill="#808080" />
                    <path d="M8 15C6.61553 15 5.26216 14.5895 4.11101 13.8203C2.95987 13.0511 2.06266 11.9579 1.53285 10.6788C1.00303 9.3997 0.86441 7.99224 1.13451 6.63437C1.4046 5.2765 2.07129 4.02922 3.05026 3.05026C4.02922 2.07129 5.2765 1.4046 6.63437 1.13451C7.99224 0.86441 9.3997 1.00303 10.6788 1.53285C11.9579 2.06266 13.0511 2.95987 13.8203 4.11101C14.5895 5.26216 15 6.61553 15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15ZM8 2C6.81332 2 5.65328 2.3519 4.66658 3.01119C3.67989 3.67047 2.91085 4.60755 2.45673 5.7039C2.0026 6.80026 1.88378 8.00666 2.11529 9.17054C2.3468 10.3344 2.91825 11.4035 3.75736 12.2426C4.59648 13.0818 5.66558 13.6532 6.82946 13.8847C7.99335 14.1162 9.19975 13.9974 10.2961 13.5433C11.3925 13.0892 12.3295 12.3201 12.9888 11.3334C13.6481 10.3467 14 9.18669 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2Z" fill="#808080" />
                </svg>
            </div> */}
        </div>
    );
};

const ProjectDetailItemMultiple = (props: any) => {
    if (!props.value?.length) return null;
    const renderListItems = () => {
        if (Array.isArray(props.value)) {
            return props.value.map((item: any, index: any) => (
                <div key={index} className='text-f-2xl font-light text-neutral-1000'>
                    {typeof item === 'object' && 'name' in item ? item.name : item}
                </div>
            ));
        }
        return <div>{props.value}</div>;
    };


    return (
        <div className={`flex-1 ${props.tw} flex px-l py-xl  border rounded-xl`}>
            <div className='flex-1 flex'>
                <div className='p-m rounded-full shrink-0 border w-4xl h-4xl flex justify-center items-center'>
                    <ListBoxes className="w-4 h-4" color="#808080" />
                </div>
                <div className='ml-m flex flex-col justify-start'>
                    <div className='text-f-s font-semibold text-tertiary'>
                        {props.label.toUpperCase()}
                    </div>
                    {renderListItems()}
                </div>
            </div>
            {/* <div className='flex'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8.5 11V7H6.5V8H7.5V11H6V12H10V11H8.5Z" fill="#808080" />
                    <path d="M8 4C7.85167 4 7.70666 4.04399 7.58333 4.1264C7.45999 4.20881 7.36386 4.32595 7.30709 4.46299C7.25033 4.60004 7.23548 4.75084 7.26441 4.89632C7.29335 5.04181 7.36478 5.17544 7.46967 5.28033C7.57456 5.38522 7.7082 5.45665 7.85369 5.48559C7.99917 5.51453 8.14997 5.49968 8.28701 5.44291C8.42406 5.38615 8.54119 5.29002 8.6236 5.16668C8.70602 5.04334 8.75 4.89834 8.75 4.75C8.75 4.55109 8.67098 4.36033 8.53033 4.21967C8.38968 4.07902 8.19892 4 8 4Z" fill="#808080" />
                    <path d="M8 15C6.61553 15 5.26216 14.5895 4.11101 13.8203C2.95987 13.0511 2.06266 11.9579 1.53285 10.6788C1.00303 9.3997 0.86441 7.99224 1.13451 6.63437C1.4046 5.2765 2.07129 4.02922 3.05026 3.05026C4.02922 2.07129 5.2765 1.4046 6.63437 1.13451C7.99224 0.86441 9.3997 1.00303 10.6788 1.53285C11.9579 2.06266 13.0511 2.95987 13.8203 4.11101C14.5895 5.26216 15 6.61553 15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15ZM8 2C6.81332 2 5.65328 2.3519 4.66658 3.01119C3.67989 3.67047 2.91085 4.60755 2.45673 5.7039C2.0026 6.80026 1.88378 8.00666 2.11529 9.17054C2.3468 10.3344 2.91825 11.4035 3.75736 12.2426C4.59648 13.0818 5.66558 13.6532 6.82946 13.8847C7.99335 14.1162 9.19975 13.9974 10.2961 13.5433C11.3925 13.0892 12.3295 12.3201 12.9888 11.3334C13.6481 10.3467 14 9.18669 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2Z" fill="#808080" />
                </svg>
            </div> */}
        </div>
    );
};

const ProjectDetailItemMultiple1 = (props: any) => {
    const renderListItems = () => {
        if (Array.isArray(props.value)) {
            return props.value.map((item: any, index: any) => (
                <div key={index} className="text-f-2xl font-light text-neutral-1000">
                    {typeof item === 'object' && 'stage' in item && 'year' in item
                        ? `${item.stage} (${item.year})`
                        : item} {/* Renders item directly if it’s a string or number */}
                </div>
            ));
        }
        return <div className="text-f-2xl font-light text-neutral-1000">{props.value}</div>;
    };

    return (
        <div className={`flex-1 ${props.tw} flex px-l py-xl  border rounded-xl`}>
            <div className='flex-1 flex'>
                <div className='p-m rounded-full shrink-0 border w-4xl h-4xl flex justify-center items-center'>
                    <ListBoxes className="w-4 h-4" color="#808080" />
                </div>
                <div className='ml-m flex flex-col justify-start'>
                    <div className='text-f-s font-semibold text-tertiary'>
                        {props.label.toUpperCase()}
                    </div>
                    {renderListItems()}
                </div>
            </div>
            {/* <div className='flex'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8.5 11V7H6.5V8H7.5V11H6V12H10V11H8.5Z" fill="#808080" />
                    <path d="M8 4C7.85167 4 7.70666 4.04399 7.58333 4.1264C7.45999 4.20881 7.36386 4.32595 7.30709 4.46299C7.25033 4.60004 7.23548 4.75084 7.26441 4.89632C7.29335 5.04181 7.36478 5.17544 7.46967 5.28033C7.57456 5.38522 7.7082 5.45665 7.85369 5.48559C7.99917 5.51453 8.14997 5.49968 8.28701 5.44291C8.42406 5.38615 8.54119 5.29002 8.6236 5.16668C8.70602 5.04334 8.75 4.89834 8.75 4.75C8.75 4.55109 8.67098 4.36033 8.53033 4.21967C8.38968 4.07902 8.19892 4 8 4Z" fill="#808080" />
                    <path d="M8 15C6.61553 15 5.26216 14.5895 4.11101 13.8203C2.95987 13.0511 2.06266 11.9579 1.53285 10.6788C1.00303 9.3997 0.86441 7.99224 1.13451 6.63437C1.4046 5.2765 2.07129 4.02922 3.05026 3.05026C4.02922 2.07129 5.2765 1.4046 6.63437 1.13451C7.99224 0.86441 9.3997 1.00303 10.6788 1.53285C11.9579 2.06266 13.0511 2.95987 13.8203 4.11101C14.5895 5.26216 15 6.61553 15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15ZM8 2C6.81332 2 5.65328 2.3519 4.66658 3.01119C3.67989 3.67047 2.91085 4.60755 2.45673 5.7039C2.0026 6.80026 1.88378 8.00666 2.11529 9.17054C2.3468 10.3344 2.91825 11.4035 3.75736 12.2426C4.59648 13.0818 5.66558 13.6532 6.82946 13.8847C7.99335 14.1162 9.19975 13.9974 10.2961 13.5433C11.3925 13.0892 12.3295 12.3201 12.9888 11.3334C13.6481 10.3467 14 9.18669 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2Z" fill="#808080" />
                </svg>
            </div> */}
        </div>
    );
};


const ProjectDetails = (props: any) => {
    const typesCommaSeparated = props.data.project_types.map((project: any) => project.type_name).join(', ');
    return (
        <div className="flex flex-col justify-start items-start flex-grow rounded-2xl bg-white shadow-lg mt-xl">
            <div className="flex flex-col justify-start items-start self-stretch px-6 py-4 border-b border-[#e6e6e6]">
                <h2 className="text-f-3xl font-light text-neutral-1400">Project Details</h2>
            </div>
            <div className="flex flex-wrap">
                <div className="flex flex-wrap w-full gap-6 px-l pt-l">
                    <ProjectDetailItem label={"Project ID"} value={props.data.project_id} tw="basis-[calc(25%-18px)]" icon="/project/List-boxes.svg" />
                    <ProjectDetailItem label={"Company"} value={props.data.organization_name} tw="basis-[calc(25%-18px)]" icon="/project/Enterprise.svg" />
                    <ProjectDetailItem label={"Project Size"} value={props.data.project_scale} tw="basis-[calc(25%-18px)]" icon="/project/check.svg" />
                    {props.data.sector && <ProjectDetailItem label={"Sector"} value={props.data.sector.sector_name} tw="basis-[calc(25%-18px)]" icon="/project/check.svg" />}
                </div>
                <div className="flex flex-wrap w-full gap-6 px-l pt-l">
                    <ProjectDetailItem label={"Block Chain ID"} value={props.data.blockchain_id} tw="basis-[calc(33%-18px)]" icon="/project/Development.svg" />
                    {/*<ProjectDetailItem label={"Revalidation"} value={props.data.revalidation} tw="basis-[calc(33%-18px)]" icon="/project/check.svg" />*/}
                    <ProjectDetailItem label={"Acres/Hectares"} value={props.data.area} tw="basis-[calc(33%-18px)]" icon="/project/Development.svg" />
                    {props.data.developer && <ProjectDetailItem label={"Project Developer"} value={props.data.developer.name} tw="basis-[calc(33%-18px)]" icon="/project/Development.svg" />}
                    {/*<ProjectDetailItem label={"Project Category"} value={props.data.category} tw="basis-[calc(33%-18px)]" icon="/project/Modal-Icon-2.svg" />*/}
                </div>
                <div className="flex flex-wrap w-full gap-6 px-l py-l">
                    <ProjectDetailItem label={"Project Type"} value={typesCommaSeparated} tw="basis-[calc(33%-18px)]" icon="/project/Document-preliminary.svg" />
                    <ProjectDetailItemMultiple label={"Project Proponent"} value={props.data.proponents} tw="basis-[calc(33%-18px)]" icon="/project/Development.svg" />
                    {props.data?.verification && Object.keys(props.data.verification).length > 0 && (
                        <ProjectDetailItemMultiple1
                            label="Verification"
                            value={Object.values(props.data.verification)}
                            tw="basis-[calc(33%-18px)]"
                            icon="/project/Development.svg"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};


export default ProjectDetails;