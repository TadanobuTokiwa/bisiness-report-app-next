'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const Login = () => {
    const [loginKey, setLoginKey] = useState('')

    const handleGoogleLogin = () => {
        console.log('Google login clicked')
    }

    const handleLogin = () => {
        console.log('Login clicked with key:', loginKey)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <Card className="w-full max-w-md bg-slate-50">
                <CardHeader>
                <CardTitle>ログイン</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleGoogleLogin}
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                    </svg>
                    Googleでログイン
                </Button>
                <div className="space-y-2">
                    <Label htmlFor="loginKey">ログインキー</Label>
                    <Input
                    id="loginKey"
                    type="password"
                    placeholder="ログインキーを入力してください"
                    value={loginKey}
                    onChange={(e) => setLoginKey(e.target.value)}
                    />
                </div>
                </CardContent>
                <CardFooter>
                <Button className="w-full border hover:bg-gray-200" onClick={handleLogin}>
                    ログイン
                </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Login;