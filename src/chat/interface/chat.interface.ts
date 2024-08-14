export interface CreateChatInterface {
  user1: string;
  user2: string;
}

export interface SendMessageInterface {
  senderId: string;
  content: string;
}

export interface UserMessagesInterface {
  user2: string;
  user1: string;
}
