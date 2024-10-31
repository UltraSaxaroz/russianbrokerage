'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, BarChart2, User, HelpCircle, Bell, Search, Menu, LogOut, X } from 'lucide-react'

const navItems = [
    { name: 'Основная панель', href: '/panel', icon: Home },
    { name: 'Профиль', href: '/panel/profile', icon: User },
    { name: 'Помощь', href: '/panel/help', icon: HelpCircle },
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
        <div className={'border-2 shadow-2xl'}>
            {isMobile && (
                <button
                    onClick={toggleMenu}
                    className="fixed top-4 right-4 z-50 text-gray-600 hover:text-gray-800 transition-colors"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                    {isOpen ? <div className={'bg-black rounded-md p-2 transition-all'}><X className="text-white w-6 h-6" /></div> : <Menu className="w-6 h-6" />}
                </button>
            )}

            <AnimatePresence>
                {isOpen && isMobile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-30"
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
                        <span className="text-lg font-semibold">Kamar Board</span>
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
                <div className="p-4 z-20 sm:pb-4 sm:pt-4 pt-12 pb-12 border-t border-gray-200">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-200 text-gray-800 py-2 rounded-md transition-colors text-sm"
                        onClick={logout}
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium">Выйти</span>
                    </motion.button>
                </div>
            </motion.aside>
        </div>
    )
}