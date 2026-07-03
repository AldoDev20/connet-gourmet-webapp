import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  template: `
    <aside class="fixed left-0 top-0 h-full w-64 hidden lg:flex flex-col p-4 pt-20 gap-4 bg-surface-container-low dark:bg-surface-container border-r border-outline-variant z-40">
      <!-- User profile summary for top of sidebar in profile, or bottom in feed -->
      <div routerLink="/perfil" class="flex items-center gap-3 p-2 hover:bg-surface-container-high rounded-xl cursor-pointer transition-all">
        <div class="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center overflow-hidden border border-outline-variant">
          <img class="w-full h-full object-cover" alt="Chef Gaston Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRA7k32sMJonItbTuskMBBV4ajmHQxrl3W9nntqJZXpg-fYi-7hwIcqCrCnPJPVHr_7ux9a4RrNcJau3yxkOfyDadTM8NgDnsOZxDoaZOJU-JusWGFy7vFoyJMSX_sIzje3Z6QcKHJg_krlAKL6zJMJJWU8HuZNRqgCfCbKLxdlBQ8sFkAN19mIUbTOBSjn11TBK_9P9t30kaIo7EuRrh3_DugPiO64EcQ8VEUwaZR-aINgl236BW3Tg"/>
        </div>
        <div>
          <p class="font-bold text-on-surface-variant text-body-md leading-tight">Chef Gastón</p>
          <p class="text-label-sm text-outline">Lima, Peru</p>
        </div>
      </div>

      <nav class="flex flex-col gap-2 mt-4">
        <!-- Navigation Items -->
        <a routerLink="/feed"
           routerLinkActive="bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary font-bold"
           [routerLinkActiveOptions]="{exact: true}"
           class="flex items-center gap-4 p-3 text-on-surface-variant dark:text-on-surface hover:bg-surface-container-high hover:pl-5 transition-all rounded-xl">
          <span class="material-symbols-outlined">home</span>
          <span class="font-body-md">{{ 'nav.feed' | translate }}</span>
        </a>

        <a routerLink="/mapa"
           routerLinkActive="bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary font-bold"
           class="flex items-center gap-4 p-3 text-on-surface-variant dark:text-on-surface hover:bg-surface-container-high hover:pl-5 transition-all rounded-xl">
          <span class="material-symbols-outlined">explore</span>
          <span class="font-body-md">{{ 'nav.map' | translate }}</span>
        </a>

        <a routerLink="/mensajeria"
           routerLinkActive="bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary font-bold"
           class="flex items-center gap-4 p-3 text-on-surface-variant dark:text-on-surface hover:bg-surface-container-high hover:pl-5 transition-all rounded-xl">
          <span class="material-symbols-outlined">mail</span>
          <span class="font-body-md">{{ 'nav.inbox' | translate }}</span>
        </a>

        <a routerLink="/notificaciones"
           routerLinkActive="bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary font-bold"
           class="flex items-center gap-4 p-3 text-on-surface-variant dark:text-on-surface hover:bg-surface-container-high hover:pl-5 transition-all rounded-xl cursor-pointer">
          <span class="material-symbols-outlined">notifications</span>
          <span class="font-body-md">{{ 'nav.alerts' | translate }}</span>
        </a>

        <a routerLink="/perfil"
           routerLinkActive="bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary font-bold"
           class="flex items-center gap-4 p-3 text-on-surface-variant dark:text-on-surface hover:bg-surface-container-high hover:pl-5 transition-all rounded-xl">
          <span class="material-symbols-outlined">person</span>
          <span class="font-body-md">{{ 'nav.profile' | translate }}</span>
        </a>
      </nav>

      <div class="mt-4 px-2">
        <button routerLink="/compartir" class="w-full bg-primary text-on-primary py-3 px-4 rounded-xl font-bold body-md hover:shadow-lg transition-transform active:scale-95 cursor-pointer">
          {{ 'nav.createRecipe' | translate }}
        </button>
      </div>

      <div class="mt-auto pb-4 border-t border-outline-variant pt-4 flex flex-col gap-2">
        <a routerLink="/configuracion" routerLinkActive="text-primary font-bold" class="flex items-center gap-4 px-3 py-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <span class="material-symbols-outlined">settings</span>
          <span class="font-body-md">{{ 'nav.settings' | translate }}</span>
        </a>
        <a class="flex items-center gap-4 px-3 py-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <span class="material-symbols-outlined">help</span>
          <span class="font-body-md">{{ 'nav.support' | translate }}</span>
        </a>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SidebarComponent {}
