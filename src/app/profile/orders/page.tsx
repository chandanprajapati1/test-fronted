'use client';
import { sidebarMenuItems } from "@/app/profile/components/menuItems";
import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/layouts/admin";
import { ShoppingCart, Store } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api-endpoint";
import axiosApi from "@/utils/axios-api";
import Sidebar from "@/app/profile/components/sidebar";
import OrderViewPopup from "@/components/profile/OrderViewPopup";
import { ProfileHeader } from "../components/ProfileHeader";
import { View } from "@carbon/icons-react";
import {formatNumber} from "@/utils/number-utils";

// API Types
interface APIVintage {
	total_credits: number;
	total_price: number;
	vintage_id: string;
}

interface APIProject {
	_id: string;
	batch_id: string;
	buyer_id: string;
	buyer_invoice: string;
	cart_id: string;
	certificate_name: string;
	created_at: string;
	no_of_credits: number;
	order_id: string;
	platform_fees: number;
	platform_fees_tax: number;
	project_id: string;
	project_name: string;
	seller_id: string;
	seller_invoice: string;
	status: number;
	total_discount: number;
	total_price_inclusive: number;
	total_tax: number;
	updated_at: string;
	vintages: APIVintage[];
}

interface APIResponse {
	data: {
		limit: number; page: number; total: number; pages: number; order_list: APIProject[] | null;
	};
	message: string;
}

// Application Types
export interface OrderStats {
	completed: number;
	inProgress: number;
	totalCredits: number;
}

export type OrderStatus = 'Completed' | 'Order Created' | 'Payment Done' | 'Failed';

interface Order extends Omit<APIProject, 'status'> {
	status: OrderStatus;
}

// Helper Functions
const mapAPIStatusToOrderStatus = (status: number): OrderStatus => {
	switch (status) {
		case 3:  // Based on your API response
			return 'Completed';
		case 1 || 2:
			return 'Order Created';
		case 2:
			return 'Payment Done';
		default:
			return 'Failed';
	}
};

// Components
interface StatsCardProps {
	label: string;
	value: number | React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value }) => (
	<div className="flex flex-col justify-start items-start flex-grow">
		<div className="flex flex-col w-full rounded-2xl bg-white border border-[#f5f2f2] shadow-[0px_1.5px_23px_3px_rgba(0,0,0,0.08)]">
			<div className="flex flex-col h-[100px] p-4">
				<div className="flex flex-col gap-1.5">
					<p className="opacity-70 text-base text-neutral-1200">{label}</p>
					<p className="text-xl font-semibold text-neutral-1400">{value}</p>
				</div>
			</div>
		</div>
	</div>);

interface RoleToggleProps {
	activeRole: 'buyer' | 'seller';
	onRoleChange: (role: 'buyer' | 'seller') => void;
}

const RoleToggle: React.FC<RoleToggleProps> = ({ activeRole, onRoleChange }) => (<div className="flex flex-wrap sc-sm:flex-row gap-3">
	<button
		onClick={() => onRoleChange('buyer')}
		className={`flex flex-1 justify-center items-center px-8 py-3 gap-2.5 cursor-pointer transition-all ${activeRole === 'buyer' ? 'border-b-[3px] border-primary shadow-lg bg-primary/5' : 'hover:bg-neutral-50'} text-xl ${activeRole === 'buyer' ? 'text-primary font-light' : 'text-neutral-600'}`}
	>
		<ShoppingCart className={`w-6 h-6 ${activeRole === 'buyer' ? 'text-primary' : 'text-neutral-600'}`} />
		Buyer
	</button>
	<button
		onClick={() => onRoleChange('seller')}
		className={`flex flex-1 justify-center items-center px-8 py-3 gap-2.5 cursor-pointer transition-all ${activeRole === 'seller' ? 'border-b-[3px] border-primary shadow-lg bg-primary/5' : 'hover:bg-neutral-50'} text-xl ${activeRole === 'seller' ? 'text-primary font-light' : 'text-neutral-600'}`}
	>
		<Store className={`w-6 h-6 ${activeRole === 'seller' ? 'text-primary' : 'text-neutral-600'}`} />
		Seller
	</button>
</div>);

interface TabsFilterProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
	tabs: Array<{ id: string; label: string }>;
}

const TabsFilter: React.FC<TabsFilterProps> = ({ activeTab, onTabChange, tabs }) => (
	<div className="flex gap-0.5 border-b border-[#e6e6e6] w-full">
		{tabs.map(tab => (<button
			key={tab.id}
			onClick={() => onTabChange(tab.id)}
			className={`px-4 py-2 transition-all cursor-pointer
                    ${activeTab === tab.id ? 'border-b-[1.5px] border-secondary bg-secondary/5' : 'hover:bg-neutral-50'}`}
		>
			<p className={`text-sm ${activeTab === tab.id ? 'font-semibold text-neutral-1400' : 'text-neutral-1200'}`}>
				{tab.label}
			</p>
		</button>))}
	</div>);


