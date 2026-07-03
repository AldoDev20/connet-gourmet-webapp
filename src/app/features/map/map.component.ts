import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import * as L from 'leaflet';

interface MapPin {
  id: string;
  name: string;
  type: 'restaurant' | 'producer' | 'eco';
  icon: string;
  lat: number;
  lng: number;
  details: string;
}

interface NearbyCard {
  id: string;
  name: string;
  type: 'Chef' | 'Producer';
  specialty: string;
  location: string;
  rating: number;
  description: string;
  imageUrl: string;
  iconName: 'restaurant' | 'eco' | 'nutrition';
  badgeClass: string;
}

interface MapTheme {
  id: string;
  name: string;
  url: string;
  attribution: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="bg-background text-on-surface font-body-md overflow-hidden h-screen flex">
      <!-- Sidebar Navigation -->
      <app-sidebar></app-sidebar>
    
      <!-- Main Content Area -->
      <main class="flex-1 ml-0 lg:ml-64 relative flex flex-col h-screen">
        <!-- Top Navigation & Search -->
        <header class="w-full bg-surface shadow-sm z-40 relative px-margin-desktop py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-6 shrink-0">
            <h1 class="font-headline-md text-primary font-bold tracking-tight cursor-pointer" (click)="goHome()">GourmetConnect</h1>
            <div class="hidden md:flex gap-6">
              <a class="font-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer" (click)="goHome()">Home</a>
              <a class="font-body-md text-primary border-b-2 border-primary font-bold pb-1 cursor-pointer">Discovery</a>
              <a class="font-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer" (click)="goToMessages()">Messages</a>
            </div>
          </div>
          <!-- Search and Filter Bar -->
          <div class="flex-1 max-w-2xl flex items-center bg-surface-container-low border border-outline-variant rounded-full px-4 py-2 gap-3 transition-focus focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-inner">
            <span class="material-symbols-outlined text-outline">search</span>
            <input
              [(ngModel)]="searchQuery"
              (keyup.enter)="filterCards()"
              class="bg-transparent border-none focus:ring-0 w-full text-body-md placeholder:text-outline-variant outline-none"
              placeholder="Search region, category, or ingredient..."
              type="text"/>
            <div class="h-6 w-[1px] bg-outline-variant"></div>
            <button (click)="toggleFilters()" class="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors px-2">
              <span class="material-symbols-outlined text-[20px]">filter_list</span>
              <span class="text-label-sm">Filters</span>
            </button>
          </div>
          <div class="flex items-center gap-4 shrink-0">
            <button class="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant">
              <span class="material-symbols-outlined">add_a_photo</span>
            </button>
            <div class="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border border-outline-variant cursor-pointer" (click)="goToProfile()">
              <img class="w-full h-full object-cover" alt="My Profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb4SxccU6cnSqjVRQq45P0uoVH18O8DsVYZ2XA7aa5dlFfdQcNtQsMs__7cj3-4z1XugZBaGV0aHtw0ZC_iewbi6tFb53RgXnQlMz-MmUiFJqmhqKu5al8yNZVOdLji8PIH4VwgW8QgX9sYVZozHta5gQs46LP4ewVOUSru-7ixmkKw3g0D9INv2bW8V52oKSWrhVjaFW3lxgqOhmDu3HWdQR-uxMFi04ETn3IY25kXShSGKh2tgZTGA"/>
            </div>
          </div>
        </header>
    
        <!-- Discovery Map Container -->
        <div class="flex-1 relative flex">
          <!-- Interactive OpenStreetMap Container -->
          <div class="absolute inset-0 z-0 bg-surface-container overflow-hidden">
            <div id="map" class="w-full h-full relative z-0"></div>
          </div>
    
          <!-- Map Color Theme Selector Widget -->
          <div class="absolute top-6 right-10 bg-surface/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-outline-variant/60 z-20 flex flex-col gap-2 text-xs w-48">
            <span class="font-bold text-[10px] text-outline uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">palette</span>
              Map Style
            </span>
            <div class="flex flex-col gap-1">
              @for (theme of themes; track theme) {
                <button
                  (click)="changeMapTheme(theme.id)"
                  [ngClass]="activeThemeId === theme.id ? 'bg-primary/10 text-primary font-bold border-l-2 border-primary pl-2' : 'text-on-surface-variant hover:bg-surface-container/50 pl-2'"
                  class="text-left py-1.5 rounded-r transition-all cursor-pointer">
                  {{ theme.name }}
                </button>
              }
            </div>
          </div>
    
