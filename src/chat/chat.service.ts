import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ChatService {
  constructor(private readonly databaseService: DatabaseService) {}

  async initiateChat(senderId: string, receiverId: string) {
    const previousChat = await this.databaseService.chat.findFirst({
      where: {
        participants: {
          every: {
            participantId: {
              in: [senderId, receiverId],
            },
          },
        },
      },
    });

    if(!previousChat){
      const newChat = await this.databaseService.chat.create({
        data: {
          participants: {
            create: [
              {participantId: senderId},
              {participantId: receiverId},
            ]
          }
        }
      });
      
      return { message: 'Chat not found' };
    }

    return { message: "Chat created"}
  }
}
