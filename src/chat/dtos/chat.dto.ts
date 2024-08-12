import { IsNotEmpty, IsString } from "class-validator";

export class CreateChatDto {

  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  receiverId: string;
}

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class UserMessagesDto {
  @IsNotEmpty()
  @IsString()
  user1: string;

  @IsNotEmpty()
  @IsString()
  user2: string;
}