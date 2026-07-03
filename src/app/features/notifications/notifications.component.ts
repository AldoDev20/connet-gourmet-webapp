import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

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
              <button 
                *ngFor="let filter of filters"
                (click)="selectedFilter = filter.id"
                [ngClass]="selectedFilter === filter.id ? 'bg-secondary text-on-secondary font-bold' : 'bg-surface-container-high text-on-surface-variant font-semibold hover:bg-outline-variant'"
                class="px-6 py-2 rounded-full text-label-sm transition-all shadow-sm cursor-pointer">
                {{ filter.translationKey | translate }}
              </button>
            </div>
          </section>

          <!-- Notifications List -->
          <div class="space-y-4">
            <div 
              *ngFor="let notif of filteredNotifications"
              [ngClass]="notif.opacityClass || ''"
              class="bg-white rounded-[24px] p-5 shadow-[0px_4px_15px_rgba(28,27,27,0.05)] border border-surface-container flex items-start gap-4 hover:shadow-md transition-shadow">
              
              <!-- Left Icon/Avatar Badge -->
              <div class="relative flex-shrink-0">
                <ng-container *ngIf="notif.avatar; else iconPlaceholder">
                  <img class="w-14 h-14 rounded-full object-cover border-2 border-secondary-container" [src]="notif.avatar" alt="Notification sender profile image"/>
                </ng-container>
                <ng-template #iconPlaceholder>
                  <div [class]="'w-14 h-14 flex items-center justify-center rounded-full flex-shrink-0 ' + notif.badgeBgClass">
                    <span class="material-symbols-outlined text-3xl filled-icon">{{ notif.badgeIcon }}</span>
                  </div>
                </ng-template>

                <!-- Small overlapping badge icon when profile image exists -->
                <span 
                  *ngIf="notif.avatar"
                  [class]="'absolute -bottom-1 -right-1 text-white rounded-full p-1 border-2 border-white scale-75 ' + notif.badgeBgClass">
                  <span class="material-symbols-outlined text-[16px] filled-icon">{{ notif.badgeIcon }}</span>
                </span>
              </div>

              <!-- Content Body -->
              <div class="flex-1">
                <p class="text-body-md text-on-surface" [innerHTML]="notif.contentHtml"></p>
                
                <!-- Comment quote box -->
                <div *ngIf="notif.commentQuote" class="block mt-2 bg-surface-container-low p-3 rounded-lg text-on-surface-variant font-body-md italic border border-outline-variant">
                  "{{ notif.commentQuote }}"
                </div>

                <!-- Location map crop preview -->
                <div *ngIf="notif.mapCropUrl" class="mt-4 rounded-xl overflow-hidden h-32 relative border border-outline-variant shadow-inner">
                  <img class="w-full h-full object-cover opacity-80" [src]="notif.mapCropUrl" alt="Map indicating producer crop location"/>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3">
                    <span class="text-white text-label-sm font-bold">Ver en el mapa</span>
                  </div>
                </div>

                <!-- Trending Stats Pills -->
                <div *ngIf="notif.trendingStats" class="mt-3 flex gap-2">
                  <span 
                    *ngFor="let stat of notif.trendingStats"
                    class="px-3 py-1 bg-white/60 rounded-full text-label-sm text-on-surface-variant border border-white">
                    {{ stat }}
                  </span>
                </div>

                <p class="text-label-sm text-outline mt-1.5 italic">{{ notif.timeLabel }}</p>
              </div>

              <!-- Right Image Thumbnail -->
              <div *ngIf="notif.thumbnailUrl" class="flex-shrink-0">
                <img class="w-20 h-20 rounded-xl object-cover shadow-sm border border-outline-variant/20" [src]="notif.thumbnailUrl" alt="Post recipe image thumbnail"/>
              </div>

            </div>
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
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NotificationsComponent {
  selectedFilter = 'all';

  filters = [
    { id: 'all', translationKey: 'notif.filterAll' },
    { id: 'interaction', translationKey: 'notif.filterInteractions' },
    { id: 'recipe', translationKey: 'notif.filterRecipes' },
    { id: 'system', translationKey: 'notif.filterSystem' }
  ];

  notifications: NotificationItem[] = [
    {
      id: 'notif-1',
      type: 'interaction',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqnrwlUotQv54ObDAIbWI3ZTqZTwnRhR42IQRDU_wUEKhjl_jwnbnxnLT4MTU0XfJeM665ntCOCiArEzPFDF1ABQXXYY8AeSOW4BQCvEXYSPUzTJFfwzgJiMbsw-ItRbaSEZF934-ExUct8hiXulyceXFQcFeAvjOe05DLl8sxyoy2KjlNq_mEifawI3TaRKbEkICgAkImzLXvryFjLMRfh2wQ008r_xUsBw9TDco7SCaKsCSQaesXJQ',
      badgeIcon: 'favorite',
      badgeBgClass: 'bg-secondary',
      contentHtml: '<span class="font-bold">Chef Gastón</span> le dio me gusta a tu receta de <span class="font-bold text-primary">Ceviche de Mango</span>.',
      timeLabel: 'Hace 5 min',
      thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDq3cLHJlRxOfCqUGMFuSAEsmA51usQIYQS6jkqU1Ig2clCxf1akRc7Dkn28zOmuWMa-IolZaluERaiIqrgaTJ3bQhmFSOR59PIgAAyWB9booC2nuTAJgBc_v52kF3J9aTYsOzjPFhJc_YrcLC2tcHbm77V7ygZeEXsa5UIXC4YiZmfiymER86BI7e16Kj1WzN3pALf26gvaJ5fS98QA2iOyEQ-aSQuYpJohElJFeGd079h7_OXlVJxVA'
    },
    {
      id: 'notif-2',
      type: 'interaction',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC_szcDSInh7B9703mKkQuI6a2odQYrgtJ5sFWFfemuxOzxzszt1exjBpLkE5KiGixZZbsw8QQHaxmyoK338EWk73fSqCcOs6NDtiZQigTenJyEDaySHKpJNGNkGzwIqY6XnD0R1sXpNT4O2WuC7VOR0ly5tyzB6fE2Hn-w6C8B3zrNnEVSz3zG5grlqxcZ2Rhow7A-Q7HbhiL_wrLHwFw9gig-V6sJrtMTmxsBZ3aRDHhhKWn9Wro3w',
      badgeIcon: 'chat',
      badgeBgClass: 'bg-tertiary',
      contentHtml: '<span class="font-bold">Mamá Elena</span> comentó en tu publicación:',
      commentQuote: '¡Esa técnica del ají amarillo es magistral!',
      timeLabel: 'Hace 2 horas'
    },
    {
      id: 'notif-3',
      type: 'recipe',
      badgeIcon: 'location_on',
      badgeBgClass: 'bg-tertiary text-on-tertiary',
      contentHtml: '<span class="font-bold">Nuevo productor local:</span> <span class="text-tertiary font-bold">Finca El Sol</span> se ha unido a la red cerca de ti en <span class="inline-flex items-center bg-secondary-fixed text-on-secondary-fixed-variant px-2 py-0.5 rounded-full text-xs font-bold">Amazonas</span>.',
      mapCropUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl6k-BKK5P4wGRMIHfqqpbwk7Qaa_tIDGZPoLLHeeslaIzwdpP9F51mgPu-US9IpDS5o3u9gmL2zhtIgc_16cBUaHyZa_Z495EupyyQJaGz2-1T9hZeN44IFfY410xgqu659gw0YAWbf-aax8VKUw8C2iquuAfT0GN8KKmayQ3IbYJkkPW2uPrv3xtLM4vOmUHGbiklO3011DzU4KEdoK25Gj2qDOjzocBChQTiYod-ENGT-ewzY7O3A',
      timeLabel: 'Hace 4 horas'
    },
    {
      id: 'notif-4',
      type: 'recipe',
      badgeIcon: 'trending_up',
      badgeBgClass: 'bg-secondary text-on-secondary',
      contentHtml: '¡Enhorabuena! Tu publicación <span class="font-bold italic text-secondary">\'Secretos del Rocoto\'</span> es tendencia hoy. 🌶️',
      trendingStats: ['450 me gustas', '82 compartidos'],
      timeLabel: 'Hace 6 horas'
    },
    {
      id: 'notif-5',
      type: 'system',
      badgeIcon: 'update',
      badgeBgClass: 'bg-surface-container-high text-outline',
      contentHtml: 'Actualización del sistema completada. Hemos mejorado la búsqueda de ingredientes locales.',
      timeLabel: 'Ayer',
      opacityClass: 'opacity-70'
    }
  ];

  get filteredNotifications(): NotificationItem[] {
    if (this.selectedFilter === 'all') {
      return this.notifications;
    }
    return this.notifications.filter(n => n.type === this.selectedFilter);
  }
}
