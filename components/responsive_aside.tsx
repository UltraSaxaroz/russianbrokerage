'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, User, HelpCircle, Search, Menu, LogOut, X, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

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
    const [searchQuery, setSearchQuery] = useState('')

    const toggleMenu = () => setIsOpen(!isOpen)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024)
            if (window.innerWidth >= 1024) {
                setIsOpen(true)
            } else {
                setIsOpen(false)
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

    const filteredNavItems = useMemo(() => {
        return navItems.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [searchQuery])

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className={cn(
                    "fixed top-4 right-4 z-50 lg:hidden",
                    "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                )}
                aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            <AnimatePresence>
                {isOpen && isMobile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
                        onClick={toggleMenu}
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{ x: isOpen || !isMobile ? 0 : '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={cn(
                    "fixed top-0 left-0 bottom-0 z-40",
                    "w-[280px] sm:w-[320px] lg:w-72 xl:w-80",
                    "lg:sticky lg:top-0 lg:h-screen",
                    "flex flex-col",
                    "bg-gradient-to-b from-background to-background/95 backdrop-blur-sm",
                    "border-r shadow-xl"
                )}
            >
                <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                    <Link
                        href="/"
                        className="flex items-center space-x-2 group"
                    >
                        <div className="p-2 rounded-xl bg-primary text-primary-foreground shadow-lg group-hover:shadow-primary/25 transition-shadow">
                            <Zap className="w-5 h-5" />
                        </div>
                        <span className="text-lg sm:text-xl font-semibold tracking-tight">
              Kamar Board
            </span>
                    </Link>
                </div>

                <div className="p-4 border-b">
                    <div className="relative group">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <Input
                            type="text"
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-muted/50 border-muted-foreground/20 hover:border-primary/30 focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                    <AnimatePresence initial={false}>
                        {filteredNavItems.length > 0 ? (
                            <motion.div className="space-y-1.5">
                                {filteredNavItems.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => {
                                                    if (isMobile) {
                                                        setIsOpen(false)
                                                        document.body.style.overflow = 'visible'
                                                    }
                                                }}
                                                className={cn(
                                                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all",
                                                    "hover:bg-accent hover:text-accent-foreground",
                                                    "active:bg-accent/80",
                                                    isActive && "bg-primary/10 text-primary shadow-sm",
                                                    !isActive && "text-muted-foreground hover:text-primary"
                                                )}
                                            >
                                                <item.icon className={cn(
                                                    "h-5 w-5 transition-transform",
                                                    isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-primary"
                                                )} />
                                                <span className="text-base font-medium">{item.name}</span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeIndicator"
                                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                    />
                                                )}
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center text-muted-foreground py-4"
                            >
                                Ничего не найдено
                            </motion.div>
                        )}
                    </AnimatePresence>
                </nav>

                <div className="p-4 border-t mt-auto bg-gradient-to-t from-muted/50 to-transparent">
                    <Button
                        variant="secondary"
                        className="w-full bg-background hover:bg-accent hover:text-accent-foreground group"
                        onClick={logout}
                    >
                        <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                        <span className="font-medium">Выйти</span>
                    </Button>
                </div>
            </motion.aside>
        </>
    )
}