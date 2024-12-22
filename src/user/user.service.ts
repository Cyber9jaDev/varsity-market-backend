import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { UserEntity } from './interface/user.interface';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}
  
  async uploadProfilePicture(user: UserEntity, picture:  UploadApiResponse | UploadApiErrorResponse){
    
    const uploadProfilePicture = await this.databaseService.picture.upsert({ 
      where: { userId: user.userId },
      // Update if it exists
      update: {
        public_id: picture.public_id,
        asset_id: picture.asset_id,
        secure_url: picture.secure_url,
      },

      // Create if it does not exist
      create: {
        userId: user.userId,
        secure_url: picture.secure_url,
        public_id: picture.public_id,
        asset_id: picture.asset_id
      },
      select: { secure_url: true }
    });

    const updateProfile = await this.databaseService.user.update({ 
      where: { id: user.userId },
      data: { hasDisplayPicture: true },
      select: { hasDisplayPicture: true }
    });

    if(!uploadProfilePicture  || !updateProfile){
      throw new BadRequestException("Error uploading picture!")
    }

    return  {...uploadProfilePicture, ...updateProfile }

  }
}