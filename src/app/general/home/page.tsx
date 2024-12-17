'use client'

import { useEffect, useState } from 'react'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { store, persistor } from '@/store/store';
import TasksForm from '@/feature/components/home/TasksForm';
import { signOut } from 'firebase/auth';
import { getFirebaseServices, initializeFirebaseApp } from '@/services/firebaseConfig';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '../../protectedRoute';
import Template from '@/feature/components/home/Template';

const Home = () => {
  const [cardMoved, setCardMoved] = useState<boolean>(false);

  useEffect(() => {
    initializeFirebaseApp();
  }, []);
  const { auth } = getFirebaseServices();

  const router = useRouter();
  const { userName } = useAuth();

  const reset = () => {
    setCardMoved(false);
  }

  const logout = async() => {
    if (auth) {
      await signOut(auth)
      Cookies.remove('__session');
      router.push('/login');
    }
  }

  return (
    <ProtectedRoute>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="container mx-auto p-4 max-w-5xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">業務報告</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{`ユーザー名: ${userName}`}</span>
              <Button className='hover:bg-gray-200' variant="outline" size="sm" onClick={() => logout()}>
                ログアウト
              </Button>
            </div>
          </div>
            {cardMoved ? 
              <></> :
              <TasksForm 
              cardMoved={cardMoved} 
              setCardMoved={setCardMoved}
              postUserEmail=""
              postDate=""
              userName={userName ? userName : ""}
              />
            }
          <div className={`${cardMoved ? 'mt-12' : 'mt-4'} flex justify-between`}>
          {cardMoved ? 
            <div className="invisible"></div> :
            <Template />
          }
            {cardMoved && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-green-600">送信完了</h2>
                <p className="mt-2">業務報告が正常に送信されました。</p>
                <Button className='my-5 border border-blue-900 hover:bg-gray-200 z-0' onClick={() => reset()}>新しいカードを作成</Button>
              </div>
            )}
            <Button className='border border-blue-900 hover:bg-gray-200 z-0' variant="secondary">
              <Link href={"/general/sendlist"}>
                リスト表示
              </Link>
            </Button>
          </div>
        </div>
      </PersistGate>
      </Provider>
    </ProtectedRoute>
  )
}

export default Home;