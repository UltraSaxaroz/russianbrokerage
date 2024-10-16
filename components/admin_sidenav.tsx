"use client"

import {useState} from "react"
import {Home, Users, Menu, X, Truck} from "lucide-react"
import {Button} from "@/components/ui/button"
import Link from "next/link";

const menuItems = [
    {icon: Home, label: "Register a user", url: '/admin/register'},
    {icon: Users, label: "Users", url: '/admin/user'},
    {icon: Truck, label: "Add driver", url: '/admin/driver'},
]

export default function AdminSide() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                variant="outline"
                size="icon"
                className="fixed top-4 left-4 z-50 md:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-4 w-4"/> : <Menu className="h-4 w-4"/>}
            </Button>

            <aside
                className={`top-0 left-0 z-40 h-screen w-64 bg-white shadow-lg transition-all duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
            >
                <div className="flex h-full flex-col w-full">
                    <div className="flex items-center justify-center h-16 border-b">
                        <h1 className="text-2xl font-bold text-gray-800">TruckConnect</h1>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link className={'flex'} href={item.url}>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            <item.icon className="mr-3 h-5 w-5"/>
                                            {item.label}
                                        </Button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="border-t p-4">
                        <Button variant="outline" className="w-full">
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    )
}