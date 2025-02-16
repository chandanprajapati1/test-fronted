import React from 'react'

const ProjectDetailsPopup = (props: any) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-start justify-center z-50">
            <div className="relative bg-white rounded-lg w-[80vw] shadow-lg mt-10xl ">
                <div className='py-l flex border-b-[1px] justify-between px-xl'>
                    <div className='flex justify-between '>
                        <div className='text-black text-3xl font-light'>Project Details</div>
                    </div>
                    <button className='flex py-s px-m items-center rounded-lg' onClick={() => { props.setShowProjectDetails(false) }}>
                        <button className=" text-gray-600 hover:text-gray-900" >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </button>
                </div>
                <div className='p-xl'>
                    <div className='text-black overflow-y-scroll max-h-[350px]'>
                        {props.details}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ProjectDetailsPopup