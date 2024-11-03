'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setError('Пароли не совпадают')
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
                setMessage(data.message)
                setError('')
            } else {
                setError(data.message)
                setMessage('')
            }
        } catch (error) {
            setError('Произошла ошибка. Пожалуйста, попробуйте еще раз.')
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50">
            <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 shadow-xl rounded-2xl overflow-hidden border-0">
                <CardHeader className="space-y-1 p-6">
                    <CardTitle className="text-2xl font-bold">Сброс пароля</CardTitle>
                    <CardDescription>Введите новый пароль</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">Новый пароль</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">Установить новый пароль</Button>
                    </form>
                    {message && <p className="mt-4 text-center text-green-600">{message}</p>}
                    {error && <p className="mt-4 text-center text-red-600">{error}</p>}
                </CardContent>
            </Card>
        </div>
    )
}