          <!-- Map Controls Overlay -->
          <div class="absolute bottom-10 right-10 flex flex-col gap-2 z-20">
            <button (click)="zoomIn()" class="w-12 h-12 bg-surface rounded-full shadow-lg flex items-center justify-center text-on-surface-variant hover:bg-primary-fixed hover:text-primary transition-colors border border-outline-variant cursor-pointer">
              <span class="material-symbols-outlined">add</span>
            </button>
            <button (click)="zoomOut()" class="w-12 h-12 bg-surface rounded-full shadow-lg flex items-center justify-center text-on-surface-variant hover:bg-primary-fixed hover:text-primary transition-colors border border-outline-variant cursor-pointer">
              <span class="material-symbols-outlined">remove</span>
            </button>
            <button (click)="resetMap()" class="w-12 h-12 bg-surface rounded-full shadow-lg flex items-center justify-center text-on-surface-variant hover:bg-primary-fixed hover:text-primary transition-colors border border-outline-variant cursor-pointer">
              <span class="material-symbols-outlined">my_location</span>
            </button>
          </div>
    
          <!-- Sidebar Overlay: Featured Near You -->
          <aside class="z-10 w-full max-w-sm ml-margin-desktop my-6 pointer-events-none">
            <div class="h-full flex flex-col pointer-events-auto bg-surface/90 backdrop-blur-md rounded-3xl shadow-2xl border border-outline-variant overflow-hidden">
              <div class="p-6 border-b border-outline-variant bg-surface-container-low/50">
                <h3 class="font-headline-md text-on-surface flex items-center gap-2 font-bold">
                  <span class="material-symbols-outlined text-primary">distance</span>
                  Featured Near You
                </h3>
                <p class="font-label-sm text-on-surface-variant mt-1">Discover {{ filteredCards.length }} local treasures in Lima</p>
              </div>
    
