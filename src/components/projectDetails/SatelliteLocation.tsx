// "use client";
import { GoogleMap, LoadScript, KmlLayer } from "@react-google-maps/api";


const containerStyle = {
    width: "100%",
    height: "500px", // Adjust as needed
};

const center = {
    lat: 0, // Default center (San Francisco)
    lng: 0, // Default center (San Francisco)
};


const SatelliteLocation = (props: any) => {
    const encodedFileName = encodeURIComponent(props.data.kml_file);
    const KMLFile = `${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/project-kml-file/${encodedFileName}`;
    const demo = process.env.MAP_API_KEY
    console.log("KMLFile ",KMLFile);
    
    return (
        <div className="flex-1 bg-white mt-xl rounded-xl">
            <div className="py-l flex border-b-[1px] justify-between px-xl">
                <div className="flex justify-between">
                    <div className="text-black text-f-3xl font-light">Satellite Location</div>
                </div>
            </div>
            <div className="p-xl text-black flex-col">
                {/* <div ref={mapRef} className="w-full h-[422px] bg-neutral-100" /> */}
                <LoadScript googleMapsApiKey={demo  ?? ""}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={14}
                    >
                        <KmlLayer
                        url={KMLFile}
                        />
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
};

export default SatelliteLocation;
