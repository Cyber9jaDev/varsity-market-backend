import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ProductModule } from 'src/product/product.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, ProductModule],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
