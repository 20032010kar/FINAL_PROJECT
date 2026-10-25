import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './pages/LoginPage';
import { RequestsPage } from './pages/RequestsPage';
import { CreateRequestPage } from './pages/CreateReguestPage';
import { RequestDetailsPage } from './pages/RequestDetailsPage';
import { MainLayout } from './layouts/MainLayout';
import { PublicLayout } from './layouts/PublicLayout';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

// Компонент для автоматического перенаправленя с коренной страницы '/'
const RootRedirect = () => {
    const token = localStorage.getItem('accessToken');
    return <Navigate to={token ? '/requests' : '/login'} replace />;
};

const router = createBrowserRouter([
    // Автоматический редирект с корня '/'
    {
        path: '/',
        element: <RootRedirect />,
    },

    // Публічні маршрути (тільки сторінка логіну)
    {
        element: <PublicLayout />,
        children: [
            {
                path: '/login',
                element: <LoginPage />,
            },
        ],
    },

    // Захищені маршрути внутрішньої частини системи
    {
        element: <MainLayout />,
        children: [
            {
                path: '/requests',
                element: <RequestsPage />,
            },
            {
                path: '/requests/new',
                element: <CreateRequestPage />,
            },
            {
                path: '/requests/:id',
                element: <RequestDetailsPage />,
            },
        ],
    },

    // Сторінка 404 Not Found
    {
        path: '/not-found',
        element: (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <h1 className="text-6xl font-extrabold text-gray-800 mb-2">404</h1>
                <p className="text-lg text-gray-600 mb-6">Сторінку не знайдено</p>
                <a 
                    href="/requests" 
                    className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md shadow hover:bg-indigo-700 transition"
                >
                    Повернутися на головну
                </a>
            </div>
        ),
    },

    // Усі невідомі маршрути перенаправляємо на /not-found згідно з ТЗ
    {
        path: '*',
        element: <Navigate to="/not-found" replace />,
    },
]);

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}