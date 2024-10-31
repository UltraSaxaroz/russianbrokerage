"use client"

import React, {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card"
import {ArrowLeft, Mail, ArrowRight} from "lucide-react"
import Link from "next/link"
import {useRouter} from "next/navigation";

export default function Component() {
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            router.push('/panel')
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsSubmitted(true)

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email}),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Something went wrong. Please try again later.');
        }
    };


    return (
        <div
            className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50">
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div
                    className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div
                    className="absolute left-1/3 bottom-1/3 w-1/3 h-1/3 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <Card
                className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 shadow-xl rounded-2xl overflow-hidden border-0">
                <CardHeader className="space-y-1 p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            href="/auth"
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5"/>
                        </Link>
                        <CardTitle className="text-2xl font-bold">Восстановление пароля</CardTitle>
                    </div>
                    <CardDescription className="text-gray-500">
                        Введите email, указанный при регистрации. Мы отправим инструкции по восстановлению пароля.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Почта</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10 h-12 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-medium bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-2 group"
                            >
                                Отправить инструкции
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1"/>
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4 py-6">
                            <div
                                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <svg
                                    className="w-8 h-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-gray-800">Проверьте почту</h3>
                                <p className="text-gray-600">
                                    Мы отправили инструкции по восстановлению пароля на {email}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="mt-4 border-green-500 text-green-700 hover:bg-green-50"
                                onClick={() => setIsSubmitted(false)}
                            >
                                Отправить снова
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}