import React from 'react'

const DocumentNdReports = (props: any) => {
    const documents = [
        {
            type: "pdf",
            name: "Ovacik Biogas PP ICR PDD v1.pdf",
            createdOn: "20-09-23 22:18",
        },
        {
            type: "pdf",
            name: "Ovacik Biogas PP ICR PDD v1.pdf",
            createdOn: "20-09-23 22:18",
        },
    ];

    const handleDownload = (name: string) => {
        const link = document.createElement('a');
        link.href = `${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/project-documents/${name}`;
        link.download = name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    function formatTimestamp(isoDate: any) {
        const date = new Date(isoDate);

        // Format components
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    return (
        <div className="w-full bg-white mt-xl rounded-xl">
            <div className='py-l flex border-b-[1px] justify-between px-xl'>
                <div className='flex justify-between'>
                    <div className='text-black text-f-3xl font-light'>Project Documents</div>
                </div>

            </div>
            <div className='p-xl text-black flex-col'>
                <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center bg-gray-100 py-s">
                        <div className="w-[45%] text-sm font-semibold">Document Type</div>
                        <div className="w-[45%] text-sm font-semibold ">File Name</div>
                        <div className="w-[10%] text-sm font-semibold ">Action</div>
                    </div>
                </div>
                {props.data.rawData.documentation && props.data.rawData.documentation.map((doc: any, index: any) => (
                    <div
                        key={index}
                        className="flex items-center py-xl border-t border-gray-200 hover:bg-gray-50"
                    >
                        <div className="w-[45%] text-sm text-gray-700 ">{doc.type.toUpperCase()}</div>
                        <div className="w-[45%] text-sm text-gray-700">{doc.name.length > 20 ? doc.name.slice(0, 20) + ".." : doc.name}</div>
                        <div className="w-[10%] px-m ">
                            <button
                                onClick={() => handleDownload(doc.uri)}
                                className="py-s rounded-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M13 12V14H3V12H2V14C2 14.2652 2.10536 14.5196 2.29289 14.7071C2.48043 14.8946 2.73478 15 3 15H13C13.2652 15 13.5196 14.8946 13.7071 14.7071C13.8946 14.5196 14 14.2652 14 14V12H13Z" fill="#4D4D4D" />
                                    <path d="M13 7L12.295 6.295L8.5 10.085V1H7.5V10.085L3.705 6.295L3 7L8 12L13 7Z" fill="#4D4D4D" />
                                </svg>
                            </button>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default DocumentNdReports