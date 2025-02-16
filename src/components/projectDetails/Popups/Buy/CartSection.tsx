import React from "react";
import { formatNumber } from "@/utils/number-utils";
import { SortDescending } from "@carbon/icons-react";

interface CartItem {
    id: number;
    vintage: string | null;
    quantity: number;
    rate: number;
}

export default function ShoppingCart({ cart, setCart }: {
    cart: CartItem[],
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
}) {
    const headers = [
        { id: 1, title: 'Vintage', hasIcon: true },
        { id: 2, title: 'Credits (tCO₂e)' },
        { id: 3, title: 'Rate ($)' },
        { id: 4, title: 'Amount ($)' },
        { id: 5, title: 'Action' }
    ];

    const handleDelete = (id: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    // Calculate amount for each item
    const calculateAmount = (quantity: number, rate: number) => {
        return formatNumber((quantity * rate), 2);
    };


    const DeleteIcon = () => (
        <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
        >
            <path
                d="M12.5 4.7L11.8 4L8.5 7.3L5.2 4L4.5 4.7L7.8 8L4.5 11.3L5.2 12L8.5 8.7L11.8 12L12.5 11.3L9.2 8L12.5 4.7Z"
                fill="#161616"
            />
        </svg>
    );

    return (
        <div className="sc-sm:flex-2 flex flex-col rounded-2xl bg-white shadow-md  w-full">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-f-3xl font-light text-neutral-1400">Shopping Cart</h2>
            </div>

            <div className=" border-gray-300 overflow-x-auto w-full">
                <table className="min-w-full bg-white rounded-lg">
                    {/* Header Row */}
                    <thead className="whitespace-nowrap">
                        <tr className="h-[61px]">
                            {headers.map((header) => (
                                <th
                                    key={header.id}
                                    className={`px-4 py-3 bg-slate-50 border-r border-gray-300 last:border-r-0`}
                                >
                                    <div className={`flex items-center gap-1 justify-start ${header.id == 5 && "justify-center"}`}>
                                        <span className="text-f-2xl font-light text-gray-900">{header.title}</span>
                                        {header.hasIcon && <SortDescending className="w-4 h-4" />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Cart Items */}
                    <tbody>
                        {cart.map((item, index) => (
                            <tr
                                key={item.id}
                                className={`h-[60px] border-b border-gray-300 ${index % 2 === 1 ? 'bg-slate-50' : ''
                                    }`}
                            >
                                <td className="px-4 py-3 border-r">
                                    <p className="text-f-l font-semibold text-gray-700">
                                        {item.vintage || '-'}
                                    </p>
                                </td>
                                <td className="px-4 py-3 border-r">
                                    <p className="text-f-l text-left font-light text-neutral-1200">
                                        {formatNumber(item.quantity, 3)}
                                    </p>
                                </td>
                                <td className="px-4 py-3 border-r">
                                    <p className="text-f-l text-left font-light  text-neutral-1200">
                                        {formatNumber(item.rate, 2)}
                                    </p>
                                </td>
                                <td className="px-4 py-3 border-r">
                                    <p className="text-f-l text-left font-light text-neutral-1200">
                                        {calculateAmount(item.quantity, item.rate)}
                                    </p>
                                </td>
                                <td className="px-4 py-3 ">
                                    <button
                                        className="py-xs text-f-l px-s h-8 flex items-center mx-auto justify-center rounded-lg text-white bg-red-500 hover:bg-red-600"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        {/* <DeleteIcon /> */}
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}