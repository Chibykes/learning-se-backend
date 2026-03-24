import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.email('Invalid email'),
    password: z.string('Password must be a string').min(8, 'Password must be at least 6 characters'),
    name: z.string('Name must be a string').min(1, 'Name is required'),
  })
  .strict();

export type RegisterReqBody = z.infer<typeof registerSchema>;

export const loginSchema = z
  .object({
    email: z.email('Invalid email'),
    password: z.string('Password must be a string').min(8, 'Password must be at least 6 characters'),
  })
  .strict();

export type LoginReqBody = z.infer<typeof loginSchema>;
