// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Search, UserPlus } from "lucide-react"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function Page() {
    const users = [
        { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", avatarUrl: "/placeholder.svg?height=32&width=32" },
        { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User", avatarUrl: "/placeholder.svg?height=32&width=32" },
        { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Editor", avatarUrl: "/placeholder.svg?height=32&width=32" },
        { id: 4, name: "Diana Ross", email: "diana@example.com", role: "User", avatarUrl: "/placeholder.svg?height=32&width=32" },
        { id: 5, name: "Edward Norton", email: "edward@example.com", role: "Admin", avatarUrl: "/placeholder.svg?height=32&width=32" },
    ]

    return (
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add New User
                    </Button>
                </div>
                <div className="mb-4 relative">
                    <Input
                        className="pl-10"
                        placeholder="Search users..."
                    />
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
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center">
                                        <Avatar className="h-8 w-8 mr-2">
                                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {user.name}
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" className="text-blue-500 hover:text-blue-600">
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-600">Showing 5 of 20 users</p>
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
        </div>
    )
}