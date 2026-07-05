import { Observable } from 'rxjs';
import { Notification } from './models/notification.model';

export interface NotificationRepository {
  getNotifications(userId: string): Observable<Notification[]>;
  getUnreadNotifications(userId: string): Observable<Notification[]>;
  markAsRead(id: string): Observable<Notification>;
  deleteNotification(id: string): Observable<void>;
  createNotification(recipientId: string, senderId: string, type: string, postId?: string): Observable<Notification>;
}
