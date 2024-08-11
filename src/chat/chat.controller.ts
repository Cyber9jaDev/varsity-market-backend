import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dtos/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/initiate-chat')
  initiateChat(@Body() createChatDto: CreateChatDto) {
    return this.chatService.initiateChat(createChatDto);
  }

}
