import React from "react";

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
        { id: 1, title: 'Vintage', width: 'w-[120px]', hasIcon: true },
        { id: 2, title: 'Credits', width: 'w-[102px]' },
        { id: 3, title: 'Rate ($)', width: 'w-[119px]' },
        { id: 4, title: 'Amount ($)', width: 'w-[150px]' },
        { id: 5, title: '', width: 'w-[90px]' }
    ];

    const handleDelete = (id: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    // Calculate amount for each item
    const calculateAmount = (quantity: number, rate: number) => {
        return (quantity * rate).toLocaleString();
    };

    const SortIcon = () => (
        <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
        >
            <path
                d="M9.5 11.5L10.207 10.793L12 12.586V2.5H13V12.586L14.793 10.793L15.5 11.5L12.5 14.5L9.5 11.5Z"
                fill="#808080"
            />
            <path d="M8.5 3.5H1.5V4.5H8.5V3.5Z" fill="#808080" />
            <path d="M8.5 6.5H3.5V7.5H8.5V6.5Z" fill="#808080" />
            <path d="M8.5 9.5H5.5V10.5H8.5V9.5Z" fill="#808080" />
        </svg>
    );

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
        <div className="flex flex-col h-[414px] rounded-2xl bg-white shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-f-3xl font-light text-neutral-1400">Shopping Cart</h2>
            </div>

            <div className="flex flex-col overflow-hidden pb-6">
                <div className="border-gray-300">
                    {/* Header Row */}
                    <div className="flex h-[61px]">
                        {headers.map((header) => (
                            <div
                                key={header.id}
                                className={`flex items-center ${header.width} px-4 py-3 bg-slate-50 border-r border-gray-300 last:border-r-0`}
                            >
                                <div className="flex items-center gap-1">
                                    <span className="text-xl font-light text-gray-900">{header.title}</span>
                                    {header.hasIcon && <SortIcon />}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Items */}
                    {cart.map((item, index) => (
                        <div
                            key={item.id}
                            className={`flex h-[60px] border-b border-gray-300 ${
                                index % 2 === 1 ? 'bg-slate-50' : ''
                            }`}
                        >
                            <div className={`flex items-center px-4 py-3 ${headers[0].width}`}>
                                <p className="text-xl font-semibold text-gray-700">
                                    {item.vintage || '-'}
                                </p>
                            </div>
                            <div className={`flex items-center px-4 py-3 ${headers[1].width}`}>
                                <p className="text-xl font-light text-gray-700">
                                    {item.quantity.toLocaleString()}
                                </p>
                            </div>
                            <div className={`flex items-center px-4 py-3 ${headers[2].width}`}>
                                <p className="text-xl font-light text-gray-700">
                                    {item.rate.toLocaleString()}
                                </p>
                            </div>
                            <div className={`flex items-center px-4 py-3 ${headers[3].width}`}>
                                <p className="text-xl font-light text-gray-700">
                                    {calculateAmount(item.quantity, item.rate)}
                                </p>
                            </div>
                            <div className={`flex items-center px-4 py-3 ${headers[4].width}`}>
                                <button
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}