import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [DatabaseModule, PaymentModule, CloudinaryModule],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService],
})
export class UserModule {}
