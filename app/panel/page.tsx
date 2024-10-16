'use client';

import React, { useState, useEffect } from 'react';
import { golos } from "@/app/fonts/fonts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Save, X, MapPin, Calendar, Package, Phone, User, Search } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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

interface ApiResponse {
    message?: string;
    data?: DriverData[];
}

interface FilterState {
    name: string;
    description: string;
    location: string;
    weight: string;
}

function isValidDate(dateString: string) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

export default function DriverPage() {
    const [data, setData] = useState<DriverData[]>([]);
    const [filteredData, setFilteredData] = useState<DriverData[]>([]);
    const [editingDriver, setEditingDriver] = useState<DriverData | null>(null);
    const [formData, setFormData] = useState<Partial<DriverData>>({});
    const [filters, setFilters] = useState<FilterState>({
        name: '',
        description: '',
        location: '',
        weight: '',
    });
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast({title: "Error", description: "No token found", variant: "destructive"});
                return;
            }

            const response = await fetch('/api/auth/broking/driver', {
                method: 'GET',
                headers: {'Authorization': `Bearer ${token}`},
            });

            if (!response.ok) {
                const result = await response.json();
                toast({title: "Error", description: result.message || 'Failed to fetch data', variant: "destructive"});
                return;
            }

            const result: ApiResponse = await response.json();
            if (result.data) {
                setData(result.data);
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

    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast({title: "Error", description: "No token found", variant: "destructive"});
                return;
            }

            const response = await fetch('/api/auth/broking/driver', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify({id}),
            });

            if (response.ok) {
                toast({title: "Success", description: "Driver deleted successfully"});
                setData(data.filter(driver => driver._id !== id));
            } else {
                const result = await response.json();
                toast({
                    title: "Error",
                    description: result.message || "Failed to delete driver",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast({title: "Error", description: "An error occurred while deleting", variant: "destructive"});
        }
    };

    const handleEdit = (driver: DriverData) => {
        setEditingDriver(driver);
        setFormData(driver);
    };

    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast({title: "Error", description: "No token found", variant: "destructive"});
                return;
            }

            const {_id, ...updatedData} = formData;
            const response = await fetch('/api/auth/broking/driver', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify({id: _id, ...updatedData}),
            });

            if (response.ok) {
                toast({title: "Success", description: "Driver updated successfully"});
                setData(prevData =>
                    prevData.map(driver =>
                        driver._id === _id ? {...driver, ...updatedData} : driver
                    )
                );
                setEditingDriver(null);
            } else {
                const result = await response.json();
                toast({
                    title: "Error",
                    description: result.message || "Failed to update driver",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Edit error:', error);
            toast({title: "Error", description: "An error occurred while updating", variant: "destructive"});
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFilters(prev => ({...prev, [name]: value}));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSaveEdit();
        }
    };

    return (
        <div className={`min-h-screen p-4 lg:p-8 ${golos.className}`}>
            <div className="max-w-full mx-auto relative">
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 lg:mb-8 text-center text-black">Управление водителями</h1>

                {/* Filter inputs in a grid layout */}
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
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                        <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        {filteredData.map((item) => {
                            let formattedTime = isValidDate(item.time)
                                ? format(new Date(item.time), 'PPP')
                                : item.time;

                            return (
                                <Card key={item._id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                    <CardContent className="p-4 lg:p-6">
                                        {editingDriver && editingDriver._id === item._id ? (
                                            <div className="space-y-4">
                                                <Input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName || ''}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleKeyDown}
                                                    placeholder="Полное имя"
                                                />
                                                <Input
                                                    type="text"
                                                    name="number"
                                                    value={formData.number || ''}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleKeyDown}
                                                    placeholder="Номер"
                                                />
                                                <Input
                                                    type="text"
                                                    name="time"
                                                    value={formData.time || ''}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleKeyDown}
                                                    placeholder="Время"
                                                />
                                                <Input
                                                    type="text"
                                                    name="weight"
                                                    value={formData.weight || ''}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleKeyDown}
                                                    placeholder="Вес"
                                                />
                                                <Input
                                                    type="text"
                                                    name="locationFrom"
                                                    value={formData.locationFrom || ''}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleKeyDown}
                                                    placeholder="Откуда"
                                                />
                                                <Input
                                                    type="text"
                                                    name="locationTo"
                                                    value={formData.locationTo || ''}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleKeyDown}
                                                    placeholder="Куда"
                                                />
                                                <Input
                                                    type="text"
                                                    name="description"
                                                    value={formData.description || ''}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleKeyDown}
                                                    placeholder="Описание"
                                                />
                                                <div className="flex justify-end space-x-2 mt-4">
                                                    <Button variant="outline" size="sm" onClick={handleSaveEdit}>
                                                        <Save className="h-4 w-4 mr-2"/>
                                                        Сохранить
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => setEditingDriver(null)}>
                                                        <X className="h-4 w-4 mr-2"/>
                                                        Отмена
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="bg-indigo-100 p-2 rounded-full">
                                                            <User className="h-5 w-5 lg:h-6 lg:w-6 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-base lg:text-lg text-neutral-900">{item.fullName}</h3>
                                                            <p className="text-xs lg:text-sm text-gray-500">{item.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item._id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 lg:gap-4 text-xs lg:text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <Phone className="h-3 w-3 lg:h-4 lg:w-4 text-indigo-500" />
                                                        <span>{item.number}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-3 w-3 lg:h-4 lg:w-4 text-indigo-500" />
                                                        <span>{formattedTime}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Package className="h-3 w-3 lg:h-4 lg:w-4 text-indigo-500" />
                                                        <span>{item.weight}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="h-3 w-3 lg:h-4 lg:w-4 text-indigo-500" />
                                                        <span>{item.locationFrom} → {item.locationTo}</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-center text-indigo-600 text-lg">Нет доступных данных</p>
                )}
                <Toaster />
            </div>
        </div>
    )
}