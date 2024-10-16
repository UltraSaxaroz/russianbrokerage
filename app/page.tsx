import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Shield, ChevronRight, Mail, Truck, Phone, Search } from "lucide-react"

export default function Homepage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Background SVG */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E7EB" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <circle cx="0" cy="0" r="300" fill="url(#gradient1)" />
                    <circle cx="1000" cy="1000" r="300" fill="url(#gradient2)" />
                    <defs>
                        <radialGradient id="gradient1" cx="0" cy="0" r="300" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#10B98133" />
                            <stop offset="100%" stopColor="#10B98100" />
                        </radialGradient>
                        <radialGradient id="gradient2" cx="1000" cy="1000" r="300" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#10B98133" />
                            <stop offset="100%" stopColor="#10B98100" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            {/* Header */}
            <header className="relative z-10 bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <svg className="h-10 w-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="40" height="40" rx="8" fill="#10B981"/>
                            <path d="M20 8C13.373 8 8 13.373 8 20s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8zm0 22c-5.514 0-10-4.486-10-10S14.486 10 20 10s10 4.486 10 10-4.486 10-10 10zm-2-15.5V20l6 4-1.5 2.5L15 22v-7.5h3z" fill="white"/>
                        </svg>
                        <span className="text-2xl font-bold text-gray-900">Комар</span>
                    </Link>
                    <nav className="hidden md:flex space-x-6">
                        <Link href="#how-it-works" className="text-gray-600 hover:text-green-600 transition-colors">Как это работает</Link>
                        <Link href="#benefits" className="text-gray-600 hover:text-green-600 transition-colors">Преимущества</Link>
                        <Link href="#contact" className="text-gray-600 hover:text-green-600 transition-colors">Контакты</Link>
                    </nav>
                    <div className="flex space-x-3">
                        <Button variant="outline" asChild>
                            <Link href="/auth">Войти</Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="relative z-10 container mx-auto px-4 py-12">
                {/* Hero section */}
                <section className="text-center mb-24">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Соединяем дороги и возможности</h1>
                    <p className="text-xl text-gray-600 mb-8">Платформа, где дальнобойщики и логисты находят друг друга</p>
                    <div className="flex justify-center space-x-4 mb-12">
                        <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                            Я водитель
                        </Button>
                        <Button size="lg" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">
                            Я логист
                        </Button>
                    </div>
                    <div className="relative mx-auto max-w-4xl">
                        <Image
                            src="/placeholder.svg?height=400&width=800"
                            alt="Грузовик на дороге"
                            width={800}
                            height={400}
                            className="rounded-lg shadow-2xl"
                        />
                        <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                            <div className="flex items-center space-x-2">
                                <MapPin className="text-green-600" />
                                <span className="font-semibold">100+ городов</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it works section */}
                <section id="how-it-works" className="mb-24">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Как это работает</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: MapPin, title: "Регистрация", description: "Создайте профиль водителя или логиста", image: "/placeholder.svg?height=200&width=300" },
                            { icon: Search, title: "Поиск", description: "Находите подходящие заказы или водителей", image: "/placeholder.svg?height=200&width=300" },
                            { icon: Phone, title: "Связь", description: "Общайтесь напрямую для обсуждения деталей", image: "/placeholder.svg?height=200&width=300" },
                        ].map((step, index) => (
                            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                <div className="relative">
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        width={300}
                                        height={200}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white opacity-60"></div>
                                </div>
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                        <step.icon className="h-6 w-6 text-green-600" />
                                    </div>
                                    <CardTitle className="text-2xl mb-2">{step.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">{step.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Benefits section */}
                <section id="benefits" className="mb-24">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Преимущества Комар</h2>
                    <div className="grid md:grid-cols-2 gap-12">
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                            <div className="relative">
                                <Image
                                    src="/placeholder.svg?height=300&width=500"
                                    alt="Водитель грузовика"
                                    width={500}
                                    height={300}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white opacity-60"></div>
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl mb-2">Для водителей</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {[
                                        { icon: Search, text: "Быстрый поиск заказов" },
                                        { icon: Phone, text: "Прямое общение с логистами" },
                                        { icon: Clock, text: "Гибкий график работы" },
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center">
                                            <item.icon className="h-5 w-5 text-green-600 mr-2" />
                                            <span>{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                            <div className="relative">
                                <Image
                                    src="/placeholder.svg?height=300&width=500"
                                    alt="Логист за работой"
                                    width={500}
                                    height={300}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white opacity-60"></div>
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl mb-2">Для логистов</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {[
                                        { icon: Shield, text: "Широкая база проверенных водителей" },
                                        { icon: Clock, text: "Удобный инструмент планирования" },
                                        { icon: Truck, text: "Оптимизация логистических процессов" },
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center">
                                            <item.icon className="h-5 w-5 text-green-600 mr-2" />
                                            <span>{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="mb-24 relative overflow-hidden">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Отзывы наших пользователей</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: "Иван П.", role: "Водитель", quote: "Комар помог мне найти стабильную работу и увеличить доход." },
                            { name: "Анна С.", role: "Логист", quote: "Благодаря платформе, мы оптимизировали наши перевозки на 30%." },
                            { name: "Михаил К.", role: "Владелец компании", quote: "Комар - незаменимый инструмент для нашего бизнеса." },
                        ].map((testimonial, index) => (
                            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardContent className="pt-6">
                                    <svg className="w-8 h-8 text-green-400 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                    </svg>
                                    <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                                            <span className="text-green-600 font-semibold">{testimonial.name[0]}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{testimonial.name}</p>
                                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Call to action */}
                <section className="text-center mb-24 bg-gradient-to-r from-green-600 to-green-700 text-white py-16 rounded-lg shadow-xl relative overflow-hidden">
                    <div className="absolute  inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0 L100 100 M100 0 L0 100" stroke="white" strokeWidth="1" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 relative z-10">Готовы начать?</h2>
                    <p className="text-xl mb-8 relative z-10">Присоединяйтесь к Комар сегодня и откройте новые возможности</p>
                    <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-green-50 relative z-10">
                        Зарегистрироваться
                        <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-10 bg-gray-900 text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <Link href="/" className="flex items-center space-x-2 mb-4">
                                <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="32" height="32" rx="6" fill="#10B981"/>
                                    <path d="M16 6C10.477 6 6 10.477 6 16s4.477 10 10 10 10-4.477 10-10S21.523 6 16 6zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-2-12v6l6 3-1.5 2-6-4V12h1.5z" fill="white"/>
                                </svg>
                                <span className="text-xl font-bold">Комар</span>
                            </Link>
                            <p className="text-gray-400">Соединяем дороги и возможности</p>
                        </div>
                        <nav className="space-y-4">
                            <h3 className="text-lg font-semibold mb-2">Навигация</h3>
                            <Link href="#" className="block text-gray-400 hover:text-green-400 transition-colors">О нас</Link>
                            <Link href="#" className="block text-gray-400 hover:text-green-400 transition-colors">Как это работает</Link>
                            <Link href="#" className="block text-gray-400 hover:text-green-400 transition-colors">Преимущества</Link>
                        </nav>
                        <nav className="space-y-4">
                            <h3 className="text-lg font-semibold mb-2">Поддержка</h3>
                            <Link href="#" className="block text-gray-400 hover:text-green-400 transition-colors">FAQ</Link>
                            <Link href="#" className="block text-gray-400 hover:text-green-400 transition-colors">Контакты</Link>
                            <Link href="#" className="block text-gray-400 hover:text-green-400 transition-colors">Правила использования</Link>
                        </nav>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Подпишитесь на новости</h3>
                            <div className="flex">
                                <input type="email" placeholder="Ваш email" className="flex-grow rounded-l-md px-4 py-2 bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                <Button className="rounded-r-md bg-green-600 hover:bg-green-700">
                                    <Mail className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
                        © 2024 Комар. Все права защищены.
                    </div>
                </div>
            </footer>
        </div>
    )
}