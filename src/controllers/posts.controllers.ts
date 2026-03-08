import type { Request, Response } from 'express';
import { PostsService } from '../services/posts.service.js';

export class PostsController {
  private readonly postsService: PostsService;

  constructor() {
    this.postsService = new PostsService();
  }

  getPosts = async (req: Request, res: Response) => {
    const posts = await this.postsService.getPosts();
    return res.json({
      status: 'success',
      data: posts,
      message: 'Posts retrieved successfully',
    });
  };

  getPostById = async (req: Request, res: Response) => {
    const post = await this.postsService.getPostById(Number(req.params.id));
    return res.json({
      status: 'success',
      data: post,
      message: 'Post retrieved successfully',
    });
  };

  createPost = async (req: Request, res: Response) => {
    const post = await this.postsService.createPost(req.body);
    return res.json({
      status: 'success',
      data: post,
      message: 'Post created successfully',
    });
  };

  updatePost = async (req: Request, res: Response) => {
    const post = await this.postsService.updatePost(Number(req.params.id), req.body);
    return res.json({
      status: 'success',
      data: post,
      message: 'Post updated successfully',
    });
  };

  deletePost = async (req: Request, res: Response) => {
    await this.postsService.deletePost(Number(req.params.id));
    return res.json({
      status: 'success',
      message: 'Post deleted successfully',
    });
  };

  getPostsByAuthor = async (req: Request, res: Response) => {
    const posts = await this.postsService.getPostsByAuthor(Number(req.params.authorId));
    return res.json({
      status: 'success',
      data: posts,
      message: 'Posts retrieved by author successfully',
    });
  };
}
