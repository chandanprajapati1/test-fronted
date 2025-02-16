import React, {useEffect, useRef, useState} from "react";

// Custom Scrollbar Component
const CustomScrollbar: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [scrollPercentage, setScrollPercentage] = useState(0);


    const handleScroll = () => {
        const element = contentRef.current;
        if (element) {
            const scrolled = element.scrollTop;
            const maxScroll = element.scrollHeight - element.clientHeight;
            const percentage = (scrolled / maxScroll) * 100;
            setScrollPercentage(percentage);
        }
    };

    useEffect(() => {
        const element = contentRef.current;
        if (element) {
            element.addEventListener('scroll', handleScroll);
            return () => element.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <div className="flex justify-between items-start self-stretch flex-grow relative">
            <div
                ref={contentRef}
                className="flex-grow pr-4 h-[194px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {children}
            </div>
            <div className="flex-shrink-0 w-1.5 h-[194px] relative">
                <div className="w-1.5 h-full absolute right-0 bg-neutral-300"/>
                <div
                    className="w-1.5 absolute right-0 bg-primary transition-all duration-200"
                    style={{
                        height: '100px',
                        top: `${scrollPercentage}%`,
                        transform: `translateY(-${scrollPercentage}%)`
                    }}
                />
            </div>
        </div>
    );
};

const Agreement = () => {
    return (
        <div className="flex flex-col justify-start items-center self-stretch h-[260px] gap-2.5 p-4 rounded-lg border border-neutral-300">
            <p className="text-base font-semibold text-center text-neutral-1400">
                Terms & Conditions
            </p>
            <CustomScrollbar>
                <div className="text-base text-justify text-neutral-1200 whitespace-pre-line">
                    <h6 className=" font-bold mb-8">TERMS AND CONDITIONS FOR BUYING CARBON
                        CREDITS VIA THE envr PROJECT MARKETPLACE</h6>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-xl font-semibold mb-4">1. Introduction, Purpose and
                                Acceptance of the Terms</h2>
                            <p className="mb-4">Envr has created a marketplace page on our website (the
                                "Site"), which provides a venue for Buyers to find, learn about, and
                                purchase Standard-certified carbon credits from select projects located
                                around the world (the "Project Marketplace"). We want to make sure that
                                you have a positive experience. Please read on to find out more about
                                your rights as a Buyer, as well as our expectations of you. By buying
                                Gold Standard-certified carbon credits on the Project Marketplace you
                                accept these Buyer terms and conditions (the "Terms"). To accept and
                                adopt these Terms, please click on I agree to Envr Marketplace's Terms
                                of service box.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">2. Restrictions</h2>
                            <p className="mb-4">By shopping on the Envr Marketplace, you understand,
                                agree and represent that:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>You are at least eighteen (18) years old;</li>
                                <li>You have the authority and capability to enter in to these Terms;
                                </li>
                                <li>Payments via the online Project Marketplace platform are made
                                    through third party payment providers, such as PayPal or Stripe;
                                </li>
                                <li>All prices are in US Dollars and all payments should be made in US
                                    Dollars;
                                </li>
                                <li>Envr will take 15% of the proceeds from the price listed at the time
                                    of purchase;
                                </li>
                                <li>After purchase, the Standard-certified carbon credits are publicly
                                    retired in near to real-time;
                                </li>
                                <li>A Retirement Certificate will be sent to your email address;</li>
                                <li>Carbon credits purchased may not be sold onwards;</li>
                                <li>The credit Retirements are publicly displayed in the Envr
                                    Retirements.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">3. Purchasing credits on the Envr
                                Project Marketplace</h2>
                            <p className="mb-4">When you buy ENVR carbon credits, you represent, agree
                                and understand that:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>You have read the project listing, including the project
                                    description;
                                </li>
                                <li>You will submit appropriate and timely payment;</li>
                                <li>The ENVR will transparently retire the credits on your behalf.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">4. Payment terms</h2>
                            <p className="mb-4">Payments can be made:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Online via PayPal or credit/debit card;</li>
                                <li>By direct bank transfer for amounts over $5,000.00</li>
                            </ul>
                            <p className="mt-4">For bank transfers:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide written confirmation via email to credits@ENVR.EARTH</li>
                                <li>ENVR will respond with an invoice within 3 business days</li>
                                <li>Payment must be made within 15 business days</li>
                                <li>Credits will be retired within 3 business days of receiving funds
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">5. Refunds</h2>
                            <p>The ENVR-certified carbon credits are non-refundable once retired.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">6. Tax Deduction</h2>
                            <p>Tax deductibility depends on your local laws. Please consult a tax
                                professional.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">7. Communicating with Project
                                Developers</h2>
                            <p>Contact information for Project Developers is available under each
                                Project's listing.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">8. Privacy and data
                                protection</h2>
                            <p className="mb-4">ENVR handles personal data in accordance with our
                                Privacy Policy. You consent to background checks as required by law.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">9. Copyright</h2>
                            <p>Project images and information belong to the Project Developers and/or
                                Participants. You may use this information to communicate your climate
                                action efforts with proper attribution.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">11. Termination</h2>
                            <p className="mb-4">These Terms apply to each individual purchase. ENVR
                                reserves the right to restrict access and take legal action for
                                fraudulent actions or material breaches.</p>
                        </section>
                    </div>
                </div>
            </CustomScrollbar>
        </div>
    )
}


export { Agreement };