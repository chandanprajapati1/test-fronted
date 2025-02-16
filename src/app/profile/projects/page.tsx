'use client'
import {customToast} from "@/components/ui/customToast";
import Sidebar from "@/app/profile/components/sidebar";
import {sidebarMenuItems} from "@/app/profile/components/menuItems";
import React, {useEffect, useState} from "react";
import AdminLayout from "@/components/layouts/admin";
import {API_ENDPOINTS} from "@/config/api-endpoint";
import axiosApi from "@/utils/axios-api";
import Link from "next/link";
import {useDispatch} from "react-redux";
import {currentStatusHandler, currentTabHandler} from "@/app/store/slices/projectOnboardingSlice";
import {useRouter} from "next/navigation";
import toCapitalizedCase from "@/utils/capitalized-case";
import {ProfileHeader} from "../components/ProfileHeader";
import {Add, Edit, Partnership} from "@carbon/icons-react";
import {formatNumber} from "@/utils/number-utils";
import {Routes} from "@/config/routes";

interface Tab {
    id: string;
    label: string;
}

const TABS: Tab[] = [
    {id: 'all', label: 'All'},
    {id: 'listed', label: 'Listed'},
    {id: 'not-listed', label: 'Not Listed'},
    {id: 'in-progress', label: 'In Progress'}
];


const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const dispatch = useDispatch();
    const router = useRouter()

    useEffect(() => {
        const fetchProjects = async () => {
            const state: number = activeTab === "all" ? 1 : activeTab === "listed" ? 2 : activeTab === "not-listed" ? 3 : 4
            try {
                const response = await axiosApi.project.get(API_ENDPOINTS.ProjectList(state, currentPage));
                console.log('Projects response:', response);
                setProjects(response.data.data.project_list);
                setTotalPage(response.data.data.pages)
                setLoading(false);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setLoading(false);
                customToast.error('Failed to fetch projects');
            }
        };

        fetchProjects();
    }, [activeTab, currentPage]);

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

    const filteredProjects = projects?.filter((project: any) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'listed') return project.status === 'reviewed';
        if (activeTab === 'not-listed') return project.status !== 'reviewed';
        if (activeTab === 'in-progress') return project.status === 'under_review';
        return true;
    });

    const addProjectHandler = () => {
        dispatch(currentTabHandler('details'));
        dispatch(currentStatusHandler(0));
        router.push("/project-onboarding")
    }
    return (
        <AdminLayout>
            <div
                className="flex flex-col w-full justify-center px-l overflow-x-hidden mx-auto max-w-screen-sc-2xl py-xl ">
                <div className="sc-sm:flex-row flex flex-col gap-3 ">
                    <Sidebar menuItems={sidebarMenuItems}/>
                    <div className="flex-1 min-w-0 gap-x-6">
                        <div className="flex flex-col gap-3">
                            <ProfileHeader title='Projects'/>
                            <div className="flex flex-col rounded-2xl bg-white shadow-lg">
                                <div className="flex justify-between items-center px-6 py-4 border-b border-[#e6e6e6]">
                                    <p className="flex-grow text-f-3xl font-light text-neutral-1400">Projects</p>
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            className="inline-flex whitespace-nowrap items-center gap-2 px-3 py-2 text-sm rounded-lg border border-primary hover:bg-primary/10 transition-colors"
                                            onClick={addProjectHandler}
                                        >
                                            <Add className="w-4 h-4" />
                                            Project
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col p-6 gap-3">
                                    {/* Tabs */}
                                    <div className="flex gap-0.5 border-b border-[#e6e6e6] w-full">
                                        {TABS.map(tab => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`whitespace-nowrap px-4 py-2 transition-all ${activeTab === tab.id
                                                    ? 'border-b-[1.5px] border-[#38a3a5]'
                                                    : 'hover:bg-neutral-50'
                                                }`}
                                            >
                                                <p className={`text-sm ${activeTab === tab.id
                                                    ? 'font-semibold text-neutral-1400'
                                                    : 'text-neutral-1200'
                                                }`}>
                                                    {tab.label}
                                                </p>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                            <tr className="bg-[#f3f3f3] border-b border-[#d9d9d9] text-sm font-semibold text-neutral-1400">
                                                <th className="px-4 py-3 text-left whitespace-nowrap">Project Name</th>
                                                <th className="px-4 py-3 text-left whitespace-nowrap">Project ID</th>
                                                <th className="px-4 py-3 text-left whitespace-nowrap">Project URL</th>
                                                <th className="px-4 py-3 text-left whitespace-nowrap">Registry</th>
                                                <th className="px-4 py-3 text-right whitespace-nowrap">Credits Available (tCO₂e)</th>
                                                <th className="px-4 py-3 text-center">Status</th>
                                                <th className="px-4 py-3 text-center  whitespace-nowrap">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td colSpan={7}
                                                        className="px-4 py-8 text-center text-neutral-600">
                                                        Loading...
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredProjects?.length > 0 ? filteredProjects?.map((project: any, index: number) => (
                                                        <tr
                                                            key={project._id}
                                                            className={`border-b border-[#d9d9d9] ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'
                                                            }`}
                                                        >
                                                            <td className="px-4 py-3 text-sm text-neutral-700 whitespace-nowrap">{toCapitalizedCase(project?.name)}</td>
                                                            <td className="px-4 py-3 text-sm text-neutral-700 whitespace-nowrap">{project?.project_id}</td>
                                                            <td className="px-4 py-3 text-sm text-neutral-700 whitespace-nowrap">{project?.project_url}</td>
                                                            <td className="px-4 py-3 text-sm text-neutral-700 whitespace-nowrap">{project.registry_details.name}</td>
                                                            <td className="px-4 py-3 text-sm text-right text-neutral-700">{project.total_credit ? formatNumber(project.total_credit, 3) : '-'}</td>
                                                            <td className="px-4 py-3">
                                                                <div
                                                                    className={`inline-flex whitespace-nowrap items-center gap-1 px-3 py-2 rounded  ${project?.status == "under_review" ? "bg-btnWarning" : "bg-btnSuccess"}`}>
                                                                    <p className={`text-f-xs font-semibold ${project?.status == "under_review" ? "text-notice" : "text-neutral-1400"}`}>{project?.status == "under_review" ? "In Review" : "Reviewed"}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center gap-2">
                                                                    <Link
                                                                        href={`/project-onboarding?id=${project?._id}`}
                                                                        className="whitespace-nowrap w-2xl h-2xl rounded-full  flex items-center justify-center transition-colors"
                                                                    >
                                                                        <Edit className="w-4 h-4"/>
                                                                    </Link>
                                                                    {project.total_credit > 0 && (
                                                                    <Link
                                                                        href={Routes.AgreementView + "?id=" + project?._id}
                                                                        className="whitespace-nowrap w-2xl h-2xl rounded-full  flex items-center justify-center transition-colors"
                                                                    >
                                                                        <Partnership className="h-4 w-4" />
                                                                    </Link>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )) :
                                                    <td colSpan={7} className="py-xl text-gray-500">No Record Found</td>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                    {totalPage > 1 &&
                                        <div className="flex pt-xl justify-end gap-m items-center  w-full">
                                            <button
                                                className={`${currentPage > 1 ? "text-brand1-500" : "text-gray-400"}`}
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
        </AdminLayout>

    );
};

export default ProjectList;