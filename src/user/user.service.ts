import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { UserEntity } from './interface/user.interface';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}
  
  async uploadProfilePicture(user: UserEntity, picture:  UploadApiResponse | UploadApiErrorResponse){
    const uploadProfilePicture = await this.databaseService.picture.update({ 
      where: { userId: user.userId },
      data: {
        public_id: picture.public_id,
        asset_id: picture.asset_id,
        secure_url: picture.secure_url,
      },
      select: { secure_url: true }
    });

    const updateProfile = await this.databaseService.user.update({ 
      where: { id: user.userId },
      data: {
        hasDisplayPicture: true,
      },
    });

    if(!uploadProfilePicture  || !updateProfile){
      throw new BadRequestException("Error uploading picture!")
    }

    return  uploadProfilePicture

  }
}