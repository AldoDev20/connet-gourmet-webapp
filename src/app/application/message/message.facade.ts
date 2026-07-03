
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageHttpRepository } from '../../infrastructure/persistence/message-http.repository';
import { Chat, Message } from '../../domain/message/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageFacade {
  private chatsSubject = new BehaviorSubject<Chat[]>([]);
  private activeChatSubject = new BehaviorSubject<Chat | null>(null);
  private messagesSubject = new BehaviorSubject<Message[]>([]);

  chats$: Observable<Chat[]> = this.chatsSubject.asObservable();
  activeChat$: Observable<Chat | null> = this.activeChatSubject.asObservable();
  messages$: Observable<Message[]> = this.messagesSubject.asObservable();

  constructor(private messageRepository: MessageHttpRepository) {}

  loadChats(): void {
    this.messageRepository.getChats().subscribe(chats => {
      this.chatsSubject.next(chats);
      // Auto-seleccionar el primer chat activo si existe y no hay ninguno seleccionado
      if (chats.length > 0 && !this.activeChatSubject.value) {
        const active = chats.find(c => c.isActive) || chats[0];
        this.selectChat(active);
      }
    });
  }

  selectChat(chat: Chat): void {
    // Actualizar estado de active en la lista de chats
    const updatedChats = this.chatsSubject.value.map(c => ({
      ...c,
      isActive: c.id === chat.id,
      unreadCount: c.id === chat.id ? 0 : c.unreadCount
    }));
    this.chatsSubject.next(updatedChats);

    this.activeChatSubject.next({ ...chat, isActive: true, unreadCount: 0 });
    this.messageRepository.getMessages(chat.id).subscribe(msgs => {
      this.messagesSubject.next(msgs);
    });
  }

  sendMessage(content: string): void {
    const activeChat = this.activeChatSubject.value;
    if (!activeChat) return;

    this.messageRepository.sendMessage(activeChat.id, content).subscribe(newMsg => {
      // Agregar mensaje localmente
      const currentMsgs = this.messagesSubject.value;
      this.messagesSubject.next([...currentMsgs, newMsg]);

      // Actualizar el último mensaje en la lista de chats
      const updatedChats = this.chatsSubject.value.map(c => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            lastMessageContent: content,
            lastMessageTime: newMsg.timestamp
          };
        }
        return c;
      });
      this.chatsSubject.next(updatedChats);
    });
  }
}
