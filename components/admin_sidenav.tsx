"use client"

import { useState, useEffect } from "react"
import { Home, Users, Menu, X, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const menuItems = [
    { icon: Home, label: "Register a user", url: '/admin/register' },
    { icon: Users, label: "Users", url: '/admin/user' },
    { icon: Truck, label: "Add driver", url: '/admin/driver' },
]

export default function AdminSide() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="flex h-screen overflow-hidden border shadow-2xl">
            <Button
                variant="outline"
                size="icon"
                className="fixed top-4 left-4 z-50 md:hidden"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                {isOpen ? <X className="h-4 w-4"/> : <Menu className="h-4 w-4"/>}
            </Button>

            <aside
                className={`fixed md:static top-0 left-0 z-40 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
            >
                <div className="flex h-full flex-col w-full">
                    <div className="flex items-center justify-center h-16 border-b">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">TruckConnect</h1>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-2 md:p-4">
                        <ul className="space-y-1 md:space-y-2">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link href={item.url} className="block">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-sm md:text-base text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                                        >
                                            <item.icon className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5"/>
                                            {item.label}
                                        </Button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="border-t p-2 md:p-4">
                        <Button variant="outline" className="w-full text-sm md:text-base">
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    )
}