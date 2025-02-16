'use client'
import React, { useEffect, useState } from 'react';
import Input from '@/components/ui/input';
import SelectField from "@/components/ui/selectField";
import { CityList, CountryList, CountryObject, RequiredDocument, StateList } from "@/types";
import { useForm, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosApi from "@/utils/axios-api";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import DocumentManager from "@/app/company-onboarding/components/documentManager";
import { customToast } from "@/components/ui/customToast";
import { Routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layouts/admin";
import StatusBar from "@/components/ui/statusBar";
import { handleCountryChange, handleStateChange } from "@/data/address";
import { encryptString } from '@/utils/enc-utils';
import Checkbox from "@/components/ui/checkbox";
import { isHtmlTagPresent } from '@/utils/input-utils';

export interface DocumentData {
    id?: string;
    type: string;
    name: string;
    path: string;
    notes?: string;
    status?: string | number;
}

interface SectionProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    required?: boolean;
    showCheckbox?: boolean;
    watch?: UseFormWatch<any>;
    setValue?: UseFormSetValue<any>;
    setBillingStateList?: any;
    setBillingCityList?: any;
    disabled?: boolean;
}

const Section = ({ title, subtitle, children, required = false, showCheckbox = false, watch, setValue, setBillingStateList, setBillingCityList }: SectionProps) => {
    const [sameAsRegistered, setSameAsRegistered] = useState(false);

    const handleSameAsRegistered = async (checked: boolean) => {

        setSameAsRegistered(checked);

        console.log("setValue", setValue);

        if (setValue) {

            console.log("handleSameAsRegistered", checked);

            setValue('sameAsRegistered', checked, {
                shouldValidate: true
            });

            if (checked && watch) {
                // Get all the registered address values
                const registeredCountryValue = watch('registered_country');
                const registeredStateValue = watch('registered_state');
                const registeredCityValue = watch('registered_city');
                const registeredAddress1Value = watch('registered_address1');
                const registeredAddress2Value = watch('registered_address2');
                const registeredPincodeValue = watch('registered_pincode');

                setValue('billing_country', registeredCountryValue, { shouldValidate: true });
                setValue('billing_state', registeredStateValue, { shouldValidate: true });
                setValue('billing_city', registeredCityValue, { shouldValidate: true });
                setValue('billing_address1', registeredAddress1Value, { shouldValidate: true });
                setValue('billing_address2', registeredAddress2Value, { shouldValidate: true });
                setValue('billing_pincode', registeredPincodeValue, { shouldValidate: true });

                try {
                    setValue('billing_country', registeredCountryValue, { shouldValidate: true });
                    await handleCountryChange(registeredCountryValue, setBillingStateList);
                    await new Promise(resolve => setTimeout(resolve, 100));

                    setValue('billing_state', registeredStateValue, { shouldValidate: true });
                    await handleStateChange(registeredStateValue, setBillingCityList);
                    await new Promise(resolve => setTimeout(resolve, 100));
                    setValue('billing_city', registeredCityValue, { shouldValidate: true });
                    setValue('billing_address1', registeredAddress1Value, { shouldValidate: true });
                    setValue('billing_address2', registeredAddress2Value, { shouldValidate: true });
                    setValue('billing_pincode', registeredPincodeValue, { shouldValidate: true });

                } catch (error) {
                    console.error('Error setting billing address:', error);
                }
            }
        }
    };
    return (<div className="flex flex-col gap-6">
            <div className="flex flex-col sc-xs:flex-row sc-xs:justify-between justify-start auth border-b border-neutral-200 py-4 pr-6">
                <div className="flex flex-col gap-y-2">
                    <p className="text-xl font-light text-neutral-1400">
                        {title} {required && <span className="text-negativeBold">*</span>}
                    </p>
                    <p className="text-sm text-neutral-1200">{subtitle}</p>
                </div>
                {showCheckbox && (
                    <Checkbox
                        type="checkbox"
                        name='sameAsRegistered'
                        checked={sameAsRegistered}
                        onChange={(e) => handleSameAsRegistered(e.target.checked)}
                        label={"Same as corporate address"}
                        required
                    />
                )}
            </div>

        {children}
    </div>)
};


const COUNTRIES_REQUIRING_PANCARD = [
    "66d59cb1ec81b79c8904c42f"
];

const formSchema = yup.object().shape({
    name: yup.string().matches(
        /^[a-zA-Z0-9\s&]*$/,
        'Company name can only contain letters, numbers, spaces and & symbol'
    ).required('Company name is required'),
    country_id: yup.string().required('Country is required'),
    uid: yup.string().required('Company Registration Number is required').matches(/^[a-zA-Z0-9]+$/, 'Only letters and numbers are allowed'),
    registered_country: yup.string().required('Registered country is required'),
    registered_state: yup.string().required('Registered state is required'),
    registered_address1: yup.string().required('Address line 1 is required'),
    registered_address2: yup.string().nullable(),
    registered_city: yup.string().required('City is required'),
    registered_pincode: yup.string().required('Pincode is required').matches(/^\d{1,15}$/, 'Max 15 digits allowed.'),
    sameAsRegistered: yup.boolean(),
    billing_country: yup.string().when('sameAsRegistered', {
        is: true,
        then: (schema) => schema.required('Billing country is required'),
        otherwise: (schema) => schema.nullable(),
    }),
    billing_state: yup.string().when('sameAsRegistered', {
        is: false,
        then: (schema) => schema.required('Billing state is required'),
        otherwise: (schema) => schema.nullable(),
    }),
    billing_address1: yup.string().when('sameAsRegistered', {
        is: false,
        then: (schema) => schema.required('Billing address is required'),
        otherwise: (schema) => schema.nullable(),
    }),
    billing_address2: yup.string().nullable(),
    billing_city: yup.string().when('sameAsRegistered', {
        is: false,
        then: (schema) => schema.required('Billing city is required'),
        otherwise: (schema) => schema.nullable(),
    }),
    billing_pincode: yup.string().when('sameAsRegistered', {
        is: false,
        then: (schema) => schema.required('Billing pincode is required').matches(/^\d{1,15}$/, 'Max 15 digits allowed.'),
        otherwise: (schema) => schema.nullable(),
    }),
    gst_number: yup.string().when('billing_country', {
        is: (value: string) => COUNTRIES_REQUIRING_PANCARD.includes(value),
        then: () => yup.string()
        .required('GST Number is required')
        .length(15, 'GST must be 15 characters')
        .matches(/^[0-9A-Z]{15}$/, 'Invalid GST format'),
        otherwise: () => yup.string().nullable()
    }),
    pancard: yup.string().when('billing_country', {
        is: (value: string) => COUNTRIES_REQUIRING_PANCARD.includes(value),
        then: () => yup.string()
        .required('PAN Card is required for India')
        .length(10, 'PAN must be 10 characters')
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
        otherwise: () => yup.string().nullable()
    }),
    tax_rate: yup.string().when('billing_country', {
        is: (value: string) => !COUNTRIES_REQUIRING_PANCARD.includes(value),
        then: () => yup.number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .typeError('Tax rate is required')
        .min(0, 'Tax rate must be at least 0')
        .max(100, 'Tax rate cannot exceed 100')
        .test('decimal-places', 'Tax rate can only have up to 2 decimal places', (value) => {
            if (!value) return true;
            const decimalPlaces = value.toString().split('.')[1]?.length || 0;
            return decimalPlaces <= 2;
        }),
        otherwise: () => yup.string().nullable()
    }),
    lut: yup.boolean(),
    vat_or_gst_number: yup.string().when('billing_country', {
        is: (value: string) => !COUNTRIES_REQUIRING_PANCARD.includes(value),
        then: () => yup.string()
        .required('GST/Vat Number is required')
        .max(20, 'GST/Vat max 20 characters allowed.'),
        otherwise: () => yup.string().nullable()
    }),
});

const CompanyRegistrationForm = () => {
    const router = useRouter();
    const [onboardingData, setOnboardingData] = useState<any>([]);
    const [countryList, setCountryList] = useState<CountryList[]>([]);
    const [countryListObject, setCountryListObject] = useState<CountryObject[]>([]);
    const [registeredStateList, setRegisteredStateList] = useState<StateList[]>([]);
    const [billingStateList, setBillingStateList] = useState<StateList[]>([]);
    const [registeredCityList, setRegisteredCityList] = useState<CityList[]>([]);
    const [billingCityList, setBillingCityList] = useState<CityList[]>([]);

    const [nextId, setNextId] = useState(0);
    const [requiredDoc, setRequiredDoc] = useState<RequiredDocument[]>([]);
    const [requiredDocuments, setRequiredDocuments] = useState<DocumentData[]>([]);
    const [otherDocs, setOtherDocs] = useState<RequiredDocument[]>([]);
    const [otherDocuments, setOtherDocuments] = useState<DocumentData[]>([]);
    const [companyOnboardedStatus, setCompanyOnboardedStatus] = useState(false)

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: {
            sameAsRegistered: false,
        }
    });

    const fetchCountryList = async () => {
        try {
            const countryData = await axiosApi.auth.get(API_ENDPOINTS.CountryList);
            setCountryListObject(countryData.data.data.Country);

            const namesAndIds = countryData.data.data.Country.map((country: { ID: string; Name: string }) => ({
                _id: country.ID,
                name: country.Name
            }));

            setCountryList([
                { _id: '', name: 'Select country' },
                ...namesAndIds
            ]);
        } catch (error) {
            console.error('Error fetching states:', error);
            setCountryList([]);
        }
    };

    useEffect(() => {
        fetchCountryList();
        const fetchData = async () => {
            try {
                const response = await axiosApi.auth.get(API_ENDPOINTS.ME);
                const orgData = response?.data?.data?.organization;
                setOnboardingData(orgData);
                await fetchCountryList();
                if (orgData?.name) {
                    // Set basic organization details
                    setValue('name', orgData?.name);
                    setValue('uid', orgData?.company_number);
                    setValue('country_id', orgData?.country_id);
                    if (orgData?.documents && Array.isArray(orgData.documents)) {
                        // Transform documents and set them as required documents
                        const transformedDocs = orgData.documents.map((doc: any) => ({
                            id: Math.random().toString(36).substring(2, 15),
                            type: doc.type,
                            name: doc.name,
                            path: doc.path,
                            status: doc.status || 0
                        }));
                        setRequiredDocuments(transformedDocs); // Set the actual documents

                        // Create requiredDoc array from the document types
                        const docTypes = [...new Set(orgData.documents.map((doc: any) => ({
                            Name: doc.type
                        })))] as RequiredDocument[];
                        setRequiredDoc(docTypes);
                    }

                    if (orgData?.other_documents && Array.isArray(orgData.other_documents)) {
                        const transformedDocs = orgData.other_documents.map((doc: any) => ({
                            id: Math.random().toString(36).substring(2, 15),
                            type: doc.type,
                            name: doc.name,
                            path: doc.path,
                            status: doc.status || 0
                        }));
                        setNextId(orgData.other_documents.length);
                        setOtherDocuments(transformedDocs);

                        const docTypes = [...new Set(orgData.other_documents.map((doc: any, index: number) => ({
                            id: index++,
                            Name: doc.type
                        })))] as RequiredDocument[];
                        setOtherDocs(docTypes);
                    }
                    if (orgData?.addresses && orgData.addresses.length > 0) {

                        for (const address of orgData.addresses) {
                            if (address.address_type === 'billing') {
                                setValue('billing_country', address.country_id, { shouldValidate: true });
                                await handleCountryChange(address.country_id, setBillingStateList);
                                await new Promise(resolve => setTimeout(resolve, 100));

                                setValue('billing_state', address.state_id, { shouldValidate: true });
                                await handleStateChange(address.state_id, setBillingCityList);
                                await new Promise(resolve => setTimeout(resolve, 100));

                                setValue('billing_city', address.city_id, { shouldValidate: true });
                                setValue('billing_address1', address.address1, { shouldValidate: true });
                                setValue('billing_address2', address.address2, { shouldValidate: true });
                                setValue('billing_pincode', address.pincode, { shouldValidate: true });

                                if(COUNTRIES_REQUIRING_PANCARD.includes(address.country_id)){
                                    setValue('pancard', orgData?.pancard);
                                    setValue('gst_number', orgData?.gst_number);
                                    setValue('lut', orgData?.lut);
                                }else{
                                    setValue('tax_rate', orgData?.tax_rate);
                                    setValue('vat_or_gst_number', orgData?.vat_or_gst_number);
                                }
                            } else if (address.address_type === 'corporate') {
                                setValue('registered_country', address.country_id, { shouldValidate: true });
                                await handleCountryChange(address.country_id, setRegisteredStateList);
                                await new Promise(resolve => setTimeout(resolve, 100));

                                setValue('registered_state', address.state_id, { shouldValidate: true });
                                await handleStateChange(address.state_id, setRegisteredCityList);
                                await new Promise(resolve => setTimeout(resolve, 100));

                                setValue('registered_city', address.city_id, { shouldValidate: true });
                                setValue('registered_address1', address.address1, { shouldValidate: true });
                                setValue('registered_address2', address.address2, { shouldValidate: true });
                                setValue('registered_pincode', address.pincode, { shouldValidate: true });
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching project details:', error);
            }
        };

        fetchData();
    }, [setValue]);

    const onSubmit = async (data: any) => {
        const hasAllRequired = requiredDoc.every(doc =>
            requiredDocuments.some(uploaded => uploaded.type === doc.Name)
        );

        if (!hasAllRequired) {
            customToast.error("Please Upload All Required Docs.");
            return;
        }

        const rejectedDocuments = [...requiredDocuments, ...otherDocuments].filter(
            doc => doc.status === 2
        );

        if (rejectedDocuments.length > 0) {
            customToast.error("Please re-upload the rejected documents before submitting.");
            return;
        }

        const formData = {
            organization: {
                country_id: data.country_id,
                company_number: data.uid,
                name: data.name,
                ...(COUNTRIES_REQUIRING_PANCARD.includes(data.billing_country)
                        ? {
                            pancard: data.pancard,
                            gst_number: data.gst_number,
                            lut: data.lut ? 1 : 0
                        }
                        : {
                            tax_rate: Number(parseFloat(data.tax_rate).toFixed(2)),
                            vat_or_gst_number: data.vat_or_gst_number
                        }
                ),
                documents: requiredDocuments,
                other_documents: otherDocuments,
            },
            addresses: [
                // Billing Address
                {
                    address1: data.billing_address1,
                    address2: data.billing_address2,
                    pincode: data.billing_pincode,
                    state_id: data.billing_state,
                    country_id: data.billing_country,
                    city_id: data.billing_city,
                    address_type: "billing"
                },
                // Registered/Corporate Address
                {
                    address1: data.registered_address1,
                    address2: data.registered_address2,
                    pincode: data.registered_pincode,
                    state_id: data.registered_state,
                    country_id: data.registered_country,
                    city_id: data.registered_city,
                    address_type: "corporate"
                }
            ]
        };
        console.log(formData);
        if (isHtmlTagPresent(formData)) {
            customToast.error("Invalid Input!");
            return;
        }
        try {
            let message;
            if (onboardingData?.status == 3) {
                //console.log(modifiedFormData);
                const requestBody = {
                    _id: onboardingData?._id,
                    ...formData,
                }
                let encryptedPayload = {};
                if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                    encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
                }
                const response = await axiosApi.auth.put(API_ENDPOINTS.OrgResubmit, { data: encryptedPayload });
                //dispatch(profileDetail(response.data.data));
                message = "Organization updated successfully.";
                console.log(response);
            } else {
                const requestBody = formData;
                let encryptedPayload = {};
                if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                    encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
                }
                const response = await axiosApi.auth.post(API_ENDPOINTS.OrgOnboard, { data: encryptedPayload });
                message = "Organization created successfully.";
                console.log(response);
            }
            setCompanyOnboardedStatus(true)

            customToast.success(message);
            // router.push(Routes.Dashboard);
        } catch (error) {
            console.error('Error fetching states:', error);
        }finally
        {
            window.scrollTo(0, 0)
        }

    };

    const backToDashboard = () => {
        router.push(Routes.Dashboard);
    }
    const setRequiredDocumentList = (selectedCountry: any) => {
        const selectedCountryData = countryListObject.find((country: any) => country.ID === selectedCountry);

        if (selectedCountryData) {
            const requiredDocuments: RequiredDocument[] = selectedCountryData.RequiredDocuments;
            setRequiredDoc(requiredDocuments)

            if (!COUNTRIES_REQUIRING_PANCARD.includes(selectedCountry)) {
                setValue('pancard', '', { shouldValidate: true });
                setValue('gst_number', '', { shouldValidate: true });
            }else{
                setValue('tax_rate', '', { shouldValidate: true });
                setValue('vat_or_gst_number', '', { shouldValidate: true });
            }
        } else {
            console.error('No country data found for the selected ID');
        }
    };

    const addOtherDocHandler = () => {
        const newDocType: RequiredDocument = {
            Name: `Other Document ${nextId + 1}`,
            Required: false
        };
        setOtherDocs(prevDocs => [...prevDocs, newDocType]);
        setNextId(prevId => prevId + 1);
    };

    const selectedCountryId = watch('billing_country');

    const handleBack = () => {
        router.push(Routes.Dashboard);
    }

    return (
        <AdminLayout>
            <div className="m-6">
                <div className="flex flex-col justify-center mx-auto max-w-screen-sc-2xl p-6 bg-white  rounded-2xl">
                    <div className="flex flex-col gap-6">
                        {!companyOnboardedStatus ? <div className="">
                            {onboardingData?.status === 1 && (<StatusBar
                                message="Congratulations! Your Company Has Been Successfully Registered.Your submission is being reviewed by our team. We'll update you once the review is complete."
                                type="warning" showIcon={false} classess='mx-auto mb-6'/>)} {onboardingData?.status === 3 && (
                            <StatusBar
                                message={`We've reviewed your submission and found some areas that need attention - ${onboardingData?.remark}`}
                                type="danger" classess='mx-auto mb-6'/>)}
                            <form onSubmit={handleSubmit(onSubmit)} noValidate
                                className="flex flex-col items-center gap-6 mx-auto">
                                <div className="flex flex-col sc-sm:flex-row gap-6 w-full">
                                    <div className="flex-grow">
                                        <div className="flex flex-col gap-y-6">
                                            <Section title="Name and Origin" subtitle="Fill in the details">
                                                <div className="flex flex-col sc-xs:flex-row gap-6">
                                                    <Input registration={register('name')} label="Company Name"
                                                        placeholder="Enter Name"
                                                        className='flex flex-col gap-2 w-full'
                                                        inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[46px]'
                                                        error={errors.name?.message}
                                                        readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                        required
                                                        inputBgColor='bg-transparent'
                                                    />
                                                    <div className="flex flex-col gap-2 w-full">
                                                        <SelectField className="flex flex-col gap-2 w-full"
                                                            registration={register('country_id')}
                                                            label="Country of Origin"
                                                            placeholder="Add Country"
                                                            options={countryList}
                                                            dimension="small"
                                                            variant="normal"
                                                            value={watch('country_id')}
                                                            readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                                register('country_id').onChange(e);
                                                                setRequiredDocumentList(e.target.value);
                                                            }}
                                                            error={errors.country_id?.message}
                                                            inputBgColor='bg-transparent'
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </Section>
                                            <hr/>

                                            <Section title="Enter following details" subtitle="Fill in the details">
                                                <Input registration={register('uid')}
                                                    label="Company Registration Number"
                                                    placeholder="Enter your Company Registration Number"
                                                    className='flex flex-col gap-2 w-full'
                                                    inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[46px]'
                                                    error={errors.uid?.message}
                                                    readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                    required
                                                    inputBgColor='bg-transparent'
                                                /> </Section>
                                            <hr/>

                                            <Section title="Corporate Address" subtitle="Fill in the details"
                                                required>
                                                <div className="flex flex-col gap-6">
                                                    <div className="flex flex-col sc-xs:flex-row gap-6">
                                                        <SelectField className="flex flex-col gap-2 w-full"
                                                            registration={register('registered_country')}
                                                            label="Country" placeholder="Add Country"
                                                            options={countryList}
                                                            dimension="small"
                                                            readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                            variant="normal"
                                                            value={watch('registered_country')}
                                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                                register('registered_country').onChange(e);
                                                                handleCountryChange(e.target.value, setRegisteredStateList);
                                                            }} required
                                                            inputBgColor='bg-transparent'
                                                        /> <SelectField className="flex flex-col gap-2 w-full"
                                                        label="State"
                                                        placeholder="Add State"
                                                        registration={register('registered_state')}
                                                        options={registeredStateList}
                                                        readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                        dimension="small"
                                                        variant="normal"
                                                        value={watch('registered_state')}
                                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                            register('registered_state').onChange(e);
                                                            handleStateChange(e.target.value, setRegisteredCityList);
                                                        }}
                                                        inputBgColor='bg-transparent'
                                                        required
                                                    />
                                                    </div>
                                                    <div className="flex flex-col sc-xs:flex-row gap-6">
                                                        <Input label="Address Line 1" placeholder="Address Line 1"
                                                            registration={register('registered_address1')}
                                                            className='flex flex-col gap-2 w-full'
                                                            readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                            error={errors.registered_address1?.message}
                                                            inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[46px]'
                                                            required
                                                            inputBgColor='bg-transparent'
                                                        /> <Input label="Address Line 2" placeholder="Address Line 2"
                                                        registration={register('registered_address2')}
                                                        className='flex flex-col gap-2 w-full'
                                                        readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                        error={errors.registered_address2?.message}
                                                        inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[46px]'
                                                        inputBgColor='bg-transparent'
                                                        required/>
                                                    </div>
                                                    <div className="flex flex-col sc-xs:flex-row gap-6">
                                                        <SelectField className="flex flex-col gap-2 w-full"
                                                            label="City"
                                                            placeholder="Add City"
                                                            registration={register('registered_city')}
                                                            options={registeredCityList}
                                                            dimension="small"
                                                            readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                            variant="normal"
                                                            value={watch('registered_city')}
                                                            error={errors.registered_city?.message}
                                                            required
                                                            inputBgColor='bg-transparent'
                                                        /> <Input label="Pincode" placeholder="Add Pincode"
                                                        className='flex flex-col gap-2 w-full'
                                                        registration={register('registered_pincode')}
                                                        readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                        error={errors.registered_pincode?.message}
                                                        inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[46px]'
                                                        inputBgColor='bg-transparent'
                                                        required/>
                                                    </div>
                                                </div>
                                            </Section>

                                            <Section title="Billing Address" subtitle="Fill in the details" showCheckbox={!onboardingData?.status} watch={watch} setValue={setValue} setBillingStateList={setBillingStateList} setBillingCityList={setBillingCityList}>

                                                <div className="flex flex-col gap-6">
                                                    <div className="flex flex-col sc-xs:flex-row gap-6">
                                                        <SelectField className="flex flex-col gap-2 w-full"
                                                            registration={register('billing_country')}
                                                            label="Country"
                                                            placeholder="Add Country"
                                                            readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                            options={countryList}
                                                            dimension="small"
                                                            variant="normal"
                                                            value={watch('billing_country')}
                                                            error={errors.billing_country?.message}
                                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                                register('billing_country').onChange(e);
                                                                handleCountryChange(e.target.value, setBillingStateList);
                                                            }}
                                                            inputBgColor='bg-transparent'
                                                            required
                                                        /> <SelectField className="flex flex-col gap-2 w-full"
                                                        registration={register('billing_state')}
                                                        label="State"
                                                        placeholder="Add State"
                                                        options={billingStateList}
                                                        value={watch('billing_state')}
                                                        dimension="small"
                                                        variant="normal"
                                                        readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                        error={errors.billing_state?.message}
                                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                            register('billing_state').onChange(e);
                                                            handleStateChange(e.target.value, setBillingCityList);
                                                        }}
                                                        inputBgColor='bg-transparent'
                                                        required
                                                    />
                                                    </div>
                                                    <div className="flex flex-col sc-xs:flex-row gap-6">
                                                        <Input
                                                            registration={register('billing_address1')}
                                                            label="Address Line 1"
                                                            readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                            placeholder="Address Line 1"
                                                            className='flex flex-col gap-2 w-full'
                                                            inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[46px]'
                                                            error={errors.billing_address1?.message}
                                                            inputBgColor='bg-transparent'
                                                            required
                                                        /> <Input
                                                        registration={register('billing_address2')}
                                                        label="Address Line 2"
                                                        placeholder="Address Line 2"
                                                        readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                        className='flex flex-col gap-2 w-full'
                                                        inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[46px]'
                                                        inputBgColor='bg-transparent'
                                                        required
                                                    />
                                                    </div>
                                                    <div className="flex flex-col sc-xs:flex-row gap-6">
                                                        <SelectField
                                                            className="flex flex-col gap-2 w-full bg-transparent"
                                                            label="City"
                                                            placeholder="Add City"
                                                            registration={register('billing_city')}
                                                            options={billingCityList}
                                                            value={watch('billing_city')}
                                                            dimension="small"
                                                            readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                            inputBgColor='bg-transparent'
                                                            variant="normal"
                                                            required
                                                        /> <Input
                                                        registration={register('billing_pincode')}
                                                        label="Pincode"
                                                        placeholder="Add Pincode"
                                                        readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                        className='flex flex-col gap-2 w-full'
                                                        inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[46px]'
                                                        error={errors.billing_pincode?.message}
                                                        inputBgColor='bg-transparent'
                                                        required
                                                    />
                                                    </div>
                                                </div>
                                            </Section>

                                            {COUNTRIES_REQUIRING_PANCARD.includes(selectedCountryId ?? '') && (
                                                <div className="flex flex-col gap-6">
                                                    <div className="flex flex-col sc-xs:flex-row sc-xs:justify-between auth justify-start border-b border-neutral-200 py-4 pr-6">
                                                        <div className="flex flex-col gap-y-2">
                                                            <p className="text-xl font-light text-neutral-1400">
                                                                Business Details <span className="text-negativeBold">*</span>
                                                            </p>
                                                            <p className="text-sm text-neutral-1200">Fill in the details</p>
                                                        </div>
                                                        <Checkbox
                                                            type="checkbox"
                                                            {...register('lut')}
                                                            disabled={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                            label="LUT (Letter Of Undertaking) Available"
                                                            required
                                                        />
                                                    </div>
                                                    <Input label="PAN Number" placeholder="Add PAN number"
                                                        className='flex flex-col gap-2 w-full'
                                                        registration={register('pancard')}
                                                        error={errors.pancard?.message}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            const value = e.target.value.toUpperCase();
                                                            setValue('pancard', value);
                                                        }}
                                                        readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                        inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[46px]'
                                                        inputBgColor='bg-transparent'
                                                        required/> <Input
                                                    label="GST Number"
                                                    placeholder="Enter GST number"
                                                    className="flex flex-col gap-2 w-full"
                                                    registration={register('gst_number')}
                                                    error={errors.gst_number?.message}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        const value = e.target.value.toUpperCase();
                                                        setValue('gst_number', value);
                                                    }}
                                                    readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                    inputClassName="w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[46px]"
                                                    inputBgColor="bg-transparent"
                                                    required
                                                /></div>)}

                                            {!COUNTRIES_REQUIRING_PANCARD.includes(selectedCountryId ?? '') && (
                                                <Section title="Business Details" subtitle="Fill in the details" required>
                                                    <Input label="Tax Rate (%)" placeholder="Add Tax Rate"
                                                        className='flex flex-col gap-2 w-full'
                                                        registration={register('tax_rate')}
                                                        error={errors.tax_rate?.message}
                                                        readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                        inputClassName='w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[46px]'
                                                        inputBgColor='bg-transparent'
                                                        required/>
                                                    <Input
                                                        label="GST/Vat Number"
                                                        placeholder="Enter GST/Vat number"
                                                        className="flex flex-col gap-2 w-full"
                                                        registration={register('vat_or_gst_number')}
                                                        error={errors.vat_or_gst_number?.message}
                                                        readOnly={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                        inputClassName="w-full text-sm text-[#363636] outline-none placeholder-[#bbb] h-[46px]"
                                                        inputBgColor="bg-transparent"
                                                        required
                                                    />
                                                </Section>
                                            )}
                                            <hr className="w-full border-t border-neutral-200"/>
                                        </div>
                                    </div>

                                    <div className="min-h-full border-[.5px] hidden sc-sm:block border-neutral-200"/>

                                    <div className="">
                                        <Section title="List of documents" subtitle="Upload and attach documents of the company.">
                                            <div className="flex flex-col gap-4">
                                                {requiredDoc.map((doc: any) => {
                                                    const existingDoc = requiredDocuments.find(d => d.type === doc.Name);
                                                    return (<DocumentManager
                                                        key={doc.Name}
                                                        required
                                                        docType={doc.Name}
                                                        existingDocument={existingDoc}
                                                        folder={'company-documents'}
                                                        extAllowed={['.pdf', '.doc', '.docx', '.jpg', '.png', '.jpeg']}
                                                        removable={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                        onDocumentUpdate={(updatedDoc: DocumentData) => {
                                                            if (updatedDoc.status === 'deleted') {
                                                                setRequiredDocuments(prev => prev.filter(doc => doc.type !== updatedDoc.type));
                                                            } else {
                                                                setRequiredDocuments(prev => {
                                                                    const filtered = prev.filter(d => d.type !== updatedDoc.type);
                                                                    return [...filtered, updatedDoc];
                                                                });
                                                            }
                                                        }}
                                                    />);
                                                })}
                                            </div>
                                        </Section>

                                        <Section title="Other documents"
                                            subtitle="Upload and attach documents of the company.">
                                            {![1, 2].includes(onboardingData?.status) && (<div id="add-other-doc"
                                                className='bg-neutral-300 px-l cursor-pointer py-m flex flex-col items-center justify-center rounded-lg border-2 border-dashed'
                                                onClick={addOtherDocHandler}>
                                                <div
                                                    className='flex justify-center bg-[#FBFBFB] w-4xl h-4xl items-center rounded-full'>
                                                    <div
                                                        className='flex justify-center bg-[#F2F2F2] w-3xl h-3xl items-center rounded-full'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                                            height="16"
                                                            viewBox="0 0 16 16" fill="none">
                                                            <path
                                                                d="M3 9L3.705 9.705L7.5 5.915V15H8.5V5.915L12.295 9.705L13 9L8 4L3 9Z"
                                                                fill="#1A1A1A"/>
                                                            <path
                                                                d="M3 4V2H13V4H14V2C14 1.73478 13.8946 1.48043 13.7071 1.29289C13.5196 1.10536 13.2652 1 13 1H3C2.73478 1 2.48043 1.10536 2.29289 1.29289C2.10536 1.48043 2 1.73478 2 2V4H3Z"
                                                                fill="#1A1A1A"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div
                                                    className=' font-semibold text-tertiary text-m font-inter mt-l'>Click to upload and attach documents
                                                </div>
                                                <div
                                                    className='text-neutral-1000 font-extralight text-m font-inter'>PDF, DOC, jpeg, png (max. 13mb)
                                                </div>
                                            </div>)}
                                            <div className='flex flex-col gap-l'>
                                                {otherDocs.map((doc: any, index: number) => {
                                                    const existingDoc = otherDocuments.find(d => d.type === doc.Name);
                                                    return (<DocumentManager
                                                        key={doc.Name}
                                                        required={false}
                                                        docType={doc.Name}
                                                        existingDocument={existingDoc}
                                                        removable={onboardingData?.status !== undefined && onboardingData?.status !== 3}
                                                        folder={'company-documents'}
                                                        extAllowed={['.pdf', '.doc', '.docx', '.jpg', '.png', '.jpeg']}
                                                        onDocumentUpdate={(updatedDoc: DocumentData) => {
                                                            if (updatedDoc.status === 'deleted') {
                                                                // Remove from both arrays when a document is deleted
                                                                setOtherDocuments(prev => prev.filter(d => d.type !== updatedDoc.type));
                                                                /*setOtherDocs(prev =>
																 prev.filter(d => d.Name !== updatedDoc.type)
																 );*/
                                                            } else {
                                                                // Update the document while maintaining the arrays in sync
                                                                setOtherDocuments(prev => {
                                                                    const filtered = prev.filter(d => d.type !== updatedDoc.type);
                                                                    return [...filtered, updatedDoc];
                                                                });
                                                            }
                                                        }}
                                                    />)
                                                })}
                                            </div>
                                        </Section>
                                    </div>
                                </div>

                                <div className="flex gap-4 mb-xl">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-6 py-4 rounded-lg bg-[#808080] text-white text-sm">
                                        Back
                                    </button>
                                    {!(onboardingData?.status !== undefined && onboardingData?.status !== 3) && (
                                        <button type="submit"
                                            className="px-6 py-4 rounded-lg bg-brand1-500 text-white text-sm">
                                            Submit
                                        </button>)}
                                </div>
                            </form>
                        </div> : <div className='text-neutral-1400 pt-xl pb-xl bg-white'>
                            <div className='flex flex-col items-center  h-[400px] px-6 gap-6'>
                                <div className=' text-f-5xl font-bold text-brand1-500'>
                                    Congratulations!
                                </div>
                                <div className='text-f-2xl text-center'>
                                    Thank You for Partnering with Us!
                                </div>
                                <div className='text-f-xl text-neutral-800 text-center'>
                                    We’re excited to have you onboard. Together, we can build something great while making a positive impact.
                                </div>
                                <button
                                    className='bg-brand1-500 mt-5xl py-l px-xl text-f-xl font-semibold text-white rounded-lg'
                                    onClick={backToDashboard}>Home
                                </button>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </AdminLayout>);
};

export default CompanyRegistrationForm;
