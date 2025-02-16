'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AdminLayout from "@/components/layouts/admin";
import Sidebar from "@/app/profile/components/sidebar";
import { sidebarMenuItems } from "@/app/profile/components/menuItems";
import { DocumentData } from "@/app/company-onboarding/page";
import axiosApi from "@/utils/axios-api";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import { ProfileHeader } from "@/app/profile/components/ProfileHeader";
import DocumentManager from "@/app/company-onboarding/components/documentManager";
import toCapitalizedCase from '@/utils/capitalized-case';
import { ButtonCentered, Email, LocationCompany } from "@carbon/icons-react";

// Component interfaces
interface KYCIconsType {
	Card: React.FC;
	Email: React.FC;
	Address: React.FC
}

interface InfoItemProps {
	icon: React.FC,
	label: string,
	value: string | string[],
	classes?: string
}

// Icons components
const KYCIcons: KYCIconsType = {
	Card: () => (
		<ButtonCentered className="h-4 w-4 text-primary" />
	),
	Email: () => (
		<Email className="h-4 w-4 text-primary" />
	),
	Address: () => (
		<LocationCompany className="h-4 w-4 text-primary" />
	)
};


// Reusable components
const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value, classes }: any) => {
	const valueArray = Array.isArray(value) ? value : [value];

	return (
		<div className={`flex flex-col justify-start items-start self-stretch gap-1 ${classes}`}>
			<div className="flex justify-start items-center self-stretch gap-2">
				<div className="flex justify-start items-center self-stretch relative gap-2">
					<div className="flex justify-center items-center w-8 h-8 relative gap-2.5 py-px rounded-full border border-gray-200">
						<Icon />
					</div>
					<p className="text-f-m font-semibold text-gray-900">
						{label}
					</p>
				</div>
			</div>
			<div className="flex flex-col justify-start items-start self-stretch gap-1 pl-10">
				{/* {valueArray.map((line, index) => ( */}
				<div className="text-f-m text-gray-600 py-1">
					{label.includes('Address') ? toCapitalizedCase(valueArray.filter(Boolean).join(', ')) : valueArray.filter(Boolean).join(', ')}
				</div>
				{/* ))} */}
			</div>
		</div>
	);
};

const StatusIndicator = ({ status }: any) => {
	const getStatusConfig = (statusCode: any) => {
		switch (statusCode) {
			case 1:
				return {
					text: "Pending",
					colorClass: "bg-btnWarning",
					textColorClass: "text-notice"
				};
			case 2:
				return {
					text: "Approved",
					colorClass: "bg-btnSuccess",
					textColorClass: "text-neutral-1400"
				};
			case 3:
				return {
					text: "Rejected",
					colorClass: "bg-btnDanger",
					textColorClass: "text-neutral-1400"
				};
			default:
				return {
					text: "Unknown",
					colorClass: "text-gray-600",
					textColorClass: "text-white"
				};
		}
	};

	const { text, colorClass, textColorClass } = getStatusConfig(status);

	return (
		<div className={`flex justify-center items-center gap-1 px-3 py-2 rounded  ${colorClass}`}>
			<p className={` text-[10px] font-semibold ${textColorClass}`}>{text}</p>
		</div>
	);
};

const Profile: React.FC = () => {
	const [requiredDocuments, setRequiredDocuments] = useState<DocumentData[]>([]);
	const [otherDocuments, setOtherDocuments] = useState<DocumentData[]>([]);
	const [me, setMe] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
			try {

				const response = await axiosApi.auth.get(API_ENDPOINTS.ME);
				const orgData = response?.data?.data?.organization;

				setMe(response)
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

					const transformedOtherDocs = orgData.other_documents.map((doc: any) => ({
						id: Math.random().toString(36).substring(2, 15),
						type: doc.type,
						name: doc.name,
						path: doc.path,
						status: doc.status || 0
					}));
					setOtherDocuments(transformedOtherDocs);

				}
			} catch (error) {
				console.error('Error fetching project details:', error);
			}
		};

		fetchData();
	}, []);

	return (
		<AdminLayout>
			<div className="flex flex-col w-full justify-center mx-auto max-w-screen-sc-2xl">
				<div className="flex flex-col sc-sm:flex-row gap-6 p-6">
					<Sidebar menuItems={sidebarMenuItems} />
					<div className="flex flex-col gap-6 w-full">
						<ProfileHeader title='KYC' />
						<div className="flex flex-col sc-md:flex-row gap-6 h-full">
							<div className="flex flex-col flex-grow w-full ">
								<Card className="flex flex-col rounded-2xl bg-white shadow-[0px_1.5px_23px_3px_rgba(0,0,0,0.08)] flex-grow">
									<div className="px-6 py-4 border-b border-[#e6e6e6]">
										<div className="flex justify-between items-center">
											<h2 className="text-f-3xl font-light">KYC Details</h2>
											<StatusIndicator status={me?.data?.data?.organization?.status} />
										</div>
									</div>
									<div className="px-6 ">
										<div className="grid grid-cols-1 divide-y">
											<InfoItem icon={KYCIcons.Card} label="Company Name" value={me?.data?.data?.organization?.name} classes="py-4 " />
											<InfoItem icon={KYCIcons.Card} label="Company Registration Number" value={me?.data?.data?.organization?.company_number} classes="py-4 " />
											<InfoItem icon={KYCIcons.Email} label="Email" value={me?.data?.data?.email} classes="py-4 " /> {me?.data?.data?.organization?.addresses.map((address: any, index: any) => (
												<InfoItem key={index} icon={KYCIcons.Address}
													label={`${address.address_type.charAt(0).toUpperCase() + address.address_type.slice(1)} Address`}
													value={[
														address.address1 || '',
														address.address2 || '',
														address.city_name || '',
														address.country_name || '',
														address.pincode || ''
													]} classes="py-4 " />
											))}
											{ }
											{me?.data?.data?.organization?.pancard && <InfoItem icon={KYCIcons.Card} label="PAN Number" value={me?.data?.data?.organization?.pancard} classes="py-4 " />}
											{me?.data?.data?.organization?.gst_number && <InfoItem icon={KYCIcons.Card} label="GST Number" value={me?.data?.data?.organization?.gst_number} classes="py-4 " />}
										</div>
									</div>
								</Card>
							</div>
							<div className="flex flex-col flex-shrink-0 ">
								<Card className="flex flex-col rounded-2xl bg-white shadow-[0px_1.5px_23px_3px_rgba(0,0,0,0.08)]">
									<div className="px-6 py-4 border-b border-[#e6e6e6]">
										<h2 className="text-f-3xl font-light">Documents</h2>
									</div>
									<CardContent className="flex flex-col gap-3">
										{requiredDocuments.map((doc: any, index: number) => {
											return (
												<DocumentManager
													key={doc.Name}
													required
													docType={doc.Name}
													existingDocument={doc}
													folder={'company-documents'}
													removable={true}
													onDocumentUpdate={() => {
													}}
												/>
											);
										})}
										{otherDocuments.map((doc: any, index: number) => {
											return (
												<DocumentManager
													key={doc.Name}
													required
													docType={doc.Name}
													existingDocument={doc}
													folder={'company-documents'}
													removable={true}
													onDocumentUpdate={() => {
													}}
												/>
											);
										})}
									</CardContent> </Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
};

export default Profile;