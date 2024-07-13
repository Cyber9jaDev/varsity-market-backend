import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from '../dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post('/signup')
  SignUp(@Body() body: SignUpDto){
    return this.authService.signUp(body);
  }

  // @Post('/signin')
  // SignIn(@Body() body: SignInDto){
  //   return this.authService.signIn(body)
  // }
}
