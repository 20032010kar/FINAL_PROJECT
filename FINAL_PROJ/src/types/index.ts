
export type UserRole = 'user' | 'operator';

export interface User{
    name:string;
    role:UserRole;
    email:string;
    id:string;
}

export interface Category{
    name:string;
    id:string;
}

export interface Priority{
    name:string;
    level:number;
    id:string;
}

export interface RequestStatus{
    id:string;
    name:string;
}

export interface OperatorComments{
    authorName:string;
    comment:string;
    createdAt:string;
    commentId:string;
    requestId:string;
    id:string | number;
}

export interface StatusHistoryChange{
    requestId:string;
    oldStatus:string;
    newStatus:string;
    changedAt:string;
    changedBy:string;
}

export interface ServiceRequest {
    id: string;
    userId: string;
    topic: string;
    description: string;
    categoryId: string;
    priorityId: string;
    statusId: string;
    createdAt: string;
    clientContact: string;
}