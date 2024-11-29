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

  // async signUp(userType: UserType, body: AuthParams): Promise<AuthResponse> {

  //   this.logger.log(`Signup attempt for email: ${body.email}, user type: ${userType}`);

  //   const userExists = await this.databaseService.user.findUnique({ where: { email: body.email } });

  //   if (userExists) { 
  //     this.logger.warn(`Signup attempt failed: User already exists (email: ${body.email})`);
  //     throw new ConflictException('User already exists')
  //   }

  //   try {
  //     // Verify bank account details and create subaccount
  //     return await this.databaseService.$transaction(async (db) => {
  //       let subaccountCode: string;

  //       if(userType === UserType.SELLER && body.accountNumber !== undefined && body.bankCode !== undefined && body.businessName !== undefined ){
        
  //         // Verify seller account number
  //         this.logger.log(`Verifying seller bank account for: ${body.businessName}`);
  //         await this.paymentService.verifySellerBankAccount(body);
          
  //         // Create subaccount
  //         const subaccount = await this.paymentService.createSubaccount(body);
  //         subaccountCode = subaccount.data.subaccount_code
  //       }
        
  //       const hashedPassword = await bcrypt.hash(body.password, 10);

  //       const user = await db.user.create({
  //         data: data(body, userType, hashedPassword, subaccountCode),
  //         select: { ...selectOptions },
  //       });

  //       const token = this.generateJWT(user.id, user.name);
        
  //       return { ...user, token };
  //     })
  //   } 
  //   catch (error) {
  //     this.logger.error(`Signup transaction failed: ${error.message}`);
  //     throw new Error(error.message);
  //   }
  // }

  async signUp(userType: UserType, body: AuthParams): Promise<AuthResponse> {
    this.logger.log(`Signup attempt for email: ${body.email}, user type: ${userType}`);
  
    try {
      const userExists = await this.databaseService.user.findUnique({ 
        where: { email: body.email } 
      });
  
      if (userExists) { 
        this.logger.warn(`Signup attempt failed: User already exists (email: ${body.email})`);
        throw new ConflictException('User already exists')
      }
  
      this.logger.log('Starting transaction for user creation');
      return await this.databaseService.$transaction(async (db) => {
        let subaccountCode: string;
        
        if(userType === UserType.SELLER && 
          body.accountNumber !== undefined && 
          body.bankCode !== undefined && 
          body.businessName !== undefined) {
          
          this.logger.log(`Verifying seller bank account for business: ${body.businessName}`);
          try {
            await this.paymentService.verifySellerBankAccount(body);
            this.logger.log(`Bank account verification successful for business: ${body.businessName}`);
          } catch (error) {
            this.logger.error(`Bank account verification failed for business: ${body.businessName}`, error.stack);
            throw error;
          }
          
          this.logger.log(`Creating subaccount for business: ${body.businessName}`);
          try {
            const subaccount = await this.paymentService.createSubaccount(body);
            subaccountCode = subaccount.data.subaccount_code;
            this.logger.log(`Subaccount created successfully. Code: ${subaccountCode}`);
          } catch (error) {
            this.logger.error(`Subaccount creation failed for business: ${body.businessName}`, error.stack);
            throw error;
          }
        }
        
        this.logger.log('Hashing user password');
        const hashedPassword = await bcrypt.hash(body.password, 10);
  
        this.logger.log('Creating user record in database');
        const user = await db.user.create({
          data: data(body, userType, hashedPassword, subaccountCode),
          select: { ...selectOptions },
        });
        this.logger.log(`User created successfully with ID: ${user.id}`);
  
        this.logger.log('Generating JWT token');
        const token = this.generateJWT(user.id, user.name);
  
        this.logger.log(`Signup completed successfully for user: ${user.id}`);
        return { ...user, token };
      });
    } catch (error) {
      this.logger.error('Signup process failed', {
        error: error.message,
        stack: error.stack,
        email: body.email,
        userType: userType
      });
      
      // Rethrow with more specific error handling
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to create user: ${error.message}`);
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
