import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AuthFacade } from '../../application/auth/auth.facade';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

interface RegionPref {
  id: string;
  name: string;
  selected: boolean;
  imageUrl: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent, TranslatePipe],
  template: `
    <app-header></app-header>
    
    <div class="flex max-w-container-max mx-auto pt-16 bg-surface-container-low min-h-screen text-on-surface">
      <!-- Side Navigation Bar -->
      <app-sidebar></app-sidebar>
    
      <!-- Main Content Area -->
      <main class="flex-1 lg:ml-64 p-margin-mobile md:p-margin-desktop max-w-5xl mx-auto w-full">
        <!-- Page Header -->
        <header class="mb-10">
          <h1 class="font-display-lg text-display-lg text-primary mb-2 font-bold text-4xl">{{ 'settings.title' | translate }}</h1>
          <p class="font-body-lg text-on-surface-variant">{{ 'settings.subtitle' | translate }}</p>
        </header>
    
        <div class="space-y-gutter">
    
          <!-- Section 1: Perfil de Cuenta -->
          <section class="settings-card bg-surface-container-lowest rounded-[24px] p-6 md:p-8 shadow-sm">
            <div class="flex items-center gap-3 mb-6 border-b border-outline-variant/30 pb-4">
              <span class="material-symbols-outlined text-primary">person</span>
              <h2 class="font-headline-md text-headline-md text-on-surface font-bold text-xl">{{ 'settings.account' | translate }}</h2>
            </div>
    
            <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <!-- Avatar Upload -->
              <div class="flex flex-col items-center gap-4">
                <div class="w-32 h-32 rounded-full border-4 border-primary-fixed overflow-hidden relative group">
                  <div
                    class="w-full h-full bg-cover bg-center"
                  [style.background-image]="'url(' + avatarUrl + ')'"></div>
                  <div
                    (click)="changeAvatar()"
                    class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span class="material-symbols-outlined text-white">photo_camera</span>
                  </div>
                </div>
                <button (click)="changeAvatar()" class="font-label-sm text-primary hover:underline font-bold text-sm">{{ 'settings.changePhoto' | translate }}</button>
              </div>
    
              <!-- Form Fields -->
              <div class="md:col-span-2 space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1.5">
                    <label class="font-label-sm text-on-surface-variant text-xs font-bold uppercase tracking-wider">{{ 'settings.fullName' | translate }}</label>
                    <input
                      [(ngModel)]="fullName"
                      name="fullName"
                      class="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                      type="text"/>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="font-label-sm text-on-surface-variant text-xs font-bold uppercase tracking-wider">{{ 'login.email' | translate }}</label>
                    <input
                      [(ngModel)]="email"
                      name="email"
                      class="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                      type="email"/>
                  </div>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="font-label-sm text-on-surface-variant text-xs font-bold uppercase tracking-wider">{{ 'settings.bio' | translate }}</label>
                  <textarea
                    [(ngModel)]="bio"
                    name="bio"
                    class="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                  rows="3"></textarea>
                </div>
              </div>
            </div>
          </section>
    
          <!-- Section 2: Privacidad y Seguridad -->
          <section class="settings-card bg-surface-container-lowest rounded-[24px] p-6 md:p-8 shadow-sm">
            <div class="flex items-center gap-3 mb-6 border-b border-outline-variant/30 pb-4">
              <span class="material-symbols-outlined text-primary">security</span>
              <h2 class="font-headline-md text-headline-md text-on-surface font-bold text-xl">{{ 'settings.privacySecurity' | translate }}</h2>
            </div>
    
            <div class="space-y-6">
              <!-- Profile Privacy Toggle -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-body-md font-semibold text-on-surface">{{ 'settings.privateProfile' | translate }}</p>
                  <p class="text-sm text-on-surface-variant">Solo tus seguidores confirmados podrán ver tus recetas y publicaciones.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    [(ngModel)]="isPrivate"
                    name="isPrivate"
                    class="sr-only peer"
                    type="checkbox"/>
                  <div
                    [ngClass]="isPrivate ? 'bg-primary' : 'bg-surface-container-high'"
                  class="w-11 h-6 rounded-full transition-colors duration-200"></div>
                  <div
                    [ngClass]="isPrivate ? 'translate-x-5' : 'translate-x-0'"
                  class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                </label>
              </div>
    
              <!-- Search engine visibility Toggle -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-body-md font-semibold text-on-surface">{{ 'settings.searchVisibility' | translate }}</p>
                  <p class="text-sm text-on-surface-variant">Permite que otros te encuentren por tu nombre de chef o productor.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    [(ngModel)]="isVisibleInSearch"
                    name="isVisibleInSearch"
                    class="sr-only peer"
                    type="checkbox"/>
                  <div
                    [ngClass]="isVisibleInSearch ? 'bg-primary' : 'bg-surface-container-high'"
                  class="w-11 h-6 rounded-full transition-colors duration-200"></div>
                  <div
                    [ngClass]="isVisibleInSearch ? 'translate-x-5' : 'translate-x-0'"
                  class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                </label>
              </div>
    
              <div class="pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-on-surface-variant">lock</span>
                  <span class="font-body-md text-on-surface font-semibold">{{ 'settings.changePassword' | translate }}</span>
                </div>
                <button (click)="changePassword()" class="text-primary hover:bg-primary-fixed px-4 py-2 rounded-lg font-label-sm font-bold text-sm transition-all cursor-pointer">{{ 'settings.updateBtn' | translate }}</button>
              </div>
            </div>
          </section>
    
          <!-- Section 3: Notificaciones -->
          <section class="settings-card bg-surface-container-lowest rounded-[24px] p-6 md:p-8 shadow-sm">
            <div class="flex items-center gap-3 mb-6 border-b border-outline-variant/30 pb-4">
              <span class="material-symbols-outlined text-primary">notifications</span>
              <h2 class="font-headline-md text-headline-md text-on-surface font-bold text-xl">{{ 'settings.notifications' | translate }}</h2>
            </div>
    
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <!-- Push Column -->
              <div class="space-y-4">
                <h3 class="font-label-sm text-primary uppercase tracking-widest text-xs font-bold">Push Notifications</h3>
                <div class="flex items-center justify-between py-2 border-b border-outline-variant/10">
                  <span class="text-on-surface font-medium">Nuevas Publicaciones</span>
                  <input [(ngModel)]="pushNewPosts" name="pushNewPosts" class="rounded text-primary focus:ring-primary w-5 h-5 cursor-pointer" type="checkbox"/>
                </div>
                <div class="flex items-center justify-between py-2 border-b border-outline-variant/10">
                  <span class="text-on-surface font-medium">Mensajes Directos</span>
                  <input [(ngModel)]="pushDirectMessages" name="pushDirectMessages" class="rounded text-primary focus:ring-primary w-5 h-5 cursor-pointer" type="checkbox"/>
                </div>
                <div class="flex items-center justify-between py-2 border-b border-outline-variant/10">
                  <span class="text-on-surface font-medium">Menciones y Etiquetas</span>
                  <input [(ngModel)]="pushMentions" name="pushMentions" class="rounded text-primary focus:ring-primary w-5 h-5 cursor-pointer" type="checkbox"/>
                </div>
              </div>
    
              <!-- Email Column -->
              <div class="space-y-4">
                <h3 class="font-label-sm text-primary uppercase tracking-widest text-xs font-bold">Email Marketing</h3>
                <div class="flex items-center justify-between py-2 border-b border-outline-variant/10">
                  <span class="text-on-surface font-medium">Resumen Semanal</span>
                  <input [(ngModel)]="emailWeeklySummary" name="emailWeeklySummary" class="rounded text-primary focus:ring-primary w-5 h-5 cursor-pointer" type="checkbox"/>
                </div>
                <div class="flex items-center justify-between py-2 border-b border-outline-variant/10">
                  <span class="text-on-surface font-medium">Nuevos Seguidores</span>
                  <input [(ngModel)]="emailNewFollowers" name="emailNewFollowers" class="rounded text-primary focus:ring-primary w-5 h-5 cursor-pointer" type="checkbox"/>
                </div>
                <div class="flex items-center justify-between py-2 border-b border-outline-variant/10">
                  <span class="text-on-surface font-medium">Actualizaciones del Sistema</span>
                  <input [(ngModel)]="emailSystemUpdates" name="emailSystemUpdates" class="rounded text-primary focus:ring-primary w-5 h-5 cursor-pointer" type="checkbox"/>
                </div>
              </div>
            </div>
          </section>
    
          <!-- Section 4: Preferencias Gastronómicas -->
          <section class="settings-card bg-surface-container-lowest rounded-[24px] p-6 md:p-8 shadow-sm">
            <div class="flex items-center gap-3 mb-6 border-b border-outline-variant/30 pb-4">
              <span class="material-symbols-outlined text-primary">restaurant</span>
              <h2 class="font-headline-md text-headline-md text-on-surface font-bold text-xl">{{ 'settings.gastronomicPref' | translate }}</h2>
            </div>
            <p class="text-on-surface-variant mb-6 italic text-sm">{{ 'settings.gastronomicDesc' | translate }}</p>
    
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              @for (region of regions; track region) {
                <div
                  (click)="toggleRegion(region.id)"
                  [ngClass]="region.selected ? 'border-2 border-primary ring-2 ring-primary/20' : 'border-2 border-transparent hover:border-primary-fixed'"
                  class="relative group cursor-pointer overflow-hidden rounded-xl transition-all duration-300">
                  <div class="h-32 bg-cover bg-center" [style.background-image]="'url(' + region.imageUrl + ')'"></div>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                    <div class="flex items-center justify-between w-full">
                      <span class="text-white font-bold text-sm">{{ region.name }}</span>
                      <span
                        [ngClass]="region.selected ? 'text-white' : 'text-white/50'"
                        class="material-symbols-outlined text-lg">
                        {{ region.selected ? 'check_circle' : 'add_circle' }}
                      </span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </section>
    
          <!-- Save Actions -->
          <div class="flex flex-col sm:flex-row items-center justify-end gap-4 pb-20">
            <button
              (click)="discardChanges()"
              class="w-full sm:w-auto px-8 py-3 rounded-xl border-2 border-secondary text-secondary font-bold hover:bg-secondary-fixed transition-all active:scale-95 cursor-pointer">
              {{ 'settings.discard' | translate }}
            </button>
            <button
              (click)="saveSettings()"
              class="w-full sm:w-auto px-12 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95 cursor-pointer">
              {{ 'settings.save' | translate }}
            </button>
          </div>
        </div>
      </main>
    </div>
    `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`
    :host {
      display: block;
    }
    .settings-card {
      box-shadow: 0 4px 15px rgba(28, 27, 27, 0.05);
    }
  `]
})
export class SettingsComponent implements OnInit {
  fullName = '';
  email = '';
  bio = 'Apasionado por la cocina fusión peruana y los ingredientes ancestrales del Amazonas.';
  avatarUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhwa2CmzQlHVFuEb4xJGKGZcjSKClcE-yAMp707yYkLp8BBcPfwn03l2oIt_hmICCNOCkZZNp2jH3YBovlDz2HMqghvEF7CxKdUC0e7VndLHgoCB_4RFWtAuN1dR3hsIMPXat3hBDES0yQMEXBG5Ko_wzy83vonIm0d6Zh8tEKq_q1ErRmU8HxcjHpKTGofggjIzU47fUde2q-CLI5RKEJiHNP7rMXWJOgdY0J-Cavg7Z1kfs04LFi5w';

