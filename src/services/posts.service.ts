import type { Post } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

export class PostsService {
  private readonly prisma: typeof prisma;
  constructor() {
    this.prisma = prisma;
  }

  getPosts = async () => {
    const posts = await this.prisma.post.findMany();
    return posts;
  };

  getPostById = async (id: number) => {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });
    return post;
  };

  createPost = async (post: Post) => {
    const newPost = await this.prisma.post.create({
      data: post,
    });
    return newPost;
  };

  updatePost = async (id: number, post: Post) => {
    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: post,
    });
    return updatedPost;
  };

  deletePost = async (id: number) => {
    await this.prisma.post.delete({
      where: { id },
    });
    return;
  };

  getPostsByAuthor = async (authorId: number) => {
    const posts = await this.prisma.post.findMany({
      where: { authorId },
    });
    return posts;
  };
}
