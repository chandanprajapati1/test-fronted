'use client'
import React, { useState } from "react";
import AdminLayout from "@/components/layouts/admin";
import { FAQ } from "@/data/faq";

const Page = () => {
    const [currentQues, setCurrentQues] = useState(0);

    return (
        <AdminLayout>
            <div className="p-l">
                <div className="container  mx-auto flex flex-col">
                    <div className="mt-l text-2xl px-l border-b pb-l">FAQ</div>
                    <div className="flex gap-6xl">
                        <div className="flex flex-[.3]  flex-col border-r ">
                            {FAQ.map((faq, index) => <div key={index} onClick={() => { setCurrentQues(index) }} className={`p-l mt-l ${index != currentQues && "hover:bg-neutral-300"} mr-l cursor-pointer ${index == currentQues && "bg-brand1-300"}`}>
                                <span className="mr-s">{index + 1}.</span>{faq.question}
                            </div>)}
                        </div>
                        <div className="flex-1 p-l text-xl justify-center">
                            <div className=" inline-block px-xl py-l pb-10xl  text-f-xl border-b ">
                                {(typeof FAQ[currentQues].answer === "string") ? FAQ[currentQues].answer : <ProjectEligibility data={FAQ[currentQues].answer} />}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </AdminLayout>
    );
};

export default Page;

const ProjectEligibility = ({ data }: any) => {
    return (

        <div >
            {data.map((value: any, index: any) => (
                <div key={index}>
                    <h2 className="font-bold text-lg">
                        {value.title && value.title}
                    </h2>
                    {value.value.length > 0 && <ul className="list-disc pl-6 mt-2">
                        {value.value.map((val: any, index: any) => (
                            <li className="mb-2" key={index}>
                                {val.title}
                                {val.subvalue && val.subvalue.length > 0 && val.subvalue[0]}
                                {val.subvalue && val.subvalue.length > 0 && <ul className="list-disc pl-6 mt-2">
                                    {val.subvalue.map((subVal: any, index: any) => (
                                        <li className="mb-2" key={index}>
                                            {subVal}
                                        </li>
                                    ))}

                                </ul>}
                            </li>
                        ))}

                    </ul>}
                </div>
            ))}

        </div>
    );
};
