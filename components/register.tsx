import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {TabsContent} from "@/components/ui/tabs";
import {useRouter} from "next/navigation";

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        if (!email.includes('@')) {
            setError('Please enter a valid email address')
            setIsLoading(false)
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            setIsLoading(false)
            return
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, email, password}),
            })

            const data = await res.json()

            if (res.ok) {
                router.push('/panel')
            } else {
                setError(data.message || 'An error occurred')
            }
        } catch (error) {
            setError('An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <TabsContent value="register">
            <Card className="backdrop-blur-sm bg-white/80">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
                    <CardDescription>Создайте новый аккаунт</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="space-y-2">
                                <Label htmlFor="register-name">Имя</Label>
                                <Input
                                    id="register-name"
                                    placeholder="Иван Иванов"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <Label htmlFor="register-email">Почта</Label>
                            <Input
                                id="register-email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="register-password">Пароль</Label>
                            <Input
                                id="register-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Регистрация.." : "Зарегистрироваться"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </TabsContent>
    );
};

export default Register;