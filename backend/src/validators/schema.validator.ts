import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    name: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const projectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required'),
    imageUrl: z.string().optional().nullable(),
    palette: z.array(z.string()).optional(),
    options: z.record(z.string(), z.any()).optional(),
  }),
});
