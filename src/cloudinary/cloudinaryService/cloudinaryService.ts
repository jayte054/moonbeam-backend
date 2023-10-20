import { Injectable } from '@nestjs/common';
import { cloudinary } from '../../cloudinaryConfig/cloudinaryConfig';
import { CloudinaryResponse } from '../cloudinaryResponse/cloudinaryResponse';
import streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      // const result = await cloudinary.uploader.upload(file.path)
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}
