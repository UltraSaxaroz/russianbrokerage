'use client'

import {useEffect, useState} from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {useRouter} from "next/navigation";
import Login from "@/components/login";
import Register from "@/components/register";

export default function Component() {
    const [activeTab, setActiveTab] = useState("login")
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            router.push('/panel')
        }
    }, [router]);

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4 overflow-hidden">
            {/* Background SVG elements */}
            <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                        <rect width="100" height="100" fill="url(#smallGrid)"/>
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md relative z-10">
                {/*<TabsList className="w-full mb-4">*/}
                    {/*<TabsTrigger className={'w-full'} value="login">Вход</TabsTrigger>*/}
                {/*</TabsList>*/}
                <Login />
                {/*<Register />*/}
            </Tabs>
        </div>
    )
}