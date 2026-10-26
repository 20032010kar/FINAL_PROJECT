import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { requestSchema, type RequestFormInputs } from '../schemas/requstSchema';
import { useNotification } from '../context/NotificationContext';

export function CreateRequestPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get('/categories');
            return res.data;
        },
    });

    const { data: priorities = [] } = useQuery({
        queryKey: ['priorities'],
        queryFn: async () => {
            const res = await api.get('/priorities');
            return res.data;
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RequestFormInputs>({
        resolver: zodResolver(requestSchema),
    });

    const mutation = useMutation({
        mutationFn: async (formData: RequestFormInputs) => {
            const payload = {
                topic: formData.subject,
                description: formData.description,
                categoryId: formData.categoryId,
                priorityId: formData.priorityId,
                clientContact: formData.contactInfo,
            };
            const res = await api.post('/requests', payload);
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            showNotification('Заявку створено! ', 'success');
            navigate(`/requests/${data.id}`);
        },
        onError: () => {
            showNotification('Не вдалося створити заявку. Сталася помилка сервера.', 'error');
        },
    });

    const onSubmit = (data: RequestFormInputs) => {
        mutation.mutate(data);
    };

    return (
        <div className="relative max-w-2xl mx-auto">
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-violet-900/30 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 bg-zinc-950 border border-purple-500/30 p-8 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.15)] text-purple-100">
                <div className="flex items-center space-x-3 mb-6">
                    <span className="text-3xl"></span>
                    <div>
                        <h2 className="text-2xl font-bold tracking-wide text-purple-400 font-mono uppercase">
                            Створення нової заявки
                        </h2>
                        <p className="text-xs text-zinc-400">Опишіть проблему для служби підтримки</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
                            Тема заявки
                        </label>
                        <input
                            type="text"
                            {...register('subject')}
                            className="w-full px-3 py-2 bg-zinc-900 border border-purple-900/60 rounded-md text-purple-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                            placeholder="Коротко опишіть проблему..."
                        />
                        {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
                            Детальний опис
                        </label>
                        <textarea
                            rows={4}
                            {...register('description')}
                            className="w-full px-3 py-2 bg-zinc-900 border border-purple-900/60 rounded-md text-purple-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm resize-none"
                            placeholder="Детально розкажіть про суть проблеми..."
                        />
                        {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
                                Категорія
                            </label>
                            <select
                                {...register('categoryId')}
                                className="w-full px-3 py-2 bg-zinc-900 border border-purple-900/60 rounded-md text-purple-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm cursor-pointer"
                            >
                                <option value="" className="bg-zinc-950 text-zinc-500">Оберіть категорію</option>
                                {categories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id} className="bg-zinc-950 text-purple-200">
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && <p className="mt-1 text-xs text-red-400">{errors.categoryId.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
                                Пріоритет
                            </label>
                            <select
                                {...register('priorityId')}
                                className="w-full px-3 py-2 bg-zinc-900 border border-purple-900/60 rounded-md text-purple-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm cursor-pointer"
                            >
                                <option value="" className="bg-zinc-950 text-zinc-500">Оберіть пріоритет</option>
                                {priorities.map((prio: any) => (
                                    <option key={prio.id} value={prio.id} className="bg-zinc-950 text-purple-200">
                                        {prio.name}
                                    </option>
                                ))}
                            </select>
                            {errors.priorityId && <p className="mt-1 text-xs text-red-400">{errors.priorityId.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
                            Контактні дані
                        </label>
                        <input
                            type="text"
                            {...register('contactInfo')}
                            className="w-full px-3 py-2 bg-zinc-900 border border-purple-900/60 rounded-md text-purple-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
                            placeholder="Email або телефон..."
                        />
                        {errors.contactInfo && <p className="mt-1 text-xs text-red-400">{errors.contactInfo.message}</p>}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t border-purple-900/30">
                        <button
                            type="button"
                            onClick={() => navigate('/requests')}
                            className="px-4 py-2 border border-purple-900/50 rounded-md text-sm font-medium text-purple-300 hover:bg-purple-950/50 transition cursor-pointer"
                        >
                            Скасувати 
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="px-5 py-2 border border-purple-500/50 rounded-md shadow-[0_0_15px_rgba(168,85,247,0.3)] text-sm font-bold text-zinc-950 bg-purple-500 hover:bg-purple-400 focus:outline-none disabled:opacity-50 transition uppercase tracking-wider cursor-pointer"
                        >
                            {mutation.isPending ? 'Відправка...' : 'Відправити заявку '}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateRequestPage;