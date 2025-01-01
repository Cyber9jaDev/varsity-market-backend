import { BadRequestException, Controller, Patch, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from './decorators/user.decorator';
import { UserEntity } from './interface/user.interface';
import { UserService } from './user.service';
import { UserType } from '@prisma/client';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly userService: UserService
  ){}

  @ApiBearerAuth()
  @Roles(UserType.SELLER, UserType.BUYER)
  @Patch('/upload/profile-picture')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor("profilePicture"))
  async uploadProfilePicture(
    @User() user: UserEntity,
    @UploadedFile() file: Express.Multer.File
  ){

    if(!file){
      throw new BadRequestException('Please upload a valid profile picture')
    }

    // Upload Image to Cloudinary
    const picture = await this.cloudinaryService.uploadImage(file, 'unimarket/profile-pictures');

    if (!picture) throw new BadRequestException('Error uploading profile picture to the server');

    // Upload image url to the database
    return this.userService.uploadProfilePicture(user, picture)
  }
}
