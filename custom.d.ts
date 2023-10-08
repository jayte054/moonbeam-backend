import { File } from 'express';

declare module 'express' {
  interface Request {
    file: Express.Multer.File & { cloudinaryInfo?: any };
  }
}
