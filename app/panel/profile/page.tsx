'use client';

import React, {Suspense, useEffect, useState} from 'react';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { User, Mail, Hexagon } from 'lucide-react'
import ProfileSkeleton from "@/components/skeletons/profileSkeleton";

interface UserData {
    _id: string;
    name: string;
    email: string;
}

interface ApiResponse {
    message?: string;
    data?: UserData[];
}

const Page = () => {
    const [data, setData] = useState<UserData[]>([]);
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast({ title: "Error", description: "No token found", variant: "destructive" });
                return;
            }

            const response = await fetch('/api/user/', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                const result = await response.json();
                toast({ title: "Error", description: result.message || 'Failed to fetch data', variant: "destructive" });
                return;
            }

            const result: ApiResponse = await response.json();
            if (result.data && result.data.length > 0) {
                setData(result.data);
            } else {
                toast({ title: "Info", description: "No data found" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Error fetching data", variant: "destructive" });
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div
            className="w-full min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center p-4">
            <Suspense fallback={<ProfileSkeleton />}>
            {data.length > 0 ? (
                <div className={'w-full flex justify-center'}>
                    {data.map((item) => (
                        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative overflow-hidden">
                            {/* Декоративные элементы */}
                            <div
                                className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
                            <div className="absolute top-0 left-0 w-full h-32 opacity-20">
                                {[...Array(6)].map((_, i) => (
                                    <Hexagon
                                        key={i}
                                        size={64}
                                        className="text-white absolute"
                                        style={{
                                            top: `${Math.random() * 100}%`,
                                            left: `${Math.random() * 100}%`,
                                            transform: `rotate(${Math.random() * 360}deg)`,
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Аватар */}
                            <div className="relative z-10 w-32 h-32 mx-auto mb-4 mt-12">
                                <div className="absolute inset-0 bg-white rounded-full shadow-inner"></div>
                                <User size={80} className="absolute inset-0 m-auto text-gray-400"/>
                            </div>

                            {/* Информация профиля */}
                            <div className="text-center relative z-10">
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h1>
                                <div className="flex items-center justify-center text-gray-600 mb-6">
                                    <Mail size={16} className="mr-2"/>
                                    <span>{item.email}</span>
                                </div>

                                {/* Дополнительная информация */}
                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <p className="text-gray-600">Участник с 2023 года</p>
                                </div>
                            </div>
                        </div>
                        ))}
                </div>
            ) : (
                <div></div>
            )}
            </Suspense>
<Toaster/>
</div>
)
;
}
;

export default Page;
