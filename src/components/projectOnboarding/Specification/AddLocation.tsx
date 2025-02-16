import SingleSelector from '@/components/common/SingleSelector';
import React, { useEffect, useState } from 'react';
import { getCountryNamesAndIds, getStateNamesAndIds } from '../SpecificationApis';
import { isHtmlTagPresent } from '@/utils/input-utils';
import { customToast } from '@/components/ui/customToast';
import SelectField from "@/components/ui/selectField";
import {ErrorMessage} from "@/components/ui/validationMsg";

interface AddLocationProps {
    onClose: () => void;
    onSubmit: (data: any) => void;
    // setSelectedState: any
}

interface CountryState {
    _id: string;
    name: string;
}

const AddLocation: React.FC<AddLocationProps> = ({ onClose, onSubmit }) => {
    const [countryList, setCountryList] = useState<CountryState[]>([]);
    const [stateList, setStateList] = useState<CountryState[]>([]);

    const [formData, setFormData] = useState({
        address: '',
        pincode: '',
        state_id: '',
        country_id: '',
        latitude: '',
        longitude: '',
        country_name: '',
        state_name: '',
    });

    const [errors, setErrors] = useState({
        address: '',
        pincode: '',
        state_id: '',
        country_id: '',
        latitude: '',
        longitude: '',
    });

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
    const stateListHandler = async (id: string) => {
        try {
            const list = await getStateNamesAndIds(id)
            setStateList(list);
        } catch (e: any) {
            console.log(e)
        } finally {
            console.log("finally")
        }
    }

// Implement scroll prevention when modal mounts
    useEffect(() => {
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
    }, []);

    useEffect(() => {
        countryListHandler()
    }, [])

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if (name === "country_id") {
            stateListHandler(value);
        }

        let parsedValue: any = value;
        if (name == "address") {
            parsedValue = value.trimStart().slice(0, 100)
        }
        if (name == "pincode") {
            parsedValue = value.trimStart().slice(0, 100)
        }
        else if (name === 'latitude' || name === 'longitude') {
            if (value !== "") {
                if (value.length > 10) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [name]: "Maximum 10 characters allowed.",
                    }));
                    return;  // Exit early if value exceeds max length
                }

                if (!isNaN((value))) {
                    parsedValue = (value);
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [name]: "This field should be a number.",
                    }));
                    return;
                }
            }
        }


        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: parsedValue ? '' : 'This field is required',
        }));
        let newdata: any;
        if (name === "country_id") {
            const selectedCountry = countryList.find(country => country._id === parsedValue);
            newdata = {
                [name]: parsedValue,
                "country_name": selectedCountry?.name || '',
                "state_id": '',
                "state_name": ''
            }
        }
        else if (name === "state_id") {
            const selectedState = stateList.find(state => state._id === parsedValue);
            newdata = {
                [name]: parsedValue,
                "state_name": selectedState?.name || ''
            }
        }
        else {
            newdata = {
                [name]: parsedValue
            }
        }

        console.log("longitude  ####==", newdata)
        setFormData({
            ...formData,
            ...newdata
        });
        console.log("=========----------=========", formData)
    };

    const validateForm = () => {
        const newErrors: any = {};
        console.log("formData");
        console.log(formData);
        console.log("formData");
        Object.entries(formData).forEach(([key, value]) => {
            console.log("validateForm", key)
            if (!value && key !== 'state_id' && key !== 'state_name') {
                newErrors[key] = 'This field is required';
            }
        });
        console.log("validateForm newErrors", newErrors)
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (isHtmlTagPresent(formData)) {
            customToast.error("Invalid Input!");
            return;
        }
        if (validateForm()) {
            console.log(formData)
            onSubmit(formData);
        }
    };

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 p-4 sc-md:p-0">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen mt-6xl">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Add Location</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        &#x2715;
                    </button>
                </div>
                <div className="flex-1 mt-4 space-y-4   max-h-[50vh] overflow-scroll 89">
                    <div>
                        <label className="block text-f-m font-medium text-gray-700">Address  <span className="text-negativeBold">*</span></label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Add Address"
                            className="mt-1 px-l py-s block w-full border border-gray-300 rounded-md shadow-sm hover:ring-brand1-500 hover:border-brand1-500 focus:outline-none focus:border-brand1-500 focus:ring-brand1-500 sm:text-sm"
                        />
                        {errors.address && (
                            <ErrorMessage message={errors.address} />
                        )}
                    </div>

                    <div>
                        <label className="block  text-f-m font-medium text-gray-700">Pincode  <span className="text-negativeBold">*</span></label>
                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            placeholder="Add Pincode"
                            className="mt-1 px-l py-s block w-full border border-gray-300 rounded-md shadow-sm hover:ring-brand1-500 hover:border-brand1-500 focus:outline-none focus:border-brand1-500 focus:ring-brand1-500 sm:text-sm"
                        />
                        {errors.pincode && (
                            <ErrorMessage message={errors.pincode} />
                        )}
                    </div>
                    <SelectField
                        options={countryList}
                        label="Country"
                        required={true}
                        value={formData.country_id}
                        onChange={(selected: any) => {
                            console.log("selected", selected);
                            handleChange({ target: { name: 'country_id', value: selected.target.value } });
                            }
                        }
                        placeholder="Select the Country"
                        error={errors.country_id}
                    />


                    <SelectField
                        options={stateList}
                        label="State"
                        required={true}
                        value={formData.state_id}
                        onChange={(selected: any) => {
                            console.log("selected", selected);
                            handleChange({ target: { name: 'state_id', value: selected.target.value } })
                        }
                        }
                        placeholder="Select the State"
                        error={errors.state_id}
                    />
                    <div>
                        <label className="block  text-f-m font-medium text-gray-700">Latitude  <span className="text-negativeBold">*</span></label>
                        <input
                            type="text"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            placeholder="Add Latitude"
                            className="mt-1 px-l py-s block w-full border border-gray-300 rounded-md shadow-sm hover:ring-brand1-500 hover:border-brand1-500 focus:outline-none focus:border-brand1-500 focus:ring-brand1-500 sm:text-sm"
                        />
                        {errors.latitude && (
                            <ErrorMessage message={errors.latitude} />
                        )}
                    </div>

                    <div>
                        <label className="block  text-f-m font-medium text-gray-700">Longitude  <span className="text-negativeBold">*</span></label>
                        <input
                            type="text"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            placeholder="Add Longitude"
                            className="mt-1 px-l py-s block w-full border border-gray-300 rounded-md shadow-sm hover:ring-brand1-500 hover:border-brand1-500 focus:outline-none focus:border-brand1-500 focus:ring-brand1-500 sm:text-sm"
                        />
                        {errors.longitude && (
                            <ErrorMessage message={errors.longitude} />
                        )}
                    </div>


                </div>
                <div className="mt-6 flex justify-end space-x-4 bg-white">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Submit
                    </button>
                </div>
            </div >
        </div >
    );
};

export default AddLocation;
