import { Body, Controller, Param, ParseEnumPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthResponseDto,
  RegistrationKeyDto,
  SignInDto,
  SignUpDto,
} from '../dtos/auth.dto';
import { UserType } from '@prisma/client';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiParam({
    name: 'userType',
    enum: UserType,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
    schema: {
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
    status: 409,
    description: 'Conflict',
    schema: {
      example: {
        message: 'User already exists',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiBody({
    required: true,
    type: SignUpDto,
  })
  @Post('/signup/:userType')
  async SignUp(
    // @Body() { name, email, password, phone, registration_key }: SignUpDto,
    @Body() { name, email, password, phone }: SignUpDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ): Promise<AuthResponseDto> {
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

    return this.authService.signUp({ name, email, password, phone, userType });
  }

  @Post('/signin')
  @ApiResponse({
    status: 201,
    description: 'Created',
    schema: {
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
    schema: {
      example: {
        message: 'Invalid credentials',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiBody({
    required: true,
    type: SignInDto,
  })
  signin(@Body() body: SignInDto): Promise<AuthResponseDto> {
    return this.authService.signIn(body);
  }

  // Only admin can generate a registration key
  @Post('/registration_key')
  generateRegistrationKey(@Body() { email, userType }: RegistrationKeyDto) {
    return this.authService.generateRegistrationKey(email, userType);
  }
}
