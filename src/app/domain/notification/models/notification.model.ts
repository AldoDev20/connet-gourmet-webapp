export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  type: string; // 'like' | 'comment' | 'follow' | 'system'
  postId?: string;
  createdAt: string;
  read: boolean;
}
