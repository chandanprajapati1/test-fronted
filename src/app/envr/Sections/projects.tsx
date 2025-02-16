"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const fetchProjectDetails = async (nextPageLimit: number, sector = null, registry = null, status = null, search = ''): Promise<any> => {
  const url = `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/project/public-projects?page=1&limit=${nextPageLimit}${sector && sector !== "all" ? `&sector=${sector}` : ''}${registry && registry !== "all" ? `&registry=${registry}` : ''}${status ? `&status=${status}` : ''}${search && search.length > 4 ? `&search=${search}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
};

const Projects = () => {

  const router = useRouter();
  const [projects, setProjects] = useState<any>([])

  const fetchData = async () => {
    try {
      const projectData = await fetchProjectDetails(50);
      const projects = projectData.projects.slice(0, 6)
      console.log("fetch data ========> ", projectData.projects, projects)
      setProjects(projects)

    } catch (error) {
      console.error("Error fetching project list:", error);
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  const onclickExploreButton = (id: any) => {
    router.push(`project/${id}`)
  }

  return (
    <div id="projects" className="h-auto bg-[#f3f4f6]  px-4 sm:px-8 scroll-mt-[87px]  py-[50px]">
      <div className="py-12 lg:px-4">

        <div className="flex items-center space-x-3 mb-8">
          <div className="w-4 h-4 bg-brand1-500 rounded-full"></div>
          <p className="font-[500] text-[18px] font-inter  text-black">Projects</p>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16 lg:gap-x-8 lg:items-stretch">
          <div className="flex flex-col items-center lg:items-start  lg:text-left">
            <h1 className="text-[40px] lg:text-[65px] font-inter font-[300] text-[#000] lg:leading-[75px] leading-[50px]">
              Drive <span className="text-[#57CC99] font-[600]">Sustainability</span> and
              Shape a <span className="font-[500]">Greener <br />Future</span>
            </h1>
          </div>

          <div className="lg:w-1/2 flex flex-col justify-between mt-6 lg:mt-0">
            <p className="text-[#000] font-inter text-[16px] font-normal leading-[35px] lg:text-left">
              Transform your sustainability efforts into tangible results with our
              carbon trading platform. Make every trade count towards a greener planet.
            </p>

            <div className="mt-auto  lg:text-left">
              <button onClick={() => (router.push('/project-listing'))}
                className="mt-8 bg-black text-white font-inter py-3 px-8 rounded-[42px] text-sm lg:text-base shadow-md hover:opacity-90">
                Explore Projects
              </button>
            </div>
          </div>
        </div>



        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {projects.length > 0 && projects.map((project: any, index: any) => (
            <div
              key={index}
              className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200 rounded-[15px] bg-white"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/project-images/${project.background_image}`}
                alt={project.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 rounded-[15px] bg-white relative bottom-[15px] bg-[ #FFF] ">
                <div>
                  <div className="flex items-center text-sm text-[#57CC99] space-x-2 mb-3">
                    {/* <span className="w-2 h-2 bg-brand1-500 rounded-full"></span>
                    <span className="text-[13px] font-inter font-[500]">country</span> */}
                    <span className="w-2 h-2 bg-brand1-500 rounded-full"></span>
                    <span className="text-[13px] font-inter [500]">{project.project_types[0].type_name}</span>
                  </div>
                  <h3 className="text-[18px] font-[500] font-inter text-[#000]">
                    {project.name}
                  </h3>
                  <p className="text-[#979797] font-inter text-[16px] font-normal leading-[35px] mt-3 line-clamp-2">
                    {project.details}
                  </p>
                </div>
                <div className="mt-3">
                  <button
                    className="px-5 py-2 rounded-[42px] font-[20px] font-inter bg-black text-white hover:bg-gray-800"
                    onClick={() => { onclickExploreButton(project._id) }}
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>



      </div>
    </div>
  );
};
export default Projects;
