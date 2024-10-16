'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, BarChart2, User, HelpCircle, Bell, Search, Menu, LogOut, X } from 'lucide-react'

const navItems = [
    { name: 'Main Panel', href: '/panel', icon: Home },
    { name: 'Profile', href: '/panel/profile', icon: User },
    { name: 'Help', href: '/help', icon: HelpCircle },
]

const logout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
}

export default function AsidePanel() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(true)

    const toggleMenu = () => setIsOpen(!isOpen)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024)
            if (window.innerWidth >= 1024) {
                setIsOpen(true)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (isOpen && isMobile) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'visible'
        }

        return () => {
            document.body.style.overflow = 'visible'
        }
    }, [isOpen, isMobile])

    return (
        <div className={''}>
            {isMobile && (
                <button
                    onClick={toggleMenu}
                    className="fixed top-4 right-4 z-50 text-gray-600 hover:text-gray-800 transition-colors"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            )}

            <AnimatePresence>
                {isOpen && isMobile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={toggleMenu}
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{ x: isOpen || !isMobile ? 0 : '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 w-64 h-full bg-gray-100 text-gray-800 flex flex-col z-50 lg:relative lg:translate-x-0 lg:w-72"
                style={{ willChange: 'transform' }}
            >
                <div className="p-4 flex items-center justify-between border-b border-gray-200">
                    <Link href="/" className="flex items-center space-x-2">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-lg font-semibold">YourApp</span>
                    </Link>
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
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <motion.div
                                key={item.name}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href={item.href}
                                    className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                                        isActive
                                            ? 'bg-gray-200 text-gray-900'
                                            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                    }`}
                                    onClick={() => {
                                        if (isMobile) {
                                            setIsOpen(false)
                                            document.body.style.overflow = 'visible'
                                        }
                                    }}
                                >
                                    <item.icon className={`w-4 h-4 ${isActive ? 'text-gray-900' : 'text-gray-500'}`} />
                                    <span className="text-base font-medium">{item.name}</span>
                                </Link>
                            </motion.div>
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
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-200 text-gray-800 py-2 rounded-md transition-colors text-sm"
                        onClick={logout}
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium">Logout</span>
                    </motion.button>
                </div>

                <motion.svg
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-0 left-0 w-full h-64 text-gray-200 opacity-25 pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                >
                    <path
                        fill="currentColor"
                        fillOpacity="1"
                        d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ></path>
                </motion.svg>
            </motion.aside>
        </div>
    )
}