const TABS = [{ id: 'all', label: 'All' }, { id: 'in_progress', label: 'In Progress' }, {
	id: 'completed', label: 'Completed'
}, { id: 'failed', label: 'Failed' }];

const OrdersPage: React.FC = () => {
	// const [mounted, setMounted] = useState(false);
	const [activeRole, setActiveRole] = useState<'buyer' | 'seller'>('buyer');
	const [activeTab, setActiveTab] = useState('all');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [orders, setOrders] = useState<Order[]>([]);
	const [stats, setStats] = useState<OrderStats>({
		completed: 0, inProgress: 0, totalCredits: 0
	});
	const [orderDetails, setOrderDetails] = useState(null);
	const [activeViewDetails, setActiveViewDetails] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);

	const nextHandler = () => {
		if (currentPage < totalPage) {
			setCurrentPage(prev => prev + 1)
		}
	}

	const previousHandler = () => {
		if (currentPage > 1) {
			setCurrentPage(prev => prev - 1)
		}
	}

	const handleRoleChange = (role: 'buyer' | 'seller') => {
		setActiveRole(role);
	}


	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const endpoint = activeRole === 'buyer' ? API_ENDPOINTS.BuyerStats : API_ENDPOINTS.SellerStats;

				const response = await axiosApi.project.get(endpoint);

				console.log("orderStatus", response.data.data)
				if (!response) {
					throw new Error('No data found');
				}
				setStats({
					completed: response.data.data.stats.complete_orders,
					inProgress: response.data.data.stats.in_progress_orders,
					totalCredits: response.data.data.stats.total_credits
				})

			} catch (error) {
				console.error(`Error fetching ${activeRole} orders:`, error);

				let errorMessage = 'Failed to load orders. Please try again later.';
				if (error instanceof Error) {
					errorMessage = error.message;
				}
			}
		};

		fetchOrders();
	}, [activeRole])

	useEffect(() => {
		const fetchOrders = async () => {
			setLoading(true);
			setError(null);
			const state: number = activeTab === "all" ? 1 : activeTab === "in_progress" ? 2 : activeTab === "completed" ? 3 : 4;

			try {
				const endpoint = activeRole === 'buyer' ? API_ENDPOINTS.BuyerOrderList(state, currentPage) : API_ENDPOINTS.SellerOrderList(state, currentPage);

				const response = await axiosApi.project.get<APIResponse>(endpoint);

				if (!response?.data?.data?.order_list) {
					throw new Error('No data found');
				}

				const projectList = response.data.data.order_list;
				setTotalPage(response.data.data.pages);

				const transformedOrders: Order[] = projectList.map((project: APIProject) => ({
					...project,
					status: mapAPIStatusToOrderStatus(project.status),
					no_of_credits: project.no_of_credits || 0,
					total_price_inclusive: project.total_price_inclusive || 0
				}));

				console.log('transformedOrders', transformedOrders);
				setOrders(transformedOrders);
			} catch (error) {
				console.error(`Error fetching ${activeRole} orders:`, error);

				let errorMessage = 'Failed to load orders. Please try again later.';
				if (error instanceof Error) {
					errorMessage = error.message;
				}

				setError(errorMessage);
				setOrders([]);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [activeTab, currentPage, activeRole]);


	const handleTabChange = useCallback((tab: string) => {
		setActiveTab(tab);
		setCurrentPage(1);
		setTotalPage(1);
	}, []);

	// useEffect(() => {
	//     setMounted(true);
	// }, []);

	// useEffect(() => {
	//     if (mounted) {
	//         handleRoleChange(activeRole);
	//     }
	// }, [mounted, handleRoleChange, activeRole]);

	// if (!mounted) return null;


	const viewDetailsHandler = (details: any) => {
		setOrderDetails(details);
		setActiveViewDetails(true)
	}

	return (<AdminLayout>
		<div className="flex flex-col w-full justify-center px-l overflow-x-hidden mx-auto max-w-screen-sc-2xl ">
			{orderDetails != null &&
				<OrderViewPopup setIsOpen={setActiveViewDetails} isOpen={activeViewDetails} details={orderDetails} role={activeRole} />}
			<div className="sc-sm:flex-row flex flex-col gap-3 ">
				<Sidebar menuItems={sidebarMenuItems} />
				<div className="flex-1 min-w-0 gap-x-6">
					<div className="flex flex-col gap-6 flex-1">
						<div className="flex flex-col sc-sm:flex-row justify-between">
							<ProfileHeader title='Orders' />
							<RoleToggle
								activeRole={activeRole}
								onRoleChange={handleRoleChange}
							/>
						</div>

						<div className="flex flex-wrap gap-6">
							<StatsCard label="Total Completed Orders" value={stats.completed} />
							<StatsCard label="Total In Progress Orders" value={stats.inProgress} />
							<StatsCard label={`Total Credit ${activeRole == "buyer" ? "Holdings" : "Sold"} (tCO₂e)`} value={
								<div className="flex items-center gap-3">
									<span>{stats.totalCredits}</span> {/* <Info className="w-4 h-4 text-neutral-600" /> */}
								</div>}
							/>
						</div>

						<div className="flex flex-col bg-white rounded-2xl shadow-lg ">
							<div className="flex justify-between items-center px-6 py-4 border-b border-neutral-200">
								<h3 className="text-f-3xl font-light text-neutral-900">Orders</h3>
							</div>

							<div className="flex flex-col p-6 gap-3">
								<TabsFilter
									activeTab={activeTab}
									onTabChange={handleTabChange}
									tabs={TABS}
								/>
								<div className="overflow-x-auto ">
									<table className="w-full border-collapse">
										<thead className="text-sm font-semibold text-neutral-1400">
											<tr className="bg-[#f3f3f3] border-b border-[#d9d9d9]">
												<th className="px-4 py-3 text-left whitespace-nowrap ">Order ID</th>
												<th className="px-4 py-3 text-left whitespace-nowrap ">Project Name</th>
												<th className="px-4 py-3 text-left whitespace-nowrap ">Invoice Id</th>
												<th className="px-4 py-3 text-right whitespace-nowrap ">Credits (tCO₂e)</th>
												<th className="px-4 py-3 text-right whitespace-nowrap ">Amount ($)</th>
												<th className="px-4 py-3 text-center">Status</th>
												<th className="px-4 py-3 text-action">Action</th>
											</tr>
										</thead>
										<tbody>
											{loading ? (<tr>
												<td colSpan={7} className="px-4 py-8 text-neutral-600">
													Loading...
												</td>
											</tr>) : (<>
												{orders.length > 0 ? orders.map((order: any, index: number) => (<tr
													key={order._id}
													className={`border-b border-[#d9d9d9] ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}
												>
													<td className="px-4 py-s text-sm text-neutral-700">{order.order_id}</td>
													<td className="px-4 py-s text-sm text-neutral-700 whitespace-nowrap">{order.project_name.length > 15 ? order.project_name.slice(0, 15) + ".." : order.project_name}</td>
													<td className="px-4 py-s text-sm text-neutral-700">{activeRole == "buyer" ? order.buyer_invoice : order.seller_invoice}</td>
													<td className="px-4 py-s text-sm text-neutral-700 text-right">{formatNumber(order.no_of_credits, 3)}</td>
													<td className="px-4 py-s text-sm text-neutral-700 text-right">{formatNumber(order.total_price_inclusive, 2)}</td>
													<td className="px-4 py-3 text-center">
														<button
															className={`inline-flex whitespace-nowrap items-center gap-1 px-3 py-2 rounded ${order.status === 'Order Created' ? 'bg-btnWarning' :
																order.status === 'Completed' ? 'bg-btnSuccess' :
																	order.status === 'Failed' ? 'bg-red-400' :
																		order.status === 'Payment Done' ? 'bg-btnSuccess' : ''
																}`}>
															<p className={`text-xs font-semibold ${order.status === 'Order Created' ? 'text-notice' : order.status === 'Failed' ? 'text-red-950' : 'text-neutral-1400'
																}`}>{order.status}</p>
														</button>
													</td>
													<td className="text-center py-s px-4">
														<button
															className="text-f-xs "
															onClick={() => {
																viewDetailsHandler(order)
															}}><View className="w-4 h-4 text-neutral-1200" />
														</button>
													</td>
												</tr>)) : <tr className="px-4 py-8 text-gray-500">
													<td colSpan={7}>No Record Found</td>
												</tr>}

											</>

											)}
										</tbody>
									</table>
								</div>
								{totalPage > 1 && <div className="flex pt-xl justify-end gap-m items-center">
									<button className={`${currentPage > 1 ? "text-brand1-500" : "text-gray-400"}`}
										onClick={previousHandler}>
										Prev
									</button>
									<div className="bg-brand1-500 px-m text-white rounded-md">
										{currentPage}
									</div>
									<button
										className={`${currentPage < totalPage ? "text-brand1-500" : "text-gray-400"}`}
										onClick={nextHandler}>
										Next
									</button>
								</div>}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</AdminLayout>);
};

export default OrdersPage;