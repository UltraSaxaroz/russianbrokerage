'use client';

import React, {useState, useEffect} from 'react';
import {golos} from "@/app/fonts/fonts";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {MapPin, Calendar, Package, Phone, User, Search, ChevronLeft, ChevronRight} from "lucide-react";
import {Toaster} from "@/components/ui/toaster";
import {useToast} from "@/hooks/use-toast";
import {format} from "date-fns";

interface DriverData {
    _id: string;
    fullName: string;
    description: string;
    number: string;
    time: string;
    weight: string;
    locationFrom: string;
    locationTo: string;
}

interface FilterState {
    name: string;
    description: string;
    location: string;
    weight: string;
}

interface PaginationData {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

function isValidDate(dateString: string) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

export default function DriverPage() {
    const [data, setData] = useState<DriverData[]>([]);
    const [filteredData, setFilteredData] = useState<DriverData[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        name: '',
        description: '',
        location: '',
        weight: '',
    });
    const [pagination, setPagination] = useState<PaginationData>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });
    const {toast} = useToast();

    const fetchData = async (page: number = 1) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast({title: "Error", description: "No token found", variant: "destructive"});
                return;
            }

            const response = await fetch(`/api/auth/broking/driver?page=${page}&limit=${pagination.limit}`, {
                method: 'GET',
                headers: {'Authorization': `Bearer ${token}`},
            });

            if (!response.ok) {
                const result = await response.json();
                toast({title: "Error", description: result.message || 'Failed to fetch data', variant: "destructive"});
                return;
            }

            const result = await response.json();
            if (result.data) {
                setData(result.data);
                setPagination({
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages
                });
            } else {
                toast({title: "Info", description: "No data found"});
            }
        } catch (error) {
            toast({title: "Error", description: "Error fetching data", variant: "destructive"});
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = data.filter(item =>
            item.fullName.toLowerCase().includes(filters.name.toLowerCase()) &&
            item.description.toLowerCase().includes(filters.description.toLowerCase()) &&
            (item.locationFrom.toLowerCase().includes(filters.location.toLowerCase()) ||
                item.locationTo.toLowerCase().includes(filters.location.toLowerCase())) &&
            (filters.weight === '' || parseFloat(item.weight) >= parseFloat(filters.weight))
        );
        setFilteredData(filtered);
    }, [data, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFilters(prev => ({...prev, [name]: value}));
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchData(newPage);
        }
    };

    return (
        <div className={`w-full min-h-screen p-4 lg:p-8 ${golos.className}`}>
            <div className="max-w-full mx-auto relative">
                <h1 className={`text-3xl lg:text-4xl font-semibold mb-4 lg:mb-8 text-center text-neutral-900 ${golos.className}`}>Основная
                    панель</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="relative">
                        <Input
                            type="text"
                            name="name"
                            placeholder="Фильтр по имени..."
                            value={filters.name}
                            onChange={handleFilterChange}
                            className="pl-10 pr-4 py-2 w-full"
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    </div>
                    <div className="relative">
                        <Input
                            type="text"
                            name="description"
                            placeholder="Фильтр по описанию..."
                            value={filters.description}
                            onChange={handleFilterChange}
                            className="pl-10 pr-4 py-2 w-full"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    </div>
                    <div className="relative">
                        <Input
                            type="text"
                            name="location"
                            placeholder="Фильтр по локации..."
                            value={filters.location}
                            onChange={handleFilterChange}
                            className="pl-10 pr-4 py-2 w-full"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    </div>
                    <div className="relative">
                        <Input
                            type="text"
                            name="weight"
                            placeholder="Фильтр от веса..."
                            value={filters.weight}
                            onChange={handleFilterChange}
                            className="pl-10 pr-4 py-2 w-full"
                        />
                        <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    </div>
                </div>

                {filteredData.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                            {filteredData.map((item) => {
                                let formattedTime = isValidDate(item.time)
                                    ? format(new Date(item.time), 'PPP')
                                    : item.time;

                                return (
                                    <Card key={item._id}
                                          className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                        <CardContent className="p-4 lg:p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-indigo-100 p-2 rounded-full">
                                                        <User className="h-5 w-5 lg:h-6 lg:w-6 text-indigo-600"/>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-base lg:text-lg text-neutral-900">{item.fullName}</h3>
                                                        <p className="text-xs lg:text-sm text-gray-500">{item.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 lg:gap-4 text-xs lg:text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <Phone className="h-3 w-3 lg:h-4 lg:w-4 text-indigo-500"/>
                                                    <span>{item.number}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-3 w-3 lg:h-4 lg:w-4 text-indigo-500"/>
                                                    <span>{formattedTime}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Package className="h-3 w-3 lg:h-4 lg:w-4 text-indigo-500"/>
                                                    <span>{item.weight}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-3 w-3 lg:h-4 lg:w-4 text-indigo-500"/>
                                                    <span>{item.locationFrom} → {item.locationTo}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                        <div className="flex justify-center items-center mt-6 space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                            >
                                <ChevronLeft className="h-4 w-4"/>
                            </Button>
                            <span className="text-sm">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                            >
                                <ChevronRight className="h-4 w-4"/>
                            </Button>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-indigo-600 text-lg">Нет доступных данных</p>
                )}
                <Toaster/>
            </div>
        </div>
    )
}