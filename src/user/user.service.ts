import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { UpdateUserParams, UserEntity } from './interface/user.interface';
import { PaymentModule } from 'src/payment/payment.module';
import { PaystackService } from 'src/payment/paystack/paystack.service';
import { PaymentService } from 'src/payment/payment.service';

const selectOptions = {
  id: true,
  email: true,
  name: true,
  phone: true,
  userType: true,
  hasDisplayPicture: true,
  displayPicture: { select: { secure_url: true } },
};

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paymentService: PaymentService,
  ) {}

  async uploadProfilePicture(
    user: UserEntity,
    picture: UploadApiResponse | UploadApiErrorResponse,
  ) {
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
        asset_id: picture.asset_id,
      },
      select: { secure_url: true },
    });

    const updateProfile = await this.databaseService.user.update({
      where: { id: user.userId },
      data: { hasDisplayPicture: true },
      select: { hasDisplayPicture: true },
    });

    if (!uploadProfilePicture || !updateProfile) {
      throw new BadRequestException('Error uploading picture!');
    }

    return { ...uploadProfilePicture, ...updateProfile };
  }

  async updateUser(id: string, body: UpdateUserParams) {
    const user = await this.databaseService.user.findFirst({
      where: { id },
      select: { ...selectOptions },
    });

    if (body.phone) {
      const existingPhoneNumber = await this.databaseService.user.findFirst({
        where: { phone: body.phone },
        select: { phone: true },
      });

      if (existingPhoneNumber) {
        if (existingPhoneNumber.phone && user.phone !== body.phone) {
          throw new BadRequestException('Phone number already exists!');
        }
      }
    }

    if (body.bankCode || body.accountNumber || body.businessName) {
      if (user.userType === 'BUYER') {
        throw new BadRequestException('Buyer cannot update bank details!');
      }

      // Verify new seller bank account
      try {
        const verifySellerBankInfo =
          await this.paymentService.verifySellerBankAccount(body);
        console.log(verifySellerBankInfo);
      } catch (error) {
        throw error;
      }
    }

    const updatedUser = await this.databaseService.user.update({
      where: { id },
      data: { ...body },
      select: { ...selectOptions },
    });

    return updatedUser;
  }
}
