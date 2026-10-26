import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../api/client';
import { loginSchema, type LoginFormInputs } from '../schemas/authSchema';
import { useNotification } from '../context/NotificationContext';

export function LoginPage() {
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    
    const emailInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        emailInputRef.current?.focus();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormInputs) => {
        setServerError('');

        try {
            const response = await api.post('/auth/login', data);
            const { accessToken } = response.data;

            localStorage.setItem('accessToken', accessToken);

            const meResponse = await api.get('/auth/me');
            const user = meResponse.data;

            localStorage.setItem('userRole', user.role);

            showNotification('Успішний вхід ', 'success');
            navigate('/requests');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Невірний email або пароль';
            setServerError(msg);
            showNotification(msg, 'error');
        }
    };

    const { ref: registerRef, ...emailRegistration } = register('email');

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-orange-100 relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-950/40 rounded-full blur-3xl pointer-events-none"></div>

            <div className="bg-zinc-900 border border-orange-500/30 p-8 rounded-xl shadow-[0_0_25px_rgba(249,115,22,0.15)] w-full max-w-md mx-4 relative z-10">
                <div className="text-center mb-6">
                    <span className="text-4xl">🎃</span>
                    <h1 className="text-2xl font-bold tracking-wider text-orange-500 mt-2 font-mono uppercase">
                        Halloween Desk
                    </h1>
                </div>
                
                {serverError && (
                    <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 text-red-300 text-xs rounded-md text-center">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-orange-400 mb-1">Email</label>
                        <input
                            type="email"
                            {...emailRegistration}
                            ref={(e) => {
                                registerRef(e);
                                emailInputRef.current = e;
                            }}
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-md text-orange-100 placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-sm"
                            placeholder="user@example.com"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-orange-400 mb-1">Пароль</label>
                        <input
                            type="password"
                            {...register('password')}
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-md text-orange-100 placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-sm"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 border border-orange-500/50 rounded-md shadow-[0_0_15px_rgba(249,115,22,0.3)] text-sm font-bold text-zinc-950 bg-orange-500 hover:bg-orange-400 focus:outline-none disabled:opacity-50 transition uppercase tracking-wider cursor-pointer"
                    >
                        {isSubmitting ? 'Відправка...' : 'Увійти '}
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-zinc-800 text-xs text-zinc-400 space-y-1">
                    
                </div>
            </div>
        </div>
    );
}

export default LoginPage;