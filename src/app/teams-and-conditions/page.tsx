'use client'
import React, { useState } from "react";
import AdminLayout from "@/components/layouts/admin";

const Page = () => {

    return (
        <AdminLayout>
            <div className="p-l">
                <div className="container  mx-auto flex flex-col">
                    <div className="mt-l text-3xl px-l border-b pb-l ">Teams & Conditions</div>
                    <div className="flex flex-col gap-xl my-xl px-l ">
                        <div className="flex flex-col gap-s">
                            <div className="font-normal text-xl">1. Introduction, Purpose and Acceptance of the Terms</div>
                            <div className="ml-xl font-normal text-l text-neutral-1200">The Gold Standard Foundation (“GSF”, “Gold Standard” “we”, “us”, or “our”) has created a marketplace page on our website (the “Site”), which provides a venue for Buyers to find, learn about, and purchase Gold Standardcertified carbon credits from select projects located around the world (the "Project Marketplace”). We want to make sure that you have a positive experience. Please read on to find out more about your rights as a Buyer, as well as our expectations of you. By buying Gold Standard-certified carbon credits on the Project Marketplace you accept these Buyer terms and conditions (the “Terms”). To accept and adopt these Terms, please click on I agree to Gold Standard Marketplace's Terms of service box.</div>
                        </div>
                        <div className="flex flex-col gap-s">
                            <div className="font-normal text-xl">2. Privacy and data protection</div>
                            <div className="ml-xl font-normal text-l text-neutral-1200">
                                The Gold Standard takes the protection of personal data very seriously. The Gold Standard is committed to protecting your privacy and providing a safe online experience. Data collected will be strictly used to help us carry out our services. Any personal data received by Gold Standard under these Terms will be handled in accordance with our Privacy Policy. By using the Site, you consent to the collection, storage, use and disclosure of your personal information as described in our Privacy Policy and you consent to Gold Standard Website Terms and Conditions.
                                You acknowledge that Gold Standard may be required by law to conduct background checks on you from time to time. You agree to use your best endeavours to assist us in carrying out any such obligations on background check requirements.
                            </div>
                        </div>
                        <div className="flex flex-col gap-s">
                            <div className="font-normal text-xl">3. Copyright</div>
                            <div className="ml-xl font-normal text-l text-neutral-1200">
                                The images and information related to each Project belong to the independent Project Developers and/or Project Participants. For any Project supported via the online Project Marketplace, you may use the information and the images included in the online Project profile pages on the Gold Standard Site to communicate your climate action efforts, as long as you accredit the relevant Project Developer(s) and/or Project Participants (where relevant). Any dispute in this regard will have to be settled directly between you, the Project Developer(s) and/or Project Participants, without any intervention by Gold Standard, who shall not be held liable in any way.
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </AdminLayout>
    );
};

export default Page;


