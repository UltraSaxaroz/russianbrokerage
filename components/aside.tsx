'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart2, Users, Settings, HelpCircle, Bell, Search, Menu } from 'lucide-react'

const navItems = [
    { name: 'Main Panel', href: '/panel', icon: Home },
    { name: 'Add info', href: '/panel/driver', icon: BarChart2 },
    { name: 'Profile', href: '/panel/profile', icon: BarChart2 },
    { name: 'Help', href: '/help', icon: HelpCircle },
]

export default function AsidePanel() {
    const pathname = usePathname()

    return (
        <aside className="w-64 h-screen bg-gradient-to-b from-purple-700 to-purple-900 text-white">
            <div className="flex flex-col h-full">
                <div className="p-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-xl font-bold">YourApp</span>
                    </Link>
                    <button className="lg:hidden text-white hover:text-yellow-400 transition-colors">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
                <div className="px-4 py-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-purple-800 text-white placeholder-purple-300 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-purple-300" />
                    </div>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                                    isActive
                                        ? 'bg-purple-800 text-yellow-400 shadow-lg'
                                        : 'text-purple-100 hover:bg-purple-800 hover:text-white'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-yellow-400' : 'text-purple-300'}`} />
                                <span className="font-medium">{item.name}</span>
                                {isActive && (
                                    <span className="ml-auto w-2 h-2 bg-yellow-400 rounded-full"></span>
                                )}
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-4 border-t border-purple-600">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <img
                                src="/placeholder.svg?height=40&width=40"
                                alt="User avatar"
                                className="w-10 h-10 rounded-full border-2 border-yellow-400"
                            />
                            <div>
                                <p className="font-semibold">John Doe</p>
                                <p className="text-sm text-purple-300">Admin</p>
                            </div>
                        </div>
                        <button className="text-purple-300 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>
                    </div>
                    <button className="w-full flex items-center justify-center space-x-3 bg-purple-800 hover:bg-purple-900 text-white py-2 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    )
}