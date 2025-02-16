import React from "react";

export const LabelHandler = ({ title, instruction, required = true, optionalcheck = false }: any) => (
    <label className="text-f-m font-normal flex justify-between">
        <div className="text-neutral-1200">
            {title} {required && !optionalcheck && <span className="text-negativeBold">* </span>}
        </div>
        {instruction && <div className="italic text-neutral-500">{instruction}</div>}
    </label>
);