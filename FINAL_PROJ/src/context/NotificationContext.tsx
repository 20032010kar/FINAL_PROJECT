import { createContext, useContext, useState, type ReactNode } from 'react';

type NotificationType = 'success' | 'error';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

interface NotificationContextType {
    showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = (message: string, type: NotificationType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 4000);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="fixed bottom-5 right-5 z-50 space-y-2 pointer-events-none">
                {notifications.map((n) => {
                    let styleClasses = '';
                    let icon = '';

                    if (n.type === 'success') {
                        styleClasses = 'bg-zinc-950 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
                        icon = '🦇 ';
                    } else {
                        styleClasses = 'bg-zinc-950 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
                        icon = '⚡ ';
                    }

                    return (
                        <div
                            key={n.id}
                            className={`px-4 py-3 rounded-lg shadow-lg text-sm font-mono border transition-all pointer-events-auto ${styleClasses}`}
                        >
                            {icon} {n.message}
                        </div>
                    );
                })}
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}