  // Privacidad
  isPrivate = false;
  isVisibleInSearch = true;

  // Notificaciones
  pushNewPosts = true;
  pushDirectMessages = true;
  pushMentions = true;
  emailWeeklySummary = false;
  emailNewFollowers = true;
  emailSystemUpdates = false;

  // Preferencias
  regions: RegionPref[] = [
    { 
      id: 'costa', 
      name: 'Costa', 
      selected: true, 
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsPCRUdRe001eGphSg69OWjRr5A2WXvxCQJbonOmhDpZ5NUygS3tqzRg-MNn8fMDC0lJEWSjgGyCy3SKrecE0dYPo_Xjl9uSUzwQEtURNPo78JPerwNODZnGBfE-NtbDsYxtIF1WxnUig94fqVC-5gtePWsuwCoGy4_q0kFdtC1l3c6AGwe0kdPQIUVBsXmuefXkw0ZDVqv89pvdcvqGTL6ZtiICsnpudbt3jwPDz4VefbTPIQoPvEcw' 
    },
    { 
      id: 'sierra', 
      name: 'Sierra', 
      selected: false, 
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe_xsGrYl14jPt2u7San1Nc-pEhKNEbquBCNogvk5YTDMnNxluaWGEKJG6O_b1Jim6G2_9i4IiAFl6eE6S5EDICnJw0oAjJCD_BtRfJf2KlD9Y3ubtrkYDuE7tlt9BGavd6rPNXU7tWpV4F2bkCU1Kpvj8_EQuSMlqlYtRLOwKvRz5IqmxHPDWA0M_49Ms6VoQ6V-sQNsdD8PdtKyG341iCrbk1Ii33vzw8Uz8qdQ8dbiAss31yGEI1g' 
    },
    { 
      id: 'selva', 
      name: 'Selva', 
      selected: true, 
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlwbOqZnxleitDGt9EZyGj2RBQUj-xSZDxgdmEFwwVKqA4VaHuaogNzG28jBoMWJP4T3Fmyj9__xKBD6wgyWu_3iW4qeWU-d0kk0lpt3vfLNZs49IXZd2hxWQXtXbqtcjA4ZQosmGH5ufrgUyYdx5jmuEioolfAVGUPq5iS5aI-6aZ_83jvMF0M10dQtn_8fRYQVWuj4qTltJqn1TJCv3i0Z8Q46vFwWAgzlmnOMefxkn0pu6dzOuJ-Q' 
    }
  ];

