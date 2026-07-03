import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageRepository } from '../../domain/message/message.repository';
import { Chat, Message } from '../../domain/message/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageHttpRepository implements MessageRepository {
  private apiUrl = '/api/messages';

  // Datos mock correspondientes a 'mensajeria-privada.html'
  private mockChats: Chat[] = [
    {
      id: 'chat-lucia',
      participantId: 'lucia-mendoza',
      participantName: 'Lucia Mendoza',
      participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACrGH3GG11AyLNzF7GxyLJNRDAEX2dV3gcf8EztS5rEwr1LKBNlLvIKcIr3DSjg1w7X0BbWOwbO6pt3-zYZMwzXyBW_ImLVgxexqWKOGE1T7-YYauezJFGSdwWgh09nue-C7URwRXWgj1DQJt3fz3O8Amb43ln68jgJv4PN1KY9B-dAh0Osf_Fe-6eB3qj57_iIxaVIAlko3QipCj-D20L757DL2kV-L1kgg0bTeoQXuvPPMaBmgnKZw',
      participantLocation: 'Cevichería El Sol, Lima',
      lastMessageContent: 'Ese cebiche estuvo espectacular! Nos vemos en la feria del fin de semana.',
      lastMessageTime: '10:32 AM',
      unreadCount: 0,
      isActive: true
    },
    {
      id: 'chat-ricardo',
      participantId: 'don-ricardo',
      participantName: 'Don Ricardo',
      participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvKEQ9ISqqPAMGO7s8OvokM6ROT4TYSQdR_jFCTHKxO9QJIDlGJVknmR8Y3CObb9-2swE2DOJ7Tz0uDS-L95e1_V6DBDtjPmjTqXef4wOeEPVvv9mtX6DXTzA6gKC2QDXLlgmQxvMoQ30qB4cq4xhEiaCE1mmNbykphg24eH1eaV6xWaVF4uF18_Z88W_QiaoRxtyM95pgw5crgn1QNrsKAWwuIa8lX2kpmMZ2OQWuwLUWh5Izt8VmGg',
      participantLocation: 'Valle Sagrado, Cusco',
      lastMessageContent: 'La cosecha de papa nativa está en su mejor momento, Chef.',
      lastMessageTime: 'Yesterday',
      unreadCount: 2
    },
    {
      id: 'chat-mariapaz',
      participantId: 'maria-paz',
      participantName: 'María Paz',
      participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYUXB9Os_jDGO3-j-8Om-Pl-Dp41NYKcnHVMnxQR4A_bYZvEj4YpU3m1fMLkp6tpn7OWHW5lQluX61Szjk1-OEsdwJXzkfX4_MA7lzxnOZDA5bo-WWY_gQLx_RlaBQFAq7GDzah-Hgl75nSghnbXZtagXABkvdeurzfhRC9MgpQmz8_yfECS4BO9hH_RxCECcw0ozVDsd7buSN7F1uAWW4Bfn8d45ITi--PhZjUZ2nNfTnLor1jzAjgw',
      participantLocation: 'Arequipa',
      lastMessageContent: 'Gracias por la receta de Rocoto Relleno, me quedó de lujo.',
      lastMessageTime: '2 days ago',
      unreadCount: 0
    },
    {
      id: 'chat-rocoto',
      participantId: 'el-rocoto-arequipa',
      participantName: 'El Rocoto Arequipa',
      participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRA7k32sMJonItbTuskMBBV4ajmHQxrl3W9nntqJZXpg-fYi-7hwIcqCrCnPJPVHr_7ux9a4RrNcJau3yxkOfyDadTM8NgDnsOZxDoaZOJU-JusWGFy7vFoyJMSX_sIzje3Z6QcKHJg_krlAKL6zJMJJWU8HuZNRqgCfCbKLxdlBQ8sFkAN19mIUbTOBSjn11TBK_9P9t30kaIo7EuRrh3_DugPiO64EcQ8VEUwaZR-aINgl236BW3Tg',
      participantLocation: 'Arequipa, Peru',
      lastMessageContent: 'Confirmado el envío de la mercadería para el jueves.',
      lastMessageTime: '1 week ago',
      unreadCount: 0
    }
  ];

  private mockMessages: { [chatId: string]: Message[] } = {
    'chat-lucia': [
      {
        id: 'm1',
        senderId: 'lucia-mendoza',
        senderName: 'Lucia Mendoza',
        content: 'Hola Chef! Quería consultarle sobre el ají amarillo seco que compró en el mercado de Surquillo. ¿Cómo hace para que el aderezo de la causa no quede picante?',
        timestamp: '10:15 AM',
        isSender: false
      },
      {
        id: 'm2',
        senderId: 'chef-gaston',
        senderName: 'Chef Gastón',
        content: 'Hola Lucía! Qué gusto saludarte. El secreto está en hervir el ají amarillo tres veces, cambiando el agua y añadiendo una cucharada de azúcar en el último hervor. Luego, licúalo con un chorrito de aceite vegetal y quedará una crema suave sin picor agresivo.',
        timestamp: '10:20 AM',
        isSender: true
      },
      {
        id: 'm3',
        senderId: 'lucia-mendoza',
        senderName: 'Lucia Mendoza',
        content: 'Excelente consejo, Chef. Lo pondré en práctica hoy mismo. ¿Y para lograr esa textura sedosa en el tiradito? ¿Usa licuadora de alta potencia?',
        timestamp: '10:25 AM',
        isSender: false
      },
      {
        id: 'm4',
        senderId: 'chef-gaston',
        senderName: 'Chef Gastón',
        content: 'Para el tiradito, corta el pescado en láminas sesgadas y sírvelo al instante. La leche de tigre licuada debe ser colada con un tamiz fino para quitar cualquier fibra de jengibre o apio. Eso le da la sedosidad sin restarle frescura.',
        timestamp: '10:30 AM',
        isSender: true
      },
      {
        id: 'm5',
        senderId: 'lucia-mendoza',
        senderName: 'Lucia Mendoza',
        content: 'Ese cebiche estuvo espectacular! Nos vemos en la feria del fin de semana.',
        timestamp: '10:32 AM',
        isSender: false
      }
    ],
    'chat-ricardo': [
      {
        id: 'mr1',
        senderId: 'don-ricardo',
        senderName: 'Don Ricardo',
        content: 'Estimado Chef Gastón, las papas nativas de esta temporada ya están listas para enviar.',
        timestamp: 'Yesterday',
        isSender: false
      },
      {
        id: 'mr2',
        senderId: 'don-ricardo',
        senderName: 'Don Ricardo',
        content: 'La cosecha de papa nativa está en su mejor momento, Chef. Avíseme cuántos sacos necesitará para el restaurante.',
        timestamp: 'Yesterday',
        isSender: false
      }
    ],
    'chat-mariapaz': [
      {
        id: 'mm1',
        senderId: 'chef-gaston',
        senderName: 'Chef Gastón',
        content: 'Hola María Paz, cuéntame, ¿cómo te fue con el rocoto relleno?',
        timestamp: '3 days ago',
        isSender: true
      },
      {
        id: 'mm2',
        senderId: 'maria-paz',
        senderName: 'María Paz',
        content: 'Gracias por la receta de Rocoto Relleno, me quedó de lujo. A mi familia le encantó el toque de pasas.',
        timestamp: '2 days ago',
        isSender: false
      }
    ],
    'chat-rocoto': [
      {
        id: 'mrc1',
        senderId: 'chef-gaston',
        senderName: 'Chef Gastón',
        content: 'Hola, ¿pudieron despachar el pedido de rocotos arequipeños para esta semana?',
        timestamp: '1 week ago',
        isSender: true
      },
      {
        id: 'mrc2',
        senderId: 'el-rocoto-arequipa',
        senderName: 'El Rocoto Arequipa',
        content: 'Confirmado el envío de la mercadería para el jueves.',
        timestamp: '1 week ago',
        isSender: false
      }
    ]
  };

  constructor(private http: HttpClient) {}

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(this.apiUrl).pipe(
      catchError(() => {
        return of(this.mockChats);
      })
    );
  }

  getMessages(chatId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${chatId}`).pipe(
      catchError(() => {
        return of(this.mockMessages[chatId] || []);
      })
    );
  }

  sendMessage(chatId: string, content: string): Observable<Message> {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'chef-gaston',
      senderName: 'Chef Gastón',
      content: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSender: true
    };

    return this.http.post<Message>(`${this.apiUrl}/${chatId}`, newMessage).pipe(
      catchError(() => {
        if (!this.mockMessages[chatId]) {
          this.mockMessages[chatId] = [];
        }
        this.mockMessages[chatId].push(newMessage);

        // Actualizar último mensaje en el chat
        const chat = this.mockChats.find(c => c.id === chatId);
        if (chat) {
          chat.lastMessageContent = content;
          chat.lastMessageTime = newMessage.timestamp;
        }

        return of(newMessage);
      })
    );
  }
}
