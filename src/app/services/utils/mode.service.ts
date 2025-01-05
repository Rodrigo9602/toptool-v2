import { Injectable, Signal, computed, effect, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signal privado para el estado del tema
  private themeSignal = signal<Theme>(this.getInitialTheme());
  
  // Signal público de solo lectura
  public theme: Signal<Theme> = computed(() => this.themeSignal());
  
  // Signal computed para verificar si está en modo oscuro
  public isDarkMode: Signal<boolean> = computed(() => this.themeSignal() === 'dark');

  constructor() {
    // Efecto para sincronizar el tema con el DOM
    effect(() => {
      this.updateThemeInDOM(this.themeSignal());
      this.saveThemePreference(this.themeSignal());
    });

    // Escuchar cambios en las preferencias del sistema
    this.listenToSystemPreferences();
  }

  private getInitialTheme(): Theme {
    // Intentar obtener el tema guardado
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }

    // Si no hay tema guardado, usar preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private updateThemeInDOM(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    // Opcional: Actualizar meta tag para el color del tema
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
    }
  }

  private saveThemePreference(theme: Theme): void {
    localStorage.setItem('theme', theme);
  }

  private listenToSystemPreferences(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Solo actualizar si no hay preferencia guardada
      if (!localStorage.getItem('theme')) {
        this.themeSignal.set(e.matches ? 'dark' : 'light');
      }
    });
  }

  public toggleTheme(): void {
    this.themeSignal.update(current => current === 'light' ? 'dark' : 'light');
  }

  public setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
  }
}