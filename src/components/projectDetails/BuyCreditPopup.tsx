import React, { useState, useEffect } from 'react';
import ShoppingCart from "@/components/projectDetails/Popups/Buy/CartSection";
import CartSummary from "@/components/projectDetails/Popups/Buy/CartDetailSection";
import { useDispatch, useSelector } from "react-redux";
import VintageTable from "@/components/projectDetails/Popups/Buy/VintageTable";
import { getAuthCredentials } from '@/utils/auth-utils';
import { customToast } from "@/components/ui/customToast";
import { getBaseUrl } from '@/utils/axios-api';
import { increasecart } from '@/app/store/slices/addCartSlice';
import { useRouter } from 'next/navigation';
import { encryptString } from '@/utils/enc-utils';
import { formatNumber } from "@/utils/number-utils";
import { isHtmlTagPresent } from '@/utils/input-utils';
import SelectField from "@/components/ui/selectField";

interface CartItem {
    id: number;
    vintage: string | null;
    quantity: number;
    rate: number;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    tax: any;
}


interface PriceSlab {
    range_start: number;
    range_end: number;
    price_per_credit: number;
}

interface Vintage {
    year: number;
    available_credits: number;
    price_slabs: PriceSlab[];
}


const BuyCreditPopup: React.FC<ModalProps> = ({ isOpen, onClose, data, tax }) => {
    const [vintage, setVintage] = useState<string>('');
    const [quantity, setQuantity] = useState<any>('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [currentVinatgeQuantity, setCurrentVinatgeQuantity] = useState('');
    const projectDetails = useSelector((state: any) => state.projectDetails.projectDetails);
    const dispatch = useDispatch();
    const router = useRouter()

    useEffect(() => {
        console.log("project details ", projectDetails)
    }, [projectDetails])

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleAddToCart = () => {
        const numQuantity = parseFloat(String(quantity));
        const vintageData = projectDetails.batches.vintages.find((v: any) => v.year === vintage);

        if (!vintageData) {
            customToast.error("Selected vintage not found");
            return false;
        } else if (quantity == 0) {
            customToast.error("Requested quantity should be greater than 0.");
            return false;
        } else if (quantity > vintageData.total_Credit) {
            customToast.error("Requested quantity exceeds available credits.");
            return false;
        }
        const pricePerCredit = vintageData.per_credit_price;

        // Handle vintage/slabs based cart update
        const existingCartItemIndex = cart.findIndex(item => item.vintage === vintage);

        if (existingCartItemIndex !== -1) {
            // Update quantity of existing item
            setCart(prevCart => {
                const updatedCart = [...prevCart];
                const existingItem = updatedCart[existingCartItemIndex];

                // Get vintage data to check available credits
                const vintageData = projectDetails.batches.vintages.find((v: any) => v.year === vintage);
                const totalQuantity = existingItem.quantity + numQuantity;

                if (vintageData && totalQuantity > vintageData.total_credit) {
                    customToast.error("Total quantity exceeds available credits.");
                    return prevCart;
                }

                updatedCart[existingCartItemIndex] = {
                    ...existingItem,
                    quantity: totalQuantity,
                    rate: pricePerCredit
                };

                return updatedCart;
            });
        } else {
            // Add new vintage item
            const newCartItem: CartItem = {
                id: Date.now(),
                vintage: vintage,
                quantity: numQuantity,
                rate: pricePerCredit,
            };
            setCart(prevCart => [...prevCart, newCartItem]);
        }

        setTimeout(() => {
            const cartSection = document.querySelector('.cart-summary');
            const scrollContainer = document.querySelector('.overflow-y-auto');
            if (cartSection && scrollContainer) {
                const cartOffset = cartSection.getBoundingClientRect().top;
                const containerOffset = scrollContainer.getBoundingClientRect().top;
                const scrollTo = cartOffset - containerOffset + scrollContainer.scrollTop;

                scrollContainer.scrollTo({
                    top: scrollTo,
                    behavior: 'smooth'
                });
            }
        }, 100);
        // Reset only vintage based inputs
        setVintage('');
        setQuantity('');

    };

    const quantityHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (currentVinatgeQuantity == '') { return; }
        const value = e.currentTarget.value as unknown as number;
        console.log("quantityHandler", value);
        if (value >= 0 && value <= Number(currentVinatgeQuantity)) {
            setQuantity(value ? value : ''); // Handle empty input gracefully
        }

        // setUserReqQuantity(value);
    };



    const generateVintageCredits = (cart: any, vintages: any) => {
        console.log("generateVintageCredits", cart, vintages)
        return cart.map((cartItem: any) => {
            const vintage = vintages.find((v: any) => v.year === cartItem.vintage);

            return vintage
                ? {
                    vintage_id: vintage._id,
                    no_of_credits: cartItem.quantity
                }
                : null;
        }).filter((item: any) => item !== null); // Filter out any null results if no vintage match found
    };

    const addToCartHandler = async () => {

        let newData = {};

        const totalCredits = cart.reduce((sum, item) => sum + item.quantity, 0);
        console.log("addToCartHandler", totalCredits, cart, projectDetails);
        const vintage_credits = generateVintageCredits(cart, projectDetails.batches.vintages);
        console.log("vintage_credits", vintage_credits);
        newData = {
            "batch_id": projectDetails.batches._id,
            "project_id": projectDetails._id,
            "vintages": vintage_credits
        }

        console.log("addToCartHandler newData", newData);

        const token = getAuthCredentials();

        if (!token?.token) {
            console.error("No valid token found");
            customToast.error("Unauthorized: Missing authentication token");
            return;
        }

        try {
            let requestBody = newData

            if (isHtmlTagPresent(requestBody)) {
                customToast.error("Invalid Input!");
                return;
            }
            let encryptedPayload = {};
            if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            const response = await fetch(`${getBaseUrl('project')}/add-to-cart`, {
                method: 'POST',
                body: JSON.stringify({ data: encryptedPayload }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`,
                },
            });

            if (!response.ok) {
                const errorMessage: any = await response.text();
                const errorMessageText: any = JSON.parse(errorMessage).message
                console.error("Server Error:", errorMessageText);
                customToast.error(errorMessageText || "Error while adding to cart.");
                setTimeout(() => {
                    router.push('/company-onboarding')
                }, 2000)
                onClose()
                return;
            }
            const result = await response.json();
            console.log("Updated Cart Details:", result);
            dispatch(increasecart())
            // Show success toast notification
            customToast.success("Credits successfully added to your cart!");

            onClose();
            return result.data || [];
        } catch (error: any) {
            // let errorMsg = JSON.stringify(error)
            console.error("Unexpected error:", error);
            // customToast.error("Something went wrong. Please try again.");
        }
    }

    // Implement scroll prevention when modal mounts
    useEffect(() => {
        // Save current scroll position and prevent scrolling
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflowY = 'scroll'; // Prevent layout shift
        document.body.style.paddingRight = 'var(--scrollbar-width)'; // Prevent layout shift

        // Cleanup function when modal unmounts
        return () => {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflowY = '';
            document.body.style.paddingRight = '';
            window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50   bg-opacity-50 bg-black flex items-center justify-center p-4"
            onClick={handleOverlayClick}>
            <div
                className="w-full max-w-5xl max-h-[calc(100vh-7rem)] flex flex-col rounded-xl bg-white shadow-lg overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#E6E6E6] px-6 py-4">
                    <p className="text-xl font-light text-neutral-1400 ">Buy Credits</p>
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
                <RenderDynamicContent
                    projectDetails={projectDetails}
                    handleAddToCart={handleAddToCart}
                    quantityHandler={quantityHandler}
                    quantity={quantity}
                    currentVinatgeQuantity={currentVinatgeQuantity}
                    setCurrentVinatgeQuantity={setCurrentVinatgeQuantity}
                    setVintage={setVintage}
                    vintage={vintage}
                    setCart={setCart}
                    cart={cart}
                    tax={tax}
                />
                <div className="flex items-center justify-end border-t border-[#dee2e6] px-6 py-4">
                    <div className="flex gap-2">
                        <button className="rounded-lg bg-[#808080] px-6 py-3 text-white" onClick={onClose}>Cancel
                        </button>
                        {cart.length > 0 && <button className="rounded-lg bg-brand1-500 px-6 py-3 text-white" onClick={addToCartHandler}>Add to cart</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const RenderDynamicContent = ({ projectDetails, handleAddToCart, quantityHandler, quantity, currentVinatgeQuantity, setCurrentVinatgeQuantity, setVintage, vintage, setCart, cart, tax }: any) => {
    return (
        <div className="flex flex-col gap-2 overflow-y-auto p-6 hide-scrollbar">
            <div className="rounded-2xl bg-white shadow-md">
                <div className="border-b border-gray-200 px-4 py-4">
                    <h2 className="text-f-3xl font-light text-neutral-1400">Credits</h2>
                </div>
                <VintageTable vintages={projectDetails?.batches?.vintages || []} />
            </div>
            <AddToCart
                projectDetails={projectDetails}
                handleAddToCart={handleAddToCart}
                quantityHandler={quantityHandler}
                quantity={quantity}
                currentVinatgeQuantity={currentVinatgeQuantity}
                setCurrentVinatgeQuantity={setCurrentVinatgeQuantity}
                setVintage={setVintage}
                vintage={vintage}
            />
            {cart.length > 0 && <div className="flex flex-wrap gap-4 mt-xl sc-sm:flex-row cart-summary  ">
                <ShoppingCart cart={cart} setCart={setCart} />
                <CartSummary cart={cart} tax={tax} />
            </div>}
        </div>
    );
};

const AddToCart = ({ projectDetails, handleAddToCart, quantityHandler, quantity, currentVinatgeQuantity, setCurrentVinatgeQuantity, setVintage, vintage }: any) => {

    const vintageOptions: any = projectDetails.batches.vintages
        ? projectDetails.batches.vintages
            .filter((vintage: any) => vintage.total_credit !== 0 && vintage.per_credit_price !== 0)
            .map((vintage: any) => ({
                _id: vintage.year.toString(),
                name: vintage.year.toString(),
                originalData: vintage
            }))
        : [];

    return <div className="rounded-2xl bg-white shadow-md">
        <div className="border-b border-gray-200 px-4 py-4">
            <h2 className="text-f-3xl font-light text-neutral-1400 ">Choose your vintage</h2>
        </div>

        <div className="p-4  space-y-6">
            <div className="flex flex-col sc-xs:flex-row items-stretch sc-xs:items-end gap-4">
                <div className="flex-1 space-y-2 ">
                    <SelectField
                        value={vintage}
                        className="flex flex-col gap-2 w-full"
                        label="Vintages" placeholder="Select Vintage"
                        options={vintageOptions}
                        dimension="small"
                        variant="normal"
                        onChange={(e) => {
                            setVintage(e.target.value);
                            projectDetails.batches.vintages?.forEach((vintage: any) => { // Changed map to forEach since we're not using the return value
                                if (vintage.year == e.target.value) {
                                    setCurrentVinatgeQuantity(vintage.total_credit);
                                }
                            });
                        }} required
                        inputBgColor='bg-transparent'
                    />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center ">
                        <label className="text-sm text-neutral-1200">Quantity ({currentVinatgeQuantity == '' ? formatNumber(projectDetails.total_credit, 3) : currentVinatgeQuantity})</label>
                    </div>
                    <input
                        type='text'
                        placeholder="Enter quantity"
                        value={quantity}
                        onKeyDown={(e) => {
                            // First check if it's a control key
                            if (e.key === "Backspace" || e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Delete" || e.key === "Tab") {
                                return; // Allow these keys
                            }

                            // Then check for numbers and decimal
                            if (!/[0-9.]/.test(e.key)) {
                                e.preventDefault();
                                return;
                            }

                            // Handle decimal point
                            const value = (e.target as HTMLInputElement).value;
                            if (e.key === '.') {
                                if (value.includes('.') || value === '') {
                                    e.preventDefault();
                                }
                                return;
                            }

                            // Check decimal places
                            if (value.includes('.') && value.split('.')[1]?.length >= 3) {
                                e.preventDefault();
                            }
                        }}
                        onChange={quantityHandler}
                        className="w-full px-4 py-2 h-[46px] text-black text-sm rounded-md border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-brand1-500 hover:border-brand1-500"
                    />

                    {/* <input
                        type="number"
                        value={quantity === 0 ? '' : quantity} // Display empty if zero
                        onInput={(e) => {
                            const value = e.currentTarget.valueAsNumber;
                            if ((value > 0 && value <= Number(currentVinatgeQuantity)) || e.currentTarget.value === "") {
                                setQuantity(value || 0); // Handle empty input gracefully
                            }
                        }}
                        placeholder="Enter quantity"
                        min="1"
                        className="w-full h-9 px-4 py-2 text-black text-sm rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    /> */}

                </div>

                <button
                    onClick={handleAddToCart}
                    className="h-[46px] px-6 py-3 text-sm text-white rounded-lg bg-brand1-500 hover:bg-[#4bb588] transition-colors">
                    Add
                </button>
            </div>
        </div>
    </div>
};

export default BuyCreditPopup;