              <!-- List of Cards -->
              <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                @for (card of filteredCards; track card) {
                  <div
                    [class.border-primary]="selectedPinName === card.name"
                    (click)="focusOnCard(card)"
                    class="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden custom-shadow card-hover transition-all duration-300 cursor-pointer">
                    <div class="h-32 w-full relative">
                      <img class="w-full h-full object-cover" [alt]="card.name" [src]="card.imageUrl"/>
                      <div [class]="card.badgeClass" class="absolute top-2 right-2 px-3 py-1 rounded-full flex items-center gap-1 border border-white/20 text-white">
                        <span class="material-symbols-outlined text-[14px]">{{ card.iconName }}</span>
                        <span class="text-[10px] font-bold uppercase tracking-wider">{{ card.type }}</span>
                      </div>
                    </div>
                    <div class="p-4">
                      <div class="flex justify-between items-start mb-2">
                        <div>
                          <h4 class="font-body-md font-bold text-on-surface">{{ card.name }}</h4>
                          <p class="font-label-sm text-secondary">{{ card.specialty }} • {{ card.location }}</p>
                        </div>
                        <div class="flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded-lg">
                          <span class="material-symbols-outlined text-primary text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
                          <span class="text-label-sm font-bold">{{ card.rating }}</span>
                        </div>
                      </div>
                      <p class="text-label-sm text-on-surface-variant line-clamp-2 mb-4">{{ card.description }}</p>
                      <div class="flex gap-2">
                        <button (click)="connectWithCard(card.id); $event.stopPropagation()" class="flex-1 bg-secondary text-on-secondary py-2 rounded-lg font-bold text-label-sm active:scale-95 transition-transform hover:bg-secondary/90">
                          Connect
                        </button>
                        <button (click)="$event.stopPropagation()" class="px-3 border-2 border-outline-variant rounded-lg text-outline hover:bg-surface-container-low transition-colors">
                          <span class="material-symbols-outlined text-[20px]">bookmark</span>
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
    
              <!-- Footer -->
              <div class="p-4 bg-surface border-t border-outline-variant flex justify-center">
                <button (click)="viewAllDiscoveries()" class="text-primary font-bold text-label-sm hover:underline flex items-center gap-1">
                  View all local discoveries
                  <span class="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
    
        <!-- Floating Action Button (FAB) -->
        <button (click)="createNewDiscovery()" class="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
          <span class="material-symbols-outlined text-[28px]">add</span>
        </button>
      </main>
    </div>
    `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class MapComponent implements AfterViewInit, OnDestroy {
  searchQuery = '';
  selectedPinName = '';
  activeThemeId = 'satellite';

  private map!: L.Map;
  private tileLayer!: L.TileLayer;
  private markers: L.Marker[] = [];

  themes: MapTheme[] = [
    { 
      id: 'satellite', 
      name: 'Satélite Realista', 
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' 
    },
    { 
      id: 'creme', 
      name: 'Crema Gourmet', 
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', 
      attribution: '© OpenStreetMap & CartoDB' 
    },
    { 
      id: 'dark', 
      name: 'Noche Premium', 
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', 
      attribution: '© OpenStreetMap & CartoDB' 
    },
    { 
      id: 'warm', 
      name: 'Tono Cálido', 
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', 
      attribution: '© OpenStreetMap & French Tile team' 
    },
    { 
      id: 'standard', 
      name: 'Clásico (OSM)', 
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
      attribution: '© OpenStreetMap contributors' 
    }
  ];

  pins: MapPin[] = [
    { id: 'mateo', name: 'Mateo Quispe', type: 'producer', icon: 'eco', lat: -12.0850, lng: -76.9950, details: 'Organic Quinoa • Puno' },
    { id: 'lucia', name: 'Chef Lucía', type: 'restaurant', icon: 'restaurant', lat: -12.1220, lng: -77.0290, details: 'Modern Seafood • Miraflores' },
    { id: 'amazon', name: 'Amazon Cacao Co.', type: 'producer', icon: 'agriculture', lat: -12.1480, lng: -77.0210, details: 'Tree-to-Bar • San Martín' }
  ];

  cards: NearbyCard[] = [
    {
      id: 'mateo',
      name: 'Mateo Quispe',
      type: 'Producer',
      specialty: 'Organic Quinoa',
      location: 'Puno',
      rating: 4.9,
      description: 'Sustainable farming at 3,800m. Heirloom varieties harvested with traditional techniques.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkDj1UOxfdLv7-kYWIySiBRfWzQsmPX-Tl6eRJeblpyrEmaksrO5bZrv3y-_jPmCJmKIZJPKQRBse1BfSrBJzgSpZc9y9-7EweAUhI8M6NPKT0R9Mb3Oyt7grsw0nG5GWyx-9YexGCGUslKJSJ-WfgFd4RZ0YGKTzOuaoBcjvLfqKmnh-94Y5gC0ARMSt0fDk89V_CbnhwznIuTg8a7tq3lh2_4JyDZ9EsCzPlT428AwD1YQVed8UiZA',
      iconName: 'eco',
      badgeClass: 'bg-tertiary-container'
    },
    {
      id: 'lucia',
      name: 'Chef Lucía',
      type: 'Chef',
      specialty: 'Modern Seafood',
      location: 'Miraflores',
      rating: 5.0,
      description: 'Reinventing coastal classics with forgotten Amazonian ingredients. Daily fresh catch.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgtVhOdcaeMlIm8Imzgz2uI32Tu-QoUJ8fK0PWaEpz_FAeCmt4xSZNxLqZr-VyrsXYJVD7Y9aFbm6tvC8DX1zOXViUP9PTGqW_ESQA8FHLWqJbCuGUeDmHn1SZ2XpvZ7ny6Ng_0O1rZ0C2KdzegYzM2nW1ZSAyr6Hr2iCIilwW7hKf0GhMFgwWG4OipoG3FhuBlG6vHeNYkuNw4s4x88C0YfL0yKXFLs-qdh5Dk2Ut5kKiFDJumGzDgQ',
      iconName: 'restaurant',
      badgeClass: 'bg-primary-container'
    },
    {
      id: 'amazon',
      name: 'Amazon Cacao Co.',
      type: 'Producer',
      specialty: 'Tree-to-Bar',
      location: 'San Martín',
      rating: 4.8,
      description: 'Supporting 20 families through regenerative cacao farming and artisan chocolate making.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD0PMauzluSsayerXppaquLTYsbYEA2PgqOLTg6rrf09h5N4Qauy8tw7FAX098EvqKiVcTegB-4s_xEVVrVaCyEyF5B5N2zrw3YVHYIP1DBQCn7T5dBZ1gAOlgHA7VMt1SGZuvEX-DeBtz7bOrx_Gmuli_wz96JCZt5n04Iwp5isLlZO2EV3KCskDjdqe5CMRiR_UIwlvXV62AEs3DoY_5HyNyMkMxYDWG0I5b6BLr9Ii7HU-pqCPufQ',
      iconName: 'nutrition',
      badgeClass: 'bg-tertiary-container'
    }
  ];

  filteredCards: NearbyCard[] = [...this.cards];

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Inicializar el mapa con vista alejada de todo el Perú
    this.map = L.map('map', {
      center: [-9.19, -75.01],
      zoom: 6,
      zoomControl: false
    });

    // Iniciar con el tema predeterminado
    const initialTheme = this.themes.find(t => t.id === this.activeThemeId) || this.themes[0];
    this.tileLayer = L.tileLayer(initialTheme.url, {
      maxZoom: 19,
      attribution: initialTheme.attribution
    }).addTo(this.map);

    // Agregar marcadores dinámicos
    this.pins.forEach(pin => {
      const customIcon = L.divIcon({
        className: 'leaflet-custom-div-icon',
        html: `
          <div class="relative group cursor-pointer">
            <div class="${pin.type === 'restaurant' ? 'bg-primary text-on-primary' : 'bg-tertiary text-on-tertiary'} w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white transform hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">${pin.icon}</span>
            </div>
            <!-- Tooltip del pin -->
            <div class="absolute bottom-12 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant px-3 py-1 rounded-full shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              <span class="text-xs font-bold text-on-surface">${pin.name}</span>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([pin.lat, pin.lng], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(`
          <div class="p-2 font-body-md text-on-surface">
            <h4 class="font-bold text-sm text-primary">${pin.name}</h4>
            <p class="text-xs text-outline mt-1">${pin.details}</p>
          </div>
        `);

      marker.on('click', () => {
        this.selectPin(pin);
      });

      this.markers.push(marker);
    });

    // Animar el acercamiento cinematográfico hacia el primer punto (Mateo Quispe)
    setTimeout(() => {
      this.map.invalidateSize();
      const firstPin = this.pins[0];
      this.map.flyTo([firstPin.lat, firstPin.lng], 16, {
        animate: true,
        duration: 2.5
      });
      // Abrir el popup y seleccionar la tarjeta una vez termine la animación
      this.map.once('zoomend', () => {
        if (this.markers[0]) {
          this.markers[0].openPopup();
          this.selectPin(firstPin);
        }
      });
    }, 250);
  }

  changeMapTheme(themeId: string): void {
    const theme = this.themes.find(t => t.id === themeId);
    if (theme && this.map) {
      this.activeThemeId = themeId;
      this.map.removeLayer(this.tileLayer);
      
      this.tileLayer = L.tileLayer(theme.url, {
        maxZoom: 19,
        attribution: theme.attribution
      }).addTo(this.map);
    }
  }

  goHome(): void {
    this.router.navigate(['/feed']);
  }

  goToMessages(): void {
    this.router.navigate(['/mensajeria']);
  }

  goToProfile(): void {
    this.router.navigate(['/perfil']);
  }

  zoomIn(): void {
    if (this.map) this.map.zoomIn();
  }

  zoomOut(): void {
    if (this.map) this.map.zoomOut();
  }

  resetMap(): void {
    if (this.map) {
      this.map.setView([-12.11, -77.01], 12);
      this.selectedPinName = '';
      this.filteredCards = [...this.cards];
    }
  }

  selectPin(pin: MapPin): void {
    this.selectedPinName = pin.name;
    if (this.map) {
      this.map.flyTo([pin.lat, pin.lng], 16, {
        animate: true,
        duration: 1.5
      });
    }
  }

  focusOnCard(card: NearbyCard): void {
    const pin = this.pins.find(p => p.name === card.name);
    if (pin) {
      this.selectPin(pin);
      const idx = this.pins.findIndex(p => p.name === card.name);
      if (idx !== -1 && this.markers[idx]) {
        this.markers[idx].openPopup();
      }
    }
  }

  filterCards(): void {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.filteredCards = [...this.cards];
      return;
    }
    this.filteredCards = this.cards.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.specialty.toLowerCase().includes(q) || 
      c.location.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q)
    );
  }

  connectWithCard(id: string): void {
    this.router.navigate(['/mensajeria']);
  }

  toggleFilters(): void {
    alert('Filtros avanzados:\n• Calificación mínima (4.5+)\n• Rango de distancia (10km)\n• Certificación orgánica');
  }

  viewAllDiscoveries(): void {
    alert('Mostrando las 12 locaciones registradas en Lima Metropolitana y regiones vinculadas.');
  }

  createNewDiscovery(): void {
    alert('Formulario de nuevo descubrimiento:\nComparte un productor o restaurante sustentable para agregarlo al mapa.');
  }
}