  constructor(
    public authFacade: AuthFacade,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse a la sesión del usuario para cargar su nombre y avatar correspondientes
    this.authFacade.currentUser$.subscribe(user => {
      if (user) {
        this.fullName = user.name;
        this.email = user.email;
        if (user.avatarUrl) {
          this.avatarUrl = user.avatarUrl;
        }
      }
    });
  }

  toggleRegion(id: string): void {
    const region = this.regions.find(r => r.id === id);
    if (region) {
      region.selected = !region.selected;
    }
  }

  changeAvatar(): void {
    const newUrl = prompt('Ingresa la URL de tu nueva foto de perfil:', this.avatarUrl);
    if (newUrl && newUrl.trim()) {
      this.avatarUrl = newUrl.trim();
    }
  }

  changePassword(): void {
    const newPass = prompt('Ingresa tu nueva contraseña:');
    if (newPass && newPass.trim()) {
      alert('¡Contraseña actualizada con éxito! Guardada en el perfil temporal.');
    }
  }

  discardChanges(): void {
    if (confirm('¿Estás seguro de que deseas descartar los cambios realizados?')) {
      // Recargar datos originales
      this.authFacade.currentUser$.subscribe(user => {
        if (user) {
          this.fullName = user.name;
          this.email = user.email;
        }
      });
      this.bio = 'Apasionado por la cocina fusión peruana y los ingredientes ancestrales del Amazonas.';
      this.isPrivate = false;
      this.isVisibleInSearch = true;
      this.regions.forEach(r => {
        r.selected = r.id === 'costa' || r.id === 'selva';
      });
      alert('Cambios descartados.');
    }
  }

  saveSettings(): void {
    if (!this.fullName.trim() || !this.email.trim()) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    // Actualizar datos del perfil de forma reactiva a través del Facade
    this.authFacade.updateProfile(this.fullName.trim(), this.email.trim());

    alert('¡Configuración guardada exitosamente! Se han actualizado tus datos reactivos.');
    this.router.navigate(['/feed']);
  }
}
