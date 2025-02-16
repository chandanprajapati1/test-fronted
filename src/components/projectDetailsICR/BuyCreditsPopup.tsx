import React, { useState, useEffect } from 'react';

interface Vintage {
    year: number;
    available_credits: number;
    price_slabs: Array<{
        range_start: number;
        range_end: number;
        price_per_credit: number;
    }>;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

interface QuantityInputProps {
    vintageIndex: number;
    tierIndex: number;
    minQuantity: number;
    maxQuantity: number;
    quantities: Record<number, Record<number, number>>;
    onQuantityChange: (vintageIndex: number, tierIndex: number, newQuantity: number) => void;
}

interface PricingRowProps {
    range: string;
    value: number;
    vintageIndex: number;
    tierIndex: number;
    minQuantity: number;
    maxQuantity: number;
    quantities: Record<number, Record<number, number>>;
    onQuantityChange: (vintageIndex: number, tierIndex: number, newQuantity: number) => void;
}

interface CartItemProps {
    label: string;
    value: number | string;
    isTotal?: boolean;
}

interface ShoppingCartProps {
    totalCredits: number;
    buyAmount: number;
    discount: number;
    platformFee: number;
    vat: number;
    total: number;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
    vintageIndex,
    tierIndex,
    minQuantity,
    maxQuantity,
    quantities,
    onQuantityChange,
}) => {
    const handleQuantityChange = (newQuantity: number) => {
        onQuantityChange(
            vintageIndex,
            tierIndex,
            Math.max(minQuantity, Math.min(maxQuantity, newQuantity))
        );
    };

    const currentQuantity = quantities[vintageIndex]?.[tierIndex] || 0;

    return (
        <div className="flex h-9 w-60 items-center rounded-lg border border-[#e6e6e6] text-black">
            <button
                className="flex h-full w-8 items-center justify-center border-r border-[#d9d9d9]"
                onClick={() => handleQuantityChange(currentQuantity - 1)}
                disabled={currentQuantity <= minQuantity}
            >
                -
            </button>
            <input
                type="number"
                value={currentQuantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
                className="w-full text-center"
                min={minQuantity}
                max={maxQuantity}
            />
            <button
                className="flex h-full w-8 items-center justify-center border-l border-[#d9d9d9]"
                onClick={() => handleQuantityChange(currentQuantity + 1)}
                disabled={currentQuantity >= maxQuantity}
            >
                +
            </button>
        </div>
    );
};

const PricingRow: React.FC<PricingRowProps> = ({
    range,
    value,
    vintageIndex,
    tierIndex,
    minQuantity,
    maxQuantity,
    quantities,
    onQuantityChange,
}) => {
    const quantity = quantities[vintageIndex]?.[tierIndex] || 0;
    const finalValue = quantity * value;

    return (
        <>
            <div className="h-[1px] bg-[#E6E6E6]"></div>
            <div className="flex items-center justify-between">
                <p className="text-xl font-light text-neutral-1400">{range}</p>
                <div className="flex items-center gap-4">
                    <p className="min-w-[60px] bg-neutral-100 text-center text-base font-semibold text-neutral-1200">
                        $ {value}
                    </p>
                    <QuantityInput
                        vintageIndex={vintageIndex}
                        tierIndex={tierIndex}
                        minQuantity={minQuantity}
                        maxQuantity={maxQuantity}
                        quantities={quantities}
                        onQuantityChange={onQuantityChange}
                    />
                    <p className="w-[100px] text-right text-base font-semibold text-neutral-1200">
                        $ {finalValue.toFixed(2)}
                    </p>
                </div>
            </div>
        </>
    );
};

const CartItem: React.FC<CartItemProps> = ({ label, value, isTotal = false }) => (
    <div className={`flex justify-between items-center w-full px-4 py-3 ${!isTotal ? 'border-b border-[#d9d9d9]' : ''}`}>
        <p className={`text-xl ${isTotal ? 'text-neutral-1200' : 'font-light text-neutral-1200'}`}>{label}</p>
        <p className="text-xl text-neutral-1400">{value}</p>
    </div>
);

const ShoppingCart: React.FC<ShoppingCartProps> = ({
    totalCredits,
    buyAmount,
    discount,
    platformFee,
    vat,
    total,
}) => {
    const formatCurrency = (value: number) => `$ ${value.toFixed(2)}`;

    const cartItems = [
        { label: 'Number of credits', value: totalCredits },
        { label: 'Buy Amount', value: formatCurrency(buyAmount) },
        { label: 'Discount', value: formatCurrency(discount) },
        { label: 'Service Fee', value: formatCurrency(platformFee) },
        { label: 'Vat', value: formatCurrency(vat) },
    ];

    return (
        <div className="flex flex-col  rounded-2xl bg-pink-400 shadow-[0px_1.5px_23px_3px_rgba(0,0,0,0.08)]">
            <div className="px-6 py-4 border-b border-[#e6e6e6]">
                <h2 className="text-f-3xl font-light text-neutral-1400">Shopping Cart</h2>
            </div>
            <div className="p-6">
                <div className="flex flex-col gap-0.5">
                    {cartItems.map((item, index) => (
                        <CartItem key={index} label={item.label} value={item.value} />
                    ))}
                    <CartItem label="Net Total Amount" value={formatCurrency(total)} isTotal={true} />
                </div>
            </div>
        </div>
    );
};

const ExpandableVintageCard: React.FC<any> = ({ data, quantities, onQuantityChange }) => {
    const [expandedStates, setExpandedStates] = useState<Record<number, boolean>>({});

    const toggleExpanded = (index: number) => {
        setExpandedStates((prevStates) => ({
            ...prevStates,
            [index]: !prevStates[index],
        }));
    };

    return (
        <>
            {data.vintages.map((vintage: Vintage, index: number) => (
                <div key={index} className="flex flex-col gap-2 rounded-xl border border-[#e6e6e6] bg-white p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xl font-semibold text-neutral-1400">Vintage {vintage.year}</p>
                            <p className="text-sm">
                                <span className="text-neutral-1400">{vintage.available_credits}</span>
                                <span className="text-[#808080]"> Credits Available</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="rounded bg-[#cde9ff] px-3 py-2">
                                {/* <p className="text-sm font-semibold text-neutral-1400">
                                    {Object.values(quantities[index] || {}).reduce((sum, q) => sum + q, 0)} credits

                                </p> */}
                            </div>
                            <p className="text-base font-semibold text-neutral-1200">
                                $ {vintage.price_slabs.reduce((sum, tier, tierIndex) => sum + ((quantities[index]?.[tierIndex] || 0) * tier.price_per_credit), 0).toFixed(2)}
                            </p>
                            <button
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ccc]/20 transition-transform duration-300"
                                onClick={() => toggleExpanded(index)}
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`transform transition-transform duration-300 ${expandedStates[index] ? 'rotate-180' : ''}`}
                                >
                                    <path d="M8 5L13 10L12.3 10.7L8 6.4L3.7 10.7L3 10L8 5Z" fill="#161616" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div
                        className={`flex flex-col gap-2 overflow-hidden transition-all duration-300 ease-in-out ${expandedStates[index] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                    >
                        {vintage.price_slabs.map((tier, tierIndex) => (
                            <PricingRow
                                key={tierIndex}
                                range={`${tier.range_start} - ${tier.range_end}`}
                                value={tier.price_per_credit}
                                vintageIndex={index}
                                tierIndex={tierIndex}
                                minQuantity={tier.range_start}
                                maxQuantity={tier.range_end}
                                quantities={quantities}
                                onQuantityChange={onQuantityChange}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
};

const BuyCreditsPopup: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
    const [quantities, setQuantities] = useState<Record<number, Record<number, number>>>({});
    const [cartData, setCartData] = useState({
        totalCredits: 0,
        buyAmount: 0,
        discount: 0,
        platformFee: 0,
        vat: 0,
        total: 0,
    });

    const handleQuantityChange = (vintageIndex: number, tierIndex: number, newQuantity: number) => {
        const tier = data.vintages[vintageIndex].price_slabs[tierIndex];
        const clampedQuantity = Math.max(tier.range_start, Math.min(tier.range_end, newQuantity));

        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [vintageIndex]: {
                ...prevQuantities[vintageIndex],
                [tierIndex]: clampedQuantity,
            },
        }));
    };

    useEffect(() => {
        let totalCredits = 0;
        let buyAmount = 0;

        data.vintages.forEach((vintage: any, vintageIndex: any) => {
            vintage.price_slabs.forEach((tier: any, tierIndex: any) => {
                const quantity = quantities[vintageIndex]?.[tierIndex] || 0;
                totalCredits += quantity;
                buyAmount += quantity * tier.price_per_credit;
            });
        });

        const discount = buyAmount * 0.1; // 10% discount
        const platformFee = 1; // Fixed platform fee
        const vat = 0; // No VAT for this example
        const total = buyAmount - discount + platformFee + vat;

        setCartData({
            totalCredits,
            buyAmount,
            discount,
            platformFee,
            vat,
            total,
        });
    }, [quantities, data.vintages]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
            <div className="w-full max-w-2xl max-h-[calc(100vh-2rem)] flex flex-col rounded-xl bg-white shadow-lg overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#E6E6E6] px-6 py-4">
                    <p className="text-xl font-light text-neutral-1400">Buy Credits</p>
                    <button className="rounded-lg p-2.5" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="Close" opacity="0.5">
                                <path id="Vector"
                                    d="M18 7.05L16.95 6L12 10.95L7.05 6L6 7.05L10.95 12L6 16.95L7.05 18L12 13.05L16.95 18L18 16.95L13.05 12L18 7.05Z"
                                    fill="black" />
                            </g>
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col gap-2 overflow-y-auto p-6">
                    <ExpandableVintageCard data={data} quantities={quantities} onQuantityChange={handleQuantityChange} />
                    <ShoppingCart {...cartData} />
                </div>
                <div className="flex h-[69px] items-center justify-end border-t border-[#dee2e6] px-6 py-4">
                    <div className="flex gap-2">
                        <button className="rounded-lg bg-[#808080] px-6 py-3 text-white" onClick={onClose}>Cancel</button>
                        <button className="rounded-lg bg-brand1-500 px-6 py-3 text-white">Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyCreditsPopup;
