'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Mail, Phone, Search } from 'lucide-react'
import Link from "next/link";

export default function Page() {
    const [searchTerm, setSearchTerm] = useState('')

    const faqs = [
        {
            question: "Что такое Kamar Board?",
            answer: "Kamar Board - это справочник с информацией водителей, и по совместительству очень удобный веб-сайт, который позволит вам облегчить свою работу и находить подходящих водителей проще, чем вы могли это делать ранее."
        },
        {
            question: "Какова политика этой площадки?",
            answer: "У нас запрещается красть/парсить информацию водителей с нашей площадки. В случае таких неправомерных действий вы потеряете навсегда со всех своих аккаунтов доступ к нашей площадке. Так же, все сделки, которые вы будете проводить, будут происходить исключительно через нашу компанию и соответственно вы будете платить тот процент, который обговорили заранее."
        },
        {
            question: "Как связаться с вами?",
            answer: "Вы можете связаться с нами через социальные сети, такие как Telegram, WhatsApp, через нашу электронную почту или же через номер телефона, которые указаны ниже."
        },
    ]

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Информация о панели водителя</h1>
                    <p className="text-xl text-gray-600">Ответы на ваши вопросы и полезная информация</p>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Часто задаваемые вопросы</CardTitle>
                        <CardDescription>Найдите ответы на популярные вопросы о панели водителя</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative mb-6">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Поиск по вопросам..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                            {filteredFaqs.map((faq, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                                    <AccordionContent>{faq.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Нужна дополнительная помощь?</CardTitle>
                        <CardDescription>Свяжитесь с нашей службой поддержки</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center space-x-2">
                                <Mail className="text-gray-500" />
                                <span>support@kamarlogistics.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="text-gray-500" />
                                <span>+7 (777) 77 77 77</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center mt-8">
                    <Button><Link href={"/panel"}>Перейти к панели</Link></Button>
                </div>
            </div>
        </div>
    )
}