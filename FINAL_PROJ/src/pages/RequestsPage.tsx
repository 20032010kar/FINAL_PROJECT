import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api/client';

export function RequestsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const statusIdFilter = searchParams.get('statusId') || '';
    
    const userRole = localStorage.getItem('userRole');
    const isOperator = userRole === 'operator';

    const endpoint = isOperator ? '/requests' : '/requests/my';

    const { data: requests = [], isLoading, error } = useQuery({
        queryKey: ['requests', isOperator, statusIdFilter],
        queryFn: async () => {
            const response = await api.get(endpoint, {
                params: isOperator && statusIdFilter ? { statusId: statusIdFilter } : {},
            });
            return response.data;
        },
    });

    const { data: statuses = [] } = useQuery({
        queryKey: ['statuses'],
        queryFn: async () => {
            const res = await api.get('/request-statuses');
            return res.data;
        },
    });

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val) {
            setSearchParams({ statusId: val });
        } else {
            setSearchParams({});
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-16 text-cyan-400 font-mono text-lg animate-pulse">
                Завантаження списку заявок...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-400 font-mono text-lg bg-zinc-950 border border-red-500/30 rounded-xl max-w-lg mx-auto p-6">
                Не вдалося завантажити список заявок.
            </div>
        );
    }

    return (
        <div className="relative max-w-7xl mx-auto space-y-6">
            <div className="absolute -top-12 -left-12 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/2 -right-12 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                    <span className="text-3xl">👻</span>
                    <h2 className="text-2xl font-bold tracking-wide text-cyan-400 font-mono uppercase">
                        {isOperator ? 'Усі заявки ' : 'Мої заявки '}
                    </h2>
                </div>
                
                {!isOperator && (
                    <Link
                        to="/requests/new"
                        className="px-5 py-2.5 border border-cyan-500/50 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] text-xs font-bold text-zinc-950 bg-cyan-400 hover:bg-cyan-300 focus:outline-none transition uppercase tracking-wider cursor-pointer"
                    >
                       ➕
                    </Link>
                )}
            </div>

            <div className="relative z-10 bg-zinc-950 border border-cyan-500/30 p-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.1)] flex items-center space-x-4">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300">
                    Фільтр за статусом:
                </label>
                <select
                    value={statusIdFilter}
                    onChange={handleStatusChange}
                    className="bg-zinc-900 text-cyan-200 border border-cyan-900/60 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                >
                    <option value="" className="bg-zinc-950 text-zinc-500">Усі статуси</option>
                    {statuses.map((status: any) => (
                        <option key={status.id} value={status.id} className="bg-zinc-950 text-cyan-200">
                            {status.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="relative z-10 bg-zinc-950 border border-cyan-500/30 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.12)] overflow-hidden">
                {requests.length === 0 ? (
                    <p className="p-8 text-center text-zinc-500 font-mono text-sm">
                        🕸️ Нічого не знайдено за вашим запитом.
                    </p>
                ) : (
                    <table className="min-w-full divide-y divide-cyan-950">
                        <thead className="bg-zinc-900/80">
                            <tr>
                                <th className="px-6 py-3.5 text-left text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3.5 text-left text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">Тема</th>
                                <th className="px-6 py-3.5 text-left text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">Пріоритет</th>
                                <th className="px-6 py-3.5 text-left text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">Статус</th>
                                <th className="px-6 py-3.5 text-right text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">Дії</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cyan-950/60 bg-zinc-950/60">
                            {requests.map((req: any) => (
                                <tr key={req.id} className="hover:bg-cyan-950/30 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-cyan-300">{req.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-200">{req.subject || req.topic}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-zinc-400">{req.priorityId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="px-3 py-1 inline-flex text-xs font-mono font-semibold rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                                            {req.statusId}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/requests/${req.id}`} className="text-cyan-400 hover:text-cyan-300 font-mono text-xs tracking-wider uppercase transition">
                                            Оглянути ;
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default RequestsPage;