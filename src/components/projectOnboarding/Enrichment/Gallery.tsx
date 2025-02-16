import React, { useEffect, useRef, useState } from 'react';
import AddImage from './AddImage';
import {
    currentProjectDetail,
    currentStatusHandler,
    currentTabHandler,
    decrementEnrichmentStepper,
    updateAllowedTabs
} from '@/app/store/slices/projectOnboardingSlice';
import { useDispatch, useSelector } from 'react-redux';
import { API_ENDPOINTS } from '@/config/api-endpoint';
import axiosApi from '@/utils/axios-api';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuthCredentials } from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import { customToast } from '@/components/ui/customToast';
import { WITHOUT_CREDITS_PROJECT_STATUS_IDS } from "@/utils/constants";
import { validateFile } from '@/utils/validate-file';
import { encryptString } from '@/utils/enc-utils';
import { ChevronLeft, ChevronRight, Download, Edit, Location, TrashCan } from "@carbon/icons-react";
import { isHtmlTagPresent } from '@/utils/input-utils';

interface GalleriesData {
    id: string, // Changed to string for uniqid
    thumbnail: any,
    title: string,
    description: string,
    country_id: string
}

const Gallery: React.FC = () => {
    const [locations, setLocations] = useState<any>([]);
    const [selectedLocations, setSelectedLocations] = useState<any>('');
    const [selectedImage, setSelecteImage] = useState<any>('');
    const [formValue, setFormValue] = useState<any>([])
    const [addImage, setAddImage] = useState(false);
    const [files, setFiles] = useState<File[]>([]); // Changed to store multiple files
    const [galleryItems, setGalleryItems] = useState<GalleriesData[]>([]);
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const projectDetail = useSelector((state: any) => state.projectOnboarding?.projectDetail);
    const allowedTabs = useSelector((state: any) => state.projectOnboarding?.allowedTabs);
    const router = useRouter();
    const [completeOnboarding, setCompleteOnboarding] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0);
        const projectId = searchParams.get('id');
        if (!projectId) {
            console.log("No project ID found in URL. Skipping project details fetch.");
            return;
        }

        const fetchData = async () => {
            try {
                const projectResponse = await axiosApi.project.get(API_ENDPOINTS.ProjectCurrentStatus(projectId));
                const projectData = projectResponse.data.data.project_details;

                const newData = projectData.locations.map((location: any) => ({
                    ...location,
                    images: location.images && location.images.length > 0 ? location.images : []
                }));
                setFormValue(newData);
                console.log("setLocations", projectData.locations)
                setLocations(projectData.locations)
                setSelectedLocations(projectData.locations[0].state_id ? projectData.locations[0].state_id : projectData.locations[0].country_id)
            } catch (e: any) {
                console.log(e)
            } finally {
                console.log("finally")
            }
        };
        fetchData();
    }, []);

    const updateImagesInLocation = (countryId: any, newImage: any) => {
        setFormValue((prevLocations: any) =>
            prevLocations.map((location: any) =>
                (location.state_id ? location.state_id : location.country_id) == countryId
                    ? {
                        ...location,
                        images: [...location.images, newImage]
                    }
                    : location
            )
        );
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const validation = validateFile(e.target.files[0], 8, ['.jpg', '.jpeg', '.png']);
            if (!validation.isValid) {
                customToast.error(validation.error || 'Invalid file');

                // Clear the file input to allow re-upload of the same file
                e.target.value = '';
                return;
            }
            const uploadedFiles = Array.from(e.target.files); // Convert FileList to Array
            setFiles(uploadedFiles); // Update state with the selected files

            console.log('uploadedFiles', uploadedFiles)
            const newGalleryItems = uploadedFiles.map(async (uploadedFile) => {
                const formData = new FormData();
                formData.append('file', uploadedFile);
                formData.append('folder', 'project-images');
                try {
                    const token = getAuthCredentials();
                    const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_IMAGE_ENDPOINT}/auth/file-upload`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Authorization': `Bearer ${token.token}`
                        }

                    });

                    if (response.ok) {
                        const result = await response.json();
                        console.log('Files uploaded successfully:', result);
                        let newData = {
                            "name": uploadedFile.name,
                            "path": result.data.file_path,
                            "description": "Enter the description...'",
                            "title": uploadedFile.name
                        }



                        updateImagesInLocation(selectedLocations, newData);


                    } else {
                        console.error('Failed to upload files:', response.statusText);
                    }

                } catch (error) {
                    console.error('Error uploading files:', error);
                }
            });
        }
    };

    const handleDeleteImage = (imagePath: string) => {
        setFormValue((prevLocations: any) =>
            prevLocations.map((location: any) =>
                (location.state_id ? location.state_id : location.country_id) === selectedLocations
                    ? {
                        ...location,
                        images: location.images.filter((img: any) => img.path !== imagePath)
                    }
                    : location
            )
        );
    };

    const handleDownload = (imagePath: string) => {
        // Find the location with the specified country_id
        const location = formValue.find((loc: any) => (loc.state_id ? loc.state_id : loc.country_id) === selectedLocations);

        if (!location) {
            console.log(`Location with country_id ${selectedLocations} not found`);
            return;
        }

        // Find the image within the location that matches the imagePath
        const image = location.images.find((img: any) => img.path === imagePath);

        if (!image) {
            console.log(`Image with path ${imagePath} not found in location with country_id ${selectedLocations}`);
            return;
        }

        // Open the image in a new tab
        const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/project-images/${image.path}`;
        window.open(imageUrl, '_blank');
    };

    const handleImageAdd = (id: string) => {
        setSelecteImage(id)
        setAddImage(true);
    };


    const onCloseImageHandler = () => {
        setAddImage(false);
    };

    const onSubmitImageHandler = (data: any) => {

        setFormValue((prevLocations: any) =>
            prevLocations.map((location: any) =>
                (location.state_id ? location.state_id : location.country_id) == selectedLocations
                    ? {
                        ...location,
                        images: location.images.map((image: any) =>
                            image.path === selectedImage
                                ? { ...image, description: data.description, title: data.tag }
                                : image
                        )
                    }
                    : location
            )
        );
        console.log(galleryItems)
        onCloseImageHandler()
    };

    const currentLocationHandler = (location_id: any) => {
        setSelectedLocations(location_id)
    }

    const nextHandler = async () => {
        const newData = {
            "locations": formValue,
            "onboarding_status": {
                "step_number": 6,
                "step_name": "enrichment",
                "is_complete": true,
            },
            "project_completion_status": 12,
        };
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
            const requestBody = newData;
            let encryptedPayload = {};
            if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            let response = await axiosApi.project.put(API_ENDPOINTS.ProjectUpdate(projectId), { data: encryptedPayload });

            if (response.status == 200) {
                setCompleteOnboarding(true)
            }
            // if (response.data.data && response.data.data.project) {
            //     // router.replace(`${Routes.ProjectCreate}?id=${projectId}`);
            // }

        } catch (e: any) {
            console.log(e)
        } finally {

            console.log("finally")
        }

        console.log(formValue)
    }

    const onclickBackButton = () => {
        dispatch(decrementEnrichmentStepper())
    }

    const handleSkip = async () => {
        if (projectDetail.project_completion_status == 4) {
            await router.replace(`${Routes.Project}/${projectDetail._id}`);
        }
    }

    const updateStatus = async () => {
        try {
            const requestBody = { project_completion_status: 4 };
            let encryptedPayload = {};
            if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            const response = await axiosApi.project.post(`/project-status/${projectDetail._id}`, {
                data: encryptedPayload
            });
            if (response.status === 200) {
                dispatch(currentProjectDetail(response.data.project));
                dispatch(currentStatusHandler(response.data.project.project_completion_status));
                if (WITHOUT_CREDITS_PROJECT_STATUS_IDS.includes(response.data.project?.project_status?._id)) {
                    dispatch(updateAllowedTabs({ isDetailsComplete: true, isSpecificationsComplete: true }));
                    dispatch(currentTabHandler("enrichment"));
                } else {
                    dispatch(updateAllowedTabs({ isDetailsComplete: true, isSpecificationsComplete: true, isEnrichmentComplete: true }));
                    dispatch(currentTabHandler("management"));
                }

                customToast.success(`Onboarding completed successfully.`);
            }
        } catch (err) {
            customToast.error('Failed to update status');
        } finally {
        }
    }

    return (
        <div className="text-neutral-1400 flex flex-col gap-6">
            {addImage && <AddImage onClose={onCloseImageHandler} onSubmit={onSubmitImageHandler} />}
            <div>
                <h2 className="text-f-5xl font-light">Gallery</h2>
                <div className="text-f-l text-neutral-1200 font-normal">
                    Fill in the details below
                </div>
            </div>
            {/* Location Selection */}
            <div className="flex space-x-4 items-center">
                {locations.map((location: any, index: any) => (<button
                    key={index}
                    className={`py-s px-m rounded-lg flex ${selectedLocations === (location.state_id ? location.state_id : location.country_id) ? 'bg-brand1-200' : 'bg-gray-200'}`}
                    onClick={() => {
                        currentLocationHandler(location.state_id ? location.state_id : location.country_id);
                    }}
                >
                    <Location className="w-4 h-4" />
                    <div className='text-f-xs font-semibold ml-xs text-gray-600 '>
                        {!location.state_name ? location.country_name : location.state_name}
                    </div>
                </button>
                ))}
            </div>

            {/* Location Description */}
            {/* <div className="mb-6">
                <label className="block text-f-m text-neutral-1200 font-normal mb-s" htmlFor="description">
                    Project Description
                </label>
                <textarea
                    id="description"
                    className="w-full border rounded-md text-gray-700 resize-none px-l py-m"
                    placeholder="Description"
                    value={locationDescription}
                    onChange={(e) => setLocationDescription(e.target.value)}
                    maxLength={2000}
                    rows={5}
                />
                <p className="text-right italic text-f-m text-gray-400">Max. 2000 characters</p>
            </div> */}

            {(![4, 6, 7, 8, 9, 10].includes(projectDetail?.project_completion_status) && !(projectDetail?.project_completion_status == 12 || completeOnboarding)) && <div className="mb-6 p-l bg-gray-200 border-dashed border border-gray-300 rounded-md hover:ring-brand1-500 hover:border-brand1-500 focus:border-brand1-500 focus:ring-brand1-500">
                <div className="w-full h-auto relative flex items-center justify-center cursor-pointer">
                    <input
                        type="file"
                        id="banner"
                        ref={fileInputRef}
                        className="opacity-0 absolute h-full w-full cursor-pointer"
                        onChange={handleFileChange}
                        accept=".jpeg,.jpg,.png"
                        multiple // Allow multiple file selection
                    />
                    <div className="text-center">

                        <div className='flex justify-center flex-col items-center '>
                            <div className='w-fit p-m rounded-full border-4 border-white mb-m'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                    <path d="M7.5 10.7076L5 8.20711L5.7065 7.50061L7.5 9.29361L11.2925 5.50061L12 6.20811L7.5 10.7076Z" fill="#808080" />
                                    <path d="M8.5 1.00061C7.11553 1.00061 5.76216 1.41115 4.61101 2.18032C3.45987 2.94949 2.56266 4.04274 2.03285 5.32183C1.50303 6.60091 1.36441 8.00838 1.63451 9.36624C1.9046 10.7241 2.57129 11.9714 3.55026 12.9504C4.52922 13.9293 5.7765 14.596 7.13437 14.8661C8.49224 15.1362 9.8997 14.9976 11.1788 14.4678C12.4579 13.938 13.5511 13.0407 14.3203 11.8896C15.0895 10.7385 15.5 9.38508 15.5 8.00061C15.5 6.14409 14.7625 4.36362 13.4497 3.05086C12.137 1.73811 10.3565 1.00061 8.5 1.00061ZM8.5 14.0006C7.31332 14.0006 6.15328 13.6487 5.16658 12.9894C4.17989 12.3301 3.41085 11.3931 2.95673 10.2967C2.5026 9.20035 2.38378 7.99395 2.61529 6.83007C2.8468 5.66618 3.41825 4.59708 4.25736 3.75797C5.09648 2.91885 6.16558 2.34741 7.32946 2.1159C8.49335 1.88439 9.69975 2.00321 10.7961 2.45733C11.8925 2.91146 12.8295 3.68049 13.4888 4.66719C14.1481 5.65388 14.5 6.81392 14.5 8.00061C14.5 9.59191 13.8679 11.118 12.7426 12.2433C11.6174 13.3685 10.0913 14.0006 8.5 14.0006Z" fill="#808080" />
                                </svg>
                            </div>
                            <p className="text-tertiary text-f-m font-semibold">Click to upload banner images</p>
                            <p className="text-neutral-1000 text-f-m font-normal">
                                .jpg, .jpeg, .png (max. 8mb, Dimension: 1920px*330px)
                            </p>
                        </div>

                    </div>
                </div>
            </div>}

            {/* Other UI components */}

            <div className="bg-white shadow border border-gray-50 rounded-2xl">
                <div className='py-l px-xl border-b flex justify-between'>
                    <div className="text-f-3xl font-light text-black border-gray-300">Gallery</div>
                    <div className="flex">
                        {/* <button className="text-gray-600">View All</button> */}
                    </div>
                </div>
                <div className="p-6 overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-3 px-2 text-sm font-semibold text-left w-1/4">Thumbnail</th>
                                <th className="py-3 px-2 text-sm font-semibold text-left">Details</th>
                                <th className="py-3 px-2 text-sm font-semibold text-left w-1/6">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formValue.map((item: any) => ((item.state_id ? item.state_id : item.country_id) === selectedLocations && item.images?.map((image: any, index: any) => (
                                <tr key={index} className="border-t border-gray-200">
                                    <td className="py-3 px-2">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/project-images/${image.path}`}
                                            alt={item.title}
                                            className="w-16 h-16 rounded-md"
                                        />
                                    </td>
                                    <td className="py-3 px-2" onClick={() => handleImageAdd(image.path)}>
                                        <div className="text-sm font-normal">{image.title}</div>
                                        <div className="text-gray-500 text-xs">{image.description}</div>
                                    </td>
                                    <td className="py-3 px-2">
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => handleImageAdd(image.path)}>
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button id="download" onClick={() => handleDownload(image.path)}>
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button
                                                id="delete"
                                                onClick={() => {
                                                    handleDeleteImage(image.path);
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = '';
                                                    }
                                                }}
                                            >
                                                <TrashCan className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>))))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className=' flex justify-end flex-wrap gap-l border-t pt-xl'>
                <button className='px-xl py-l flex items-center' onClick={onclickBackButton}>
                    <div className='-scale-100'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10.9998 8.00061L5.9998 13.0006L5.2998 12.3006L9.5998 8.00061L5.2998 3.70061L5.9998 3.00061L10.9998 8.00061Z" fill="#22577a" />
                        </svg>
                    </div>
                    <div className='text-f-m ml-l text-tertiary font-normal'>Back</div>
                </button>
                {[4, 6, 7, 8, 9, 10].includes(projectDetail?.project_completion_status) ? (/*<button
                        type='button'
                        className={`flex h-12 min-w-12 px-6 py-4 justify-end items-center gap-4 rounded-lg bg-brand1-500 text-white cursor-pointer'`}
                        onClick={handleSkip}
                    >
                        {allowedTabs.includes('management') ? 'Skip' : 'Redirect to Detail Page'}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.9998 8L5.9998 13L5.2998 12.3L9.5998 8L5.2998 3.7L5.9998 3L10.9998 8Z"
                                fill="currentColor" />
                        </svg>
                    </button>*/
                    <></>) : ((projectDetail?.project_completion_status == 12 || completeOnboarding) ? <button
                        type="button"
                        className=" flex items-center justify-center h-14 px-6 rounded-lg bg-gray-300 hover:bg-gray-400 transition-colors whitespace-nowrap"
                        onClick={updateStatus}
                    >
                        Complete Onboarding
                        <ChevronRight className="w-4 h-4" />
                    </button> : <button className='px-xl py-l bg-brand1-500 text-white rounded-lg flex items-center ' onClick={nextHandler}>
                        <div className='text-f-m mr-l font-normal'>Submit</div>
                        <div>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </button>

                )}
            </div>
        </div>
    );
};

export default Gallery;

