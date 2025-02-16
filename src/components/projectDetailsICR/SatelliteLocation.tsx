import React, { useEffect, useRef } from 'react';

type SatelliteLocationProps = {
    data: {
        lat: number;
        lng: number;
    };
};

const SatelliteLocation = ({ data }: any) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initializeMap = () => {
            if (!mapRef.current) return;

            const map = new google.maps.Map(mapRef.current, {
                center: { lat: data.rawData.location.lat, lng: data.rawData.location.lng },
                zoom: 10,
            });

            new google.maps.Marker({
                position: { lat: data.rawData.location.lat, lng: data.rawData.location.lng },
                map: map,
                title: 'Location Pin',
            });
        };

        const loadGoogleMapsScript = () => {
            if (!window.google) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.MAP_API_KEY}`; // Replace with your API key
                script.async = true;
                script.defer = true;
                script.onload = initializeMap;
                document.head.appendChild(script);
            } else {
                initializeMap();
            }
        };

        loadGoogleMapsScript();
    }, [data.rawData.location.lat, data.rawData.location.lng]);

    return (
        <div className="flex-1 bg-white mt-xl rounded-xl">
            <div className="py-l flex border-b-[1px] justify-between px-xl">
                <div className="flex justify-between">
                    <div className="text-black text-f-3xl font-light">Satellite Location</div>
                </div>
            </div>
            <div className="p-xl text-black flex-col">
                <div ref={mapRef} className="w-full h-[422px] bg-neutral-100" />
            </div>
        </div>
    );
};

export default SatelliteLocation;
