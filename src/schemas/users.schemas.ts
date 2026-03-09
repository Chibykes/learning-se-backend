import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z.string(),
    email: z.email(),
  })
  .strict();
export type CreateUserReqBody = z.infer<typeof createUserSchema>;

export const updateUserSchema = z
  .object({
    name: z.string(),
  })
  .strict();
export type UpdateUserReqBody = z.infer<typeof updateUserSchema>;
