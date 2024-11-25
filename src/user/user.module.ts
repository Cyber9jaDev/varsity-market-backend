import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [DatabaseModule, PaymentModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class UserModule {}
