import React from 'react';
import AdminLayout from "@/components/layouts/admin";
import Analytics from '@/components/analytics/Analytics';


export default function EmissionsDashboard() {
    return (
        <AdminLayout>
            <Analytics />
        </AdminLayout>
    );
}