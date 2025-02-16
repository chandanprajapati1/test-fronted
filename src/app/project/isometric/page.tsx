'use client'
import React, { useEffect, useState } from 'react';
import { MapPin, ArrowUpRight, Leaf } from 'lucide-react';
import axiosApi from '@/utils/axios-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import AdminLayout from "@/components/layouts/admin";
import { Button } from "@/components/ui/button";
import { customToast } from "@/components/ui/customToast";
import { encryptString } from '@/utils/enc-utils';

interface Project {
    id: string;
    name: string;
    status: string;
    url: string;
    pathway: string;
    facilities: Array<{ name: string; description: string }>;
    issued_credits_total: { credits: number; credit_kgs: number };
    retired_credits_total: { credits: number; credit_kgs: number };
    supplier: {
        organisation: {
            name: string;
            domain: string;
        };
    };
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [claimingProject, setClaimingProject] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await axiosApi.auth.get('/isometric-projects');
                setProjects(response.data.nodes);
                setError(null);
            } catch (err) {
                setError('Failed to load projects');
                console.error('Error fetching projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleClaimProject = async (projectId: string) => {
        try {
            setClaimingProject(projectId);
            const requestBody = { project_id: projectId };
            let encryptedPayload = {};
            if (Object.keys(requestBody).length && process.env.EMAIL_CHECK && process.env.EMAIL_CHECK.length > 0) {
                encryptedPayload = encryptString(JSON.stringify(requestBody), process.env.EMAIL_CHECK);
            }
            await axiosApi.auth.post('/claim-isometric-project', { data: encryptedPayload });
            customToast.success("The project has been successfully claimed.");
        } catch (err) {
            console.error('Error claiming project:', err);
            customToast.error("Failed to claim the project. Please try again.");
        } finally {
            setClaimingProject(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'validated':
                return 'bg-success/10 text-success';
            case 'under_validation':
                return 'bg-warning/10 text-warning';
            default:
                return 'bg-neutral-200 text-neutral-700';
        }
    };

    const formatNumber = (num: number) => {
        if (num === 0) return '0';
        return num.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-neutral-200 rounded w-48"></div>
                        <div className="h-4 bg-neutral-200 rounded w-64"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <p className="text-danger mb-4">{error}</p>
                    <button
                        onClick={() => router.refresh()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-neutral-900">Carbon Removal Projects</h1>
                    <p className="mt-2 text-neutral-600">Explore our verified carbon removal projects</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge className={`${getStatusColor(project.status)} capitalize`}>
                                        {project.status.replace('_', ' ')}
                                    </Badge>
                                    <a
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-tertiary hover:text-secondary transition-colors"
                                    >
                                        <ArrowUpRight className="w-5 h-5" />
                                    </a>
                                </div>
                                <CardTitle className="text-xl font-bold line-clamp-2">
                                    {project.name}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>
                                        {project.facilities[0]?.name || 'Location not specified'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Leaf className="w-4 h-4 text-primary" />
                                    <span className="text-sm text-neutral-700 capitalize">
                                        {project.pathway.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-neutral-200">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-neutral-600">Issued Credits</p>
                                            <p className="text-lg font-semibold text-neutral-900">
                                                {formatNumber(project.issued_credits_total.credits)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-neutral-600">Retired Credits</p>
                                            <p className="text-lg font-semibold text-neutral-900">
                                                {formatNumber(project.retired_credits_total.credits)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden">
                                            {project.supplier.organisation.domain && (
                                                <img
                                                    src={`https://www.google.com/s2/favicons?domain=${project.supplier.organisation.domain}&sz=32`}
                                                    alt={project.supplier.organisation.name}
                                                    className="w-4 h-4"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">
                                                {project.supplier.organisation.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-neutral-200">
                                    <Button
                                        onClick={() => handleClaimProject(project.id)}
                                        disabled={claimingProject === project.id}
                                        className="w-full"
                                        variant="secondary"
                                    >
                                        {claimingProject === project.id ? (
                                            <span className="flex items-center gap-2">
                                                <div
                                                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                Claiming...
                                            </span>
                                        ) : (
                                            'Claim Project'
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}