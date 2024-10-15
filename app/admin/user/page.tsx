'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Search, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogOverlay,
    DialogClose,
    DialogTitle,
} from '@/components/ui/dialog';

export default function Page() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: '' });

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await res.json();
                setUsers(data.data || []);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleEditClick = (user: any) => {
        setEditUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role });
        setShowModal(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('/api/user', {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id: editUser._id, ...formData }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user');
            }

            const updatedUser = await response.json();
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === updatedUser.data[0]._id ? updatedUser.data[0] : user
                )
            );
            setShowModal(false);
        } catch (error: any) {
            console.error('Error updating user:', error);
            setError(error.message);
        }
    };

    if (loading) {
        return <div>Loading users...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add New User
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add New User</DialogTitle>
                            <form onSubmit={handleFormSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Role
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) =>
                                            setFormData({ ...formData, role: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                        Add User
                                    </Button>
                                </div>
                            </form>
                            <DialogClose className="absolute right-4 top-4">
                                <span className="sr-only">Close</span>
                            </DialogClose>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="mb-4 relative">
                    <Input className="pl-10" placeholder="Search users..." />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center">
                                        <Avatar className="h-8 w-8 mr-2">
                                            <AvatarImage
                                                src={user.avatarUrl || '/placeholder.svg?height=32&width=32'}
                                                alt={user.name}
                                            />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {user.name}
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role || 'User'}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        className="text-blue-500 hover:text-blue-600"
                                        onClick={() => handleEditClick(user)}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-600">
                        Showing {users.length} of {users.length} users
                    </p>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Модальное окно для редактирования пользователя */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Edit User</DialogTitle>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <Input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <Input
                                type="text"
                                value={formData.role}
                                onChange={(e) =>
                                    setFormData({ ...formData, role: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                Update User
                            </Button>
                        </div>
                    </form>
                    <DialogClose className="absolute right-4 top-4">
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </div>
    );
}
