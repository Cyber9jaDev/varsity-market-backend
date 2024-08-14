import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  CreateChatInterface,
  SendMessageInterface,
  UserMessagesInterface,
} from './interface/chat.interface';

@Injectable()
export class ChatService {
  constructor(private readonly databaseService: DatabaseService) {}

  async initiateChat({ user1, user2 }: CreateChatInterface) {
    // Ensure user cannot initiate chat
    if (user1 === user2)
      throw new BadRequestException('You cannot initiate chat with yourself');

    const previousChat = await this.databaseService.chat.findFirst({
      where: {
        AND: [
          { participants: { some: { participantId: user1 } } },
          { participants: { some: { participantId: user2 } } },
        ],
      },
      include: {
        participants: true,
      },
    });

    if (!previousChat) {
      const newChat = await this.databaseService.chat.create({
        // data: {
        //   participants: {
        //     create: [
        //       { participantId: senderId },
        //       { participantId: receiverId },
        //     ],
        //   },
        // },
        data: {
          participants: {
            create: [
              { participant: { connect: { id: user1 } } },
              { participant: { connect: { id: user2 } } },
            ],
          },
        },
        include: {
          participants: true,
        },
      });

      return newChat;
    }

    return previousChat;
  }

  async userChats(userId: string) {
    const userChats = await this.databaseService.chat.findMany({
      where: {
        participants: {
          some: { participantId: userId },
        },
      },
      select: {
        id: true,
        participants: {
          select: {
            participantId: true,
          },
        },
      },
    });

    if (!userChats) throw new BadRequestException('No chats found');
    return userChats;
  }

  async sendMessage(
    chatId: string,
    { senderId, content }: SendMessageInterface,
  ) {
    // Check if sender is allowed to use the chatId
    const chat = await this.databaseService.chat.findFirst({
      where: {
        AND: {
          id: chatId,
          participants: { some: { participantId: senderId } },
        },
      },
    });

    if (!chat)
      throw new BadRequestException(
        'You are not allowed to send message. Please create a new chat',
      );

    const newMessage = this.databaseService.message.create({
      data: {
        content,
        senderId,
        chatId,
      },
    });

    if (!newMessage) throw new BadRequestException();

    return newMessage;
  }

  async userMessages(chatId: string, user1: string, user2: string) {
    const chat = await this.databaseService.chat.findFirst({
      where: {
        id: chatId,
        participants: {
          some: {
            participantId: {
              in: [user1, user2],
            },
          },
        },
      },
      select: {
        messages: {
          select: {
            id: true,
            content: true,
            sentAt: true,
            senderId: true,
          }
        },
      },
    });

    if (!chat) throw new BadRequestException();

    if (chat.messages.length === 0)
      throw new NotFoundException('No messages found');

    return chat.messages;
  }

  async secondChatParticipant(participantId: string) {

  }
}
