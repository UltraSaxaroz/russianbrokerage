import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Phone, Search, Users, ChevronRight } from "lucide-react"

export default function Homepage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Truck className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">ТракКоннект</span>
                    </Link>
                    <nav className="hidden md:flex space-x-6">
                        <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">Как это работает</Link>
                        <Link href="#benefits" className="text-gray-600 hover:text-gray-900 transition-colors">Преимущества</Link>
                        <Link href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Контакты</Link>
                    </nav>
                    <div className="flex space-x-3">
                        <Button variant="outline" asChild>
                            <Link href="/auth">Войти</Link>
                        </Button>
                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                            <Link href="/auth">Регистрация</Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="container mx-auto px-4 py-12">
                {/* Hero section */}
                <section className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Соединяем дороги и возможности</h1>
                    <p className="text-xl text-gray-600 mb-8">Платформа, где дальнобойщики и логисты находят друг друга</p>
                    <div className="flex justify-center space-x-4">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                            Я водитель
                        </Button>
                        <Button size="lg" variant="outline">
                            Я логист
                        </Button>
                    </div>
                </section>

                {/* How it works section */}
                <section id="how-it-works" className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Как это работает</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Truck, title: "Регистрация", description: "Создайте профиль водителя или логиста" },
                            { icon: Search, title: "Поиск", description: "Находите подходящие заказы или водителей" },
                            { icon: Phone, title: "Связь", description: "Общайтесь напрямую для обсуждения деталей" },
                        ].map((step, index) => (
                            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                        <step.icon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">{step.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Benefits section */}
                <section id="benefits" className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Преимущества ТракКоннект</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="text-xl mb-2">Для водителей</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Быстрый поиск заказов</li>
                                    <li>Прямое общение с логистами</li>
                                    <li>Гибкий график работы</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="text-xl mb-2">Для логистов</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    <li>Широкая база проверенных водителей</li>
                                    <li>Удобный инструмент планирования</li>
                                    <li>Оптимизация логистических процессов</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Call to action */}
                <section className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Готовы начать?</h2>
                    <p className="text-xl text-gray-600 mb-8">Присоединяйтесь к ТракКоннект сегодня и откройте новые возможности</p>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                        Зарегистрироваться
                        <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 border-t border-gray-200">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <Link href="/" className="flex items-center space-x-2 mb-4">
                                <Truck className="h-6 w-6 text-blue-600" />
                                <span className="text-xl font-bold text-gray-900">ТракКоннект</span>
                            </Link>
                            <p className="text-gray-600">Соединяем дороги и возможности</p>
                        </div>
                        <nav className="grid grid-cols-2 gap-4">
                            <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">О нас</Link>
                            <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Блог</Link>
                            <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Поддержка</Link>
                            <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Контакты</Link>
                        </nav>
                        <div>
                            <h3 className="font-semibold mb-4">Подпишитесь на новости</h3>
                            <div className="flex">
                                <input type="email" placeholder="Ваш email" className="flex-grow rounded-l-md px-4 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <Button className="rounded-r-md bg-blue-600 hover:bg-blue-700">
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
                        © 2024 ТракКоннект. Все права защищены.
                    </div>
                </div>
            </footer>
        </div>
    )
}