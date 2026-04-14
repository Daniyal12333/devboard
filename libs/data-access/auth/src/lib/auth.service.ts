import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import type { User, AuthError } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { from, Observable } from 'rxjs';

export interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  private state = signal<AuthState>({
    user: null,
    loading: false,
    initialized: false,
  });

  user = computed(() => this.state().user);
  isLoading = computed(() => this.state().loading);
  isAuthenticated = computed(() => !!this.state().user);
  isInitialized = computed(() => this.state().initialized);

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    const { data } = await this.supabase.client.auth.getSession();
    this.state.update((s) => ({
      ...s,
      user: data.session?.user ?? null,
      initialized: true,
    }));

    this.supabase.client.auth.onAuthStateChange((_event, session) => {
      this.state.update((s) => ({
        ...s,
        user: session?.user ?? null,
      }));
    });
  }

  signIn(email: string, password: string): Observable<{ error: AuthError | null }> {
    this.state.update((s) => ({ ...s, loading: true }));
    return from(
      this.supabase.client.auth
        .signInWithPassword({ email, password })
        .then(({ error }) => {
          this.state.update((s) => ({ ...s, loading: false }));
          if (!error) this.router.navigate(['/dashboard']);
          return { error };
        }),
    );
  }

  signUp(email: string, password: string, fullName: string): Observable<{ error: AuthError | null }> {
    this.state.update((s) => ({ ...s, loading: true }));
    return from(
      this.supabase.client.auth
        .signUp({ email, password, options: { data: { full_name: fullName } } })
        .then(({ error }) => {
          this.state.update((s) => ({ ...s, loading: false }));
          return { error };
        }),
    );
  }

  signOut(): Observable<{ error: AuthError | null }> {
    return from(
      this.supabase.client.auth.signOut().then(({ error }) => {
        if (!error) this.router.navigate(['/auth/login']);
        return { error };
      }),
    );
  }

  resetPassword(email: string): Observable<{ error: AuthError | null }> {
    return from(
      this.supabase.client.auth
        .resetPasswordForEmail(email)
        .then(({ error }) => ({ error })),
    );
  }
}
