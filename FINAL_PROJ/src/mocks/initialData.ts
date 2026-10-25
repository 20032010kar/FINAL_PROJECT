import type {
    User,
    ServiceRequest,
    Category,
    Priority,
    RequestStatus,
    OperatorComments,
    StatusHistoryChange
} from '../types';

export const initialUsers:User[]=[
    {id:'1',email:'user@example.com',role:'user',name:"Elis"},
    {id:'2',email:'operator@example.com',role:'operator',name:"Rory"}
];

export const initialRequests: ServiceRequest[] = [
    {
        id: 'req-1',
        userId: '1',
        topic: 'Не працює принтер',
        description: 'Принтер не друкує документи.',
        categoryId: 'yutr-2', // hardware
        priorityId: 'prio-2', // Average
        statusId: 'st-1',   // New request
        createdAt: new Date().toISOString(),
        clientContact: 'user@example.com',
    },
    {
        id: 'req-2',
        userId: '1',
        topic: 'Проблеми з інтернетом',
        description: 'Зникає підключення до мережі.',
        categoryId: 'wesf-1', // auxiliary services
        priorityId: 'prio-3', // High
        statusId: 'st-2',   // Pending
        createdAt: new Date().toISOString(),
        clientContact: '+380671234567',
    },
    {
        id: 'req-3',
        userId: '1',
        topic: 'Налаштування телефону',
        description: 'Потрібно підключити корпоративну пошту.',
        categoryId: 'sdkv-3', // phones
        priorityId: 'prio-1', // low
        statusId: 'st-1',   // New request
        createdAt: new Date().toISOString(),
        clientContact: 'user@example.com',
    },
    {
        id: 'req-4',
        userId: '1',
        topic: 'Заміна мишки',
        description: 'Не працює ліва кнопка миші.',
        categoryId: 'yutr-2', // hardware
        priorityId: 'prio-1', // low
        statusId: 'st-4',   // Resolved
        createdAt: new Date().toISOString(),
        clientContact: '+380509876543',
    },
    {
        id: 'req-5',
        userId: '1',
        topic: 'Помилка ПЗ',
        description: 'Вилітає програма при запуску.',
        categoryId: 'wesf-1', // auxiliary services
        priorityId: 'prio-3', // High
        statusId: 'st-5',   // Rejected
        createdAt: new Date().toISOString(),
        clientContact: 'user@example.com',
    },
];

export const initialComments:OperatorComments[]=[

    {
    commentId:'erwre-1',
    requestId:'uygu-2',
    authorName:'Ann',
    comment:'Everythig work succesfully',
    createdAt:new Date().toISOString(),
    id:'1'
    },
    {
        commentId: 'erwre-2',
        requestId: 'req-1',
        authorName: 'Rory',
        comment: 'Перевіряємо стан картриджа.',
        createdAt: new Date().toISOString(),
        id: '2'
    }
];

export const initialHistory: StatusHistoryChange[] = [
    {
        requestId: 'req-2',
        oldStatus: 'New request',
        newStatus: 'Pending',
        changedAt: new Date().toISOString(),
        changedBy: 'Rory'
    },
    {
        requestId: 'req-4',
        oldStatus: 'Pending',
        newStatus: 'Resolved',
        changedAt: new Date().toISOString(),
        changedBy: 'Rory'
    }
];

export const initialCategories:Category[]=[
    {id:'wesf-1',name:'auxiliary services'},
    {id:'yutr-2',name:'hardware'},
    {id:'sdkv-3',name:'phones'}
];

export const initialPriorities: Priority[] = [
    { id: 'prio-1', name: 'low', level: 1 },
    { id: 'prio-2', name: 'Average', level: 2 },
    { id: 'prio-3', name: 'High', level: 3 },
];

export const initialStatuses: RequestStatus[] = [
    { id: 'st-1', name: 'New request' },
    { id: 'st-2', name: 'Pending' },
    { id: 'st-4', name: 'Resolved' },
    { id: 'st-5', name: 'Rejected' },
];



