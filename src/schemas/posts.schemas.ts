import { z } from 'zod';

export const createPostSchema = z
  .object({
    title: z.string('Title is not a string').min(1, 'Title is required'),
    content: z.string('Content is not a string').min(1, 'Content is required'),
    authorId: z.number('Author ID is not a number').min(1, 'Author ID is required'),
    published: z.boolean('Published is not a boolean').optional(),
  })
  .strict();

export type CreatePostReqBody = z.infer<typeof createPostSchema>;

export const updatePostSchema = z
  .object({
    title: z.string('Title is not a string').min(1, 'Title is required'),
    content: z.string('Content is not a string').min(1, 'Content is required'),
    published: z.boolean('Published is not a boolean').optional(),
  })
  .strict();

export type UpdatePostReqBody = z.infer<typeof updatePostSchema>;

export const patchPostSchema = z
  .object({
    title: z.string('Invalid title').min(1, 'Title is required').optional(),
    content: z.string('Invalid content').min(1, 'Content is required').optional(),
    published: z.boolean('Invalid published').optional(),
  })
  .strict();

export type PatchPostReqBody = z.infer<typeof patchPostSchema>;
