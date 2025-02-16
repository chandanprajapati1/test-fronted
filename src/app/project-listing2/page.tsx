"use client";
import Footer from '@/components/common/Footer';
import ProjectCardMini from '@/components/projectListing/ProjectCardMini';
import ProjectHeader from '@/components/projectListing/ProjectHeader';
import SearchFilterBar from '@/components/projectListing/SearchFilterBar';
import { getAuthCredentials } from '@/utils/auth-utils';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import ProjectCard1 from "@/components/projectListing/ProjectCard1";
import ProjectCard2 from "@/components/projectListing/ProjectCard2";
import ProjectCard from "@/components/projectListing/ProjectCard";

const fetchProjectDetails = async (nextPageLimit: number, sector = null, registry = null, status = null, search = ''): Promise<any> => {
    const token = getAuthCredentials();
    const url = token.token
        ? `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/project/projects?page=1&limit=${nextPageLimit}${sector && sector !== "all" ? `&sector=${sector}` : ''}${registry && registry !== "all" ? `&registry=${registry}` : ''}${status ? `&status=${status}` : ''}${search && search.length > 4 ? `&search=${search}` : ''}`
        : `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/project/public-projects?page=1&limit=${nextPageLimit}${sector && sector !== "all" ? `&sector=${sector}` : ''}${registry && registry !== "all" ? `&registry=${registry}` : ''}${status ? `&status=${status}` : ''}${search && search.length > 4 ? `&search=${search}` : ''}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.token ? token.token : ''}`,
        },
    });

    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
};


const Page = () => {
    const [pageLimit, setPageLimit] = useState(2);
    const [headerProject, setHeaderProject] = useState([]);
    const [secondaryProjectList, setSecondaryProjectList] = useState([]);
    const [projectList, setProjectList] = useState<any>([]);
    const [hasMore, setHasMore] = useState(true);
    const [totalProject, setTotalProject] = useState(0);
    const [activeToken, setActiveToken] = useState(true);
    const [enterLoad, setEnterLoad] = useState(false);

    const observerRef = useRef<HTMLDivElement>(null);

    const [paramsData, setParamsData] = useState({
        'register': null,
        "sector": null,
        'status': null,
        'search': '',
    });

    useEffect(() => {
        const token = getAuthCredentials();
        setActiveToken(!!token.token);
    }, []);

    const fetchData = async (nextPageLimit: number, isLoadMore = false) => {
        try {
            const projectData = await fetchProjectDetails(nextPageLimit, paramsData.sector, paramsData.register, paramsData.status, paramsData.search);

            setTotalProject(projectData.total_count);
            console.log("Total Projects Set:", projectData.total_count);

            if (!isLoadMore) {
                setHeaderProject(projectData.hero_projects || []);
                setSecondaryProjectList(projectData.projects.slice(0, 2) || []);
                setProjectList([]);
                if (projectData.projects && projectData.projects.length > 0) {
                    const newProjects = projectData.projects.slice(2);
                    const groupedProjects: any = [];

                    for (let i = 0; i < newProjects.length; i += 4) {
                        groupedProjects.push(newProjects.slice(i, i + 4));
                    }

                    setProjectList((prev: any) => (isLoadMore ? [...prev, ...groupedProjects] : groupedProjects));
                    console.log("Loading More Projects: initial", projectData.total_count, nextPageLimit, projectData.total_count > nextPageLimit);
                    setHasMore(projectData.total_count > nextPageLimit);
                    setEnterLoad(true)
                } else {
                    setHasMore(false);
                }
            }


        } catch (error) {
            console.error("Error fetching project list:", error);
        }
    };

    const loadProjectData = async (nextPageLimit: number, isLoadMore = false) => {
        try {
            const projectData = await fetchProjectDetails(nextPageLimit, paramsData.sector, paramsData.register, paramsData.status, paramsData.search);

            console.log("Loading More Projects: Total Projects Set:  loadProjectData", totalProject);

            // if (!isLoadMore) {
            // setSecondaryProjectList(projectData.projects.slice(0, 2) || []);
            setProjectList([]);
            if (projectData.projects && projectData.projects.length > 0) {
                const newProjects = projectData.projects.slice(2);
                const groupedProjects: any = [];

                for (let i = 0; i < newProjects.length; i += 4) {
                    let newDataArr = newProjects.slice(i, i + 4)
                    console.log("Loading More Projects: groups newDataArr", newDataArr)
                    groupedProjects.push(newDataArr);
                }

                console.log("Loading More Projects: groups", groupedProjects)
                setProjectList(groupedProjects);
                //     setHasMore(totalProject > nextPageLimit);
                setHasMore(totalProject > nextPageLimit);
                setEnterLoad(true)
                // } else {
                //     setHasMore(false);
                // }
            }


        } catch (error) {
            console.error("Error fetching project list:", error);
        }
    };

    useEffect(() => {
        setHeaderProject([]);
        setSecondaryProjectList([]);
        setProjectList([]);
        setPageLimit(2);
        fetchData(2);
    }, [paramsData]);

    const loadMoreProjects = useCallback(() => {
        console.log("Loading More Projects: before", totalProject, pageLimit, hasMore);

        if (pageLimit >= totalProject) {
            setEnterLoad(false);
            return;

        }
        const nextPageLimit = pageLimit + 2;
        setPageLimit(nextPageLimit);
        console.log("Loading More Projects: after", totalProject, pageLimit, hasMore, nextPageLimit);
        loadProjectData(nextPageLimit, true);
    }, [pageLimit, hasMore, totalProject, paramsData]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                console.log("Loading More Projects: entering ", entry.isIntersecting, hasMore, enterLoad)
                if (entry.isIntersecting && hasMore && enterLoad) {
                    console.log("Loading More Projects: enter")
                    setEnterLoad(false)
                    loadMoreProjects();
                }
            },
            { threshold: 1.0 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    });

    return (
        <div className='text-black flex flex-col  bg-gray-100'>
            <div className='w-full h-[522px] relative'>
                {headerProject.length > 0 && (
                    <ProjectHeader data={headerProject[0]} activeToken={activeToken}/>
                )}
                <SearchFilterBar setParamsData={setParamsData}/>
            </div>

            <div className='mt-56 sc-xs:mt-32 sc-md:mt-8 flex flex-col w-full justify-center py-m px-6'>

                <div className='max-w-[1540px] grid grid-cols-1 sc-sm:grid-cols-2 gap-xl justify-between'>
                    {secondaryProjectList.map((projectData, index) => (
                        <ProjectCard1 key={index} data={projectData} activeToken={activeToken}/>
                    ))}
                </div>

                {projectList.map((projectArr: any, index: number) => (
                    <div key={index}
                         className='py-m grid grid-cols-1 sc-sm:grid-cols-2 sc-lg:grid-cols-4 justify-between gap-xl'>
                        {projectArr.map((projectData: any, innerIndex: number) => (
                            <ProjectCard2 key={innerIndex} data={projectData} activeToken={activeToken}
                                          len={projectArr.length}/>
                        ))}
                    </div>
                ))}

                {enterLoad && hasMore && (
                    <div ref={observerRef} className="h-10 mt-4 text-gray-600 ">
                        Loading more projects... {totalProject}
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    );
};

export default Page;
