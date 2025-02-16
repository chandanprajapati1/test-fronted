'use client'
import React, { useEffect, useRef, useState } from 'react';
import { getCountryNamesAndIds, getMethodologyNamesAndIds, getSectorNamesAndIds, getTypeNamesAndIds } from './SpecificationApis';
import AddLocation from './Specification/AddLocation';
import { useDispatch, useSelector } from 'react-redux';
import {
    currentProjectDetail,
    currentStatusHandler,
    currentTabHandler,
    updateAllowedTabs
} from '@/app/store/slices/projectOnboardingSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosApi from '@/utils/axios-api';
import { API_ENDPOINTS } from '@/config/api-endpoint';
import { Routes } from '@/config/routes';
import { InputFieldRow } from "@/components/common/InputField";
import { LabelHandler } from '../common/LabelHandler';
import DatePicker from 'react-multi-date-picker';
import { format } from "date-fns";
import { getAuthCredentials } from '@/utils/auth-utils';
import { encryptString } from '@/utils/enc-utils';
import { isHtmlTagPresent } from '@/utils/input-utils';
import { customToast } from '../ui/customToast';
import {Add, TrashCan} from "@carbon/icons-react";
import {ErrorMessage} from "@/components/ui/validationMsg";
import {Input} from "postcss";

const getUpperFields = (sectorValue:any) => {
    const baseFields = [
        {
            id: "sector",
            title: "Sector",
            placeholder: "Enter Sector",
            type: "drop"
        },
        {
            id: "project_types",
            title: "Project Type",
            instruction: "Add multiple",
            placeholder: "Enter Project Types",
            type: "multi"
        }
    ];

    return [baseFields];
};

let lowerFields = [

    [
        {
            id: "blockchain_id",
            title: "Block Chain ID",
            placeholder: "Enter ID",
            type: "input"
        },
        {
            id: "blockchain_url",
            title: "Block Chain URL",
            placeholder: "Enter Block Chain URL",
            type: "input"
        }

    ],
    [
        {
            id: "methodologies",
            title: "Methodology",
            placeholder: "Enter Methodology",
            type: "multi"
        },
        {
            id: "estimation_annual_estimated_reductions",
            title: "Estimation Annual Estimated Reduction",
            placeholder: "Enter Estimation Annual Estimated Reduction",
            type: "input"
        }
    ],
    [

        {
            id: "actual_annual_estimated_reductions",
            title: "Actual Annual Estimated Reduction",
            placeholder: "Enter Actual Annual Estimated Reduction",
            type: "input"
        },
        {
            id: "validator",
            title: "Validator",
            placeholder: "Enter Validator",
            type: "input"
        }
    ]
];

