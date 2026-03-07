import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        const userId = sessionStorage.getItem('user_id');
        setIsAuth(!!userId);
    }, []);

    if (isAuth === null) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuth) {
        // Phase 14: Redirect to /token as required
        console.warn("Unauthorized access, redirecting to /token");
        window.location.href = "/token";
        return null;
    }

    return <>{children}</>;
};

export default AuthGuard;
