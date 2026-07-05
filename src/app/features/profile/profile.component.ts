import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CreatorFacade } from '../../application/creator/creator.facade';
import { PostFacade } from '../../application/post/post.facade';
import { AuthFacade } from '../../application/auth/auth.facade';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, SidebarComponent],
  template: `
    <app-header></app-header>
    
    <div class="flex max-w-container-max mx-auto pt-16 bg-surface min-h-screen text-on-surface">
      <!-- Side Navigation Bar -->
      <app-sidebar></app-sidebar>
    
      <!-- Main Content Area -->
      <main class="flex-1 lg:ml-64 px-4 md:px-margin-desktop py-8">
        @if (creatorFacade.creator$ | async; as creator) {
          <!-- Profile Header Section -->
          <section class="mb-12 rounded-[24px] overflow-hidden bg-white shadow-[0_4px_15px_-3px_rgba(28,27,27,0.1)]">
            <div class="h-64 md:h-80 w-full relative">
              <div class="w-full h-full bg-cover bg-center" [style.background-image]="'url(' + creator.coverUrl + ')'"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <div class="px-8 pb-8 -mt-20 relative z-10 flex flex-col md:flex-row items-end justify-between gap-6">
              <div class="flex flex-col md:flex-row items-end gap-6">
                <img class="w-40 h-40 rounded-full border-4 border-surface shadow-xl object-cover" [alt]="creator.name" [src]="creator.avatarUrl"/>
                <div class="pb-2">
                  <h1 class="font-display-lg text-display-lg text-on-surface leading-tight">{{ creator.name }}</h1>
                  <p class="font-body-md text-on-surface-variant max-w-md mt-2">{{ creator.bio }}</p>
                </div>
              </div>
              <div class="flex gap-4 pb-2">
                <button
                  (click)="toggleFollow()"
                  [ngClass]="creator.isFollowing ? 'bg-surface-container text-primary border-2 border-primary' : 'bg-primary text-on-primary'"
                  class="px-6 py-2 rounded-lg font-bold active:scale-95 transition-all">
                  {{ creator.isFollowing ? 'Following' : 'Follow' }}
                </button>
                <button routerLink="/mensajeria" class="px-6 py-2 border-2 border-secondary text-secondary rounded-lg font-bold hover:bg-secondary-fixed transition-colors active:scale-95">
                  Message
                </button>
              </div>
            </div>
            <div class="px-8 py-6 border-t border-surface-container flex gap-12 overflow-x-auto">
              <div class="flex flex-col">
                <span class="font-headline-md text-primary font-bold">{{ creator.followersCount | number }}</span>
                <span class="font-label-sm text-on-surface-variant uppercase text-xs">Followers</span>
              </div>
              <div class="flex flex-col">
                <span class="font-headline-md text-primary font-bold">{{ creator.recipesCount }}</span>
                <span class="font-label-sm text-on-surface-variant uppercase text-xs">Recipes</span>
              </div>
              <div class="flex flex-col">
                <span class="font-headline-md text-primary font-bold">{{ creator.producersCount }}</span>
                <span class="font-label-sm text-on-surface-variant uppercase text-xs">Producers</span>
              </div>
            </div>
          </section>
          <!-- Bio Grid and Posts -->
          <div class="flex flex-col lg:flex-row gap-gutter">
            <!-- Center Content: Grid -->
            <div class="flex-1">
              <!-- Tabs -->
              <div class="flex gap-8 mb-8 border-b border-outline-variant">
                @for (tab of tabs; track tab) {
                  <button
                    (click)="activeTab = tab"
                    [ngClass]="activeTab === tab ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-primary'"
                    class="pb-4 border-b-2 transition-all capitalize">
                    {{ tab }}
                  </button>
                }
              </div>
              <!-- Bento-style Masonry Grid -->
              @if (activeTab === 'posts') {
                <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  @if (gastonPosts$ | async; as gastonPosts) {
                    @for (post of gastonPosts; track post; let idx = $index) {
                      <div
                        [ngClass]="idx === 2 ? 'md:col-span-2' : ''"
                        class="bg-white rounded-[24px] overflow-hidden shadow-[0_4px_15px_-3px_rgba(28,27,27,0.1)] group">
                        <!-- Post image / Video aspect -->
                        <div class="overflow-hidden relative" [ngClass]="post.videoUrl && !post.imageUrl ? 'h-[420px]' : 'h-64'">
                          <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" [alt]="post.content" [src]="post.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1XtEkkwyYPDDganzlpxgC1yvWYXck3ft8IYlpYBHSleee-nrPrhL_EJ3S46Qa2FzRJ5CQ44qCn8qSDAJe_2-qGGnRObdOK-YEEK_i7aOTM14bwtoY_KHdbgU39pMHTa4Xg4dD_sn31eD2jDXRBo7KaWIUkCZIBngFp4-dg0alJUdtqjHfPX0_Wros9p5IJcNDFJCYjmJuqNLToAGEvy-dULlpChnKSp4bje8fKRB-AAokcJEYs7mDHw'"/>
                          @if (post.videoUrl) {
                            <div class="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <button class="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
                                <span class="material-symbols-outlined text-white text-4xl" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                              </button>
                            </div>
                          }
                        </div>
                        <!-- Post Description details -->
                        <div class="p-6">
                          @if (post.locationLabel) {
                            <div class="flex items-center gap-2 mb-2">
                              <span class="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-label-sm flex items-center gap-1 font-semibold">
                                <span class="material-symbols-outlined text-[14px]">location_on</span>
                                {{ post.locationLabel }}
                              </span>
                              @if (idx === 2) {
                                <span class="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-label-sm font-semibold">
                                  Sustainability Hero
                                </span>
                              }
                            </div>
                          }
                          <h3 class="font-headline-md text-on-surface mb-2 font-bold" [ngClass]="idx === 2 ? 'text-3xl' : ''">
                            {{ post.recipeTitle || 'Culinary Insights' }}
                          </h3>
                          <p class="text-on-surface-variant" [ngClass]="idx === 2 ? 'mb-6 text-body-lg' : 'line-clamp-2'">
                            {{ post.content }}
                          </p>
                          <div class="mt-4 flex items-center justify-between border-t border-surface-container-low pt-4">
                            <div class="flex gap-4">
                              <button (click)="likePost(post.id)" class="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
                                <span class="material-symbols-outlined" [class.text-red-500]="post.isLiked">favorite</span> {{ post.likesCount }}
                              </button>
                              <button class="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
                                <span class="material-symbols-outlined">chat_bubble</span> {{ post.commentsCount }}
                              </button>
                            </div>
                            <button class="text-tertiary font-bold hover:underline flex items-center gap-1 group/btn">
                              {{ idx === 2 ? 'Read the full story' : 'View Details' }}
                              <span class="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    }
                  }
                </div>
              }
              <!-- Other tabs display -->
              @if (activeTab !== 'posts') {
                <div class="bg-white rounded-3xl p-8 border border-outline-variant/30 min-h-[300px] flex items-center justify-center">
                  <div class="text-center space-y-3">
                    <span class="material-symbols-outlined text-outline text-5xl">construction</span>
                    <p class="text-on-surface-variant font-body-md">Tab {{ activeTab }} represents extra cooking archives.</p>
                  </div>
                </div>
              }
            </div>
            <!-- Right Sidebar: Pantry list -->
            <aside class="w-full lg:w-80 flex flex-col gap-8">
              <!-- Ingredients List Card -->
              <div class="bg-surface-container-low rounded-[24px] p-6 border border-outline-variant">
                <h2 class="font-headline-md text-on-surface mb-6 flex items-center gap-2 font-bold">
                  <span class="material-symbols-outlined text-primary">eco</span>
                  Chef's Pantry
                </h2>
                @if (creatorFacade.producers$ | async; as producers) {
                  <ul class="flex flex-col gap-4">
                    @for (producer of producers; track producer) {
                      <li class="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                            [ngClass]="producer.id === '1' || producer.id === '4' ? 'bg-secondary-fixed' : producer.id === '2' ? 'bg-tertiary-fixed' : 'bg-primary-fixed'">
                            <span class="material-symbols-outlined"
                              [ngClass]="producer.id === '1' ? 'text-secondary' : producer.id === '2' ? 'text-tertiary' : producer.id === '3' ? 'text-primary' : 'text-secondary'">
                              {{ producer.id === '1' ? 'nutrition' : producer.id === '2' ? 'grass' : producer.id === '3' ? 'bakery_dining' : 'water_drop' }}
                            </span>
                          </div>
                          <div>
                            <div class="font-bold text-sm">{{ producer.name }}</div>
                            <div class="text-xs text-on-surface-variant">{{ producer.type }}</div>
                          </div>
                        </div>
                        <span class="text-primary font-bold text-sm">{{ producer.percentageUsed }}%</span>
                      </li>
                    }
                  </ul>
                }
                <button routerLink="/mapa" class="w-full mt-6 py-2.5 text-primary font-bold border-2 border-primary rounded-xl hover:bg-primary-fixed transition-colors">
                  See Sourcing Map
                </button>
              </div>
              <!-- Connect with Producers -->
              <div class="bg-primary text-on-primary rounded-[24px] p-8 shadow-lg relative overflow-hidden">
                <div class="relative z-10">
                  <h3 class="font-headline-md mb-2 font-bold text-xl">Sustainable Network</h3>
                  <p class="text-sm opacity-90 mb-4">Directly connect with 45 local producers curated by Chef Gastón.</p>
                  <button routerLink="/mapa" class="bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-surface-container-high transition-colors">
                    Browse Producers
                  </button>
                </div>
                <span class="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl opacity-10">handshake</span>
              </div>
              <!-- Reviews Highlights -->
              <div class="bg-white rounded-[24px] p-6 shadow-sm border border-surface-container">
                <h3 class="font-bold text-lg mb-4 text-on-surface-variant">Community Feedback</h3>
                <div class="flex flex-col gap-4">
                  <div class="flex flex-col gap-2">
                    <div class="flex gap-1 text-primary">
                      <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">star</span>
                      <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">star</span>
                      <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">star</span>
                      <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">star</span>
                      <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">star</span>
                    </div>
                    <p class="text-sm italic text-on-surface-variant font-body-md">
                      "Gastón's advocacy for Cusco's local farmers has shifted the way we buy grains here in Lima. Recommending this network!"
                    </p>
                    <span class="text-xs text-outline">- Lucia Mendoza</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        }
      </main>
    </div>
    `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProfileComponent implements OnInit {
  activeTab = 'posts';
  tabs = ['posts', 'recipes', 'ingredients', 'connections'];
  gastonPosts$: Observable<any[]> | undefined;
  currentUserId = 'chef-gaston';

  constructor(
    public creatorFacade: CreatorFacade,
    private postFacade: PostFacade,
    private authFacade: AuthFacade
  ) {}

  ngOnInit(): void {
    this.authFacade.currentUser$.subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
        this.creatorFacade.loadCreator(user.id);
        this.gastonPosts$ = this.postFacade.posts$.pipe(
          map(posts => posts.filter(post => post.creatorId === user.id))
        );
      } else {
        this.creatorFacade.loadCreator('chef-gaston');
        this.gastonPosts$ = this.postFacade.posts$.pipe(
          map(posts => posts.filter(post => post.creatorId === 'chef-gaston'))
        );
      }
    });
    this.postFacade.loadFeed();
  }

  toggleFollow(): void {
    this.creatorFacade.toggleFollow();
  }

  likePost(postId: string): void {
    this.postFacade.toggleLike(postId);
  }
}
