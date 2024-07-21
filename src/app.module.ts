import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthController } from './user/auth/auth.controller';
import { AuthService } from './user/auth/auth.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './user/interceptor/user.interceptor';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UserModule, ProductModule],
  // controllers: [AppController, AuthController],
  controllers: [AppController],
  providers: [
    AppService, 
    // AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor
    }
  ],
})
export class AppModule {}
