'use client'

import { useState } from 'react'
import { Provider } from 'react-redux';
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { store } from '@/store/store';
import TasksForm from '@/feature/components/home/TasksForm';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '../../protectedRoute';
import { Input } from '@/components/ui/input';

const ManagerHome = () => {
    const [cardMoved, setCardMoved] = useState<boolean>(false);
    const [postUserName, setPostUserName] = useState<string>("");

    const router = useRouter();
    const { userName } = useAuth();

    const reset = () => {
        setCardMoved(false);
    }

    return (
        <ProtectedRoute>
        <Provider store={store}>
        <div className="container mx-auto p-4 max-w-5xl">
            <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">業務報告</h1>
            <strong className='border px-4 bg-yellow-600 text-white'>管理者用</strong>
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{`ユーザー名: ${userName}`}</span>
            </div>
            </div>
            {cardMoved ? 
                <></> :
                <TasksForm 
                cardMoved={cardMoved} 
                setCardMoved={setCardMoved}
                postUserName={postUserName}
                />
            }
            <div className={`${cardMoved ? 'mt-12' : 'mt-4'} flex justify-between`}>
            <div className="">
                <Input 
                    className='w-28'
                    value={postUserName}
                    onChange={(e) => setPostUserName(e.target.value)}
                    placeholder='投稿ユーザー名' 
                />
                <p className='pt-1 text-xs'>※空欄の場合</p>
                <p className='text-xs'>{userName} で投稿</p>
            </div>
            {cardMoved && (
                <div className="text-center">
                <h2 className="text-2xl font-bold text-green-600">送信完了</h2>
                <p className="mt-2">業務報告が正常に送信されました。</p>
                <Button className='my-5 border border-blue-900 hover:bg-gray-200 z-0' onClick={() => reset()}>新しいカードを作成</Button>
                </div>
            )}
            <Button 
                className='border border-blue-900 hover:bg-gray-200 z-0' 
                variant="secondary"
                onClick={() => router.back()}
            >
                戻る
            </Button>
            </div>
        </div>
        </Provider>
        </ProtectedRoute>
    )
}

export default ManagerHome;