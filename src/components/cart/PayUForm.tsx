import React, { useEffect } from 'react';

const PayUForm = ({ decryptedData }: any) => {
    useEffect(() => {
        // Automatically submit the form once it's loaded and populated
        const form = document.getElementById('payuForm') as HTMLFormElement;
        if (form) {
            form.submit();
        }
    }, []);

    return (
        <form
            id="payuForm"
            action="https://test.payu.in/_payment"
            method="post"
            style={{ display: 'none' }} // Hide the form since we're auto-submitting
        >
            <input type="hidden" name="key" value={decryptedData.key} />
            <input type="hidden" name="txnid" value={decryptedData.order_id} />
            <input type="hidden" name="productinfo" value={decryptedData.productinfo} />
            <input type="hidden" name="amount" value={String(decryptedData.order_amount)} />
            <input type="hidden" name="email" value={decryptedData.email} />
            <input type="hidden" name="firstname" value={decryptedData.user_name} />
            <input type="hidden" name="lastname" value={decryptedData.user_name} /> {/* Add value if available */}
            <input type="hidden" name="surl" value={decryptedData.surl} />
            <input type="hidden" name="furl" value={decryptedData.furl} />
            <input type="hidden" name="phone" value={decryptedData.phone_number} />
            <input type="hidden" name="hash" value={decryptedData.hash} />
            <input type="submit" value="Submit" />
        </form>
    );
};

export default PayUForm;
