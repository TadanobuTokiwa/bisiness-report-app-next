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
        return <p>Loading...</p>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;