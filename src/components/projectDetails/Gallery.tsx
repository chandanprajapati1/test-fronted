import React, { useEffect, useState } from 'react'

const Gallery = (props: any) => {
    const [images, setImages] = useState([]);
    useEffect(() => {
        // setImages(getAllImages);
        if (!props.data.locations) {
            return;
        }
        let allImages: any = [];
        props.data.locations.forEach((images: any) => {
            //allImages = allImages.concat(images.images);
            if (images?.images && Array.isArray(images.images)) {
                allImages = allImages.concat(images.images);
            } else {
                console.log('Invalid images data for location:', location);
            }
        });
        console.log("getAllImages", props.data.locations, allImages)
        setImages(allImages)
    }, [])

    // function getAllImages() {
    //     let allImages: any = [];
    //     // props.data.locations.forEach((images: any) => {
    //     //     allImages = allImages.concat(images);
    //     // });
    //     // console.log(allImages);
    //     console.log("getAllImages", props.data.locations)
    //     return []//allImages;
    // }

    return (
        <div className="flex-1 bg-white mt-xl rounded-xl">
            <div className='py-l flex border-b-[1px] justify-between px-xl'>
                <div className='flex justify-between'>
                    <div className='text-black text-f-3xl font-light'>Gallery</div>
                </div>
                <button className='flex py-s px-m bg-neutral-100 items-center rounded-lg' onClick={() => { props.setActivePop(true) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M15.47 7.83C14.882 6.30882 13.861 4.99331 12.5334 4.04604C11.2058 3.09878 9.62977 2.56129 8.00003 2.5C6.37029 2.56129 4.79423 3.09878 3.46663 4.04604C2.13904 4.99331 1.11811 6.30882 0.530031 7.83C0.490315 7.93985 0.490315 8.06015 0.530031 8.17C1.11811 9.69118 2.13904 11.0067 3.46663 11.954C4.79423 12.9012 6.37029 13.4387 8.00003 13.5C9.62977 13.4387 11.2058 12.9012 12.5334 11.954C13.861 11.0067 14.882 9.69118 15.47 8.17C15.5097 8.06015 15.5097 7.93985 15.47 7.83ZM8.00003 12.5C5.35003 12.5 2.55003 10.535 1.53503 8C2.55003 5.465 5.35003 3.5 8.00003 3.5C10.65 3.5 13.45 5.465 14.465 8C13.45 10.535 10.65 12.5 8.00003 12.5Z" fill="black" />
                        <path d="M8.00003 5C7.40669 5 6.82667 5.17595 6.33332 5.50559C5.83997 5.83524 5.45546 6.30377 5.22839 6.85195C5.00133 7.40013 4.94192 8.00333 5.05768 8.58527C5.17343 9.16721 5.45915 9.70176 5.87871 10.1213C6.29827 10.5409 6.83282 10.8266 7.41476 10.9424C7.9967 11.0581 8.5999 10.9987 9.14808 10.7716C9.69626 10.5446 10.1648 10.1601 10.4944 9.66671C10.8241 9.17336 11 8.59334 11 8C11 7.20435 10.684 6.44129 10.1214 5.87868C9.55874 5.31607 8.79568 5 8.00003 5ZM8.00003 10C7.60447 10 7.21779 9.8827 6.88889 9.66294C6.55999 9.44318 6.30365 9.13082 6.15227 8.76537C6.0009 8.39991 5.96129 7.99778 6.03846 7.60982C6.11563 7.22186 6.30611 6.86549 6.58582 6.58579C6.86552 6.30608 7.22189 6.1156 7.60985 6.03843C7.99781 5.96126 8.39995 6.00087 8.7654 6.15224C9.13085 6.30362 9.44321 6.55996 9.66297 6.88886C9.88273 7.21776 10 7.60444 10 8C10 8.53043 9.78932 9.03914 9.41424 9.41421C9.03917 9.78929 8.53046 10 8.00003 10Z" fill="black" />
                    </svg>
                    <div className='text-black ml-s'>View All</div>
                </button>
            </div>
            <div className='p-xl text-black flex justify-evenly'>
                <div className='w-full h-[422px] grid lg:grid-cols-3 gap-xl overflow-scroll hide-scrollbar'>
                    {images && images?.map((image: any, index: any) => (
                        <GalleryDiv key={index} image={image.path} name={image.name} />
                    ))}
                </div>
            </div>

        </div >
    )
}

export default Gallery;


const GalleryDiv = (props: any) => {
    return (
        <div className='flex bg-neutral-100 flex-1 justify-center items-center h-[192px]'>
            <img src={`${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/project-images/${props.image}`} alt={props.name} className='bg-cover w-full h-full' loading="lazy" />
        </div>
    );
};