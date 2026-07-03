import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../domain/auth/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$: Observable<string | null> = this.errorSubject.asObservable();

  constructor(private router: Router) {
    const storedUser = localStorage.getItem('gc_user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): void {
    this.errorSubject.next(null);

    // Validación de credenciales temporales
    if (email === 'chef@gourmetconnect.com' && password === 'password123') {
      const mockUser: User = {
        id: 'chef-gaston',
        email: email,
        name: 'Chef Gastón',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv9b09OWxrEJPrcpdsaRtQEBtwhMjGY62uevjD5OOSmL9NYZpNBPKu0OrTvJKQ96iES8zHurnHlENOkHFQ8LTSoIa3-QsKxPvm5AZdrL-CvI7SavAvc9App9qdcjNqeIXx5DYs4PDV0JaTJyWca0HpaYfYYgd5QzoYvcRqjqoKczmsewnlNQ1xwqp_zQBnzJiCAOzHP5GQgdX7Jx9Fc7yVw-pvtLT3yhtib3PEAUnpq_ZF0bGz0r3kAA',
        token: 'mock-jwt-token-123456'
      };

      localStorage.setItem('gc_user', JSON.stringify(mockUser));
      this.currentUserSubject.next(mockUser);
      this.router.navigate(['/feed']);
    } else {
      this.errorSubject.next('Correo o contraseña incorrectos. Usa chef@gourmetconnect.com y password123');
    }
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  logout(): void {
    localStorage.removeItem('gc_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  updateProfile(name: string, email: string): void {
    const user = this.currentUserSubject.value;
    if (user) {
      const updatedUser = { ...user, name, email };
      localStorage.setItem('gc_user', JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
}
