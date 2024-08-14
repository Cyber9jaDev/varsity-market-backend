import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  CreateChatDto,
  SendMessageDto,
  UserMessagesDto,
} from './dtos/chat.dto';

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

  @Post('/:chatId/send-message')
  sendMessage(
    @Param('chatId') chatId: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(chatId, sendMessageDto);
  }

  @Get('/:chatId/messages/:user1/:user2')
  userMessages(
    @Param('chatId') chatId: string,
    @Param('user1') user1: string,
    @Param('user2') user2: string,
  ) {
    return this.chatService.userMessages(chatId, user1, user2);
  }

  @Get('/secondParticipantId/:secondParticipantId')
  secondChatParticipant(
    @Param('secondParticipantId') secondParticipantId: string,
  ) {
    return this.chatService.secondChatParticipant(secondParticipantId);
  }
}
