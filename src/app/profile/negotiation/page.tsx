"use client";
import React, { useState } from 'react'
import NegotiationsPage from './NegotiationsPage'
import UserNegotiations from './UserNegotiations'
import AdminLayout from '@/components/layouts/admin';

const Page = () => {
    const [activeCart, setActiveCart] = useState('');
    const [role, setRole] = useState('buyer')

    return (
        <AdminLayout>
                {activeCart === '' && <NegotiationsPage setActiveCart={setActiveCart} setRole={setRole} />}
                {activeCart !== '' && <UserNegotiations activeCart={activeCart} setActiveCart={setActiveCart} role={role} />}
        </AdminLayout>
    )
}

export default Page;
