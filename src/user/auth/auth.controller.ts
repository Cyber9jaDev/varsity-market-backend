import { Body, Controller, Param, ParseEnumPipe, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationKeyDto, SignInDto, SignUpDto } from '../dtos/auth.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  async SignUp(
    @Body() { name, email, password, phone, registration_key }: SignUpDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType
  ) {

    // In order to signup as a SELLER, a key is needed from the ADMIN 
    if(userType !== UserType.BUYER){

      // Ensure there is a registration key in the body in order to signup as a SELLER
      if(!registration_key){
        throw new UnauthorizedException()
      }

      // If there is a registration key
      // Get the registration key and compare tto ensure the user is getting his/her specific key
      const validRegistrationKey = `${email}-${userType}-${process.env.REGISTRATION_KEY_SECRET}`
      const isValidRegistrationKey = await bcrypt.compare(validRegistrationKey, registration_key);

      if(!isValidRegistrationKey){
        throw new UnauthorizedException()
      }
    }

    return this.authService.signUp({ name, email, password, phone, userType });
  }

  @Post('/signin')
  async signin (){
    return []
  }

  // Only admin can generate a registration key
  @Post('/registration_key')
  generateRegistrationKey(
    @Body() { email, userType }: RegistrationKeyDto
  ) {
    return this.authService.generateRegistrationKey(email, userType)
  }
}
