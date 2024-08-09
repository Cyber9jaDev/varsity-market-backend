import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ChatService {
  constructor(private readonly databaseService: DatabaseService) {}

  async initiateChat(){
    // const previousChat = await this.databaseService.chat.findUnique({
    //   where: {
        
    //   }
    // })
  }
}
