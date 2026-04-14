import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthServiceBase } from '@devboard/data-access-auth';

@Component({
  selector: 'db-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div
      class="flex min-h-screen items-center justify-center bg-[var(--color-surface-secondary)] px-4"
    >
      <div
        class="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm"
      >
        <h1 class="mb-2 text-2xl font-bold text-[var(--color-text)]">
          Welcome back
        </h1>
        <p class="mb-6 text-sm text-[var(--color-text-secondary)]">
          Sign in to your DevBoard account
        </p>

        @if (errorMessage()) {
          <div
            class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {{ errorMessage() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label
              for="email"
              class="mb-1 block text-sm font-medium text-[var(--color-text)]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              placeholder="you@example.com"
              autocomplete="email"
            />
            @if (form.controls.email.touched && form.controls.email.hasError('required')) {
              <p class="mt-1 text-xs text-red-500">Email is required</p>
            }
          </div>

          <div>
            <label
              for="password"
              class="mb-1 block text-sm font-medium text-[var(--color-text)]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              placeholder="••••••••"
              autocomplete="current-password"
            />
            @if (form.controls.password.touched && form.controls.password.hasError('required')) {
              <p class="mt-1 text-xs text-red-500">Password is required</p>
            }
          </div>

          <button
            type="submit"
            [disabled]="form.invalid || authService.isLoading()"
            class="w-full rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ authService.isLoading() ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <p class="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
          Don't have an account?
          <a routerLink="/auth/signup" class="text-[var(--color-primary)] hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  protected authService = inject(AuthServiceBase);

  errorMessage = signal<string | null>(null);

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.errorMessage.set(null);

    const { email, password } = this.form.getRawValue();
    this.authService.signIn(email, password).subscribe(({ error }) => {
      if (error) this.errorMessage.set(error.message);
    });
  }
}
