import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateChatInterface } from './interface/chat.interface';

@Injectable()
export class ChatService {
  constructor(private readonly databaseService: DatabaseService) {}

  async initiateChat({ senderId, receiverId }: CreateChatInterface) {
    const previousChat = await this.databaseService.chat.findFirst({
      where: {
        AND: [
          { participants: { some: { participantId: senderId } } },
          { participants: { some: { participantId: receiverId } } },
        ],
      },
    });

    if (!previousChat) {
      const newChat = await this.databaseService.chat.create({
        data: {
          participants: {
            create: [
              { participantId: senderId },
              { participantId: receiverId },
            ],
          },
        },
        // data: {
        //   participants: {
        //     create: [
        //       { participant: { connect: { id: senderId } } },
        //       { participant: { connect: { id: receiverId } } },
        //     ],
        //   },
        // },
      });

      return newChat;
    }

    return previousChat;
  }
}
