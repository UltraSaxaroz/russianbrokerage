import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {TabsContent} from "@/components/ui/tabs";
import {useRouter} from "next/navigation";
import Link from 'next/link';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
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

        if (password.length < 1) {
            setError('Please enter your password')
            setIsLoading(false)
            return
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            })

            const data = await res.json()

            if (res.ok) {
                localStorage.setItem('token', data.token)
                // Redirect or update UI on successful login
                router.push('/panel');
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
        <TabsContent value="login">
            <Card className="backdrop-blur-sm bg-white/80">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Вход</CardTitle>
                    <CardDescription>Войдите в свой аккаунт</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="login-email">Почта</Label>
                            <Input
                                id="login-email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                type="email"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="login-password">Пароль</Label>
                            <Input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 sm:space-x-4">
                        <Button
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                            disabled={isLoading} type="submit">
                            {isLoading ? "Ожидание.." : "Войти"}
                        </Button>
                        <Link href="/auth/password-recovery" className="w-full sm:w-auto text-sm">
                            Забыли пароль? <span className={'font-semibold'}>Восстановить</span>
                        </Link>
                    </CardFooter>
                </form>
            </Card>
        </TabsContent>
    );
};

export default Login;