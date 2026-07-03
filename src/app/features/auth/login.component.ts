import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '../../application/auth/auth.facade';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  template: `
    <div class="flex flex-col md:flex-row min-h-screen bg-surface font-body-md text-on-surface">
      <!-- Left: Immersive Hero Section -->
      <section class="relative w-full md:w-1/2 lg:w-[60%] h-64 md:h-screen overflow-hidden">
        <img alt="Gourmet Peruvian cuisine presentation" class="absolute inset-0 w-full h-full object-cover" src="https://cdn-blog.superprof.com/blog_pe/wp-content/uploads/2025/01/cocina-peruana-gastronomia-peru-clases-scaled.jpg"/>
        <div class="absolute inset-0 hero-gradient flex flex-col justify-between p-12 text-white">
          <a class="font-display-lg text-3xl italic tracking-tight cursor-pointer" routerLink="/">GourmetConnect</a>
          <div class="max-w-md animate-slide-in">
            <h2 class="font-display-lg text-4xl md:text-5xl lg:text-6xl italic leading-tight">
              "La cocina es el alma de nuestra tierra."
            </h2>
            <div class="mt-6 w-24 h-1 bg-white/40"></div>
          </div>
        </div>
      </section>

      <!-- Right: Login Form Section -->
      <section class="w-full md:w-1/2 lg:w-[40%] flex flex-col bg-surface relative min-h-screen">
        <!-- Floating Language Switcher -->
        <div class="absolute top-6 right-8 flex items-center gap-2 border border-outline-variant/30 rounded-full px-3 py-1 bg-surface-container-low text-xs font-semibold z-10">
          <button 
            (click)="setLang('es')" 
            [ngClass]="currentLang === 'es' ? 'text-primary font-bold scale-105' : 'text-outline hover:text-primary'" 
            class="transition-all cursor-pointer">ES</button>
          <span class="text-outline-variant">|</span>
          <button 
            (click)="setLang('en')" 
            [ngClass]="currentLang === 'en' ? 'text-primary font-bold scale-105' : 'text-outline hover:text-primary'" 
            class="transition-all cursor-pointer">EN</button>
        </div>

        <main class="flex-grow flex items-center justify-center px-8 py-20 lg:px-24">
          <div class="w-full max-w-sm space-y-10 animate-fade-in">
            <div class="space-y-4">
              <h1 class="font-display-lg text-4xl text-on-surface font-headline-md">{{ 'login.welcome' | translate }}</h1>
              <p class="font-body-md text-on-surface-variant tracking-wide">{{ 'login.subtitle' | translate }}</p>
            </div>

            <!-- Banner de Error de Credenciales -->
            <div *ngIf="authFacade.error$ | async as errorMsg" class="bg-error-container text-on-error-container text-sm rounded-xl p-4 animate-fade-in flex items-center gap-3 border border-error/20">
              <span class="material-symbols-outlined text-[20px] text-error">warning</span>
              <span class="flex-1 font-body-md leading-snug">{{ errorMsg }}</span>
            </div>
            
            <form class="space-y-8" (ngSubmit)="onSubmit()">
              <div class="space-y-1.5 relative">
                <label class="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold" for="email">{{ 'login.email' | translate }}</label>
                <input 
                  [(ngModel)]="email"
                  name="email"
                  class="w-full py-3 bg-transparent input-underline text-on-surface outline-none placeholder:text-surface-dim font-body-md transition-all px-0" 
                  id="email" 
                  placeholder="tu@ejemplo.com" 
                  required 
                  type="email"/>
              </div>
              
              <div class="space-y-1.5 relative">
                <div class="flex justify-between items-end">
                  <label class="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold" for="password">{{ 'login.password' | translate }}</label>
                </div>
                <div class="relative">
                  <input 
                    [(ngModel)]="password"
                    name="password"
                    [type]="showPassword ? 'text' : 'password'"
                    class="w-full py-3 bg-transparent input-underline text-on-surface outline-none font-body-md transition-all px-0" 
                    id="password" 
                    placeholder="••••••••" 
                    required/>
                  <button 
                    (click)="togglePasswordVisibility()"
                    class="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer" 
                    type="button">
                    <span class="material-symbols-outlined text-[20px]">
                      {{ showPassword ? 'visibility_off' : 'visibility' }}
                    </span>
                  </button>
                </div>
                <div class="pt-2">
                  <a class="font-label-sm text-[11px] text-on-surface-variant hover:text-primary transition-colors italic underline underline-offset-4 decoration-outline-variant" href="#">{{ 'login.forgot' | translate }}</a>
                </div>
              </div>
              
              <div class="pt-4">
                <button 
                  [disabled]="!email || !password"
                  class="w-full py-4 bg-primary text-on-primary font-body-md font-semibold tracking-widest hover:brightness-110 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="submit">
                  {{ 'login.button' | translate }}
                </button>
              </div>
            </form>
            
            <div class="space-y-6">
              <div class="relative flex items-center justify-center">
                <div class="w-full border-t border-outline-variant"></div>
                <span class="absolute px-4 bg-surface text-[10px] uppercase tracking-[0.3em] text-surface-dim font-bold">o</span>
              </div>
              
              <button (click)="loginWithGoogle()" class="w-full py-3.5 border border-outline-variant flex items-center justify-center gap-3 text-on-surface font-medium hover:bg-white hover:shadow-md transition-all duration-300 font-body-md group cursor-pointer">
                <svg class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span>{{ 'login.google' | translate }}</span>
              </button>
              
              <p class="text-center font-body-md text-on-surface-variant text-sm">
                {{ 'login.noAccount' | translate }} <a class="text-primary font-semibold hover:underline" href="#">{{ 'login.register' | translate }}</a>
              </p>
            </div>
          </div>
        </main>
        
        <!-- Professional Footer -->
        <footer class="w-full py-8 px-8 border-t border-outline-variant bg-surface-container-low mt-auto">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">
            <span>© 2024 GourmetConnect</span>
            <div class="flex gap-8">
              <a class="hover:text-primary transition-colors" href="#">Política de Privacidad</a>
              <a class="hover:text-primary transition-colors" href="#">Términos y Condiciones</a>
              <a class="hover:text-primary transition-colors" href="#">Ayuda</a>
            </div>
          </div>
        </footer>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .input-underline {
      border-bottom: 1.5px solid #e0c0b2 !important;
      border-top: 0 !important;
      border-left: 0 !important;
      border-right: 0 !important;
      border-radius: 0 !important;
    }
    .input-underline:focus {
      border-bottom-color: #cc5500 !important;
      box-shadow: none !important;
    }
    .hero-gradient {
      background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6));
    }
    @keyframes slideIn {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .animate-slide-in {
      animation: slideIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-fade-in {
      animation: fadeIn 0.7s ease-out forwards;
    }
  `]
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  showPassword = false;
  currentLang = 'es';

  constructor(
    public authFacade: AuthFacade,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.authFacade.clearError();
    this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.email && this.password) {
      this.authFacade.login(this.email, this.password);
    }
  }

  loginWithGoogle(): void {
    this.authFacade.login('chef@gourmetconnect.com', 'password123');
  }

  setLang(lang: 'es' | 'en'): void {
    this.translationService.setLanguage(lang);
  }
}
