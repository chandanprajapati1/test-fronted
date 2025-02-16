import React from 'react'
import { Download } from "@carbon/icons-react";

const DocumentNdReports = (props: any) => {

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

            <div className="w-full overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="">
                        <tr className="text-left text-sm font-semibold text-gray-900">
                            <th className="px-6 py-3">
                                Document Type
                            </th>
                            <th className="px-6 py-3">
                                Created On
                            </th>
                            <th className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {props.data.documents && props.data.documents.map((doc: any, index: any) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {doc.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {formatTimestamp(doc.created_at)}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDownload(doc.path)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        aria-label="Download document"
                                    >
                                        <Download className="h-4 w-4 text-gray-600" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default DocumentNdReports