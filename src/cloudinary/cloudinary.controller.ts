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
  @UseInterceptors(FilesInterceptor('images'))
  async uploadFile(
    @UploadedFiles() images: Express.Multer.File[]
  ) {
    console.log(images);
    const uploadPromises = images.map((image) =>
      this.cloudinaryService.uploadImage(image, 'unimarket/posts'),
    );
    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new BadRequestException('Please add product images');
    }
    const results = await Promise.all(uploadPromises);
    return results;
  }
}
