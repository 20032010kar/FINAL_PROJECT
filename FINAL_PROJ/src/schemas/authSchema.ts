import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Введіть коректну електронну пошту'),
    password: z.string().min(1, 'Пароль обов’язковий для заповнення'),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;