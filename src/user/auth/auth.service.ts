import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';
import { AuthResponse } from '../dtos/auth.dto';
import { PaymentService } from 'src/payment/payment.service';
import { AuthParams } from '../interface/user.interface';
import { data } from 'src/helpers/functions';

const selectOptions = {
  id: true,
  email: true,
  name: true,
  phone: true,
  userType: true,
};

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService, 
    private readonly paymentService: PaymentService 
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async signUp(userType: UserType, body: AuthParams): Promise<AuthResponse> {

    this.logger.log(`Signup attempt for email: ${body.email}, user type: ${userType}`);

    const userExists = await this.databaseService.user.findUnique({
      where: { email: body.email },
    });

    if (userExists) { throw new ConflictException('User already exists')}

    
    try {
      // Verify bank account details and create subaccount
      let subaccountCode: string;
      
      if(userType === UserType.SELLER && body.accountNumber !== undefined && body.bankCode !== undefined && body.businessName !== undefined ){
        
        // Verify seller account number
        await this.paymentService.verifySellerBankAccount(body);
        
        // Create subaccount
        const subaccount = await this.paymentService.createSubaccount(body);
        subaccountCode = subaccount.data.subaccount_code
      }
      
      const hashedPassword = await bcrypt.hash(body.password, 10);

      const user = await this.databaseService.user.create({
        data: data(body, userType, hashedPassword, subaccountCode),
        select: { ...selectOptions },
      });

      const token = this.generateJWT(user.id, user.name);

      return { ...user, token };
    } 

    catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async signIn({
    email,
    password,
  }: Partial<AuthParams>): Promise<AuthResponse> {
    const user = await this.databaseService.user.findUnique({
      where: { email },
      select: { ...selectOptions, password: true },
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.generateJWT(user.id, user.name);

    delete user.password;

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
}
