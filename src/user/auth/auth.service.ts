import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { UserType } from '@prisma/client';

interface signUpParams {
  name: string;
  email: string;
  password: string;
  phone: string;
  userType: UserType
}

interface signInParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async signUp({ name, email, password, phone, userType }: signUpParams) {
    const userExists = await this.databaseService.user.findUnique({
      where: { email }
    });

    if(userExists) {
      throw new ConflictException('Username already exist')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.databaseService.user.create({
      data: { 
        email, 
        phone, 
        name,
        password: hashedPassword,
        userType
      },
    });

    return user
  }
}
