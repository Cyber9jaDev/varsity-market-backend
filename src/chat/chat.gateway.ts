import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface User {
  id: string;
  socketId: string;
}

interface Message {
  senderId: string;
  content: string;
  chatId: string;
  receiverId: {
    participantId: string;
  };
}

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  private users: User[] = [];

  // This decorator injects the WebSocket server instance (Socket.io instance) enabling direct communication with connected clients.
  @WebSocketServer()
  io: Server;

  afterInit() {
    this.logger.log('Gateway initialized');
  }

  handleConnection(client: Socket) {
    const { sockets } = this.io.sockets;
    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
    console.log(this.users);
    this.logger.log(this.users);
  }

  // Get Active Users
  handleDisconnect(client: Socket) {
    this.logger.log(`ClientId:${client.id} disconnected`);
    this.users = this.users.filter((user) => user.socketId !== client.id);
    this.io.emit('get-users', this.users);
  }

  @SubscribeMessage('add-new-user')
  handleNewUser(client: Socket, newUserId: string) {
    if (!this.users.some((user) => user.id === newUserId)) {
      this.users.push({ id: newUserId, socketId: client.id });
    }
    this.io.emit('get-users', this.users);
  }

  @SubscribeMessage('send-message')
  handleSendMessage(client: Socket, data: Message) {
    this.logger.log(data);
  }
}
