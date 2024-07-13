import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

interface signUpParams {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface signInParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async signUp({ name, email, password, phone }: signUpParams) {
    const user = await this.databaseService.user.create({
      data: { 
        email, 
        password, 
        phone, 
        name,
      },
    });

    return user
  }

  // signIn({ email }: signInParams){
  //   return this.databaseService.user.create({ data: { email, password }})
  // }
}
