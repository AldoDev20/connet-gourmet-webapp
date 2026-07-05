import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationHttpRepository } from '../../infrastructure/persistence/notification-http.repository';
import { Notification } from '../../domain/notification/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationFacade {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadNotificationsSubject = new BehaviorSubject<Notification[]>([]);

  notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();
  unreadNotifications$: Observable<Notification[]> = this.unreadNotificationsSubject.asObservable();

  constructor(private notificationRepository: NotificationHttpRepository) {}

  loadNotifications(): void {
    const storedUser = localStorage.getItem('gc_user');
    const currentUserId = storedUser ? JSON.parse(storedUser).id : 'chef-gaston';

    this.notificationRepository.getNotifications(currentUserId).subscribe(list => {
      this.notificationsSubject.next(list);
    });

    this.notificationRepository.getUnreadNotifications(currentUserId).subscribe(list => {
      this.unreadNotificationsSubject.next(list);
    });
  }

  markAsRead(id: string): void {
    this.notificationRepository.markAsRead(id).subscribe(updated => {
      const updatedList = this.notificationsSubject.value.map(n => n.id === id ? { ...n, read: true } : n);
      this.notificationsSubject.next(updatedList);

      const updatedUnread = this.unreadNotificationsSubject.value.filter(n => n.id !== id);
      this.unreadNotificationsSubject.next(updatedUnread);
    });
  }

  deleteNotification(id: string): void {
    this.notificationRepository.deleteNotification(id).subscribe(() => {
      const updatedList = this.notificationsSubject.value.filter(n => n.id !== id);
      this.notificationsSubject.next(updatedList);

      const updatedUnread = this.unreadNotificationsSubject.value.filter(n => n.id !== id);
      this.unreadNotificationsSubject.next(updatedUnread);
    });
  }

  createNotification(recipientId: string, senderId: string, type: string, postId?: string): void {
    this.notificationRepository.createNotification(recipientId, senderId, type, postId).subscribe(() => {
      this.loadNotifications();
    });
  }
}
