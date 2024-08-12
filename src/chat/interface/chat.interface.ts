export interface CreateChatInterface {
  senderId: string;
  receiverId: string;
}

export interface SendMessageInterface {
  senderId: string;
  content: string;
}

export interface UserMessagesInterface {
  user2: string;
  user1: string;
}
