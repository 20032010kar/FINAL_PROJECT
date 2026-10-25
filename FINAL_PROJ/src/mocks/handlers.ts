import { http, HttpResponse, delay } from 'msw';
import {
    initialUsers,
    initialCategories,
    initialPriorities,
    initialStatuses,
    initialRequests,
    initialComments,
    initialHistory
} from './initialData';
import type { ServiceRequest, OperatorComments, StatusHistoryChange } from '../types';

let users = [...initialUsers];
let categories = [...initialCategories];
let priorities = [...initialPriorities];
let statuses = [...initialStatuses];
let requests = [...initialRequests];
let comments = [...initialComments];
let history: StatusHistoryChange[] = [...initialHistory];
const checkAuth = (request: Request) => {
    const authHeader = request.headers.get('Authorization');
    return authHeader && authHeader.startsWith('Bearer ');
};

export const handlers=[
// 1. Вхід у систему
    http.post('/auth/login', async ({ request }) => {
        const data = (await request.json()) as { email: string; password: string };

        if (data.email === 'user@example.com' && data.password === 'user123') {
            return HttpResponse.json({
                accessToken: 'mock-user-token-123',
                user: users[0],
            });
        } else if (data.email === 'operator@example.com' && data.password === 'operator123') {
            return HttpResponse.json({
                accessToken: 'mock-operator-token-123',
                user: users[1],
            });
        } else {
            return new HttpResponse(JSON.stringify({ message: 'Невірні дані авторизації' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }),

    // 2. Отримання даних поточного користувача
    http.get('/auth/me', ({ request }) => {
        if (!checkAuth(request)) return new HttpResponse(null, { status: 401 });

        const authHeader = request.headers.get('Authorization');
        if (authHeader?.includes('mock-operator-token')) {
            return HttpResponse.json(users[1]);
        }
        return HttpResponse.json(users[0]);
    }),

    // 3. Список заявок поточного користувача (з затримкою 800мс за ТЗ)
    http.get('/requests/my', async ({ request }) => {
        if (!checkAuth(request)) return new HttpResponse(null, { status: 401 });
        await delay(800);
        return HttpResponse.json(requests.filter((r) => r.userId === '1'));
    }),

    // 4. Загальний список заявок для оператора
    http.get('/requests', ({ request }) => {
        if (!checkAuth(request)) return new HttpResponse(null, { status: 401 });
        const url = new URL(request.url);
        const statusId = url.searchParams.get('statusId');

        let filtered = [...requests];
        if (statusId) {
            filtered = filtered.filter((r) => r.statusId === statusId);
        }
        return HttpResponse.json(filtered);
    }),

    // 5. Картка заявки за ID
    http.get('/requests/:id', ({ request, params }) => {
        if (!checkAuth(request)) return new HttpResponse(null, { status: 401 });
        const item = requests.find((r) => r.id === params.id);
        if (!item) return new HttpResponse(null, { status: 404 });
        return HttpResponse.json(item);
    }),

    // 6. Створення нової заявки
    http.post('/requests', async ({ request }) => {
        if (!checkAuth(request)) return new HttpResponse(null, { status: 401 });
        const body = (await request.json()) as Omit<ServiceRequest, 'id' | 'createdAt' | 'statusId' | 'userId'>;
        
        const newReq: ServiceRequest = {
            ...body,
            id: `req-${Date.now()}`,
            userId: '1',
            statusId: 'st-1', // Початковий статус "New request"
            createdAt: new Date().toISOString(),
        };

        requests.push(newReq);
        return HttpResponse.json(newReq, { status: 201 });
    }),

    // 7. Зміна статусу заявки
    http.patch('/requests/:id/status', async ({ request, params }) => {
        if (!checkAuth(request)) return new HttpResponse(null, { status: 401 });
        const body = (await request.json()) as { statusId: string; operatorName: string };
        const reqIndex = requests.findIndex((r) => r.id === params.id);

        if (reqIndex === -1) return new HttpResponse(null, { status: 404 });

        const oldStatusObj = statuses.find((s) => s.id === requests[reqIndex].statusId);
        const newStatusObj = statuses.find((s) => s.id === body.statusId);

        requests[reqIndex] = { ...requests[reqIndex], statusId: body.statusId };

        history.push({
            requestId: params.id as string,
            oldStatus: oldStatusObj?.name || 'Unknown',
            newStatus: newStatusObj?.name || 'Unknown',
            changedAt: new Date().toISOString(),
            changedBy: body.operatorName || 'Оператор',
        });

        return HttpResponse.json(requests[reqIndex]);
    }),

    // 8. Додавання коментаря
    http.post('/requests/:id/comments', async ({ request, params }) => {
        if (!checkAuth(request)) return new HttpResponse(null, { status: 401 });
        const body = (await request.json()) as { comment: string; authorName: string };
        
        const newComment: OperatorComments = {
            commentId: `com-${Date.now()}`,
            requestId: params.id as string,
            authorName: body.authorName,
            comment: body.comment,
            createdAt: new Date().toISOString(),
            id: String(comments.length + 1),
        };

        comments.push(newComment);
        return HttpResponse.json(newComment, { status: 201 });
    }),


    // 9. Отримання історії зміни статусів
    http.get('/requests/:id/history', ({ request, params }) => {
        if (!checkAuth(request)) return new HttpResponse(null, { status: 401 });
        return HttpResponse.json(history.filter((h) => h.requestId === params.id));
    }),

    // 10. Довідники (категорії, пріоритети, статуси)
    http.get('/categories', () => HttpResponse.json(categories)),
    http.get('/priorities', () => HttpResponse.json(priorities)),
    http.get('/request-statuses', () => HttpResponse.json(statuses)),
];