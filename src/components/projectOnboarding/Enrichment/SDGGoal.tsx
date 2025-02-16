// components/SDGGoalsForm.tsx
import {
    decrementEnrichmentStepper,
    incrementEnrichmentStepper,
    initialEnrichmentStepper
} from '@/app/store/slices/projectOnboardingSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSDGGoalsNamesAndIds } from '../SpecificationApis';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosApi from '@/utils/axios-api';
import { API_ENDPOINTS } from '@/config/api-endpoint';
import { encryptString } from '@/utils/enc-utils';
import { isHtmlTagPresent } from '@/utils/input-utils';
import { customToast } from '@/components/ui/customToast';
import SelectField from "@/components/ui/selectField";
import {ErrorMessage} from "@/components/ui/validationMsg";
interface Goal {
    id: number;
    title: string;
    description: string;
    isEditing: boolean;
    editedDescription: string;
    image: string
}


export default function SDGGoal() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [addGoals, setAddGoals] = useState<Goal[]>([]);
    const [selectedGoal, setSelectedGoal] = useState<string>('');
    const [introduction, setIntroduction] = useState<string>('');
    const [introductionError, setIntroductionError] = useState<string>('');
    const [sdgGoalError, setSdgGoalError] = useState<string>('');
    const [impact, setImpact] = useState<string>('');
    const [alreadyExist, setAlreadyExist] = useState(false)
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const [optionalcheck, setOptionalcheck] = useState(false);
    const projectDetail = useSelector((state: any) => state.projectOnboarding?.projectDetail);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                const sdgGaols = await getSDGGoalsNamesAndIds();
                console.log("sdgGaolssdgGaolssdgGaolssdgGaols", sdgGaols)
                const newData = sdgGaols.map((goal: any) => ({
                    id: goal._id,
                    title: goal.name,
                    description: goal.description,
                    isEditing: false,
                    editedDescription: '',
                    image: goal.image
                }));
                console.log('SDGGoal', newData)
                setGoals(newData)
            } catch (e: any) {
                console.log(e)
            } finally {
                console.log("finally")
            }
        };
        fetchData();
    }, [])

    useEffect(() => {
        const projectId = searchParams.get('id');
        if (!projectId) {
            console.log("No project ID found in URL. Skipping project details fetch.");
            return;
        }
        const fetchData = async () => {
            try {
                const projectResponse = await axiosApi.project.get(API_ENDPOINTS.ProjectCurrentStatus(projectId));
                const projectData = projectResponse.data.data.project_details;
                setIntroduction(projectData.sdg_description);
                if (projectData.sdg_goals.length > 0) {
                    const newData = projectData.sdg_goals.map((goal: any) => ({
                        id: goal._id,
                        title: goal.goal_name,
                        description: goal.impact === "" ? goal.description : goal.impact,
                        isEditing: false,
                        editedDescription: '',
                        image: goal.hero_image.name
                    }));
                    setAddGoals(newData)
                }
                setOptionalcheck(projectData.project_status.project_status_name === "Listed" || projectData.project_status.project_status_name === "Validated")
                console.log('projectData Description', projectData)
            } catch (e: any) {
                console.log(e)
            } finally {
                console.log("finally")
            }
        };
        fetchData();
    }, []);

    const handleAddGoal = () => {
        const goalId = selectedGoal;
        const matchingGoal = goals.find((goal: any) => goal.id === goalId);
        console.log("handleAddGoal === ", goalId, matchingGoal)
        if (matchingGoal) {
            setAddGoals((prev) => [
                ...prev,
                { ...matchingGoal, editedDescription: impact, isEditing: false },
            ]);
            setImpact('');
            setSelectedGoal('');
            setSdgGoalError('')
        }
        console.log("handleAddGoal", addGoals)
    };

    const handleEditClick = (goalId: number) => {
        setAddGoals((prevGoals) =>
            prevGoals.map((goal) =>
                goal.id === goalId ? { ...goal, isEditing: true } : goal
            )
        );
    };

    const handleDescriptionChange = (goalId: number, newDescription: string) => {
        setAddGoals((prevGoals) =>
            prevGoals.map((goal) =>
                goal.id === goalId ? { ...goal, editedDescription: newDescription } : goal
            )
        );
    };

    const handleSaveClick = (goalId: number) => {
        setAddGoals((prevGoals) =>
            prevGoals.map((goal) =>
                goal.id === goalId
                    ? {
                        ...goal,
                        isEditing: false,
                    }
                    : goal
            )
        );
    };

    const selectedGoalHandler = (value: string) => {
        console.log("selectedGoalHandler", value)
        setSelectedGoal(value);
        const alreadyExistGoal = addGoals.find((goal: any) => goal.id === value);
        (alreadyExistGoal) ? setAlreadyExist(true) : setAlreadyExist(false);
    }

    const onclickBackButton = () => {
        dispatch(decrementEnrichmentStepper())
    }

    const onClickNextButton = async () => {
        if ((!introduction || addGoals.length === 0) && !optionalcheck) {
            !introduction && setIntroductionError('This field is required.');
            (addGoals.length === 0) && setSdgGoalError("Goal is required.");
            return;
        }

        if ((introduction && addGoals.length !== 0) || optionalcheck) {
            const addedGoal = addGoals.map((goal: Goal) => ({
                'sdg_goal_id': goal.id,
                'impact': goal.description + ", " + goal.editedDescription,
            }));

            const newData = {
                "sdg_description": introduction,
                "sdg_goals": addedGoal,

                "onboarding_status": {
                    "step_number": 2,
                    "step_name": "enrichment",
                    "is_complete": true
                }
            };
            console.log(newData);
            /*if (isHtmlTagPresent(newData)) {
                customToast.error("Invalid Input!");
                return;
            }*/

            try {
                const projectId = searchParams.get('id');
                if (!projectId) {
                    console.error("No project ID found.");
                    return;
                }
                const requestBody = newData;
                let encryptedPayload = {};
                if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                    encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
                }
                let response = await axiosApi.project.put(API_ENDPOINTS.ProjectUpdate(projectId), { data: encryptedPayload });


                if (response.data.data && response.data.data.project) {
                    const projectId = response.data.data.project._id;
                    dispatch(incrementEnrichmentStepper())
                    // router.replace(`${Routes.ProjectCreate}?id=${projectId}`);
                }
            } catch (e: any) {
                console.log(e)
            } finally {
                console.log("finally")
            }
        }


    }

    const handleSkip = () => {
        dispatch(initialEnrichmentStepper(3));
    }

    return (<div className="text-neutral-1400 flex flex-col gap-6">
        <div className="">
            <h2 className="text-f-5xl font-light">SDG Goals</h2>
            <div className="text-f-l text-neutral-1200 font-normal">
                Fill in the details below
            </div>
        </div>

        <div className="">
            <label htmlFor="introduction" className="block text-f-m font-normal text-neutral-1200 mb-s"> Introduction {!optionalcheck &&
                <span className="text-danger ml-xs">*</span>}
            </label> <textarea
                id="introduction"
                value={introduction}
                onChange={(e) => {
                    setIntroduction(e.target.value.trimStart())
                    setIntroductionError('')
                }}
                placeholder="Add Introduction"
                maxLength={2000}
                rows={3}
                className={`text-f-m font-normal px-l py-s block w-full border rounded-md border-gray-300 focus:outline-none ${!introductionError && 'hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500'}  ${introductionError ? 'border-red-500' : 'border-neutral-300'} resize-none`}
            />
            <div className='flex justify-between items-center mt-s'>
                <ErrorMessage message={introductionError ? introductionError : ""} />
                <p className="italic text-f-m text-gray-400 ">Max. 2000 characters</p>
            </div>

        </div>
        <div className='flex flex-col px-xl py-l border rounded-xl gap-2xl'>
            <SelectField
                label="SDG Goal"
                required={!optionalcheck}
                options={goals.map(goal => ({
                    _id: goal.id,
                    name: goal.title
                }))}
                value={selectedGoal}
                onChange={(e) => selectedGoalHandler(e.target.value)}
                placeholder="Select Goal"
                error={alreadyExist && selectedGoal ? "This goal is already added." : undefined}
                className="my-s"
                selectClassName="sm:text-sm"
                selectBorderRadius="6px"
            />
            <div className="">
                <label htmlFor="impact" className="block text-f-m font-normal text-neutral-1200 mb-s"> Impact {!optionalcheck &&
                    <span className="text-danger ml-xs">*</span>}
                </label> <textarea
                id="impact"
                value={impact}
                onChange={(e) => setImpact(e.target.value.trimStart())}
                placeholder="Enter Details"
                className={`mt-1 block mb-s px-l py-m w-full rounded-md border border-gray-300 shadow-sm focus:outline-none ${!sdgGoalError && 'hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500'}  ${sdgGoalError ? 'border-red-500' : 'border-neutral-300'} resize-none`}
                maxLength={2000}
                rows={5}
            />
                <div className='flex justify-between items-center'>
                    <ErrorMessage message={sdgGoalError} />
                    <p className="italic text-f-m text-gray-400 ">Max. 2000 characters</p>
                </div>
            </div>
            <hr/>

            {[4, 6, 7, 8, 9, 10].includes(projectDetail?.project_completion_status) ? (
                <div className='flex flex-wrap justify-end  gap-l'>
                    <button className='px-xl py-l flex items-center' onClick={onclickBackButton}>
                        <div className='-scale-100'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10.9998 8.00061L5.9998 13.0006L5.2998 12.3006L9.5998 8.00061L5.2998 3.70061L5.9998 3.00061L10.9998 8.00061Z" fill="#22577a"/>
                            </svg>
                        </div>
                        <div className='text-f-m ml-l text-tertiary font-normal'>Back</div>
                    </button>
                    <button
                        type='button'
                        className={`flex w-fit  h-12 min-w-12 px-6 py-4 justify-end items-center gap-4 rounded-lg bg-brand1-500 text-white cursor-pointer`}
                        onClick={handleSkip}
                    >
                        Skip
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.9998 8L5.9998 13L5.2998 12.3L9.5998 8L5.2998 3.7L5.9998 3L10.9998 8Z"
                                fill="currentColor"/>
                        </svg>
                    </button>
                </div>) : (
                    <div className="flex flex-wrap justify-between gap-l w-full">
                        <button className='px-xl py-l flex items-center' onClick={onclickBackButton}>
                            <div className='-scale-100'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M10.9998 8.00061L5.9998 13.0006L5.2998 12.3006L9.5998 8.00061L5.2998 3.70061L5.9998 3.00061L10.9998 8.00061Z" fill="#22577a"/>
                                </svg>
                            </div>
                            <div className='text-f-m ml-l text-tertiary font-normal'>Back</div>
                        </button>
                        <div className="flex flex-wrap sc-sm:flex-row justify-end gap-xl ml-auto">
                            <button className='px-xl py-l bg-white text-tertiary border border-brand1-500 rounded-lg flex items-center whitespace-nowrap' onClick={handleAddGoal}>
                                <div className='text-f-m font-normal'>Add Goal</div>
                            </button>
                            <button className='px-xl py-l bg-brand1-500 text-white rounded-lg flex items-center' onClick={onClickNextButton}>
                                <div className='text-f-m mr-l font-normal'>Next</div>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M10.9998 8.00061L5.9998 13.0006L5.2998 12.3006L9.5998 8.00061L5.2998 3.70061L5.9998 3.00061L10.9998 8.00061Z" fill="white"/>
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>)}

        </div>

        <div className="bg-white shadow border border-gray-50 rounded-2xl mt-xl">
            <h2 className="text-f-3xl font-light mb-4 p-l border-b border-gray-300 ">Goals</h2>
            <div className="px-xl">
                {addGoals.map((goal, index) => (<div
                    key={goal.id}
                    className={`py-4 flex gap-m justify-center items-start ${index !== (addGoals.length - 1) && 'border-b-2'}`}
                >
                    <div className='w-6xl h-6xl border-2 rounded-xl'>
                    {goal.image != '' && <img src={`${process.env.NEXT_PUBLIC_ESG_GOAL_ENDPOINT}/${goal.image}`}/>}
                    </div>
                    <div className='flex-1 '>
                        <h3 className="text-f-m font-semibold">{goal.title}</h3>{goal.isEditing ? (<div>
                            <textarea
                                value={goal.editedDescription}
                                onChange={(e) => handleDescriptionChange(goal.id, e.target.value)}
                                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:border focus:border-brand1-500 focus:ring-brand1-500 resize-none p-s"
                            />

                    </div>) : (<p className="text-neutral-1200 font-normal text-f-m mt-2">{(goal.description + ", " + goal.editedDescription).length > 150 ? (goal.description + ", " + goal.editedDescription).slice(0, 150) + "..." : goal.description + ", " + goal.editedDescription}</p>)}
                    </div>

                    {!goal.isEditing ? (<button
                        onClick={() => handleEditClick(goal.id)}
                        className="text-indigo-600 hover:underline p-m bg-gray-100 rounded-full h-fit"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M15 13.0006H1V14.0006H15V13.0006Z" fill="#161616" />
                            <path d="M12.7 4.50061C13.1 4.10061 13.1 3.50061 12.7 3.10061L10.9 1.30061C10.5 0.90061 9.9 0.90061 9.5 1.30061L2 8.80061V12.0006H5.2L12.7 4.50061ZM10.2 2.00061L12 3.80061L10.5 5.30061L8.7 3.50061L10.2 2.00061ZM3 11.0006V9.20061L8 4.20061L9.8 6.00061L4.8 11.0006H3Z" fill="#161616" />
                        </svg>
                    </button>) : (<button
                        onClick={() => handleSaveClick(goal.id)}
                        className="text-indigo-600 hover:underline p-m bg-gray-100 rounded-full h-fit rotate-180"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 9.00061L3.705 9.70561L7.5 5.91561V15.0006H8.5V5.91561L12.295 9.70561L13 9.00061L8 4.00061L3 9.00061Z" fill="#4D4D4D" />
                            <path d="M3 4.00061V2.00061H13V4.00061H14V2.00061C14 1.73539 13.8946 1.48104 13.7071 1.2935C13.5196 1.10597 13.2652 1.00061 13 1.00061H3C2.73478 1.00061 2.48043 1.10597 2.29289 1.2935C2.10536 1.48104 2 1.73539 2 2.00061V4.00061H3Z" fill="#4D4D4D" />
                        </svg>
                    </button>)}
                </div>))}
            </div>
        </div>
    </div>);
}
