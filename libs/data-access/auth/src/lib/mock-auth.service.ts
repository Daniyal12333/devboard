import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import type { User } from '@supabase/supabase-js';
import { MOCK_USER_ID, MOCK_PROFILE } from '@devboard/shared-models';
import { AuthServiceBase } from './auth-service.base';

const SESSION_KEY = 'db-mock-session';

function makeMockUser(email: string, fullName: string): User {
  return {
    id: MOCK_USER_ID,
    email,
    user_metadata: { full_name: fullName },
    app_metadata: {},
    aud: 'authenticated',
    created_at: MOCK_PROFILE.created_at,
  } as unknown as User;
}

@Injectable()
export class MockAuthService extends AuthServiceBase {
  private router = inject(Router);

  private _user = signal<User | null>(this.restoreSession());
  private _loading = signal(false);
  private _initialized = signal(true);

  readonly user = this._user.asReadonly();
  readonly isLoading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());
  readonly isInitialized = this._initialized.asReadonly();

  signIn(email: string, password: string): Observable<{ error: null }> {
    this._loading.set(true);
    // Simulate network delay
    return new Observable((observer) => {
      setTimeout(() => {
        if (password.length < 6) {
          this._loading.set(false);
          observer.next({ error: { message: 'Invalid login credentials' } as never });
          observer.complete();
          return;
        }
        const user = makeMockUser(email, email.split('@')[0]);
        this._user.set(user);
        this.persistSession(user);
        this._loading.set(false);
        this.router.navigate(['/dashboard']);
        observer.next({ error: null });
        observer.complete();
      }, 600);
    });
  }

  signUp(email: string, _password: string, fullName: string): Observable<{ error: null }> {
    this._loading.set(true);
    return new Observable((observer) => {
      setTimeout(() => {
        const user = makeMockUser(email, fullName);
        this._user.set(user);
        this.persistSession(user);
        this._loading.set(false);
        this.router.navigate(['/dashboard']);
        observer.next({ error: null });
        observer.complete();
      }, 600);
    });
  }

  signOut(): Observable<{ error: null }> {
    this._user.set(null);
    localStorage.removeItem(SESSION_KEY);
    this.router.navigate(['/auth/login']);
    return of({ error: null });
  }

  resetPassword(_email: string): Observable<{ error: null }> {
    return of({ error: null });
  }

  private restoreSession(): User | null {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  }

  private persistSession(user: User): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
}
