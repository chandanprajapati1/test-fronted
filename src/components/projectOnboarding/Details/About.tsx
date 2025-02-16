import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup';
import {
    currentProjectDetail,
    incrementDetailStepper
} from "@/app/store/slices/projectOnboardingSlice";
import AxiosApi from "@/utils/axios-api";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import { Routes } from "@/config/routes";
import axiosApi from "@/utils/axios-api";
import { LabelHandler } from "@/components/common/LabelHandler";
import { ButtonGroup } from "@/components/common/ButtonGroup";
import { getRegisterNamesAndIds } from '../SpecificationApis';
import { encryptString } from '@/utils/enc-utils';
import { isHtmlTagPresent } from '@/utils/input-utils';
import { customToast } from '@/components/ui/customToast';
import SelectField from "@/components/ui/selectField";
import {SelectOption} from "@/types";
import {ErrorMessage} from "@/components/ui/validationMsg";

const validationSchema = Yup.object().shape({
    project_name: Yup.string().required('Project name is required'),
    project_url: Yup.string().url('Must be a valid URL').required('Project URL is required'),
    project_id: Yup.string().required('Project ID is required').matches(/^[a-zA-Z0-9]+$/, 'Only letters and numbers are allowed'),
});

const About: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [registryList, setRegistryList] = useState<SelectOption[]>([]);
    const [selectedRegistry, setSelectedRegistry] = useState<any>({ name: "", _id: "" });
    const [selectedStatus, setSelectedStatus] = useState<any>({ name: "", _id: "" });
    const [registryError, setRegisterError] = useState(false);
    const [statusError, setStatusError] = useState(false);

    interface RootState {
        projectOnboarding: {
            ckAssisted?: boolean;
        };
    }

    const ckAssisted = useSelector((state: RootState) => state.projectOnboarding?.ckAssisted ?? true);
    const projectDetail = useSelector((state: any) => state.projectOnboarding?.projectDetail);
    const [statusOptions, setStatusOptions] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        project_name: '',
        project_url: '',
        project_id: '',
        project_status: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});


    useEffect(() => {
        const fetchRegistries = async () => {
            try {
                const list = await getRegisterNamesAndIds()
                setRegistryList(list);
            } catch (e: any) {
                console.log(e)
            } finally {
                console.log("finally")
            }
        };


        const fetchStatusOptions = async () => {
            try {
                const response = await AxiosApi.project.get(API_ENDPOINTS.ProjectStatus);
                setStatusOptions(response.data.data.project_statuses);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (!error.response) {
                        console.log(error)
                    }
                }
            }
        };



        const fetchProjectDetail = async () => {
            try {
                console.log("project Detail Getting Successfully.", projectDetail)

                if (projectDetail) {
                    setFormData({
                        project_name: projectDetail.name || '',
                        project_url: projectDetail.project_url || '',
                        project_id: projectDetail.project_id || '',
                        project_status: projectDetail.project_status._id || ''
                    });
                    if (projectDetail.registry) {
                        setSelectedRegistry({
                            _id: projectDetail.registry._id,
                            name: projectDetail.registry.name
                        });
                    }
                    if (projectDetail.project_status) {
                        setSelectedStatus({
                            _id: projectDetail.project_status._id,
                            name: projectDetail.project_status.project_status_name
                        });
                    }
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (!error.response) {
                        console.log(error)
                    }
                }
            }
        };


        fetchRegistries();
        fetchStatusOptions();
        fetchProjectDetail();
    }, [projectDetail, searchParams]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("handleSubmit", e);
        if (selectedRegistry._id == "") {
            setRegisterError(true);
        }
        if(selectedStatus._id == ""){
            setStatusError(true);
        }
        setErrors({});
        setIsLoading(true);
        try {
            const projectId = searchParams.get('id');
            await validationSchema.validate(formData, { abortEarly: false });

            const submissionData = {
                ...formData,
               project_status:selectedStatus._id,
                name: formData.project_name,
                registry: selectedRegistry._id,
                ck_assisted: ckAssisted !== undefined ? ckAssisted : true,
                onboarding_status: {
                    step_number: 1,
                    step_name: "details",
                    is_complete: true
                }
            };

            if (isHtmlTagPresent(submissionData)) {
                customToast.error("Invalid!");
                return;
            }


            let projectResponse;
            const requestBody = submissionData
            console.log(requestBody);
            let encryptedPayload = {};
            if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            if (!projectId) {
                projectResponse = await AxiosApi.project.post(API_ENDPOINTS.ProjectInit, { data: encryptedPayload });
            } else {
                projectResponse = await axiosApi.project.put(API_ENDPOINTS.ProjectUpdate(projectId), { data: encryptedPayload });
            }
            const projectData = projectResponse.data.data.project;
            if (projectData) {
                dispatch(incrementDetailStepper())
                // dispatch(currentProjectDetail(projectData));
                console.log(projectData);
                router.replace(`${Routes.ProjectCreate}?id=${projectData._id}`);
            } else {
                console.log("Unexpected response from server");
            }
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors: { [key: string]: string } = {};
                error.inner.forEach((err) => {
                    if (err.path) {
                        validationErrors[err.path] = err.message;
                    }
                });
                setErrors(validationErrors);
            } else if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.log(`API Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
                } else {
                    console.log(`Request setup error: ${error.message}`);
                }
            } else {
                console.log('An unexpected error occurred while submitting the form');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let { name, value }: any = e.target;

        // Prevent special characters for the project_id field
        if (name === 'project_id') {
            // Only allow alphanumeric characters
            value = value.replace(/[^a-zA-Z0-9]/g, '');
        }

        if ((name === 'project_name' || name === 'project_id' || name === 'project_url') && value.trim() === '') {
            value = '';
        }

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Clear the error for this field when the user starts typing
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };


    const onclickBackButton = () => {
        router.replace(`${Routes.ProjectCreate}`);
    }

    const projectCompletionStatus = useSelector((state: any) =>
        state.projectOnboarding?.projectDetail?.project_completion_status ?? 0
    );
    const onSkip = () => {
        dispatch(incrementDetailStepper())
    }

    return (<div className=" text-neutral-1400 flex flex-col gap-6 ">
        <div>
            <h2 className="text-f-5xl text-neutral-1400 font-light ">About your project</h2>
            <div className="text-f-l text-neutral-1200 font-normal">
                Fill in the details below
            </div>
        </div>
        {/* {errors.api && <p className="text-negativeBold mt-2">{errors.api}</p>}*/}

        <form onSubmit={handleSubmit} className="flex">
            <div className="w-full flex flex-col gap-6">
                <SelectField
                    label="Project Registry"
                    options={registryList}
                    value={selectedRegistry._id}
                    dimension="small"
                    onChange={(e) => {
                        const selectedOption = registryList.find(option => option._id === e.target.value);
                        setSelectedRegistry(selectedOption || { _id: '', name: '' });
                    }}
                    placeholder="Enter project registry"
                    error={registryError && !selectedRegistry._id ? "This field is required" : undefined}
                    required
                />

                <>
                    {[{
                        name: 'project_name',
                        label: 'Name of your project',
                        placeholder: 'Enter Project Name',
                        hint: ''
                    }, {
                        name: 'project_url',
                        label: 'Project URL',
                        placeholder: 'Enter URL',
                        hint: ''
                    }, {
                        name: 'project_id',
                        label: 'Project ID',
                        placeholder: 'Enter ID',
                        hint: ''
                    },].map((field) => (<div key={field.name} className="flex flex-col gap-2">
                        <LabelHandler title={field.label} instruction={field.hint} /> <input
                            id={field.name}
                            name={field.name}
                            type="text"
                            value={formData[field.name as keyof typeof formData]}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            className={`py-s px-l text-f-m border h-[46px] block w-full rounded-md shadow-sm sm:text-sm  focus:outline-none ${!errors[field.name] && ' hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500'} ${errors[field.name] ? 'border-red-500' : 'border-neutral-300'}`}
                        /> {errors[field.name] && <ErrorMessage message={errors[field.name]} />}
                    </div>))}
                </>
                <SelectField
                    label="Project Status"
                    options={statusOptions.map(status => ({
                        _id: status._id,
                        name: status.project_status_name
                    }))}
                    value={selectedStatus._id}
                    dimension="small"
                    onChange={(e) => {
                        const selectedOption = statusOptions.find(option => option._id === e.target.value);
                        setSelectedStatus(selectedOption || { _id: '', name: '' });
                    }}
                    placeholder="Enter project status"
                    error={statusError && !selectedStatus._id ? "This field is required" : undefined}
                    required
                />


                <ButtonGroup
                    onBack={onclickBackButton}
                    onSubmit={() => { }}
                    submitType="submit"
                    isLoading={isLoading}
                    onSkip={onSkip}
                    isSkipVisible={[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(projectCompletionStatus)}
                />
            </div>
        </form>
    </div>)
}

export default About;