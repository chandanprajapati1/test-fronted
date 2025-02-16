import React, { useState } from 'react';
import { getAuthCredentials } from '@/utils/auth-utils';
import crypto from 'crypto';
import PayUForm from './PayUForm';
import { getBaseUrl } from "@/utils/axios-api";
import { customToast } from '../ui/customToast';
import { encryptString } from '@/utils/enc-utils';

const TotalAmount = ({ projectDetail, platformFees, totalCredits, totalTax, totalPriceInclusive, totalPriceExclusive }: any) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [decryptedData, setDecryptedData] = useState(null);
    // Predefined key and IV - ensure these match what the server uses
    const key = Buffer.from("asasasasasasasasasasasasasasasas", 'utf8'); // 32-byte key
    const iv = Buffer.from("asasasasasasasas", 'utf8');                   // 16-byte IV

    const decrypt = (encryptedData: string, iv: Buffer) => {
        if (!encryptedData || !iv) {
            console.error("Missing encrypted data or IV");
            throw new Error("Missing encrypted data or IV");
        }

        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    };

    const updateProjectDetails = async () => {
        const token = getAuthCredentials();

        const cartItemIds = projectDetail.map(({ cart_item }: any) => cart_item?._id);
        if (!cartItemIds.length) return;

        if (!token?.token) {
            throw new Error('Unauthorized: Missing authentication token');
        }

        try {
            let requestBody = { cart_ids: cartItemIds }
            let encryptedPayload = {};
            if(Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0){
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            const response = await fetch(`${getBaseUrl('project')}/create-order`, {
                method: 'POST',
                body: JSON.stringify({ data: encryptedPayload }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`,
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed: ${response.statusText} - ${errorMessage}`);
            }

            const result = await response.json();
            console.log('Encrypted response:', result);
            customToast.success("Order placed Successfully.");
            // Extract and validate the encrypted data and IV
            const encryptedData = result.data?.reponse;
            if (!encryptedData) {
                console.error("Encrypted data is missing in the response.");
                throw new Error("Encrypted data is missing in the response.");
            }

            // Decrypt the response
            const decryptedData = decrypt(encryptedData, iv);

            console.log('Decrypted response:', decryptedData);
            setDecryptedData(JSON.parse(decryptedData));
            return JSON.parse(decryptedData); // Parse JSON if necessary
        } catch (error: any) {
            throw error;
        }
    };

    const paymentHandler = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await updateProjectDetails();
        } finally {
            setIsProcessing(false);
        }
    };

    if (!projectDetail || projectDetail.length === 0) {
        return <div className="text-center py-l text-gray-500">No items in the cart.</div>;
    }

    return (
        <div className="py-l w-full mt-xl flex items-center justify-end text-gray-700 bg-white">
            <div className="flex px-l flex-col text-center">
                <p className="text-f-xl font-normal">$0</p>
                <p className="text-f-m">Discount</p>
            </div>
            <div className="flex px-l flex-col text-center border-x border-neutral-500">
                <p className="text-f-xl font-normal">${platformFees}</p>
                <p className="text-f-m">Service Fee</p>
            </div>
            <div className="flex px-l flex-col text-center">
                <p className="text-f-xl font-normal">${totalPriceInclusive}</p>
                <p className="text-f-m">Net Total Amount</p>
            </div>
            <div className="flex border-l border-neutral-500 flex-col text-center font-bold px-l">
                <div
                    className={`flex gap-s items-center px-4xl py-s rounded-lg border ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand1-500 border-brand1-500'
                        }`}
                    onClick={!isProcessing ? paymentHandler : undefined}
                >
                    <div className="text-white font-normal text-f-m">
                        {isProcessing ? 'Processing...' : 'Proceed to Pay'}
                    </div>
                </div>
            </div>
            {decryptedData && <PayUForm decryptedData={decryptedData} />}
        </div>
    );
};

export default TotalAmount;
