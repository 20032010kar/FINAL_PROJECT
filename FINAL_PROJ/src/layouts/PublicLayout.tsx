import { Outlet, Navigate } from 'react-router-dom';

export function PublicLayout() {
    const token = localStorage.getItem('accessToken');

    if (token) {
        return <Navigate to="/requests" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Outlet />
        </div>
    );
}