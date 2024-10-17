'use client';

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, LucideX, Search, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function Component() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editUser, setEditUser] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({name: '', email: '', role: ''});
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, pageSize, searchQuery]);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/user?page=${currentPage}&pageSize=${pageSize}&search=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await res.json();
            setUsers(data.users || []);
            setTotalUsers(data.total || 0);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user: any) => {
        setEditUser(user);
        setFormData({name: user.name, email: user.email, role: user.role});
        setShowModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prevData => ({...prevData, [name]: value}));
    };

    const handleSave = async () => {
        if (!editUser) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _id: editUser._id,
                    ...formData,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to update user');
            }

            fetchUsers(); // Refresh the user list
            setShowModal(false);
            toast({description: 'User updated successfully!'});
        } catch (error) {
            toast({description: 'Failed to update user', variant: 'destructive'});
        }
    };

    const handleDeleteClick = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/user', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id: userId }),
            });

            if (!res.ok) {
                throw new Error('Failed to delete user');
            }

            fetchUsers(); // Refresh the user list
            toast({ description: 'User deleted successfully!' });
        } catch (error) {
            toast({ description: 'Failed to delete user', variant: 'destructive' });
        }
    };

    const toggleRowExpansion = (userId: string) => {
        setExpandedRows(prevExpandedRows => {
            const newExpandedRows = new Set(prevExpandedRows);
            if (newExpandedRows.has(userId)) {
                newExpandedRows.delete(userId);
            } else {
                newExpandedRows.add(userId);
            }
            return newExpandedRows;
        });
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(totalUsers / pageSize);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading users...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                    <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                    <Link href={"/admin/register"}>
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto">
                            <UserPlus className="mr-2 h-4 w-4"/>
                            Add New User
                        </Button>
                    </Link>
                </div>
                <div className="mb-4 relative">
                    <Input
                        className="pl-10"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset to first page on new search
                        }}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12"></TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <React.Fragment key={user._id}>
                                    <TableRow>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleRowExpansion(user._id)}
                                            >
                                                {expandedRows.has(user._id) ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center">
                                                <Avatar className="h-8 w-8 mr-2">
                                                    <AvatarImage src={user.avatarUrl || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="ghost" className="text-blue-500 hover:text-blue-600 p-1 sm:p-2" onClick={() => handleEditClick(user)}>
                                                    Edit
                                                </Button>
                                                <Button variant="ghost" className="text-blue-500 hover:text-blue-600 p-1 sm:p-2" onClick={() => handleDeleteClick(user._id)}>
                                                    <LucideX />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {expandedRows.has(user._id) && (
                                        <TableRow>
                                            <TableCell colSpan={3}>
                                                <div className="p-4 bg-gray-50">
                                                    <p><strong>Email:</strong> {user.email}</p>
                                                    <p><strong>Role:</strong> {user.role || "User"}</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-4 sm:space-y-0">
                    <p className="text-sm text-gray-600">
                        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
                    </p>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4"/>
                        </Button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
            </div>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Name"
                        />
                        <Input
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                        />
                        <Input
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            placeholder="Role"
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button onClick={handleSave} className="bg-blue-500 text-white">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}