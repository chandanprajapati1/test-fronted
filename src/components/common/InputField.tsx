import React from "react";
import { LabelHandler } from "@/components/common/LabelHandler";
import SelectField from "@/components/ui/selectField";
import SelectFieldMulti from "@/components/ui/selectFieldMulti";
import {ErrorMessage} from "@/components/ui/validationMsg";
import DateInput from "@/components/ui/input-date";

export const InputFieldRow = ({ fields, formValues, errors, onChange, sectorList, typeList, methodologyList, countryList, optionalcheck }: any) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fields.map((field: any) => (

                <SingleField
                    allfieldsValue={formValues}
                    key={field.id}
                    id={field.id}
                    placeholder={field.placeholder}
                    title={field.title}
                    instruction={field.instruction}
                    type={field.type}
                    value={formValues[field.id] || ""}
                    error={errors[field.id]}
                    onChange={onChange}
                    sectorList={sectorList}
                    typeList={typeList}
                    methodologyList={methodologyList}
                    countryList={countryList}
                    optionalcheck={optionalcheck}
                />
            ))}
        </div>
    );
};

const SingleField = ({ allfieldsValue, id, placeholder, title, instruction = "", type, value, error, onChange, sectorList, typeList, methodologyList, countryList, optionalcheck }: any) => {
    let data: string[] = [];
    if (id === "sector") {
        data = sectorList;
    } else if (id === "project_types") {
        data = typeList;
    } else if (id === "methodologies") {
        data = methodologyList;
    } else if (id === "country_id") {
        data = countryList;
    }


    return (<div className="flex flex-col  gap-2">
            <LabelHandler title={title} instruction={instruction} optionalcheck={!!(id == "blockchain_id" || id == "blockchain_url" || (optionalcheck && (id == "estimation_annual_estimated_reductions" || id == "actual_annual_estimated_reductions")))}/>
        {type === "input" && (<>
                <input
                    type="text"
                    id={id}
                    value={value}
                    placeholder={placeholder}
                    className={`py-s px-l h-[46px] text-f-m border block w-full rounded-md border-gray-300 shadow-sm sm:text-sm  focus:outline-none ${!error && ' hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500'} ${error ? 'border-red-500' : 'border-neutral-300'}`}
                    onChange={(e) => onChange(id, e.target.value)}
                /> {error && <ErrorMessage message={error} />}
            </>)}

        {type === "multi" && (
            <SelectFieldMulti
                options={data.map((item: any) => ({
                    _id: item._id, name: item.name
                }))}
                value={value}
                onChange={(value) => {
                    onChange(id, value);
                }}
                placeholder={placeholder}
                error={error}
                isDependent={!!allfieldsValue}
                dependentValue={allfieldsValue}
            />
        )}

        {type === "drop" && (
            <SelectField
                options={data.map((item:any) => ({
                    _id: item?._id,
                    name: item?.name
                }))}
                required={true}
                value={value}
                onChange={(e) => {
                    const selected = data.find((item:any) => item._id == e.target.value);
                    onChange(id, selected);
                }}
                placeholder={placeholder}
                error={error}
                isDependent={!!allfieldsValue}
                dependentValue={allfieldsValue}
            />

        )}
        {type === "date" && (
            <DateInput
                required
                value={value}
                onChange={(e) => {
                    onChange(id, e)
                    console.log(id);
                    console.log(e);
                }}
                error={error}
                placeholder={placeholder}
            />
        )}
        </div>);
}


