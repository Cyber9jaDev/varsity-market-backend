import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('/upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    const uploadPromises = files.map((file) =>
      this.cloudinaryService.uploadImage(file, 'unimarket/posts'),
    );
    if(!files || !Array.isArray(files) || files.length === 0){
      throw new BadRequestException('Please add product images');
    }
    const results = await Promise.all(uploadPromises);
    return results;
  }
}
