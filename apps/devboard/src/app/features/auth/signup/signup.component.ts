import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthServiceBase } from '@devboard/data-access-auth';

@Component({
  selector: 'db-signup',
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
          Create account
        </h1>
        <p class="mb-6 text-sm text-[var(--color-text-secondary)]">
          Start managing your projects with DevBoard
        </p>

        @if (successMessage()) {
          <div
            class="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          >
            {{ successMessage() }}
          </div>
        }

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
              for="fullName"
              class="mb-1 block text-sm font-medium text-[var(--color-text)]"
            >
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              formControlName="fullName"
              class="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              placeholder="Jane Doe"
              autocomplete="name"
            />
          </div>

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
              autocomplete="new-password"
            />
            @if (form.controls.password.touched && form.controls.password.hasError('minlength')) {
              <p class="mt-1 text-xs text-red-500">
                Password must be at least 8 characters
              </p>
            }
          </div>

          <button
            type="submit"
            [disabled]="form.invalid || authService.isLoading()"
            class="w-full rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ authService.isLoading() ? 'Creating account...' : 'Create account' }}
          </button>
        </form>

        <p class="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
          Already have an account?
          <a routerLink="/auth/login" class="text-[var(--color-primary)] hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  protected authService = inject(AuthServiceBase);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { email, password, fullName } = this.form.getRawValue();
    this.authService.signUp(email, password, fullName).subscribe(({ error }) => {
      if (error) {
        this.errorMessage.set(error.message);
      } else {
        this.successMessage.set(
          'Check your email for a confirmation link to activate your account.',
        );
        this.form.reset();
      }
    });
  }
}
