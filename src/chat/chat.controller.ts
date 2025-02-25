import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dtos/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/initiate-chat')
  initiateChat(@Body() createChatDto: CreateChatDto) {
    return this.chatService.initiateChat(createChatDto);
  }

  @Get('/:userId')
  getChatsByUserId(@Param('userId') userId: string) {
    return this.chatService.userChats(userId);
  }

  // @Post('/:chatId/send-message')
  // sendMessage(
  //   @Param('chatId') chatId: string,
  //   @Body() sendMessageDto: SendMessageDto,
  // ) {
  //   return this.chatService.sendMessage(chatId, sendMessageDto);
  // }
}
