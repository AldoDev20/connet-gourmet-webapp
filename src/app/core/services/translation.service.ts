import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  es: {
    // Navigation / General
    'nav.feed': 'Feed',
    'nav.map': 'Mapa',
    'nav.inbox': 'Mensajes',
    'nav.alerts': 'Alertas',
    'nav.profile': 'Mi Perfil',
    'nav.settings': 'Ajustes',
    'nav.support': 'Soporte',
    'nav.logout': 'Cerrar Sesión',
    'nav.createRecipe': 'Crear Receta',
    'nav.search': 'Buscar sabores...',
    'nav.welcome': 'Bienvenido',
    'general.back': 'Volver',
    
    // Login
    'login.welcome': 'Bienvenido',
    'login.subtitle': 'Inicia sesión en tu cuenta gourmet',
    'login.email': 'Correo Electrónico',
    'login.password': 'Contraseña',
    'login.forgot': '¿Olvidaste tu contraseña?',
    'login.button': 'INICIAR SESIÓN',
    'login.google': 'Continuar con Google',
    'login.noAccount': '¿No tienes una cuenta?',
    'login.register': 'Regístrate',
    
    // Feed
    'feed.title': 'Feed Gourmet',
    'feed.recipeSpotlight': 'Recetas Destacadas',
    'feed.likes': 'me gustas',
    'feed.comments': 'comentarios',
    'feed.viewRecipe': 'Ver receta',
    'feed.placeholderComment': 'Escribe un comentario...',
    'feed.postButton': 'Publicar',
    
    // Profile
    'profile.followers': 'Seguidores',
    'profile.recipes': 'Recetas',
    'profile.producers': 'Productores',
    'profile.tabPublications': 'Publicaciones',
    'profile.tabPantry': 'Mi Despensa',
    'profile.tabFarms': 'Fincas Aliadas',
    'profile.follow': 'Seguir',
    'profile.following': 'Siguiendo',
    'profile.bio': 'Chef Ejecutivo en Lima. Apasionado por la biodiversidad y la cocina sostenible.',
    
    // Map
    'map.title': 'Descubrimiento Local',
    'map.subtitle': 'Explora restaurantes premium y productores locales.',
    'map.theme': 'Tema del Mapa',
    
    // Messaging
    'msg.title': 'Mensajería Privada',
    'msg.placeholder': 'Escribe un mensaje...',
    
    // Share
    'share.title': 'Compartir Creación',
    'share.subtitle': 'Inspira a la comunidad con tu maestría culinaria',
    'share.description': 'Descripción',
    'share.descPlaceholder': 'Comparte la historia detrás de este plato...',
    'share.location': 'Ubicación & Productor',
    'share.locPlaceholder': 'Ej: Mercado Central de Lima',
    'share.tags': 'Etiquetas Culinarias',
    'share.tagsPlaceholder': 'Presiona Enter para agregar...',
    'share.privacy': 'Privacidad',
    'share.public': 'Público',
    'share.followersOpt': 'Seguidores',
    'share.private': 'Privado',
    'share.submit': 'Compartir Creación',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.subtitle': 'Gestiona tu experiencia culinaria.',
    'settings.account': 'Perfil de Cuenta',
    'settings.fullName': 'Nombre Completo',
    'settings.bio': 'Biografía',
    'settings.changePhoto': 'Cambiar foto',
    'settings.privacySecurity': 'Privacidad y Seguridad',
    'settings.privateProfile': 'Perfil Privado',
    'settings.searchVisibility': 'Visibilidad en Buscadores',
    'settings.changePassword': 'Cambiar contraseña',
    'settings.updateBtn': 'Actualizar',
    'settings.notifications': 'Notificaciones',
    'settings.gastronomicPref': 'Preferencias Gastronómicas',
    'settings.gastronomicDesc': 'Selecciona las regiones que definen tu paladar.',
    'settings.discard': 'Descartar Cambios',
    'settings.save': 'Guardar Configuración',
    'settings.logout': 'Cerrar Sesión',
    
    // Notifications
    'notif.title': 'Notificaciones',
    'notif.filterAll': 'Todas',
    'notif.filterInteractions': 'Interacciones',
    'notif.filterRecipes': 'Recetas',
    'notif.filterSystem': 'Sistema',
    'notif.inspiration': 'Inspiración del día',
    'notif.trends': 'Tendencias Lima'
  },
  en: {
    // Navigation / General
    'nav.feed': 'Feed',
    'nav.map': 'Map',
    'nav.inbox': 'Inbox',
    'nav.alerts': 'Alerts',
    'nav.profile': 'My Profile',
    'nav.settings': 'Settings',
    'nav.support': 'Support',
    'nav.logout': 'Logout',
    'nav.createRecipe': 'Create Recipe',
    'nav.search': 'Search flavors...',
    'nav.welcome': 'Welcome',
    'general.back': 'Back',
    
    // Login
    'login.welcome': 'Welcome',
    'login.subtitle': 'Log in to your gourmet account',
    'login.email': 'Email Address',
    'login.password': 'Password',
    'login.forgot': 'Forgot your password?',
    'login.button': 'LOG IN',
    'login.google': 'Continue with Google',
    'login.noAccount': "Don't have an account?",
    'login.register': 'Sign Up',
    
    // Feed
    'feed.title': 'Gourmet Feed',
    'feed.recipeSpotlight': 'Recipe Spotlights',
    'feed.likes': 'likes',
    'feed.comments': 'comments',
    'feed.viewRecipe': 'View recipe',
    'feed.placeholderComment': 'Write a comment...',
    'feed.postButton': 'Post',
    
    // Profile
    'profile.followers': 'Followers',
    'profile.recipes': 'Recipes',
    'profile.producers': 'Producers',
    'profile.tabPublications': 'Publications',
    'profile.tabPantry': 'My Pantry',
    'profile.tabFarms': 'Partner Farms',
    'profile.follow': 'Follow',
    'profile.following': 'Following',
    'profile.bio': 'Executive Chef in Lima. Passionate about biodiversity and sustainable cuisine.',
    
    // Map
    'map.title': 'Local Discovery',
    'map.subtitle': 'Explore premium eateries and local producers.',
    'map.theme': 'Map Theme',
    
    // Messaging
    'msg.title': 'Private Inbox',
    'msg.placeholder': 'Type a message...',
    
    // Share
    'share.title': 'Share Creation',
    'share.subtitle': 'Inspire the community with your culinary mastery',
    'share.description': 'Description',
    'share.descPlaceholder': 'Share the story behind this dish...',
    'share.location': 'Location & Producer',
    'share.locPlaceholder': 'E.g. Central Market of Lima',
    'share.tags': 'Culinary Tags',
    'share.tagsPlaceholder': 'Press Enter to add tag...',
    'share.privacy': 'Privacy',
    'share.public': 'Public',
    'share.followersOpt': 'Followers',
    'share.private': 'Private',
    'share.submit': 'Share Creation',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your culinary experience.',
    'settings.account': 'Account Profile',
    'settings.fullName': 'Full Name',
    'settings.bio': 'Biography',
    'settings.changePhoto': 'Change photo',
    'settings.privacySecurity': 'Privacy & Security',
    'settings.privateProfile': 'Private Profile',
    'settings.searchVisibility': 'Search Engine Visibility',
    'settings.changePassword': 'Change password',
    'settings.updateBtn': 'Update',
    'settings.notifications': 'Notifications',
    'settings.gastronomicPref': 'Gastronomic Preferences',
    'settings.gastronomicDesc': 'Select the regions that define your palate.',
    'settings.discard': 'Discard Changes',
    'settings.save': 'Save Settings',
    'settings.logout': 'Logout',
    
    // Notifications
    'notif.title': 'Notifications',
    'notif.filterAll': 'All',
    'notif.filterInteractions': 'Interactions',
    'notif.filterRecipes': 'Recipes',
    'notif.filterSystem': 'System',
    'notif.inspiration': 'Daily Inspiration',
    'notif.trends': 'Lima Trends'
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<string>('es');
  currentLang$: Observable<string> = this.currentLangSubject.asObservable();

  constructor() {
    const savedLang = localStorage.getItem('gc_lang');
    if (savedLang === 'en' || savedLang === 'es') {
      this.currentLangSubject.next(savedLang);
    }
  }

  get currentLanguage(): string {
    return this.currentLangSubject.value;
  }

  setLanguage(lang: 'es' | 'en'): void {
    localStorage.setItem('gc_lang', lang);
    this.currentLangSubject.next(lang);
  }

  translate(key: string): string {
    const lang = this.currentLangSubject.value;
    const dictionary = TRANSLATIONS[lang];
    if (dictionary && dictionary[key]) {
      return dictionary[key];
    }
    // Si no encuentra la clave, retorna la misma clave
    return key;
  }
}
