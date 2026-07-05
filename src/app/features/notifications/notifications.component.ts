import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { NotificationFacade } from '../../application/notification/notification.facade';
import { CreatorFacade } from '../../application/creator/creator.facade';

interface NotificationItem {
  id: string;
  type: 'interaction' | 'recipe' | 'system';
  avatar?: string;
  badgeIcon: string;
  badgeBgClass: string;
  contentHtml: string;
  timeLabel: string;
  thumbnailUrl?: string;
  commentQuote?: string;
  mapCropUrl?: string;
  trendingStats?: string[];
  opacityClass?: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, TranslatePipe],
  template: `
    <app-header></app-header>
    
    <div class="flex max-w-container-max mx-auto pt-16 bg-surface min-h-screen text-on-surface">
      <!-- Side Navigation Bar -->
      <app-sidebar></app-sidebar>
    
      <!-- Main Content Area -->
      <main class="flex-1 lg:ml-64 px-margin-mobile md:px-margin-desktop py-12 flex gap-gutter">
    
        <!-- Notifications List Section -->
        <div class="flex-grow max-w-3xl">
          <!-- Header & Filter Section -->
          <section class="mb-8">
            <h1 class="font-headline-md text-headline-md text-on-surface mb-6 font-bold text-3xl">{{ 'notif.title' | translate }}</h1>
            <div class="flex flex-wrap gap-3 mb-8">
              @for (filter of filters; track filter) {
                <button
                  (click)="selectedFilter = filter.id"
                  [ngClass]="selectedFilter === filter.id ? 'bg-secondary text-on-secondary font-bold' : 'bg-surface-container-high text-on-surface-variant font-semibold hover:bg-outline-variant'"
                  class="px-6 py-2 rounded-full text-label-sm transition-all shadow-sm cursor-pointer">
                  {{ filter.translationKey | translate }}
                </button>
              }
            </div>
          </section>
    
          <!-- Notifications List -->
          <div class="space-y-4">
            @for (notif of filteredNotifications; track notif) {
              <div
                (click)="markAsRead(notif.id)"
                [ngClass]="notif.opacityClass || ''"
                class="bg-white rounded-[24px] p-5 shadow-[0px_4px_15px_rgba(28,27,27,0.05)] border border-surface-container flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
                <!-- Left Icon/Avatar Badge -->
                <div class="relative flex-shrink-0">
                  @if (notif.avatar) {
                    <img class="w-14 h-14 rounded-full object-cover border-2 border-secondary-container" [src]="notif.avatar" alt="Notification sender profile image"/>
                  } @else {
                    <div [class]="'w-14 h-14 flex items-center justify-center rounded-full flex-shrink-0 ' + notif.badgeBgClass">
                      <span class="material-symbols-outlined text-3xl filled-icon">{{ notif.badgeIcon }}</span>
                    </div>
                  }
                  <!-- Small overlapping badge icon when profile image exists -->
                  @if (notif.avatar) {
                    <span
                      [class]="'absolute -bottom-1 -right-1 text-white rounded-full p-1 border-2 border-white scale-75 ' + notif.badgeBgClass">
                      <span class="material-symbols-outlined text-[16px] filled-icon">{{ notif.badgeIcon }}</span>
                    </span>
                  }
                </div>
                <!-- Content Body -->
                <div class="flex-1">
                  <p class="text-body-md text-on-surface" [innerHTML]="notif.contentHtml"></p>
                  <!-- Comment quote box -->
                  @if (notif.commentQuote) {
                    <div class="block mt-2 bg-surface-container-low p-3 rounded-lg text-on-surface-variant font-body-md italic border border-outline-variant">
                      "{{ notif.commentQuote }}"
                    </div>
                  }
                  <!-- Location map crop preview -->
                  @if (notif.mapCropUrl) {
                    <div class="mt-4 rounded-xl overflow-hidden h-32 relative border border-outline-variant shadow-inner">
                      <img class="w-full h-full object-cover opacity-80" [src]="notif.mapCropUrl" alt="Map indicating producer crop location"/>
                      <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3">
                        <span class="text-white text-label-sm font-bold">Ver en el mapa</span>
                      </div>
                    </div>
                  }
                  <!-- Trending Stats Pills -->
                  @if (notif.trendingStats) {
                    <div class="mt-3 flex gap-2">
                      @for (stat of notif.trendingStats; track stat) {
                        <span
                          class="px-3 py-1 bg-white/60 rounded-full text-label-sm text-on-surface-variant border border-white">
                          {{ stat }}
                        </span>
                      }
                    </div>
                  }
                  <p class="text-label-sm text-outline mt-1.5 italic">{{ notif.timeLabel }}</p>
                </div>
                <!-- Right Image Thumbnail -->
                @if (notif.thumbnailUrl) {
                  <div class="flex-shrink-0">
                    <img class="w-20 h-20 rounded-xl object-cover shadow-sm border border-outline-variant/20" [src]="notif.thumbnailUrl" alt="Post recipe image thumbnail"/>
                  </div>
                }
              </div>
            }
          </div>
    
          <!-- Empty State Spacer -->
          <div class="py-12 flex flex-col items-center justify-center text-center">
            <span class="material-symbols-outlined text-6xl text-surface-container-highest mb-4">notifications_off</span>
            <p class="font-headline-md text-surface-container-highest text-lg font-bold">No hay más notificaciones por ahora</p>
          </div>
        </div>
    
        <!-- Right Side - Suggested Content (Desktop Filler) -->
        <aside class="hidden lg:block w-72 px-4 space-y-6 flex-shrink-0">
          <div class="bg-surface-container-low rounded-[24px] p-6 border border-outline-variant">
            <h3 class="font-headline-md text-body-lg text-primary mb-4 font-bold text-lg">{{ 'notif.inspiration' | translate }}</h3>
            <div class="rounded-xl overflow-hidden mb-3 aspect-square relative group cursor-pointer">
              <img
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXNfbe2RgLDnRv5qd5eds8ogv8BE92Y5rdR2iNK1r2OMgypjQB-jNk9eZDrwjpwhE0YILN6fkWB_DBfgPwxjHoNWZCESivJKpW2AsRRK0KI9G9FWobHuVz4fyIrvn6uiGNLGPc4iYqXHKQSiKhiOtFFrJ9p3ejp2U-KdeKB9I_Q2f4LFV_dksPzsgzTjWW075SdF9-FDqPhnKGtv-QOzuoSEsCBj_X6Sl0LerTbz8RIe20qyS4yozZsA"
                alt="Artistic high-angle shot of traditional Peruvian spices"/>
              <div class="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
            </div>
            <p class="text-label-sm text-on-surface-variant font-bold text-sm">Especias de los Andes</p>
            <p class="text-label-sm text-outline text-xs mt-0.5">Descubre los sabores ocultos en las alturas.</p>
          </div>
    
          <div class="p-6">
            <h4 class="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-4 text-xs font-bold">{{ 'notif.trends' | translate }}</h4>
            <ul class="space-y-3">
              <li class="flex items-center justify-between group cursor-pointer">
                <span class="text-body-md hover:text-primary transition-colors">#CocinaNikkei</span>
                <span class="material-symbols-outlined text-sm text-outline group-hover:text-primary text-[14px]">arrow_forward_ios</span>
              </li>
              <li class="flex items-center justify-between group cursor-pointer">
                <span class="text-body-md hover:text-primary transition-colors">#AjiLimo</span>
                <span class="material-symbols-outlined text-sm text-outline group-hover:text-primary text-[14px]">arrow_forward_ios</span>
              </li>
              <li class="flex items-center justify-between group cursor-pointer">
                <span class="text-body-md hover:text-primary transition-colors">#Superfoods</span>
                <span class="material-symbols-outlined text-sm text-outline group-hover:text-primary text-[14px]">arrow_forward_ios</span>
              </li>
            </ul>
          </div>
        </aside>
    
      </main>
    </div>
    `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`
    :host {
      display: block;
    }
  `]
})export class NotificationsComponent implements OnInit {
  selectedFilter = 'all';
  notificationsList: NotificationItem[] = [];

  filters = [
    { id: 'all', translationKey: 'notif.filterAll' },
    { id: 'interaction', translationKey: 'notif.filterInteractions' },
    { id: 'recipe', translationKey: 'notif.filterRecipes' },
    { id: 'system', translationKey: 'notif.filterSystem' }
  ];

  constructor(
    public notificationFacade: NotificationFacade,
    private creatorFacade: CreatorFacade
  ) {}

  ngOnInit(): void {
    this.notificationFacade.loadNotifications();
    this.creatorFacade.loadAllUsers();

    // Combinar notificaciones y usuarios del backend dinámicamente
    this.creatorFacade.allUsers$.subscribe(users => {
      this.notificationFacade.notifications$.subscribe(notifs => {
        this.notificationsList = notifs.map(n => {
          const sender = users.find(u => u.id === n.senderId);
          const senderName = sender ? sender.name : 'Un chef';
          const senderAvatar = sender ? sender.avatarUrl : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYUXB9Os_jDGO3-j-8Om-Pl-Dp41NYKcnHVMnxQR4A_bYZvEj4YpU3m1fMLkp6tpn7OWHW5lQluX61Szjk1-OEsdwJXzkfX4_MA7lzxnOZDA5bo-WWY_gQLx_RlaBQFAq7GDzah-Hgl75nSghnbXZtagXABkvdeurzfhRC9MgpQmz8_yfECS4BO9hH_RxCECcw0ozVDsd7buSN7F1uAWW4Bfn8d45ITi--PhZjUZ2nNfTnLor1jzAjgw';
          
          let contentHtml = '';
          let badgeIcon = 'notifications';
          let badgeBgClass = 'bg-surface-container-high text-outline';

          if (n.type === 'like') {
            contentHtml = `<span class="font-bold">${senderName}</span> le dio me gusta a tu publicación.`;
            badgeIcon = 'favorite';
            badgeBgClass = 'bg-secondary';
          } else if (n.type === 'comment') {
            contentHtml = `<span class="font-bold">${senderName}</span> comentó en tu publicación.`;
            badgeIcon = 'chat';
            badgeBgClass = 'bg-tertiary';
          } else if (n.type === 'follow') {
            contentHtml = `<span class="font-bold">${senderName}</span> comenzó a seguirte.`;
            badgeIcon = 'person';
            badgeBgClass = 'bg-primary';
          } else if (n.type === 'system') {
            contentHtml = `Actualización del sistema completada.`;
            badgeIcon = 'update';
            badgeBgClass = 'bg-surface-container-high text-outline';
          } else {
            contentHtml = `Nueva receta o ingrediente registrado en la red.`;
            badgeIcon = 'restaurant';
            badgeBgClass = 'bg-tertiary text-on-tertiary';
          }

          return {
            id: n.id,
            type: n.type === 'system' ? 'system' as const : (n.type === 'recipe' ? 'recipe' as const : 'interaction' as const),
            avatar: senderAvatar,
            badgeIcon,
            badgeBgClass,
            contentHtml,
            timeLabel: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Hace un momento',
            opacityClass: n.read ? 'opacity-70' : ''
          };
        });
      });
    });
  }

  get filteredNotifications(): NotificationItem[] {
    if (this.selectedFilter === 'all') {
      return this.notificationsList;
    }
    return this.notificationsList.filter(n => n.type === this.selectedFilter);
  }

  markAsRead(id: string): void {
    this.notificationFacade.markAsRead(id);
  }
}

