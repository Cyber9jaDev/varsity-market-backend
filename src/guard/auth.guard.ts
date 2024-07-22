import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  name: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    // This is a fallback case that allows access to routes or
    // endpoints that do not have any specific role requirements defined.
    if (!requiredRoles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_KEY) as JWTPayload;

      const user = await this.databaseService.user.findUnique({
        where: { userId: payload.userId },
      });

      if (!user) return false;

      if (requiredRoles.includes(user.userType)) return true;

      return true;
    } catch (error) {
      return false;
    }
  }
}
