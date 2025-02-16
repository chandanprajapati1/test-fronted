// components/GalleryModal.js
'use client'
import toCapitalizedCase from '@/utils/capitalized-case';
import { useEffect, useState } from 'react';

const GalleryView = (props: any) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [imageData, setImageData] = useState<any[]>([]);
    const [selectedLocation, setSelectedLocation] = useState(0)


    useEffect(() => {
        console.log("GalleryView images", props.data.locations[0].images[0])
        setImageData(props.data.locations[0].images)
    }, [])


    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % imageData.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + imageData.length) % imageData.length);
    };

    const locationHandler = (locId: number, images: any) => {
        console.log(images)
        setSelectedLocation(locId)
        setImageData(images)
    }
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 ">
            <div className="relative bg-white rounded-lg h-[95vh] w-[80vw] shadow-lg  overflow-x-hidden overflow-y-scroll hide-scrollbar">
                <div className='py-l flex border-b-[1px] justify-between px-xl'>
                    <div className='flex justify-between'>
                        <div className='text-black text-3xl font-light'>Gallery</div>
                    </div>
                    <div className='flex py-s px-m items-center rounded-lg'>
                        <button className=" text-gray-600 hover:text-gray-900" onClick={() => { props.setActivePop(false) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className='flex m-xl   border-b-2 border-neutral-100 overflow-x-auto whitespace-nowrap hide-scrollbar '>
                    {props.data.locations.map((location: any, index: any) => (
                        <div key={index} className={`text-black px-l py-s cursor-pointer ${selectedLocation == index && "border-b-2 border-brand1-500"}`} onClick={() => { locationHandler(index, location.images) }} >{location.state_name ? location.state_name : location.country_name}</div>
                    ))}
                </div>


                <div className='m-xl h-[73%] overflow-scroll hide-scrollbar'>
                    <div className='flex flex-col p-xl mb-xl border-2 border-neutral-200 rounded-xl'>
                        <div className="flex justify-center">
                            <div className="w-full h-[432px] bg-gray-200 flex items-center justify-center">
                                {imageData?.length != 0 && <img src={`${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/project-images/${imageData[currentImage].path}`} alt={imageData[currentImage].name} className="object-cover h-full w-full" />}
                            </div>
                        </div>
                        <p className="text-gray-600 text-3xl my-xl font-light">
                            {imageData?.length != 0 && toCapitalizedCase(imageData[currentImage].title)}
                        </p>
                        <p className="text-gray-600 text-sm">
                            {imageData?.length != 0 && imageData[currentImage].description}
                        </p>
                    </div>


                    <div className='w-full h-28  flex items-center justify-between'>
                        <button
                            onClick={prevImage}
                            className="p-2 bg-gray-300 rounded-full hover:bg-gray-400"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex flex-1 justify-evenly px-l gap-xl h-full">
                            {imageData.map((img, index) => (
                                <button key={index} onClick={() => setCurrentImage(index)}>
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/project-images/${img.path}`}
                                        alt={img.name}
                                        className={`flex-1 w-[230px] bg-green-300 h-full object-cover border-2 ${currentImage === index ? 'border-brand1-500' : 'border-gray-300'
                                            } hover:border-brand1-500`}
                                    />
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={nextImage}
                            className="p-2 bg-gray-300 rounded-full hover:bg-gray-400"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default GalleryView;