const Specifications = () => {
    const [formValues, setFormValues] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [sectorList, setSectorList] = useState([]);
    const [typeList, setTypeList] = useState([]);
    const [methodologyList, setMethodologyList] = useState([]);
    const [showLocationPopup, setLocationPopup] = useState(false)
    const [locationData, setLocationData] = useState<any[]>([]);
    const [selectedState, setSelectedState] = useState<any>([])
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [optionalcheck, setOptionalcheck] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [kmlError, setKmlError] = useState(false);
    const [siteError, setsiteError] = useState(false);
    const [updateFields, setUpdateFields] = useState(lowerFields)
    const projectDetail = useSelector((state: any) => state.projectOnboarding?.projectDetail);
    const [upperFieldsState, setUpperFieldsState] = useState(getUpperFields(null));
    useEffect(() => {
        const projectId = searchParams.get('id');
        countryListHandler()
        if (!projectId) {
            console.log("No project ID found in URL. Skipping project details fetch.");
            return;
        }
        const fetchData = async () => {
            try {
                const projectResponse = await axiosApi.project.get(API_ENDPOINTS.ProjectCurrentStatus(projectId));
                const projectData = projectResponse.data.data.project_details;
                // if (projectData.registry) {
                await sectorListHandler(projectData.registry._id)
                await methodologyListHandler(projectData.registry._id);
                dispatch(currentProjectDetail(projectData))
                if (projectData.sector && projectData.sector._id) {
                    await typeListHandler(projectData.registry._id, projectData.sector._id)
                }

                if (projectData.locations) {
                    setLocationData(projectData.locations)
                    console.log(projectData.locations)
                    const stateNames = projectData.locations
                        .map((location: any) => location.state_name ? location.state_name : location.country_name);

                    setSelectedState(stateNames);
                }
                let projectTypeId;
                let methodologiesId;
                if (projectData.project_types) {
                    console.log("projectData.project_types", projectData.project_types)
                    projectTypeId = projectData.project_types.map((project_type: any) => project_type._id);
                    const concatenatedIds = projectTypeId.join(',');
                    console.log("projectData.project_types concatenatedIds", projectTypeId, concatenatedIds)
                    // concatenatedIds && methodologyListHandler(concatenatedIds)
                }
                if (projectData.methodologies) {
                    methodologiesId = projectData.methodologies.map((methodology: any) => methodology._id);
                }
                const newData: any = {}; // Initialize as an empty object
                try {

                    if (projectData) { // Check if projectData itself exists

                        console.log(projectData.sector);
                        newData.sector = projectData?.sector._id;
                        newData.project_types = projectTypeId ? projectTypeId : undefined;
                        newData.project_scale = projectData.project_scale || undefined;
                        newData.area = projectData.area || undefined;
                        newData.blockchain_id = projectData.blockchain_id || undefined;
                        newData.blockchain_url = projectData.blockchain_url || undefined;
                        newData.estimation_annual_estimated_reductions = projectData.estimation_annual_estimated_reductions || undefined;
                        newData.actual_annual_estimated_reductions = projectData.actual_annual_estimated_reductions || undefined;
                        newData.methodologies = methodologiesId ? methodologiesId : undefined;
                        newData.validator = projectData.validator || undefined;
                        newData.country_id = projectData?.country_id;
                        newData.verification = projectData.verification || undefined;

                        // Handle nested objects more carefully
                        if (projectData.active_credit) {
                            newData.active_credit = {
                                start_date: projectData.active_credit.start_date || undefined,
                                end_date: projectData.active_credit.end_date || undefined,
                            };
                        }

                        if (projectData.crediting_period) {
                            newData.crediting_period = {
                                start_date: projectData.crediting_period.start_date || undefined,
                                end_date: projectData.crediting_period.end_date || undefined,
                            };
                        }
                    }
                }
                catch (e) {
                    console.log("fetch specification data", e)
                }


                projectData.kml_file && setFileName(projectData.kml_file)
                // const firstTwoArrays = lowerFields.slice(0, 3);
                console.log("projectData", projectData.project_status.project_status_name)
                setOptionalcheck(projectData.project_status.project_status_name == "Listed" || projectData.project_status.project_status_name == "Validated");

                let newAddField: any = [];

                if (projectData.project_status.project_status_name === "Verified" || projectData.project_status.project_status_name === "Joint Verification and Validation") {
                    newAddField = [[
                        {
                            id: "country_id",
                            title: "Country",
                            placeholder: "Enter Country",
                            type: "drop"
                        },
                        {
                            id: "0_verification",
                            title: "Issuance Date",
                            placeholder: "Enter Issuance Date",
                            type: "date"
                        }
                    ]]

                }
                else if (projectData.project_status.project_status_name === "Second Verification Cycle") {
                    newAddField = [[
                        {
                            id: "country_id",
                            title: "Country",
                            placeholder: "Enter Country",
                            type: "drop"
                        },
                        {
                            id: "0_verification",
                            title: "First Issuance Date",
                            placeholder: "Enter First Issuance Date",
                            type: "date"
                        }

                    ], [
                        {
                            id: "1_verification",
                            title: "Second Issuance Date",
                            placeholder: "Enter Second Issuance Date",
                            type: "date"
                        }
                    ]]
                }
                else if (projectData.project_status.project_status_name === "Third Verification Cycle") {
                    newAddField = [[
                        {
                            id: "country_id",
                            title: "Country",
                            placeholder: "Enter Country",
                            type: "drop"
                        },
                        {
                            id: "0_verification",
                            title: "First Issuance Date",
                            placeholder: "Enter First Issuance Date",
                            type: "date"
                        }
                    ],
                    [

                        {
                            id: "1_verification",
                            title: "Second Issuance Date",
                            placeholder: "Enter Second Issuance Date",
                            type: "date"
                        },
                        {
                            id: "2_verification",
                            title: "Third Issuance Date",
                            placeholder: "Enter Third Issuance Date",
                            type: "date"
                        },
                    ]]
                }
                else {
                    newAddField = [[
                        {
                            id: "country_id",
                            title: "Country",
                            placeholder: "Enter Country",
                            type: "drop"
                        }
                    ]]
                }

                setUpdateFields([...lowerFields, ...newAddField]);

                console.log("lowerFields", lowerFields);
                const reversedFormValue: any = { ...newData };

                // Check if there is a verification object and process it
                if (reversedFormValue.verification) {
                    // Loop over the keys within the verification object
                    for (const key in reversedFormValue.verification) {
                        // Create a new key in the main object with _verification suffix
                        reversedFormValue[`${key}_verification`] = reversedFormValue.verification[key];
                    }
                    // Remove the original verification object
                    delete reversedFormValue.verification;
                }

                setFormValues(reversedFormValue)
            } catch (e: any) {
                console.log(e)
            } finally {
                console.log("finally")
            }
        };

        fetchData();
    }, []);

    const onCloseLocationHandler = () => {
        setLocationPopup(false);
    };

    const onSubmitLocationHandler = (data: any) => {
        console.log("onSubmitLocationHandler", data)
        setLocationData((prev: any) => [...prev, data]);
        setSelectedState((prev: any) => [...prev, data.state_name.trim() == "" ? data.country_name : data.state_name]);
        console.log("onSubmitLocationHandler", locationData);
        onCloseLocationHandler();
        setsiteError(false)
    };

    const handleKmlClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Programmatically click the hidden file input
        }
    };

    const removeKml = () => {
        setFileName(null); // Clear the displayed file name
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the input field value
        }
    }

    // Function to handle file selection and upload using fetch
    const handleKmlUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'project-kml-file');
        const token = getAuthCredentials();

        try {
            // Replace 'YOUR_UPLOAD_ENDPOINT' with the actual API endpoint for uploading
            const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_IMAGE_ENDPOINT}/auth/file-upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to upload KML file');
            }

            const data = await response.json();
            setKmlError(false)
            setFileName(data.data.file_path);

            console.log('File uploaded successfully:', data);
        } catch (error) {
            console.error('Error uploading file:', error);
            setErrors({ kmlUpload: 'Failed to upload KML file. Please try again.' });
        }
    };

    const handleChange = async (id: string, value: any) => {

        let parsedValue: any = value;
        if (id === "registry") {
            // sectorListHandler(value.id)
            parsedValue = value.id
        } else if (id === "sector") {
            await typeListHandler(projectDetail?.registry?._id, value._id)
            parsedValue = value._id
            setFormValues((prevValues: any) => ({
                ...prevValues,
                ['project_types']: [],
            }))

            // Update upperFields when sector changes
            setUpperFieldsState(getUpperFields(value._id));

        } else if (id === "project_types") {
            console.log("project_types 400", value)
            setFormValues((prevValues: any) => ({
                ...prevValues,
            }))
        } else if (id === "country_id") {
            parsedValue = value._id
        }
        if (id === "estimation_annual_estimated_reductions" || id === "actual_annual_estimated_reductions") {
            if (value !== "") {
                if (value.length > 10) {
                    setErrors((prevErrors: any) => ({
                        ...prevErrors,
                        [id]: "Maximum 10 characters allowed.",
                    }));
                    return;  // Exit early if value exceeds max length
                }

                if (!isNaN(parseFloat(value))) {
                    parsedValue = parseFloat(value);
                } else {
                    setErrors((prevErrors: any) => ({
                        ...prevErrors,
                        [id]: "This field should be a number.",
                    }));
                    return;
                }
            }
        }
        if (id === "project_scale" && typeof value === "string") {
            parsedValue = value.trim().slice(0, 20) // Limit to 10 characters
        } else if (id == "area") {
            parsedValue = value.trim().slice(0, 10)
        } else if (id == "blockchain_id") {
            parsedValue = value.trimStart().slice(0, 100)
        } else if (id == "validator") {
            parsedValue = value.trimStart().slice(0, 100)
        }


        if (id == "blockchain_id" || id == "blockchain_url") {
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                [id]: ""
            }));
        }
        else {
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                [id]: value ? "" : "This field is required",
            }));
        }

        if (id == "blockchain_url") {
            if (value !== "") {
                const urlPattern = /^(https?:\/\/)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|localhost)(:\d+)?(\/[^\s]*)?$/;

                parsedValue = value.trimStart().slice(0, 100); // Limit input length to 100 characters
                console.log("blockchain_url", urlPattern.test(parsedValue))
                if (urlPattern.test(parsedValue)) {
                    // If URL is valid, clear any previous errors
                    setErrors((prevErrors: any) => ({
                        ...prevErrors,
                        [id]: ""
                    }));
                } else {
                    // Set an error if the URL is invalid
                    setErrors((prevErrors: any) => ({
                        ...prevErrors,
                        [id]: "Invalid URL format. Please enter a valid URL."
                    }));
                }

            }
            else {
                setErrors((prevErrors: any) => ({
                    ...prevErrors,
                    [id]: ""
                }));
            }
        }

        setFormValues((prevValues: any) => ({
            ...prevValues,
            [id]: parsedValue,
        }));


        console.log("handleChange", id, value)
        console.log("formValues", formValues);
        console.log("parsedValue", parsedValue);
    };

    const handleDateChange = (fieldId: string, dates: any) => {
        // Check if `dates` is an array and at least one date is selected
        if (dates && Array.isArray(dates)) {
            const formattedDates = dates.map((date) =>
                date ? format(date.toDate(), "yyyy-MM-dd") : ""
            );

            setFormValues((prevValues: any) => ({
                ...prevValues,
                [fieldId]: {
                    start_date: formattedDates[0] || prevValues[fieldId]?.start_date || "",
                    end_date: formattedDates[1] || prevValues[fieldId]?.end_date || "",
                },
            }));

            // Clear errors if at least one date is selected
            if (formattedDates[0]) {
                setErrors((prevErrors: any) => ({
                    ...prevErrors,
                    [fieldId]: "",
                }));
            } else {
                setErrors((prevErrors: any) => ({
                    ...prevErrors,
                    [fieldId]: "Please select a valid date range.",
                }));
            }
        } else {
            // If `dates` is invalid or empty
            setFormValues((prevValues: any) => ({
                ...prevValues,
                [fieldId]: { start_date: "", end_date: "" },
            }));
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                [fieldId]: "Please select a valid date range.",
            }));
        }
    };


    const removeLocationHandler = (state: any) => {
        setLocationData((prevData) =>
            prevData.filter((location) => location.state_name !== state)
        );
        setSelectedState((prevData: any) => prevData.filter((stateName: any) => stateName !== state))
    }

    const countryListHandler = async () => {
        try {
            const list = await getCountryNamesAndIds()
            setCountryList(list);
        } catch (e: any) {
            console.log(e)
        } finally {
            console.log("finally")
        }
    }

    const sectorListHandler = async (id: string) => {
        try {
            const list = await getSectorNamesAndIds(id)
            console.log("sectorListHandler", list)
            setSectorList(list);
        } catch (e: any) {
            console.log(e)
        } finally {
            console.log("finally")
        }
    }

    const methodologyListHandler = async (ids: string) => {
        try {
            const list = await getMethodologyNamesAndIds(ids)
            setMethodologyList(list);
        } catch (e: any) {
            console.log(e)
        } finally {
            console.log("finally")
        }
    }

    const typeListHandler = async (registry: string, sector: string) => {
        try {
            const list = await getTypeNamesAndIds(registry, sector)
            console.log("typeListHandler", list)
            setTypeList(list);
        } catch (e: any) {
            console.log(e)
        } finally {
            console.log("finally")
        }
    }

    const validateForm = () => {
        const newErrors: any = {};
        let isValid = true;
        if (!optionalcheck && !fileName && !(formValues["sector"] != "67455262f5eef2f16a39cbcf" )) {
            setKmlError(true);
            isValid = false;
        } else {
            setKmlError(false);
        }

        // Validate sites
        if ((selectedState.length === 0)) {
            setsiteError(true);
            isValid = false;
        } else {
            setsiteError(false);
        }

        if((!formValues["area"]) && (formValues["sector"] == "67455262f5eef2f16a39cbcf")){
            newErrors["area"] = "This field is required";
            isValid = false;
        }

        if((!formValues["project_scale"])){
            newErrors["project_scale"] = "This field is required";
            isValid = false;
        }

        // Validate upper fields
        upperFieldsState.flat().forEach((field) => {
            console.log("validation" );
            console.log(field.id,formValues[field.id] );
            console.log("validation" );
            if (!formValues[field.id] || formValues[field.id].length === 0) {
                newErrors[field.id] = "This field is required.";
                isValid = false;
            }
        });

        // Validate update fields
        updateFields.flat().forEach((field) => {
            if (
                !["blockchain_id", "blockchain_url"].includes(field.id) && !(optionalcheck && (field.id == "actual_annual_estimated_reductions" || field.id == "estimation_annual_estimated_reductions")) &&
                (!formValues[field.id] || formValues[field.id].length === 0)
            ) {
                newErrors[field.id] = "This field is required.";
                isValid = false;
            }
        });

        // Validate date ranges
        if ((!formValues.crediting_period?.start_date || !formValues.crediting_period?.end_date) && !optionalcheck) {
            newErrors.crediting_period = "This field is required.";
            isValid = false;
        }

        if ((!formValues.active_credit?.start_date || !formValues.active_credit?.end_date) && !optionalcheck) {
            newErrors.active_credit = "This field is required.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = async () => {
        if (!validateForm()) {
            console.log("Form validation failed");
            return;
        }

        const newFormValue = { ...formValues, verification: {} };

        // Iterate over the formValue keys
        for (const key in formValues) {
            if (key.includes("_verification")) {
                // Extract the index before '_verification' as a string
                const index = key.split("_")[0];
                // Assign the value to the new verification object with the key as a string
                newFormValue.verification[index] = formValues[key];
                // Delete the old key from the main object
                delete newFormValue[key];
            }
        }

        const newData = {
            ...newFormValue,
            "locations": locationData,
            "kml_file": fileName === null ? "" : fileName,
            "onboarding_status": {
                "step_number": 0,
                "step_name": "enrichment",
                "is_complete": true
            }
        }

        if (isHtmlTagPresent(newData)) {
            customToast.error("Invalid Input!");
            return;
        }

        try {
            const projectId = searchParams.get('id');
            if (!projectId) {
                console.error("No project ID found.");
                return;
            }
            const requestBody = newData
            let encryptedPayload = {};
            if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            let response = await axiosApi.project.put(API_ENDPOINTS.ProjectUpdate(projectId), { data: encryptedPayload });

            if (response.data.data && response.data.data.project) {
                const projectId = response.data.data.project._id;
                dispatch(updateAllowedTabs({ isDetailsComplete: true, isSpecificationsComplete: true }));
                dispatch(currentTabHandler("enrichment"))
                dispatch(currentStatusHandler(4));
                router.replace(`${Routes.ProjectCreate}?id=${projectId}`);
            } else {
                setErrors({ api: 'Unexpected response from server' });
            }
        } catch (e: any) {
            console.log(e)
        } finally {
            console.log("finally")
        }
        console.log("Form is valid, proceed to the next step.", newData);

    };

    const handleBack = () => {
        dispatch(currentTabHandler('details'));
    }

    const onSkip = () => {
        dispatch(currentTabHandler('enrichment'));
    }

    return (
        <div className="text-neutral-1400 flex flex-col gap-6 py-6 ">
            {showLocationPopup && <AddLocation onClose={onCloseLocationHandler} onSubmit={onSubmitLocationHandler} />}
            <>
                <div className="">
                    <div className="text-f-5xl font-light">Specifications</div>
                    <div className="text-f-l text-neutral-1200 font-normal">
                        Verify the details or request change if required.
                    </div>
                </div>
                <form className="flex flex-col gap-6" >
                    {upperFieldsState.map((fields, index) => (
                        <InputFieldRow
                            key={index}
                            fields={fields}
                            formValues={formValues}
                            errors={errors}
                            onChange={handleChange}
                            sectorList={sectorList}
                            typeList={typeList}
                            methodologyList={methodologyList}
                            countryList={countryList}
                            optionalcheck={optionalcheck}
                        />
                    ))}
                    <div className={`grid grid-cols-1 ${formValues.sector == "67455262f5eef2f16a39cbcf" ? 'sm:grid-cols-2' : 'sm:grid-cols-1'} gap-6`}>
                        <div className="flex flex-col  gap-2">
                            <LabelHandler title="Project Scale" instruction="Small/Medium/Large"/>
                            <>
                                <input
                                    type="text"
                                    id={"project_scale"}
                                    value={formValues["project_scale"] || ""}
                                    placeholder={"Enter Scale"}
                                    className={`py-s px-l h-[46px] text-f-m border block w-full rounded-md border-gray-300 shadow-sm sm:text-sm  focus:outline-none ${!errors["project_scale"] && ' hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500'} ${errors["project_scale"] ? 'border-red-500' : 'border-neutral-300'}`}
                                    onChange={(e) => handleChange("project_scale", e.target.value)}
                                /> {errors["project_scale"] && <ErrorMessage message={errors["project_scale"]}/>}
                            </>
                        </div>
                        {formValues.sector == "67455262f5eef2f16a39cbcf" && (
                        <div className="flex flex-col  gap-2">
                            <LabelHandler title="Acres/Hectares" instruction=""/>
                            <>
                                <input
                                    type="text"
                                    id={"area"}
                                    value={formValues["area"] || ""}
                                    placeholder={"Enter Acres/Hectares"}
                                    className={`py-s px-l h-[46px] text-f-m border block w-full rounded-md border-gray-300 shadow-sm sm:text-sm  focus:outline-none ${!errors["area"] && ' hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500'} ${errors["area"] ? 'border-red-500' : 'border-neutral-300'}`}
                                    onChange={(e) => handleChange("area", e.target.value)}
                                /> {errors["area"] && <ErrorMessage message={errors["area"]}/>}
                            </>
                        </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <LabelHandler title="Location" instruction="Add multiple sites"/>
                            <div className="flex  text-f-m h-[46px] w-full rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-0">
                                <div className={`flex-1 py-xs px-m border border-gray-300 rounded-l-md overflow-x-scroll hide-scrollbar focus:outline-none ${!siteError && 'hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500'} ${siteError && selectedState.length == 0 ? 'border-red-500' : 'border-neutral-300'}`}>
                                    <div className='flex gap-s  overflow-x-auto whitespace-nowrap hide-scrollbar h-full' style={{
                                        maxWidth: '100%',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {selectedState.map((state: string, index: any) => (<div key={index} className='inline-flex items-center  py-xs px-m gap-s bg-[#EEF1F4] text-[#374151] rounded-lg'>
                                                <div className='text-f-m'>{state}</div>
                                                <div className='flex justify-center items-center cursor-pointer' onClick={() => removeLocationHandler(state)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="#6b7280">
                                                        <path d="M6.5325 6L9.75 9.2175L9.2175 9.75L6 6.5325L2.7825 9.75L2.25 9.2175L5.4675 6L2.25 2.7825L2.7825 2.25L6 5.4675L9.2175 2.25L9.75 2.7825L6.5325 6Z" fill="#6b7280" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className=' flex text-white  items-center py-s px-xl bg-brand1-500  border border-brand1-500 min-w-[140px] rounded-r-md text-f-m' onClick={() => { setLocationPopup(true) }}>
                                    <Add className="w-4 h-4 text-white" /><span className='pl-l'>Site</span>
                                </div>
                            </div>
                            {siteError && selectedState.length == 0 && <ErrorMessage message="Mention at least one site" />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <LabelHandler title="Attach Site Map (.kml)" instruction="" optionalcheck={optionalcheck || formValues?.sector !== '67455262f5eef2f16a39cbcf'}/>
                            <div className="flex text-f-m h-[46px] w-full rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-0">
                                {/* Hidden file input for KML upload */}
                                <div className={`flex-1 border rounded-l-md min-w-0 focus:outline-none ${!kmlError && ' hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500'} ${kmlError && !fileName ? 'border-red-500' : 'border-neutral-300'}`}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleKmlUpload}
                                        accept=".kml"
                                        style={{display: 'none'}}
                                    /> {fileName &&
                                    <p className="py-s h-full flex items-center px-l text-f-m flex-1 text-gray-700 truncate">{fileName}</p>}
                                </div>
                                {/* Upload button */}
                                <div id="kml" className='flex text-white py-s px-xl bg-brand1-500 border-2 border-brand1-500 rounded-r-md text-f-m items-center min-w-[140px]' onClick={fileName == null ? handleKmlClick : removeKml}>
                                    {fileName == null &&
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M13 12.0006V14.0006H3V12.0006H2V14.0006L2.0038 13.9982C2.00333 14.1294 2.02873 14.2595 2.07854 14.3809C2.12836 14.5023 2.20163 14.6127 2.29414 14.7058C2.38666 14.7989 2.49662 14.8729 2.61774 14.9235C2.73885 14.9741 2.86875 15.0003 3 15.0006H13C13.2652 15.0006 13.5196 14.8953 13.7071 14.7077C13.8946 14.5202 14 14.2658 14 14.0006V12.0006H13Z" fill="white"/>
                                            <path d="M3 6.00061L3.7055 6.70311L7.5 2.91311V12.0006H8.5V2.91311L12.2955 6.70311L13 6.00061L8 1.00061L3 6.00061Z" fill="white"/>
                                        </svg>} {fileName !== null && <TrashCan className="w-4 h-4 text-white"/>}
                                    <span className={`pl-l`}>{fileName == null ? 'Upload' : 'Remove'}</span>
                                </div>
                            </div>
                            {kmlError && !fileName && <ErrorMessage message="This field is required" />}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col w-full gap-2">
                            <LabelHandler title="Crediting Period" instruction="" optionalcheck={optionalcheck} />
                            <DatePicker
                                range
                                value={
                                    formValues.crediting_period
                                        ? [
                                            formValues.crediting_period.start_date
                                                ? new Date(formValues.crediting_period.start_date)
                                                : null,
                                            formValues.crediting_period.end_date
                                                ? new Date(formValues.crediting_period.end_date)
                                                : null,
                                        ]
                                        : [null, null] // Default to no selection
                                }
                                onChange={(dates) => handleDateChange("crediting_period", dates)}
                                dateSeparator=" - "
                                rangeHover
                                editable={false}
                                placeholder="Select a date range"
                                inputClass={`flex w-full justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2 py-s h-[46px]  px-xl rounded-lg bg-white border text-sm text-[#333] focus:outline-none ${!errors.crediting_period
                                    ? 'hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500'
                                    : 'border-red-500'
                                    } ${errors.crediting_period ? 'border-red-500' : 'border-neutral-300'}`}
                            />
                            {errors.crediting_period && (
                                <ErrorMessage message={errors.crediting_period} />
                            )}
                        </div>
                        <div className="flex flex-col w-full gap-2">
                            <LabelHandler title="Activate Credits" instruction="" optionalcheck={optionalcheck} />
                            <DatePicker
                                range
                                value={
                                    formValues.active_credit
                                        ? [
                                            formValues.active_credit.start_date
                                                ? new Date(formValues.active_credit.start_date)
                                                : null,
                                            formValues.active_credit.end_date
                                                ? new Date(formValues.active_credit.end_date)
                                                : null,
                                        ]
                                        : [null, null] // Default to no selection
                                }
                                onChange={(dates) => handleDateChange("active_credit", dates)}
                                dateSeparator=" - "
                                rangeHover
                                editable={false}
                                placeholder="Select a date range"
                                inputClass={`flex w-full justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-[46px] relative gap-2 py-s px-xl rounded-lg bg-white border text-sm text-[#333] focus:outline-none ${!errors.active_credit
                                    ? 'hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500'
                                    : 'border-red-500'
                                    } ${errors.active_credit ? 'border-red-500' : 'border-neutral-300'}`}
                            />
                            {errors.active_credit && (
                                <ErrorMessage message={errors.active_credit} />
                            )}

                        </div>
                    </div>
                    {updateFields.map((fields, index) => {
                        return (
                            <InputFieldRow
                                key={index}
                                fields={fields}
                                formValues={formValues}
                                errors={errors}
                                onChange={handleChange}
                                sectorList={sectorList}
                                typeList={typeList}
                                methodologyList={methodologyList}
                                countryList={countryList}
                                optionalcheck={optionalcheck}
                            />
                        );
                    })}
                </form>
                <hr />
                <div className=' flex justify-end gap-l'>
                    <button className='px-xl py-l flex items-center' onClick={handleBack}>
                        <div className='-scale-100'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10.9998 8.00061L5.9998 13.0006L5.2998 12.3006L9.5998 8.00061L5.2998 3.70061L5.9998 3.00061L10.9998 8.00061Z" fill="#22577a" />
                            </svg>
                        </div>
                        <div className='text-f-m ml-l text-tertiary font-normal'>Back</div>
                    </button>
                    {[6, 7, 8, 9, 10].includes(projectDetail?.project_completion_status) ? (
                        <button
                            type='button'
                            className={`flex h-12 min-w-12 px-6 py-4 justify-end items-center gap-4 rounded-lg bg-brand1-500 text-white cursor-pointer'`}
                            onClick={onSkip}
                        >
                            Skip
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.9998 8L5.9998 13L5.2998 12.3L9.5998 8L5.2998 3.7L5.9998 3L10.9998 8Z"
                                    fill="currentColor" />
                            </svg>
                        </button>
                    ) : (
                        <button className='px-xl py-l bg-brand1-500 text-white rounded-lg flex items-center' onClick={handleNext}>
                            <div className='text-f-m mr-l font-normal'>Next</div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M10.9998 8.00061L5.9998 13.0006L5.2998 12.3006L9.5998 8.00061L5.2998 3.70061L5.9998 3.00061L10.9998 8.00061Z" fill="white" />
                                </svg>
                            </div>
                        </button>
                    )}
                </div>
            </>
        </div >
    );
};

export default Specifications;

