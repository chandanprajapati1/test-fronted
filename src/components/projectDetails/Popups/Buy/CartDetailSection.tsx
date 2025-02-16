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
        platform_fees_tax: string;
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

   /* const platformFeeRate = Number(tax.platform_fee) * 0.01;
    const platformFee = buyAmount * platformFeeRate;
    const platformFeeTaxRate =  platformFee * Number(tax.gst) * 0.01;
    const platformFeeTax = tax.gst_status === "yes" ? Number(platformFeeTaxRate)  : 0;*/

    // Calculate VAT (if applicable)
    const vatRate = tax.gst_status === "yes" ? Number(tax.gst) * 0.01 : 0;
    const vat = buyAmount * vatRate;

    // Calculate net total
    //const netTotal = buyAmount - discount + platformFee + vat + platformFeeTax ;
    const netTotal = buyAmount - discount + vat ;

    // Prepare summary items
    const summaryItems = [
        {
            id: 1,
            label: 'Number of credits',
            value: totalCredits.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
            prefix: ''
        },
        {
            id: 2,
            label: 'Buying Amount',
            value: buyAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            prefix: '$'
        },
        {
            id: 3,
            label: 'Discount',
            value: discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            prefix: '$'
        },
       /* {
            id: 4,
            label: 'Service Fee',
            value: platformFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            prefix: '$'
        },
        {
            id: 5,
            label: 'Service Fee GST',
            value: platformFeeTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            prefix: '$'
        },*/
        {
            id: 6,
            label: 'GST/Vat',
            value: vat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            prefix: '$'
        },
        {
            id: 7,
            label: 'Net Total Amount',
            value: netTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            prefix: '$',
            isTotal: true
        }
    ];

    return (
        <div className="flex-1 rounded-2xl bg-white shadow-md whitespace-nowrap sc-sm:min-w-[350px]">
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
                                className={`text-f-l tracking-[-1px] ${item.isTotal
                                    ? 'text-neutral-1400'
                                    : 'font-light text-neutral-1200'
                                    }`}
                            >
                                {item.label}
                            </p>
                            <p className="text-f-l text-neutral-1400 tracking-[-1px]">
                                {item.prefix} {item.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CartSummary;
