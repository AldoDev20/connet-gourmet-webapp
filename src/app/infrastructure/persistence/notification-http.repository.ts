import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationRepository } from '../../domain/notification/notification.repository';
import { Notification } from '../../domain/notification/models/notification.model';
import { API_CONFIG } from '../../core/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class NotificationHttpRepository implements NotificationRepository {
  private apiUrl = `${API_CONFIG.baseUrl}/api/notifications`;

  constructor(private http: HttpClient) {}

  getNotifications(userId: string): Observable<Notification[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`).pipe(
      map(list => list || []),
      catchError(() => of([]))
    );
  }

  getUnreadNotifications(userId: string): Observable<Notification[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}/unread`).pipe(
      map(list => list || []),
      catchError(() => of([]))
    );
  }

  markAsRead(id: string): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${id}/read`, {});
  }

  deleteNotification(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createNotification(recipientId: string, senderId: string, type: string, postId?: string): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, { recipientId, senderId, type, postId });
  }
}
