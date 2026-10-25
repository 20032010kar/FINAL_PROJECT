import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

export function RequestDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState('');

    const userRole = localStorage.getItem('userRole');
    const isOperator = userRole === 'operator';

    // Завантаження даних конкретної заявки
    const { data: request, isLoading, error } = useQuery({
        queryKey: ['request', id],
        queryFn: async () => {
            const res = await api.get(`/requests/${id}`);
            return res.data;
        },
    });

    // Завантаження списку статусів для оператора
    const { data: statuses = [] } = useQuery({
        queryKey: ['statuses'],
        queryFn: async () => {
            const res = await api.get('/request-statuses');
            return res.data;
        },
    });

    // Мутація для зміни статусу заявки (оператор)
    const statusMutation = useMutation({
        mutationFn: async (newStatusId: string) => {
            const res = await api.patch(`/requests/${id}/status`, { statusId: newStatusId });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['request', id] });
            queryClient.invalidateQueries({ queryKey: ['requests'] });
        },
    });

    // Мутація для додавання коментаря
    const commentMutation = useMutation({
        mutationFn: async (text: string) => {
            const res = await api.post(`/requests/${id}/comments`, { text });
            return res.data;
        },
        onSuccess: () => {
            setCommentText('');
            queryClient.invalidateQueries({ queryKey: ['request', id] });
        },
    });

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        statusMutation.mutate(e.target.value);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        commentMutation.mutate(commentText);
    };

    if (isLoading) {
        return (
            <div className="text-center py-12 text-emerald-400 font-mono text-lg animate-pulse">
                🧪 Вариться зілля та завантажується закляття...
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="text-center py-12 text-red-400 font-mono text-lg bg-zinc-950 border border-red-500/30 rounded-xl max-w-lg mx-auto p-6">
                💀 Заявку не знайдено або її знищили темні сили.
            </div>
        );
    }

    return (
        <div className="relative max-w-4xl mx-auto space-y-6">
            {/* Отруйно-зелене неонове сяйво на фоні */}
            <div className="absolute -top-10 -left-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-green-950/40 rounded-full blur-3xl pointer-events-none"></div>

            {/* Шапка з навігацією */}
            <div className="relative z-10 flex justify-between items-center">
                <button
                    onClick={() => navigate('/requests')}
                    className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center space-x-1 transition cursor-pointer"
                >
                    <span>&larr; Назад до гримуару заявок 🧟</span>
                </button>
                <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-emerald-900/40">
                    ID закляття: <b className="text-emerald-400">{request.id}</b>
                </span>
            </div>

            {/* Основна інформація про заявку */}
            <div className="relative z-10 bg-zinc-950 border border-emerald-500/30 p-6 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.12)] space-y-5 text-emerald-100">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="flex items-center space-x-3">
                        <span className="text-3xl">🧪</span>
                        <h1 className="text-2xl font-bold tracking-wide text-emerald-400 font-mono uppercase">
                            {request.subject || request.topic}
                        </h1>
                    </div>
                    
                    <div>
                        {isOperator ? (
                            <div className="flex items-center space-x-2 bg-zinc-900 px-3 py-1.5 rounded-lg border border-emerald-900/60">
                                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                                    Статус:
                                </span>
                                <select
                                    value={request.statusId}
                                    onChange={handleStatusChange}
                                    className="bg-zinc-950 text-emerald-300 border border-emerald-800/80 rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                                >
                                    {statuses.map((st: any) => (
                                        <option key={st.id} value={st.id} className="bg-zinc-950 text-emerald-300">
                                            {st.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <span className="px-3 py-1.5 text-xs font-mono font-semibold rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                🟢 Статус: {request.statusId}
                            </span>
                        )}
                    </div>
                </div>

                <p className="text-zinc-300 text-sm whitespace-pre-line leading-relaxed bg-zinc-900/60 p-4 rounded-lg border border-zinc-800">
                    {request.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-emerald-950 text-xs text-zinc-400 font-mono">
                    <div><b>Категорія:</b> <span className="text-emerald-300">{request.categoryId}</span></div>
                    <div><b>Пріоритет:</b> <span className="text-emerald-300">{request.priorityId}</span></div>
                    <div><b>Контакти:</b> <span className="text-emerald-300">{request.contactInfo || request.clientContact}</span></div>
                    <div><b>Створено:</b> <span className="text-emerald-300">{new Date(request.createdAt).toLocaleString()}</span></div>
                </div>
            </div>

            {/* Блок заклять-коментарів */}
            <div className="relative z-10 bg-zinc-950 border border-emerald-500/30 p-6 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.12)] space-y-6">
                <div className="flex items-center space-x-2 border-b border-emerald-950 pb-3">
                    <span className="text-xl">📜</span>
                    <h2 className="text-lg font-bold text-emerald-400 font-mono uppercase tracking-wider">
                        Шепоти та Коментарі
                    </h2>
                </div>

                <div className="space-y-4">
                    {request.comments && request.comments.length > 0 ? (
                        request.comments.map((comment: any, index: number) => (
                            <div key={index} className="p-4 bg-zinc-900/80 border border-emerald-900/40 rounded-lg space-y-1.5">
                                <div className="flex justify-between text-xs font-mono text-zinc-400">
                                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                        🧙‍♂️ {comment.authorEmail || comment.authorName || 'Невідомий маг'}
                                    </span>
                                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-zinc-200">{comment.text || comment.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-zinc-500 italic font-mono">В астралі ще немає жодного коментаря...</p>
                    )}
                </div>

                {/* Форма додавання коментаря */}
                <form onSubmit={handleCommentSubmit} className="space-y-3 pt-4 border-t border-emerald-950">
                    <textarea
                        rows={3}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Напишіть коментар у чаклунський журнал..."
                        className="w-full px-3 py-2 bg-zinc-900 border border-emerald-900/60 rounded-md text-emerald-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition text-sm resize-none"
                        required
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={commentMutation.isPending}
                            className="px-5 py-2 border border-emerald-500/50 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.3)] text-xs font-bold text-zinc-950 bg-emerald-500 hover:bg-emerald-400 focus:outline-none disabled:opacity-50 transition uppercase tracking-wider cursor-pointer"
                        >
                            {commentMutation.isPending ? 'Запечатування...' : 'Додати коментар 🧪'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RequestDetailsPage;