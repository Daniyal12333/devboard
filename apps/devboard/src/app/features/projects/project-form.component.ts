import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import type { Project, ProjectStatus } from '@devboard/shared-models';

export interface ProjectFormValue {
  name: string;
  description: string;
  status: ProjectStatus;
}

@Component({
  selector: 'db-project-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
      <div>
        <label
          for="name"
          class="mb-1 block text-sm font-medium text-[var(--color-text)]"
        >
          Project name <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          formControlName="name"
          class="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
          placeholder="My awesome project"
        />
        @if (form.controls.name.touched && form.controls.name.hasError('required')) {
          <p class="mt-1 text-xs text-red-500">Name is required</p>
        }
      </div>

      <div>
        <label
          for="description"
          class="mb-1 block text-sm font-medium text-[var(--color-text)]"
        >
          Description
        </label>
        <textarea
          id="description"
          formControlName="description"
          rows="3"
          class="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
          placeholder="What is this project about?"
        ></textarea>
      </div>

      <div>
        <label
          for="status"
          class="mb-1 block text-sm font-medium text-[var(--color-text)]"
        >
          Status
        </label>
        <select
          id="status"
          formControlName="status"
          class="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button
          type="button"
          (click)="formCancel.emit()"
          class="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          [disabled]="form.invalid || isSubmitting()"
          class="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ isSubmitting() ? 'Saving...' : project() ? 'Update' : 'Create' }}
        </button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFormComponent implements OnInit {
  project = input<Project | null>(null);
  isSubmitting = input(false);

  formSave = output<ProjectFormValue>();
  formCancel = output<void>();

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    description: new FormControl('', { nonNullable: true }),
    status: new FormControl<ProjectStatus>('active', { nonNullable: true }),
  });

  ngOnInit(): void {
    const p = this.project();
    if (p) {
      this.form.patchValue({
        name: p.name,
        description: p.description ?? '',
        status: p.status,
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.formSave.emit(this.form.getRawValue());
  }
}
