import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import type { User } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
}

export abstract class AuthServiceBase {
  abstract readonly user: Signal<User | null>;
  abstract readonly isLoading: Signal<boolean>;
  abstract readonly isAuthenticated: Signal<boolean>;
  abstract readonly isInitialized: Signal<boolean>;

  abstract signIn(
    email: string,
    password: string,
  ): Observable<{ error: AuthError | null }>;

  abstract signUp(
    email: string,
    password: string,
    fullName: string,
  ): Observable<{ error: AuthError | null }>;

  abstract signOut(): Observable<{ error: AuthError | null }>;

  abstract resetPassword(
    email: string,
  ): Observable<{ error: AuthError | null }>;
}
