import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

interface AuthParams {
  nameL: string,
  email: string,
  password: string
  phone: string,
}


@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService){}

  signUp({ email }: Partial<AuthParams>){
    return this.databaseService.user.create({ data: email })
  }

  signIn()
}
