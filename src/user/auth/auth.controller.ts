import { BadRequestException, Body, Controller, Param, ParseEnumPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationKeyDto, SignInDto, SignUpDto } from '../dtos/auth.dto';
import {  UserType } from '@prisma/client';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthResponse, UserEntity } from '../interface/user.interface';
import { User } from '../decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiOperation({ 
    summary: "Sign up as a BUYER or SELLER",
    description: "1. Only a SELLER should provide 'businessName', 'bankCode' and 'accountNumber'.\n2. Use the /payment/bank endpoint to get a list of banks and their corresponding bankCode.\n3. Exclude the first 0 (zero) from your phone number."
  })
  
  @ApiParam({ name: 'userType', enum: UserType, required: true })
  @ApiResponse({ status: 201, description: 'Created', schema: {
      example: {
        id: '02b4c5a9-aef2-4189-8f0e-aa75df03f4b6',
        email: 'seller4@gmail.com',
        name: 'Seller 4',
        phone: '8013428022',
        userType: 'SELLER',
        token: 'Token',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Conflict', schema: {
      example: { message: 'User already exists', error: 'Conflict', statusCode: 409 },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error', schema: {
      example: { statusCode: 500, message: 'Internal server error', error: 'Internal Server Error' },
    },
  })
  @ApiBody({ type: SignUpDto })
  @Post('/signup/:userType')
  async SignUp(
    @Body() body: SignUpDto, 
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ): Promise<AuthResponse> {
    // In order to signup as a SELLER, a key is needed from the ADMIN
    // if(userType !== UserType.BUYER){

    //   // Ensure there is a registration key in the body in order to signup as a SELLER
    //   if(!registration_key){
    //     throw new UnauthorizedException()
    //   }

    //   // If there is a registration key
    //   // Get the registration key and compare tto ensure the user is getting his/her specific key
    //   const validRegistrationKey = `${email}-${userType}-${process.env.REGISTRATION_KEY_SECRET}`
    //   const isValidRegistrationKey = await bcrypt.compare(validRegistrationKey, registration_key);

    //   if(!isValidRegistrationKey){
    //     throw new UnauthorizedException()
    //   }
    // }

    // if(userType === UserType.BUYER) 

    return this.authService.signUp(userType, body);
  }

  @Post('/signin')
  @ApiResponse({ status: 201, description: 'Created', schema: {
      example: {
        id: '02b4c5a9-aef2-4189-8f0e-aa75df03f4b6',
        email: 'seller4@gmail.com',
        name: 'Seller 4',
        phone: '8013428022',
        userType: 'SELLER',
        token: 'Token',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: { example: { message: 'Invalid credentials', error: 'Bad Request', statusCode: 400 } },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: { example: { statusCode: 500, message: 'Internal server error', error: 'Internal Server Error' } },
  })
  @ApiBody({ required: true, type: SignInDto })
  signin(@Body() body: SignInDto): Promise<AuthResponse> {
    return this.authService.signIn(body);
  }

    // Only admin can generate a registration key
  @Post('/registration_key')
  generateRegistrationKey(@Body() { email, userType }: RegistrationKeyDto) {
    return this.authService.generateRegistrationKey(email, userType);
  }
}
