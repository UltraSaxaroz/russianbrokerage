'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart2, User, HelpCircle, Bell, Search, Menu, LogOut } from 'lucide-react'

const navItems = [
    { name: 'Main Panel', href: '/panel', icon: Home },
    { name: 'Add info', href: '/panel/driver', icon: BarChart2 },
    { name: 'Profile', href: '/panel/profile', icon: User },
    { name: 'Help', href: '/help', icon: HelpCircle },
]

const logout = () => {
    localStorage.removeItem('token');  // Удаление токена из localStorage
    window.location.href = '/';  // Перенаправление на страницу логина
};


export default function AsidePanel() {
    const pathname = usePathname()

    return (
        <aside className="w-64 h-screen bg-gray-100 text-gray-800 flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
                <Link href="/" className="flex items-center space-x-2">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-lg font-semibold">YourApp</span>
                </Link>
                <button className="lg:hidden text-gray-600 hover:text-gray-800 transition-colors">
                    <Menu className="w-5 h-5" />
                </button>
            </div>
            <div className="px-4 py-2">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-white text-gray-800 placeholder-gray-400 rounded-md py-1 pl-8 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                    <Search className="absolute left-2 top-1.5 w-4 h-4 text-gray-400" />
                </div>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                                isActive
                                    ? 'bg-gray-200 text-gray-900'
                                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                            }`}
                        >
                            <item.icon className={`w-4 h-4 ${isActive ? 'text-gray-900' : 'text-gray-500'}`} />
                            <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/placeholder.svg?height=32&width=32"
                            alt="User avatar"
                            className="w-8 h-8 rounded-full"
                        />
                        <div>
                            <p className="text-sm font-medium">John Doe</p>
                            <p className="text-xs text-gray-500">Admin</p>
                        </div>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors">
                        <Bell className="w-4 h-4" />
                    </button>
                </div>
                <button className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-200 text-gray-800 py-2 rounded-md transition-colors text-sm">
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium" onClick={logout}>Logout</span>
                </button>
            </div>
        </aside>
    )
}