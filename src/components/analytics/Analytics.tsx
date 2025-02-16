"use client"
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyData = [
    { month: 'Jan', emission: 700 },
    { month: 'Feb', emission: 600 },
    { month: 'Mar', emission: 500 },
    { month: 'Apr', emission: 450 },
    { month: 'May', emission: 400 },
    { month: 'Jun', emission: 650 },
    { month: 'Jul', emission: 500 },
    { month: 'Aug', emission: 950 },
    { month: 'Sep', emission: 650 },
    { month: 'Oct', emission: 600 }
];


const Analytics = () => {
    return (
        <div className='flex flex-col w-full justify-center mx-auto max-w-screen-sc-2xl text-black items-center p-6 '>
            <div className="flex flex-col gap-6 w-full">
                <div className="bg-white rounded-xl shadow-dashboard p-6">
                    <div className="border-b pb-6 mb-6">
                        <h2 className="text-f-3xl font-semibold">Net Zero Posture</h2>
                        <p className="text-neutral-1200">tons CO2e</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-full h-6 rounded-2xl bg-neutral-100 overflow-hidden">
                            <div className="h-full w-4/5 bg-green-500 rounded-l-2xl"></div>
                        </div>
                        <div className="flex justify-between text-neutral-1200">
                            <span>0 tons</span>
                            <span>13,600 tons (target)</span>
                        </div>
                    </div>
                </div>

                <div className="grid sc-sm:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow">
                        <div className="border-b p-6 flex items-center justify-start">
                            <h2 className="text-f-3xl font-semibold">Monthly Emission Trend</h2>
                        </div>
                        <div className="p-6 flex flex-col gap-y-6">
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="emission" stroke="#46A37A" strokeWidth={2}
                                            dot={{ fill: '#46A37A' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-6 h-6 bg-brand1-600 rounded"></div>
                                <span className="text-neutral-1200">Emission</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow">
                        <div className="border-b p-6">
                            <p className="text-neutral-1200">Total Emission</p>
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-f-3xl font-semibold">13,600</h2>
                                <span className="text-neutral-1200">tons CO2e</span>
                            </div>
                        </div>
                        {[
                            { title: 'Scope 1', value: '8,840', desc: 'Direct emissions (tons)' },
                            { title: 'Scope 2', value: '2,760', desc: 'Energy indirect emissions (tons)' },
                            { title: 'Scope 3', value: '2,000', desc: 'Supply chain emissions (tons)' }
                        ].map((scope, i) => (
                            <div key={scope.title} className={`p-6 ${i !== 0 ? 'border-t' : ''}`}>
                                <p className="text-neutral-1200">{scope.title}</p>
                                <p className="text-f-3xl font-semibold mt-2">{scope.value}</p>
                                <p className="text-neutral-1200 mt-2">{scope.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-dashboard ">
                        <div className="flex justify-between items-center border-b p-6">
                            <div>
                                <p className="text-neutral-1200">Offset Achieved</p>
                                <h2 className="text-f-3xl font-semibold">8,840</h2>
                                <p className="text-neutral-1200">tons CO2e</p>
                            </div>
                            <button className="px-6 py-3 border border-[#57cc99] rounded-lg">View History</button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-dashboard ">
                        <div className="border-b p-6">
                            <p className="text-neutral-1200">Net Position</p>
                            <h2 className="text-f-3xl font-semibold">-4,760</h2>
                            <p className="text-neutral-1200">tons CO2e</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-dashboard ">
                    <div className="border-b p-6">
                        <h2 className="text-f-3xl font-semibold">Credits Overview</h2>
                    </div>
                    <div className="flex flex-col ">
                        <div className="flex flex-col flex-wrap sc-sm:flex-row items-center gap-4 sc-sm:gap-0 p-4">
                            <div className="flex w-full flex-col sc-xs:flex-row gap-4 sc-sm:flex-1">
                                <div className="flex flex-col px-4 flex-1">
                                    <p className="text-f-3xl font-semibold">8,840</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-neutral-1200">Retired Credits (in tons)</p>
                                        <span
                                            className="px-3 py-2 bg-positiveSubtitle rounded text-xs font-semibold">Completed</span>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1 border-t pt-4 px-4 sc-xs:pt-0 sc-xs:border-t-0 sc-xs:border-l border-neutral-300 sc-xs:pl-6">
                                    <p className="text-f-3xl font-semibold">4,760</p>
                                    <p className="text-neutral-1200">Pending Credits (in tons)</p>
                                </div>
                            </div>
                            <div className="w-full  sc-sm:w-auto border-t border-l-0 sc-sm:border-t-0 sc-sm:border-l border-neutral-300 ">
                                <div className="flex items-center p-4 sc-sm:p-2sc-sm:pl-6 ">
                                    <button className="px-6 py-3 border border-brand1-500 rounded-lg">Request Retirement
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analytics