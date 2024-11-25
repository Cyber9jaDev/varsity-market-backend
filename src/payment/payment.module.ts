import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ProductModule } from 'src/product/product.module';
import { DatabaseModule } from 'src/database/database.module';
import { PaystackService } from './paystack/paystack.service';
import { FlutterwaveService } from './flutterwave/flutterwave.service';

@Module({
  imports: [DatabaseModule, ProductModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaystackService, FlutterwaveService],
  exports: [PaymentService]
})
export class PaymentModule {}
