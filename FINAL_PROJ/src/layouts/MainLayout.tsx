import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export function MainLayout() {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    let requestsLinkText = 'Мої заявки';
    if (userRole === 'operator') {
        requestsLinkText = 'Всі заявки';
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <h1 className="text-xl font-bold text-indigo-600">ServiceDesk</h1>
                    
                    <nav className="flex space-x-4">
                        <NavLink
                            to="/requests"
                            className={({ isActive }) => {
                                if (isActive) {
                                    return 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1';
                                } else {
                                    return 'text-gray-600 hover:text-indigo-600 pb-1';
                                }
                            }}
                        >
                            {requestsLinkText}
                        </NavLink>
                        <NavLink
                            to="/requests/new"
                            className={({ isActive }) => {
                                if (isActive) {
                                    return 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1';
                                } else {
                                    return 'text-gray-600 hover:text-indigo-600 pb-1';
                                }
                            }}
                        >
                            Створити заявку
                        </NavLink>
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                        Роль: <strong className="text-gray-700 capitalize">{userRole}</strong>
                    </span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition font-medium"
                    >
                        Вийти
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;