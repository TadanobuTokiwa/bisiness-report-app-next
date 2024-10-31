'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { auth } from "@/services/firebaseConfig"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie';
import ProtectedRoute from "../../protectedRoute"

const ManagerMenu = () => {

    const { userName } = useAuth();
    const router = useRouter()

    const logout = async() => {
        await signOut(auth)
        Cookies.remove('__session');
        router.push('/login');
    }
    
    return (
        <ProtectedRoute>
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md bg-slate-50">
                    <CardHeader>
                    <CardTitle>管理者メニュー</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 text-center">
                        <div className="mb-3">
                            <Label className="w-full">ユーザー名: {userName}</Label>
                            <Button 
                                className="border border-gray-400 ml-3 hover:bg-gray-200 h-7"
                                onClick={() => logout()}
                            >ログアウト</Button>
                        </div>
                        <Button 
                            className="w-full border border-gray-400 bg-gray-50 hover:bg-gray-200" 
                            onClick={() => router.push("/manager/taskManagement")}>
                            業務項目管理画面
                        </Button>
                        <Button 
                            className="w-full border border-gray-400 bg-gray-50 hover:bg-gray-200" 
                            onClick={() => console.log("")}>
                            全従業員リスト
                        </Button>
                        <Button 
                            className="w-full border border-gray-400 bg-gray-50 hover:bg-gray-200" 
                            onClick={() => router.push("/manager/home")}>
                            新規投稿
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    )
}

export default ManagerMenu