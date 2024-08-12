export interface CreateChatInterface {
  senderId : string,
  receiverId : string,
}

export interface SendMessageInterface {
  chatId: string,
  senderId: string,
  content: string,
}