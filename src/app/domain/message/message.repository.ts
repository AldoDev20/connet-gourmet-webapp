import { Observable } from 'rxjs';
import { Chat, Message } from './models/message.model';

export interface MessageRepository {
  getChats(): Observable<Chat[]>;
  getMessages(chatId: string): Observable<Message[]>;
  sendMessage(chatId: string, content: string): Observable<Message>;
}
