import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { cloudinary } from '../../cloudinaryConfig/cloudinaryConfig';
import { CloudinaryService } from '../cloudinaryService/cloudinaryService';

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  private upload = multer({ dest: 'uploads/' });

  constructor(private cloudinaryService: CloudinaryService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('result');

    this.upload.single('file')(req, res, async (err: any) => {
      if (err) {
        return next(err);
      }

      if (!req.file) {
        return next(new Error('No file provided'));
      }

      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        (req.file as any).cloudinaryInfo = result;
        await this.cloudinaryService.uploadImage(req.file);
        console.log(result);
        console.log('result');
        next();
      } catch (error) {
        throw new Error('Error processing file');
      }
    });
  }
}
