"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Search, Truck, Calendar, MapPin, Phone } from "lucide-react"
import { Label } from "@/components/ui/label"

const driversData = [
    { id: 1, name: "Иван Иванов", payload: 10, availableDays: ["Пн", "Ср", "Пт"], routes: ["Москва-Санкт-Петербург", "Москва-Нижний Новгород"], phone: "+7 (999) 123-45-67" },
    { id: 2, name: "Мария Петрова", payload: 5, availableDays: ["Вт", "Чт", "Сб"], routes: ["Екатеринбург-Челябинск", "Екатеринбург-Тюмень"], phone: "+7 (999) 234-56-78" },
    { id: 3, name: "Алексей Сидоров", payload: 15, availableDays: ["Пн", "Вт", "Ср", "Чт", "Пт"], routes: ["Новосибирск-Красноярск", "Новосибирск-Омск"], phone: "+7 (999) 345-67-89" },
    { id: 4, name: "Елена Смирнова", payload: 8, availableDays: ["Ср", "Чт", "Пт", "Сб"], routes: ["Казань-Самара", "Казань-Уфа"], phone: "+7 (999) 456-78-90" },
    { id: 5, name: "Дмитрий Козлов", payload: 12, availableDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"], routes: ["Ростов-на-Дону-Краснодар", "Ростов-на-Дону-Волгоград"], phone: "+7 (999) 567-89-01" },
    { id: 6, name: "Ольга Новикова", payload: 7, availableDays: ["Пн", "Ср", "Пт"], routes: ["Воронеж-Липецк", "Воронеж-Тамбов"], phone: "+7 (999) 678-90-12" },
    { id: 7, name: "Сергей Морозов", payload: 20, availableDays: ["Вт", "Чт", "Сб", "Вс"], routes: ["Красноярск-Иркутск", "Красноярск-Кемерово"], phone: "+7 (999) 789-01-23" },
    { id: 8, name: "Анна Волкова", payload: 6, availableDays: ["Пн", "Ср", "Пт", "Вс"], routes: ["Самара-Саратов", "Самара-Пенза"], phone: "+7 (999) 890-12-34" },
    { id: 9, name: "Павел Соколов", payload: 18, availableDays: ["Пн", "Вт", "Ср", "Чт", "Пт"], routes: ["Нижний Новгород-Владимир", "Нижний Новгород-Иваново"], phone: "+7 (999) 901-23-45" },
    { id: 10, name: "Наталья Попова", payload: 9, availableDays: ["Вт", "Чт", "Сб"], routes: ["Краснодар-Сочи", "Краснодар-Ставрополь"], phone: "+7 (999) 012-34-56" },
]

export default function Component() {
    const [nameSearch, setNameSearch] = useState("")
    const [payloadSearch, setPayloadSearch] = useState("")
    const [locationSearch, setLocationSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const driversPerPage = 5

    const filteredDrivers = useMemo(() => {
        return driversData.filter((driver) => {
            const nameMatch = driver.name.toLowerCase().includes(nameSearch.toLowerCase())
            const payloadMatch = payloadSearch === "" || driver.payload >= parseInt(payloadSearch)
            const locationMatch = locationSearch === "" || driver.routes.some(route =>
                route.toLowerCase().includes(locationSearch.toLowerCase())
            )
            return nameMatch && payloadMatch && locationMatch
        })
    }, [nameSearch, payloadSearch, locationSearch])

    const indexOfLastDriver = currentPage * driversPerPage
    const indexOfFirstDriver = indexOfLastDriver - driversPerPage
    const currentDrivers = filteredDrivers.slice(indexOfFirstDriver, indexOfLastDriver)

    const pageCount = Math.ceil(filteredDrivers.length / driversPerPage)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <h1 className="text-3xl font-bold text-center mb-8 text-primary">Информация о водителях</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <Label htmlFor="name-search" className="text-sm font-medium">
                        Поиск по имени
                    </Label>
                    <div className="relative mt-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            id="name-search"
                            type="text"
                            placeholder="Имя водителя"
                            className="pl-10 w-full"
                            value={nameSearch}
                            onChange={(e) => setNameSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="payload-search" className="text-sm font-medium">
                        Минимальная грузоподъемность
                    </Label>
                    <div className="relative mt-1">
                        <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            id="payload-search"
                            type="number"
                            placeholder="Мин. тонн"
                            className="pl-10 w-full"
                            value={payloadSearch}
                            onChange={(e) => setPayloadSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="location-search" className="text-sm font-medium">
                        Поиск по маршруту
                    </Label>
                    <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            id="location-search"
                            type="text"
                            placeholder="Город или маршрут"
                            className="pl-10 w-full"
                            value={locationSearch}
                            onChange={(e) => setLocationSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                {currentDrivers.map((driver) => (
                    <Dialog key={driver.id}>
                        <DialogTrigger asChild>
                            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-lg mb-2">{driver.name}</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center">
                                            <Truck className="h-4 w-4 mr-2 text-primary" />
                                            <span>{driver.payload} тонн</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                                            <span>{driver.availableDays.join(", ")}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-primary mb-4">{driver.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Truck className="h-5 w-5 mr-3 text-primary" />
                                    <p className="text-lg"><span className="font-medium">Грузоподъемность:</span> {driver.payload} тонн</p>
                                </div>
                                <div className="flex items-start">
                                    <Calendar className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-1" />
                                    <p className="text-lg"><span className="font-medium">Свободные дни:</span> {driver.availableDays.join(", ")}</p>
                                </div>
                                <div className="flex items-start">
                                    <MapPin className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-lg font-medium mb-1">Маршруты:</p>
                                        <ul className="list-disc list-inside pl-2">
                                            {driver.routes.map((route, index) => (
                                                <li key={index} className="text-base">{route}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 mr-3 text-primary" />
                                    <p className="text-lg"><span className="font-medium">Телефон:</span> {driver.phone}</p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                ))}
            </div>

            <div className="flex justify-center items-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
                    <Button
                        key={number}
                        variant={currentPage === number ? "default" : "outline"}
                        size="sm"
                        onClick={() => paginate(number)}
                    >
                        {number}
                    </Button>
                ))}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => paginate(Math.min(pageCount, currentPage + 1))}
                    disabled={currentPage === pageCount}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}