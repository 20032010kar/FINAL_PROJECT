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
        topic: 'Доступ до корпоративного VPN',
        description: 'Не вдається підключитися до робочої мережі з дому через новий протокол безпеки.',
        categoryId: 'yutr-2',
        priorityId: 'prio-2',
        statusId: 'st-1',  
        createdAt: new Date().toISOString(),
        clientContact: 'user@example.com',
    },
    {
        id: 'req-2',
        userId: '1',
        topic: 'Зависає ноутбук',
        description: 'Пристрій сильно гальмує та перегрівається під час запуску середовища розробки.',
        categoryId: 'wesf-1',
        priorityId: 'prio-3', 
        statusId: 'st-2',   
        createdAt: new Date().toISOString(),
        clientContact: '+380671234567',
    },
    {
        id: 'req-3',
        userId: '1',
        topic: 'Помилка доступу до пошти',
        description: 'Не виходить увійти в корпоративний Outlook, система видає помилку автентифікації.',
        categoryId: 'sdkv-3', 
        priorityId: 'prio-1',
        statusId: 'st-1',   
        createdAt: new Date().toISOString(),
        clientContact: 'user@example.com',
    },
    {
        id: 'req-4',
        userId: '1',
        topic: 'Налаштування робочого місця',
        description: 'Потрібно підключити другий монітор, док-станцію та периферію до нового системного блоку.',
        categoryId: 'yutr-2', 
        priorityId: 'prio-1', 
        statusId: 'st-4',   
        createdAt: new Date().toISOString(),
        clientContact: '+380509876543',
    },
    {
        id: 'req-5',
        userId: '1',
        topic: 'Помилка ПЗ',
        description: 'Вилітає програма при запуску.',
        categoryId: 'wesf-1',
        priorityId: 'prio-3', 
        statusId: 'st-5',   
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



