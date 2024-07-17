import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DatabaseModule } from 'src/database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports : [DatabaseModule],
  controllers: [ProductController],
  providers: [ProductService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }]
})
export class ProductModule {}
