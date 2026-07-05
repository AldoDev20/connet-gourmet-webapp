import { Observable } from 'rxjs';
import { Chat, Message } from './models/message.model';

export interface MessageRepository {
  createChat(participantIds: string[], isGroup: boolean): Observable<Chat>;
  getChatById(id: string): Observable<Chat>;
  getChats(userId: string): Observable<Chat[]>;
  updateChat(id: string, chat: Partial<Chat>): Observable<Chat>;
  deleteChat(id: string): Observable<void>;
  
  sendMessage(chatId: string, senderId: string, text: string): Observable<Message>;
  getMessages(chatId: string): Observable<Message[]>;
}
