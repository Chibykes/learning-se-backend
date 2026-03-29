import { Router } from 'express';
import { generateUploadUrl, getObjectUrl, verifyFileExists } from '../lib/s3.js';
import { InternalServerError } from '../utils/errors.js';
import { prisma } from '../lib/prisma.js';
import jwtAuthMiddleware from '../middlewares/jwt-authorization.js';

const router = Router();

router.post('/create-presigned-url', jwtAuthMiddleware, async (req, res) => {
  try {
    console.log('Request Body', req.body);
    const { fileType, fileName } = req.body; // e.g. "image/jpeg"
    if (!fileType || !fileName) {
      throw new InternalServerError('File type and name are required');
    }

    const data = await generateUploadUrl({ fileType, fileName });
    res.json(data);
  } catch (err) {
    console.log('File error', err);
    throw new InternalServerError('Failed to generate URL');
  }
});

router.post('/update-user-avatar', jwtAuthMiddleware, async (req, res) => {
  try {
    console.log('Request Body', req.body);
    const { fileKey } = req.body;

    if (!fileKey) {
      throw new InternalServerError('File key is required');
    }

    const fileExists = await verifyFileExists(fileKey);
    if (!fileExists) {
      throw new InternalServerError('File does not exist');
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user!.id,
      },
      omit: {
        password: true,
      },
      data: {
        avatar: getObjectUrl(fileKey),
      },
    });

    res.json({
      success: true,
      status: 200,
      data: updatedUser,
      message: 'User avatar updated successfully',
    });
  } catch (err) {
    console.log('File error', err);
    throw new InternalServerError('Failed to upload file');
  }
});

export default router;
