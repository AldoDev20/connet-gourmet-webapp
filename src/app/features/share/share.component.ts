import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { PostFacade } from '../../application/post/post.facade';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent, TranslatePipe],
  template: `
    <app-header></app-header>

    <div class="flex max-w-container-max mx-auto pt-16 bg-surface min-h-screen text-on-surface">
      <!-- Side Navigation Bar -->
      <app-sidebar></app-sidebar>

      <!-- Main Content Area -->
      <main class="flex-grow lg:ml-64 px-4 md:px-margin-desktop py-12">
        <div class="max-w-4xl mx-auto">
          <!-- Page Header -->
          <header class="mb-10 text-center">
            <h1 class="font-display-lg text-display-lg text-primary mb-2 font-bold text-4xl md:text-5xl">{{ 'share.title' | translate }}</h1>
            <p class="text-on-surface-variant opacity-80 font-body-lg text-body-lg">{{ 'share.subtitle' | translate }}</p>
          </header>

          <form (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            
            <!-- Image Upload / Preview Area (Bento Left) -->
            <div class="md:col-span-7">
              <div 
                (click)="mockUpload()"
                class="group relative aspect-video md:aspect-[4/5] rounded-[24px] bg-white overflow-hidden shadow-[0_4px_15px_-3px_rgba(28,27,27,0.1)] border-2 border-dashed border-outline-variant hover:border-primary transition-colors flex flex-col items-center justify-center cursor-pointer">
                
                <!-- Background Preview Image -->
                <img 
                  class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                  alt="A premium close-up of a Peruvian Causa Limeña plated beautifully" 
                  [src]="previewImage"/>
                
                <div class="relative z-10 flex flex-col items-center bg-white/80 backdrop-blur-md p-8 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined text-primary text-5xl mb-2">cloud_upload</span>
                  <span class="font-label-sm text-label-sm text-on-surface">Subir Imagen o Video</span>
                </div>
                
                <div class="absolute bottom-4 right-4 z-10 flex gap-2" (click)="$event.stopPropagation()">
                  <button (click)="changeImageUrl()" class="p-2 bg-white/90 backdrop-blur rounded-full shadow hover:bg-white transition-colors text-on-surface-variant" type="button">
                    <span class="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button (click)="removeImage()" class="p-2 bg-white/90 backdrop-blur rounded-full shadow hover:bg-white transition-colors text-error" type="button">
                    <span class="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Details Area (Bento Right) -->
            <div class="md:col-span-5 flex flex-col gap-6">
              
              <!-- Caption/Description -->
              <div class="bg-white p-6 rounded-[24px] shadow-[0_4px_15px_-3px_rgba(28,27,27,0.1)]">
                <label class="block font-label-sm text-label-sm text-outline mb-2 uppercase tracking-wider">{{ 'share.description' | translate }}</label>
                <textarea 
                  [(ngModel)]="description"
                  name="description"
                  required
                  class="w-full min-h-[140px] bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl font-body-md text-body-md p-4 text-on-surface placeholder:text-outline-variant resize-none outline-none" 
                  placeholder="{{ 'share.descPlaceholder' | translate }}"></textarea>
              </div>

              <!-- Location & Producer -->
              <div class="bg-white p-6 rounded-[24px] shadow-[0_4px_15px_-3px_rgba(28,27,27,0.1)]">
                <label class="block font-label-sm text-label-sm text-outline mb-2 uppercase tracking-wider">{{ 'share.location' | translate }}</label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-tertiary">location_on</span>
                  <input 
                    [(ngModel)]="location"
                    name="location"
                    class="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl font-body-md text-body-md outline-none" 
                    placeholder="{{ 'share.locPlaceholder' | translate }}" 
                    type="text"/>
                </div>
                <div class="mt-3 flex flex-wrap gap-2">
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-xs font-semibold">
                    <span class="material-symbols-outlined text-xs">storefront</span>
                    Finca Orgánica Valle Sagrado
                  </span>
                </div>
              </div>

              <!-- Culinary Tags -->
              <div class="bg-white p-6 rounded-[24px] shadow-[0_4px_15px_-3px_rgba(28,27,27,0.1)]">
                <label class="block font-label-sm text-label-sm text-outline mb-2 uppercase tracking-wider">{{ 'share.tags' | translate }}</label>
                <div class="flex flex-wrap gap-2 mb-3">
                  <span 
                    *ngFor="let tag of tags"
                    (click)="removeTag(tag)"
                    class="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-semibold hover:bg-error hover:text-white cursor-pointer transition-colors flex items-center gap-1">
                    #{{ tag }}
                    <span class="material-symbols-outlined text-[10px]">close</span>
                  </span>
                </div>
                <input 
                  [(ngModel)]="newTag"
                  name="newTag"
                  (keyup.enter)="addTag()"
                  class="w-full px-4 py-2 bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl font-body-md text-body-md outline-none" 
                  placeholder="{{ 'share.tagsPlaceholder' | translate }}" 
                  type="text"/>
              </div>

              <!-- Privacy & Submission -->
              <div class="bg-white p-6 rounded-[24px] shadow-[0_4px_15px_-3px_rgba(28,27,27,0.1)] mt-auto flex flex-col justify-end">
                <label class="block font-label-sm text-label-sm text-outline mb-4 uppercase tracking-wider">{{ 'share.privacy' | translate }}</label>
                <div class="flex gap-4 mb-6">
                  <button 
                    *ngFor="let privacyOpt of privacyOptions"
                    (click)="selectedPrivacy = privacyOpt.id"
                    [ngClass]="selectedPrivacy === privacyOpt.id ? 'border-2 border-primary bg-primary-fixed' : 'border border-outline-variant hover:border-primary'"
                    class="flex-1 flex flex-col items-center justify-center p-3 rounded-xl transition-all group active:scale-95 cursor-pointer" 
                    type="button">
                    <span 
                      [ngClass]="selectedPrivacy === privacyOpt.id ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'"
                      class="material-symbols-outlined mb-1">
                      {{ privacyOpt.icon }}
                    </span>
                    <span 
                      [ngClass]="selectedPrivacy === privacyOpt.id ? 'text-on-primary-fixed font-bold' : 'text-outline'"
                      class="text-[10px] uppercase font-bold">
                      {{ privacyOpt.name }}
                    </span>
                  </button>
                </div>
                
                <button 
                  [disabled]="!description.trim()"
                  class="w-full bg-[#cc5500] hover:bg-primary-container text-white py-4 rounded-xl font-body-lg text-body-lg font-bold shadow-lg transform hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="submit">
                  <span class="material-symbols-outlined">send</span>
                  {{ 'share.submit' | translate }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .hero-gradient {
      background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6));
    }
  `]
})
export class ShareComponent {
  description = '';
  location = '';
  newTag = '';
  selectedPrivacy = 'followers';

  previewImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdOIUMU0D-9djp3n26s7OF60G4kycbzkO5sV8WlmMyuT0W5WJ20fPcvseejQcqsTWbxSG8XxGCdLgB9TJprJcLRuGfOkOZ-dkk582X5HWK0h1090LrcXhXa6wAQwpgTGQxp5SqVZvb6vwaN5RbfXwdAKUPUPfec5YgF0XOJ2OyCBVDWEYGpF9pYVF4TkmMqmb60PiXpndA5Uaq7_uzT1EkhFfsoHycYB6Xc7gZqPqRozlh7XkIqYsoyg';

  tags: string[] = ['Ceviche', 'AndeanCuisine', 'Organic'];

  privacyOptions = [
    { id: 'public', name: 'Público', icon: 'public' },
    { id: 'followers', name: 'Seguidores', icon: 'group' },
    { id: 'private', name: 'Privado', icon: 'lock' }
  ];

  constructor(
    private postFacade: PostFacade,
    private router: Router
  ) {}

  addTag(): void {
    const tag = this.newTag.trim().replace(/#/g, '');
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
    }
    this.newTag = '';
  }

  removeTag(tagToRemove: string): void {
    this.tags = this.tags.filter(t => t !== tagToRemove);
  }

  mockUpload(): void {
    alert('Mock Upload:\nPuedes subir imágenes locales o editar la URL de la imagen actual en el botón de edición (lápiz).');
  }

  changeImageUrl(): void {
    const url = prompt('Ingresa la URL de tu foto de comida:', this.previewImage);
    if (url && url.trim()) {
      this.previewImage = url.trim();
    }
  }

  removeImage(): void {
    if (confirm('¿Deseas eliminar la imagen cargada?')) {
      this.previewImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60';
    }
  }

  onSubmit(): void {
    if (!this.description.trim()) return;

    // Crear el post reactivo en el Facade
    this.postFacade.createPost(
      this.description.trim(),
      this.previewImage
    );

    alert('¡Creación compartida con éxito! Redirigiendo a tu feed...');
    this.router.navigate(['/feed']);
  }
}
