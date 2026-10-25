import { z } from 'zod';

export const requestSchema = z.object({
    subject: z.string().min(3, 'Тема має містити щонайменше 3 символи'),
    description: z.string().min(10, 'Опис має містити щонайменше 10 символів'),
    categoryId: z.string().min(1, 'Оберіть категорію заявки'),
    priorityId: z.string().min(1, 'Оберіть пріоритет заявки'),
    contactInfo: z.string().min(3, 'Введіть контактні дані'),
});

export type RequestFormInputs = z.infer<typeof requestSchema>;