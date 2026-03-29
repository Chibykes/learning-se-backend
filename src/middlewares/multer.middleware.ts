import multer, { type FileFilterCallback } from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { type Request } from 'express';
import { BadRequestError } from '../utils/errors.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

class MulterHandler {
  private uploadsDir;

  constructor() {
    this.uploadsDir = path.resolve(process.cwd(), 'public/uploads');
    fs.mkdirSync(this.uploadsDir, { recursive: true });

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME!,
      api_key: process.env.CLOUDINARY_KEY!,
      api_secret: process.env.CLOUDINARY_SECRET!,
    });
  }

  public createDiskStorage = () => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, this.uploadsDir),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileName = file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop();
        cb(null, fileName);
      },
    });
    return storage;
  };

  public createCloudinaryStorage = () =>
    new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: '00-backend',
        allowed_formats: ['jpeg', 'jpg', 'png', 'webp'],
        // transformation: [{ width: 500, height: 500, crop: 'limit' }], // Auto-resize!
      } as any,
    });
}

const multerHandler = new MulterHandler();
export const upload = multer({
  storage: multerHandler.createCloudinaryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError('Invalid file type. Only JPEG, JPG, PNG and WEBP are allowed.'));
    }
  },
});

// export const cloudinaryUpload = multer({
//   storage: cloudinaryStorage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
//   fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//     const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

//     if (allowedMimeTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new BadRequestError('Invalid file type. Only JPEG, JPG, PNG and WEBP are allowed.'));
//     }
//   },
// });
