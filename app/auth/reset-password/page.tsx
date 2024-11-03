'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ArrowLeft } from 'lucide-react'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const newPassword = formData.get('new-password') as string
        const confirmPassword = formData.get('confirm-password') as string

        if (newPassword !== confirmPassword) {
            alert('Пароли не совпадают')
            return
        }

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            })
            const data = await response.json()
            if (response.ok) {
                alert(data.message)
            } else {
                alert(data.message)
            }
        } catch (error) {
            alert('Произошла ошибка. Пожалуйста, попробуйте еще раз.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="new-password">Новый пароль</Label>
                <Input
                    id="new-password"
                    name="new-password"
                    type="password"
                    required
                    className="bg-white/50"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    className="bg-white/50"
                />
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                Установить новый пароль
            </Button>
        </form>
    )
}

export default function ResetPassword() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-lime-100 via-green-100 to-emerald-100">
            <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/80 shadow-xl rounded-2xl overflow-hidden border-0">
                <CardHeader className="space-y-1 p-6">
                    <CardTitle className="text-2xl font-bold text-emerald-800">Сброс пароля</CardTitle>
                    <CardDescription className="text-emerald-600">Введите новый пароль</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <Suspense fallback={<div className="text-center text-emerald-600">Loading...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                    <Link href="/auth" className="w-full">
                        <Button variant="outline" className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Вернуться на страницу входа
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}