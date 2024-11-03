'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const newPassword = formData.get('new-password') as string
        const confirmPassword = formData.get('confirm-password') as string

        if (newPassword !== confirmPassword) {
            // You can use state for error handling if needed
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
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                />
            </div>
            <Button type="submit" className="w-full">Установить новый пароль</Button>
        </form>
    )
}

export default function ResetPassword() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50">
            <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 shadow-xl rounded-2xl overflow-hidden border-0">
                <CardHeader className="space-y-1 p-6">
                    <CardTitle className="text-2xl font-bold">Сброс пароля</CardTitle>
                    <CardDescription>Введите новый пароль</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <Suspense fallback={<div>Loading...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}