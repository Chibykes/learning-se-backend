import { Router } from 'express';
import { PostsController } from '../controllers/posts.controllers.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createPostSchema, patchPostSchema, updatePostSchema } from '../schemas/posts.schemas.js';
import { limiter } from '../config/rate-limiter.js';

const router = Router();
const postsController = new PostsController();

router.get('/', postsController.getPosts);
router.get('/:id', postsController.getPostById);
router.post('/', validate(createPostSchema), postsController.createPost);
router.put('/:id', validate(updatePostSchema), postsController.updatePost);
router.patch('/:id', validate(patchPostSchema), postsController.updatePost);
router.delete('/:id', postsController.deletePost);
router.get('/by-author/:authorId', postsController.getPostsByAuthor);

export default router;
