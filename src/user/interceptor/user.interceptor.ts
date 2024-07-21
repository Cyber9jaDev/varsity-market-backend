import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request?.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Invalid or missing Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];
    const user = jwt.decode(token);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = user;

    return next.handle();
  }
}
