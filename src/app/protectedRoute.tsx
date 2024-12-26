"use client";

import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const sessionCookie = Cookies.get('__session');
    
    useEffect(() => {
        if (!loading && (!user || !sessionCookie)) {
        router.push('/login');
        }
    }, [user, loading, sessionCookie, router]);

    if (loading) {
        return (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>  
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;