import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    // --- TAMBAHAN LOG DEBUG ---
    console.log('CLOUDINARY CONFIG:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'ada' : 'KOSONG',
    });
    // --- END TAMBAHAN ---

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'barber' }, (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        })
        .end(file.buffer);
    });
  }
}
