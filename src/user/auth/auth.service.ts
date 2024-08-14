import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

// interface signUpParams {
//   name: string;
//   email: string;
//   password: string;
//   phone: string;
//   userType: UserType
// }

interface authParams {
  name: string;
  email: string;
  password: string;
  phone: string;
  userType: UserType;
}

// interface signInParams {
//   email: string;
//   password: string;
// }

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  // async signUp({ name, email, password, phone, userType }: signUpParams) {
  async signUp({
    name,
    email,
    password,
    phone,
    userType,
  }: Partial<authParams>) {
    const userExists = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.databaseService.user.create({
      data: {
        email,
        phone,
        name,
        password: hashedPassword,
        userType,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        userType: true,
      },
    });

    if (!user) {
      return new BadRequestException('An error has occurred');
    }

    const token = this.generateJWT(user.id, user.name);
    return { ...user, token };
  }

  async signIn({ email, password }: Partial<authParams>) {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.generateJWT(user.id, user.name);

    return { ...user, token };
  }

  private generateJWT(userId: string, name: string) {
    return jwt.sign(
      { userId, name }, // Use the name and userId to sign the token
      process.env.JWT_KEY,
      { expiresIn: process.env.JWT_LIFETIME },
    );
  }

  // To generate a registration key
  // use the email, the userType and registration key
  // The token is generated by an ADMIN and sent to a SELLER
  // Hash the generated key
  generateRegistrationKey(email: string, userType: UserType) {
    const keyString = `${email}-${userType}-${process.env.REGISTRATION_KEY_SECRET}`;
    return bcrypt.hash(keyString, 10);
  }

  async secondChatParticipant(participantId: string) {
    const secondParticipant = await this.databaseService.user.findUnique({
      where: { id: participantId },
      select: { id: true, name: true, phone: true },
    });

    return secondParticipant;
  }
}
