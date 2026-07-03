import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="fixed top-0 w-full z-50 bg-surface dark:bg-surface-dim shadow-[0_4px_15px_-3px_rgba(28,27,27,0.1)] h-16 flex items-center">
      <div class="max-w-container-max mx-auto px-margin-desktop flex justify-between items-center w-full">
        <h1 routerLink="/feed" class="font-headline-md text-headline-md text-primary dark:text-primary-fixed-dim font-bold tracking-tight cursor-pointer">
          GourmetConnect
        </h1>
        <div class="flex items-center gap-6">
          <div class="hidden md:flex items-center bg-surface-container rounded-full px-4 py-1.5 border border-outline-variant">
            <span class="material-symbols-outlined text-outline">search</span>
            <input class="bg-transparent border-none focus:ring-0 text-body-md placeholder:text-outline-variant ml-2 w-64 outline-none" placeholder="Search flavors..." type="text"/>
          </div>
          <div class="flex items-center gap-4">
            
            <!-- Language Toggle Button -->
            <button 
              (click)="toggleLang()" 
              class="flex items-center gap-2 border border-outline-variant/30 rounded-full px-3.5 py-1.5 bg-surface-container-low hover:bg-surface-container-high hover:border-primary transition-all duration-300 cursor-pointer active:scale-95 group">
              <span class="material-symbols-outlined text-[16px] text-primary group-hover:rotate-12 transition-transform">language</span>
              <span class="text-xs font-bold uppercase tracking-wider text-on-surface">
                {{ currentLang === 'es' ? 'ES' : 'EN' }}
              </span>
            </button>

            <button routerLink="/compartir" class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">add_a_photo</button>
            <button routerLink="/notificaciones" class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">notifications</button>
            <div routerLink="/perfil" class="w-8 h-8 rounded-full overflow-hidden border-2 border-secondary-container cursor-pointer hover:opacity-90">
              <img class="w-full h-full object-cover" alt="User Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYUXB9Os_jDGO3-j-8Om-Pl-Dp41NYKcnHVMnxQR4A_bYZvEj4YpU3m1fMLkp6tpn7OWHW5lQluX61Szjk1-OEsdwJXzkfX4_MA7lzxnOZDA5bo-WWY_gQLx_RlaBQFAq7GDzah-Hgl75nSghnbXZtagXABkvdeurzfhRC9MgpQmz8_yfECS4BO9hH_RxCECcw0ozVDsd7buSN7F1uAWW4Bfn8d45ITi--PhZjUZ2nNfTnLor1jzAjgw"/>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentLang = 'es';

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  toggleLang(): void {
    const nextLang = this.currentLang === 'es' ? 'en' : 'es';
    this.translationService.setLanguage(nextLang);
  }
}
