export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isSender: boolean;
}

export interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantLocation: string;
  lastMessageContent: string;
  lastMessageTime: string;
  unreadCount: number;
  isActive?: boolean;
}
