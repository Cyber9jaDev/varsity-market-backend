import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ChatService {
  constructor(private readonly databaseService: DatabaseService) {}

  async initiateChat(){
    // const createChat = await this.databaseService.chat.create({
    //   data: 
    // })
  }
}
