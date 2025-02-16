import React, { useState, useEffect } from 'react';

interface Vintage {
    year: string;
    total_credit: number;
    per_credit_price: number;
}

interface VintageTableProps {
    vintages: Vintage[];
}

const VintageTable: React.FC<VintageTableProps> = ({ vintages }) => {
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortedVintages, setSortedVintages] = useState<Vintage[]>([]);

    useEffect(() => {
        if (vintages && Array.isArray(vintages)) {
            setSortedVintages([...vintages]);
        }
        console.log("VintageTable", vintages);
    }, [vintages]);

    const handleSort = () => {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newDirection);

        const sorted = [...sortedVintages].sort((a, b) => {
            if (newDirection === 'asc') {
                return parseInt(a.year) - parseInt(b.year);
            }
            return parseInt(b.year) - parseInt(a.year);
        });

        setSortedVintages(sorted);
    };

    if (!vintages || vintages.length === 0) {
        return <div className="p-4 text-center">No vintage data available</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
                <thead>
                    <tr className=" bg-slate-50">
                        <th className="flex items-center h-full px-4 py-3 border-r border-[#d9d9d9] font-light text-left gap-2"
                            onClick={handleSort}>
                            <span className="text-xl text-neutral-1400">Vintage</span>
                            <svg
                                className="w-4 h-4"
                                viewBox="0 0 17 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9.5 11L10.207 10.293L12 12.086V2H13V12.086L14.793 10.293L15.5 11L12.5 14L9.5 11Z"
                                    fill="#808080" />
                                <path d="M8.5 3H1.5V4H8.5V3Z" fill="#808080" />
                                <path d="M8.5 6H3.5V7H8.5V6Z" fill="#808080" />
                                <path d="M8.5 9H5.5V10H8.5V9Z" fill="#808080" />
                            </svg>
                        </th>

                        <th className="items-center px-4 py-3 border-r border-[#d9d9d9] font-light text-left">
                            <span className="text-xl text-neutral-1400">Available Credits</span>
                        </th>

                        <th className="items-center px-4 py-3 font-light text-left">
                            <span className="text-xl text-neutral-1400">Price per Credit</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedVintages.map((vintage, index) => (
                        vintage.total_credit != 0 && <tr key={vintage.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-4 border text-neutral-1200">{vintage.year}</td>
                            <td className="p-4 border text-neutral-1200">{vintage.total_credit}</td>
                            <td className="p-4 border text-neutral-1200">{vintage.per_credit_price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VintageTable;