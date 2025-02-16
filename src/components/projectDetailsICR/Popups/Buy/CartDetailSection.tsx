import React from 'react';

// Define the CartItem type
interface CartItem {
    id: number;
    quantity: number;
    rate: number;
}

interface CartSummaryProps {
    cart: CartItem[];
    tax: {
        platform_fee: number;
        gst: number;
        gst_status: string;
    };
}

const CartSummary = ({ cart, tax }: CartSummaryProps) => {
    // Calculate total credits
    const totalCredits = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Calculate buy amount (subtotal)
    const buyAmount = cart.reduce((sum, item) => sum + item.quantity * item.rate, 0);

    // Calculate discount (10% for example - adjust as needed)
    const discountRate = 0;
    const discount = buyAmount * discountRate;

    // Calculate platform fee (0.01% for example - adjust as needed)
    const platformFeeRate = Number(tax.platform_fee) * 0.01;
    const platformFee = buyAmount * platformFeeRate;

    // Calculate VAT (if applicable)
    const vatRate = tax.gst_status === "yes" ? Number(tax.gst) * 0.01 : 0;
    const vat = buyAmount * vatRate;

    // Calculate net total
    const netTotal = buyAmount - discount + platformFee + vat;

    // Prepare summary items
    const summaryItems = [
        {
            id: 1,
            label: 'Number of credits',
            value: totalCredits.toLocaleString(),
            prefix: ''
        },
        {
            id: 2,
            label: 'Buy Amount',
            value: buyAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            prefix: '$'
        },
        {
            id: 3,
            label: 'Discount',
            value: discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            prefix: '$'
        },
        {
            id: 4,
            label: 'Service Fee',
            value: platformFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            prefix: '$'
        },
        {
            id: 5,
            label: 'GST',
            value: vat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            prefix: '$'
        },
        {
            id: 6,
            label: 'Net Total Amount',
            value: netTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            prefix: '$',
            isTotal: true
        }
    ];

    return (
        <div className="w-full rounded-2xl bg-white shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-f-3xl font-light text-neutral-1400">Cart Summary</h2>
            </div>
            <div className="px-4 py-6">
                <div className="space-y-0.5">
                    {summaryItems.map((item) => (
                        <div
                            key={item.id}
                            className={`flex justify-between items-center h-12 px-4 py-3 ${!item.isTotal ? 'border-b border-gray-200' : ''
                                }`}
                        >
                            <p
                                className={`text-xl ${item.isTotal
                                    ? 'text-gray-700'
                                    : 'font-light text-gray-700'
                                    }`}
                            >
                                {item.label}
                            </p>
                            <p className="text-xl text-gray-900">
                                {item.prefix}
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CartSummary;
