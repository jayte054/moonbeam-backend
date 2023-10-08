// import { Injectable } from '@nestjs/common';
// import { v2 as cloudinary } from 'cloudinary';

// import { CloudinaryResponse } from '../cloudinaryResponse/cloudinaryResponse';
// import streamifier from 'streamifier';

// @Injectable()
// export class CloudinaryService {
//   async uploadImage(file: Express.Multer.File): Promise<CloudinaryResponse> {
//     try {
//       return new Promise<CloudinaryResponse>((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           (error, result) => {
//             if (error) return reject(error);
//             resolve(result);
//           },
//         );
//         streamifier.createReadStream(file.buffer).pipe(uploadStream);
//       });
//       // const result = await cloudinary.uploader.upload(file.path);
//       // return result;
//     } catch (error) {
//       throw new Error('Failed to upload image to Cloudinary');
//     }
//   }
// }

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
}
