// components/BuyCreditsModal.tsx
'use client'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {formatNumber} from "@/utils/number-utils";

interface CreditItem {
    vintage: string;
    quantity: number;
    rate: number;
}

export default function BuyCredits() {
    const [vintage, setVintage] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(0);
    const [cart, setCart] = useState<CreditItem[]>([]);

    const projectDetails = useSelector((state: any) => state.projectDetails.projectDetails);
    useEffect(() => {
        console.log("project details ", projectDetails)
    }, [projectDetails])

    const getPricePerCredit = (vintageYear: string, quantity: number) => {
        // Find the matching vintage year data
        const vintageData = projectDetails.vintages.find((v: any) => v.year === vintageYear);

        console.log("getPricePerCredit", vintageData)
        if (!vintageData) {
            return 0;
        }

        // Find the correct price slab for the given quantity
        const priceSlab = vintageData.price_slabs.find((slab: any) => {
            const isStartValid = slab.include_start ? quantity >= slab.range_start : quantity > slab.range_start;
            const isEndValid = slab.include_end ? quantity <= slab.range_end : quantity < slab.range_end;
            return isStartValid && isEndValid;
        });

        // Return the price per credit or 0 if no slab matches
        return priceSlab ? priceSlab.price_per_credit : 0;
    };

    const handleAddToCart = () => {
        if (!vintage || quantity <= 0) {
            return;
        }

        const pricePerCredit = getPricePerCredit(vintage, quantity);

        if (pricePerCredit === 0) {
            return;
        }
        // Logic to add selected credits to the cart
        const selectedCredits: CreditItem = {
            vintage,
            quantity,
            rate: pricePerCredit, // Assuming the rate is fixed
        };
        setCart((prevCart) => [...prevCart, selectedCredits]);
    };

    const handleRemoveFromCart = (index: number) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
    };

    const calculateTotalCredits = (): number => {
        return cart.reduce((acc, item) => acc + item.quantity, 0);
    };

    const calculateTotalAmount = (): number => {
        return cart.reduce((acc, item) => acc + item.quantity * item.rate, 0);
    };

    return (
        <div className="bg-white my-10xl  rounded-lg  w-full max-w-4xl mx-auto">
            <div className='py-l flex border-b-[1px] justify-between px-xl'>
                <div className='flex justify-between'>
                    <div className='text-black text-3xl font-light'>Buy Credits</div>
                </div>
            </div>

            <div className="bg-white mt-xl rounded-lg shadow-xl w-auto max-w-4xl mx-auto border-[1px]">
                <div className='py-l flex border-b-[1px] justify-between flex-col'>
                    <div className='flex justify-between px-xl'>
                        <div className='text-black text-3xl font-light'>Credits</div>
                    </div>

                </div>
                <table className="min-w-full bg-white rounded-lg ">
                    <thead>
                        <tr>
                            <th className="p-4 border text-neutral-1400">Vintage ₹</th>
                            <th className="p-4 border text-neutral-1400">Available Credits</th>
                            {projectDetails.vintages && projectDetails.vintages[0].price_slabs.map((slab: any, index: any) => (
                                <th key={index} className="p-4 border text-neutral-1400">{slab.range_start}-{slab.range_end}</th>
                            ))}

                            {/* <th className="p-4 border text-black">201-500</th>
                            <th className="p-4 border text-black">501-1000</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {projectDetails.vintages && projectDetails.vintages.map((vintage: any, index: any) => (
                            <tr key={index}>
                                <td className="p-4 border font-semibold text-neutral-1400">{vintage.year}</td>
                                <td className="p-4 border text-neutral-1400">{vintage.available_credits}</td>
                                {vintage.price_slabs.map((slab: any, index: any) => (
                                    <td key={index} className="p-4 border text-neutral-1400">${slab.price_per_credit}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-white mt-xl rounded-lg shadow-xl w-auto max-w-4xl mx-xl border-[1px]">
                <div className='py-l flex border-b-[2px] justify-between flex-col'>
                    <div className='flex justify-between px-xl'>
                        <div className='text-black text-3xl font-light'>Add to cart</div>
                    </div>
                </div>
                <div className="flex space-x-4 py-xl px-l">
                    <div className='flex flex-1 flex-col'>
                        <label className='text-black mb-s font-light'>Vintages</label>
                        <select
                            value={vintage}
                            onChange={(e) => setVintage(e.target.value)}
                            className="border p-2 rounded-md flex-1 text-black"
                        >
                            <option value="" className='text-black'>Please Select</option>
                            {projectDetails.vintages && projectDetails.vintages.map((vintage: any, index: any) => (
                                <option key={index} value={vintage.year} className='text-black'>{vintage.year}</option>
                            ))}
                        </select>
                    </div>

                    <div className='flex flex-1 flex-col'>
                        <label className='text-black mb-s font-light'>Quantity <span>{formatNumber(projectDetails.total_credit, 3)}</span></label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                            placeholder="Enter quantity"
                            className="border p-2 rounded-md flex-1 text-black"
                        />
                    </div>
                    <div className='flex  flex-col'>
                        <label className='text-black mb-s opacity-0 font-light'>Button</label>

                        <button
                            onClick={handleAddToCart}
                            className="bg-brand1-500 text-black px-4 py-2 rounded-md"
                        >
                            Add to cart
                        </button>
                    </div>

                </div>
            </div>


            {/* Shopping Cart */}
            <div className="flex gap-4 mt-xl p-xl">
                {/* 60% width for Shopping Cart */}
                <div className="w-3/5 bg-white border-[1px] rounded-lg shadow-lg">
                    <div className='py-l flex justify-between flex-col'>
                        <div className='flex justify-between px-xl'>
                            <div className='text-black text-3xl font-light'>Add to cart</div>
                        </div>
                    </div>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="p-4 border-y border-r text-black">Vintage ₹</th>
                                <th className="p-4 border text-black">Credits</th>
                                <th className="p-4 border text-black">Rate ($)</th>
                                <th className="p-4 border text-black">Amount ($)</th>
                                <th className="p-4 border-y border-l text-black"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-4 border-y text-black">{item.vintage}</td>
                                    <td className="p-4 border-y text-black">{item.quantity}</td>
                                    <td className="p-4 border-y text-black">${item.rate}</td>
                                    <td className="p-4 border-y text-black">{item.quantity * item.rate}</td>
                                    <td className="p-4 border-y text-black">
                                        <button
                                            onClick={() => handleRemoveFromCart(index)}
                                            className="text-negativeBold"
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 40% width for Order Summary */}
                <div className="w-2/5 bg-white rounded-lg border-[1px] shadow-lg ">
                    <div className='py-l flex justify-between flex-col border-b-[2px] '>
                        <div className='flex justify-between px-xl'>
                            <div className='text-black text-3xl font-light'>Shopping Cart</div>
                        </div>
                    </div>
                    <div className="space-y-2 p-xl">
                        <div className="flex justify-between text-black border-b-[1px] py-m">
                            <span className='pl-l text-fontSize-xl font-extralight'>Number of credits</span>
                            <span className='pr-l text-f-2xl'>{calculateTotalCredits()}</span>
                        </div>
                        <div className="flex justify-between text-black border-b-[1px] py-m">
                            <span className='pl-l text-f-2xl font-extralight'>Buy Amount</span>
                            <span className='pr-l text-f-2xl'>${calculateTotalAmount()}</span>
                        </div>
                        <div className="flex justify-between text-black border-b-[1px] py-m">
                            <span className='pl-l text-f-2xl font-extralight'>Discount</span>
                            <span className='pr-l text-f-2xl'>$600</span>
                        </div>
                        <div className="flex justify-between text-black border-b-[1px] py-m">
                            <span className='pl-l text-f-2xl font-extralight'>Service Fee</span>
                            <span className='pr-l text-f-2xl'>$0.60</span>
                        </div>
                        <div className="flex justify-between text-black border-b-[1px] py-m">
                            <span className='pl-l text-f-2xl font-extralight'>Vat</span>
                            <span className='pr-l text-f-2xl'>$0.00</span>
                        </div>
                        <div className="flex justify-between text-black font-semibold border-b-[1px] py-m">
                            <span className='pl-l text-f-2xl font-light'>Net Total Amount</span>
                            <span className='pr-l text-f-2xl'>${calculateTotalAmount() - 600 + 0.60}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-4 border-t-2 px-xl py-l">
                {/* <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="ck-agreement"
                        className="h-5 w-5 border-gray-300 rounded focus:ring-2 focus:ring-brand1-500"
                    />
                    <label htmlFor="ck-agreement" className="ml-2 text-gray-700">
                        I agree CK agreement
                    </label>
                </div> */}
                <div className='flex gap-l'>

                    <button className="bg-gray-300 px-4 py-2 rounded-md text-black">Cancel</button>
                    <button className="bg-brand1-500 text-white px-4 py-2 rounded-md">Buy Now</button>
                </div>
            </div>

        </div>
    );
}

