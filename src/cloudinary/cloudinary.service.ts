import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './interface/cloudinary.interface';

@Injectable()
export class CloudinaryService {
  constructor(){
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })
  }


  async uploadImage ( filePath: string ): Promise<CloudinaryResponse>{
    return new Promise((resolve, reject) => {
      return new Promise ((resolve, reject) => {
        cloudinary.uploader.upload(filePath, { folder: 'unimarket/posts' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
      })
    
      // toStream(file.buffer).pipe(upload);
    });
  }
  }
}
