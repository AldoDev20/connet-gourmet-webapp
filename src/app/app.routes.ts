import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'feed',
    canActivate: [authGuard],
    loadComponent: () => import('./features/feed/feed.component').then(m => m.FeedComponent)
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'mapa',
    canActivate: [authGuard],
    loadComponent: () => import('./features/map/map.component').then(m => m.MapComponent)
  },
  {
    path: 'mensajeria',
    canActivate: [authGuard],
    loadComponent: () => import('./features/messaging/messaging.component').then(m => m.MessagingComponent)
  },
  {
    path: 'compartir',
    canActivate: [authGuard],
    loadComponent: () => import('./features/share/share.component').then(m => m.ShareComponent)
  },
  {
    path: 'configuracion',
    canActivate: [authGuard],
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'notificaciones',
    canActivate: [authGuard],
    loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent)
  },
  { path: '**', redirectTo: 'feed' }
];
