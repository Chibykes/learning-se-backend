import { Router } from 'express';
import { PostsController } from '../controllers/posts.controllers.js';

const router = Router();
const postsController = new PostsController();

router.get('/', postsController.getPosts);
router.get('/:id', postsController.getPostById);
router.post('/', postsController.createPost);
router.put('/:id', postsController.updatePost);
router.delete('/:id', postsController.deletePost);
router.patch('/:id', postsController.updatePost);
router.get('/by-author/:authorId', postsController.getPostsByAuthor);

export default router;
