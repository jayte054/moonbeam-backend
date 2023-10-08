import { cloudinary } from '../../cloudinaryConfig/cloudinaryConfig';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config();
  },
};
