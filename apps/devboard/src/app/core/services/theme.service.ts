import { effect, Injectable, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'db-theme';

  isDark = signal<boolean>(this.getInitialTheme() === 'dark');

  constructor() {
    effect(() => {
      const dark = this.isDark();
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem(this.storageKey, dark ? 'dark' : 'light');
    });
  }

  toggleTheme(): void {
    this.isDark.update((v) => !v);
  }

  setTheme(theme: Theme): void {
    this.isDark.set(theme === 'dark');
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem(this.storageKey) as Theme | null;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
}
