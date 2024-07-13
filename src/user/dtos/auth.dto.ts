import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class SignUpDto{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
  
  @MinLength(5)
  @IsString()
  password: string;
  
  @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, { message: "Phone must be a valid phone number" })
  phone: string;
}

export class SignInDto{
  @IsEmail()
  email: string;
  
  @IsString()
  password: string;
}

