# CLAUDE.md — DevBoard Project Instructions

## Project Overview

**DevBoard** is a real-time team workspace and project tracker — a simplified Jira-meets-Notion built to showcase senior-level Angular expertise. This is a portfolio flagship project for a Senior Frontend Developer with 7+ years of experience specializing in Angular, TypeScript, and enterprise-scale frontend architecture.

The goal is NOT a tutorial project. Every feature should feel production-grade, well-architected, and demonstrate real-world patterns used in enterprise Angular applications.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Angular (LTS) | 20.x |
| Language | TypeScript | Compatible with Angular 20 |
| Monorepo | Nx | Latest |
| State Management | NgRx SignalStore | Latest |
| Styling | TailwindCSS | 4.x |
| UI Components | Angular CDK (drag-and-drop, virtual scroll, overlays) | Match Angular 20 |
| Backend | Supabase (Auth, Realtime DB, Storage) | Latest |
| AI Integration | Anthropic Claude API (claude-sonnet-4-20250514) | Latest |
| Testing | Jest (unit), Playwright (e2e) | Latest |
| CI/CD | GitHub Actions | N/A |
| Deployment | Vercel or Azure Static Web Apps | N/A |
| Package Manager | pnpm | Latest |

---

## Project Architecture

### Nx Monorepo Structure

```
devboard/
├── apps/
│   └── devboard/                    # Main Angular application
│       ├── src/
│       │   ├── app/
│       │   │   ├── app.component.ts
│       │   │   ├── app.config.ts
│       │   │   ├── app.routes.ts
│       │   │   └── core/             # Singleton services, guards, interceptors
│       │   │       ├── auth/
│       │   │       │   ├── guards/
│       │   │       │   ├── interceptors/
│       │   │       │   └── services/
│       │   │       ├── layout/       # Shell, sidebar, header components
│       │   │       └── services/     # Global services (theme, notification, etc.)
│       │   ├── environments/
│       │   └── styles/
│       └── project.json
├── libs/
│   ├── shared/
│   │   ├── ui/                       # Reusable UI components (buttons, modals, cards, avatars)
│   │   ├── models/                   # Interfaces, types, enums
│   │   ├── utils/                    # Pure utility functions, custom RxJS operators
│   │   └── pipes/                    # Shared pipes (date, truncate, highlight, etc.)
│   ├── features/
│   │   ├── dashboard/                # Dashboard feature (widgets, summary cards)
│   │   ├── projects/                 # Project CRUD, project detail views
│   │   ├── board/                    # Kanban board with drag-and-drop
│   │   ├── tasks/                    # Task detail, comments, activity log
│   │   ├── ai-assistant/             # Claude API integration features
│   │   ├── team/                     # Team members, roles, invitations
│   │   └── settings/                 # User settings, theme, notifications
│   └── data-access/
│       ├── auth/                     # Auth state, Supabase auth service
│       ├── projects/                 # Project state (NgRx SignalStore)
│       ├── tasks/                    # Task state (NgRx SignalStore)
│       ├── team/                     # Team state
│       └── ai/                       # Claude API service layer
├── tools/                            # Custom Nx generators/executors if needed
├── nx.json
├── tsconfig.base.json
├── tailwind.config.ts
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, test, build on PR
│       └── deploy.yml                # Deploy on merge to main
├── CLAUDE.md                         # This file
└── README.md                         # Project showcase README
```

### Key Architecture Decisions

1. **Standalone Components ONLY** — No NgModules. Every component, directive, and pipe is standalone.
2. **Signals-first** — Use Angular Signals as primary reactive primitive. RxJS for async streams (HTTP, WebSocket, complex event chains). Do NOT mix unnecessarily.
3. **OnPush Change Detection** — Every component uses `changeDetection: ChangeDetectionStrategy.OnPush`.
4. **New Control Flow** — Use `@if`, `@for`, `@switch`, `@defer` — NOT `*ngIf`, `*ngFor`, `*ngSwitch`.
5. **Lazy Loading** — All feature routes are lazy loaded using `loadChildren` or `loadComponent`.
6. **Smart/Dumb Component Pattern** — Container (smart) components handle state and logic. Presentational (dumb) components receive data via `input()` and emit via `output()`. Use the new signal-based `input()` and `output()` functions, NOT decorators.
7. **NgRx SignalStore** — For complex state management (projects, tasks). Use `signalStore`, `withState`, `withComputed`, `withMethods`, `patchState`. Keep stores in `libs/data-access/`.
8. **Typed Reactive Forms** — All forms use typed `FormGroup`, `FormControl` with strict typing.
9. **Custom RxJS Operators** — Create reusable operators in `libs/shared/utils/` for patterns like debounced search, retry with backoff, polling, etc.
10. **Error Handling** — Global error handler + HTTP interceptor for centralized error management.

---

## Angular Patterns to Demonstrate

These must be naturally integrated into features, NOT forced or artificial:

- **Signals**: Component state, computed values, effects for side-effects
- **RxJS**: HTTP calls with switchMap, debounceTime for search, combineLatest for filters, shareReplay for caching, takeUntilDestroyed for cleanup
- **Custom RxJS Operators**: At least 2-3 reusable operators (e.g., `retryWithBackoff`, `filterNil`, `debounceSearch`)
- **Route Guards**: `canActivate` (auth), `canDeactivate` (unsaved changes), `canMatch` (role-based)
- **HTTP Interceptors**: Auth token injection, error handling, loading state
- **Content Projection**: `ng-content` with select, `@ContentChild`/`@ContentChildren`
- **Dynamic Components**: At least one use of dynamic component loading
- **Virtual Scrolling**: For large task lists using Angular CDK `cdk-virtual-scroll-viewport`
- **Drag and Drop**: Kanban board using Angular CDK `cdkDrag`, `cdkDropList`
- **Custom Directives**: At least 2 (e.g., click-outside, auto-focus, permission-based visibility)
- **Custom Pipes**: At least 3 (e.g., relative-time, truncate, highlight-search)
- **Preloading Strategy**: Custom preloading strategy for feature modules
- **Animations**: Angular animations for route transitions, panel open/close
- **Responsive Design**: Mobile-first with Tailwind breakpoints
- **Dark/Light Theme**: CSS custom properties toggled via service + Signal
- **PWA**: Service worker for offline capability
- **i18n-ready**: Structure should support future internationalization

---

## Development Phases

### Phase 1: Foundation (Start Here)

**Goal**: Working app shell with auth, navigation, and project CRUD.

1. Initialize Nx workspace with Angular 20, TailwindCSS, pnpm
2. Set up Supabase project (auth, database tables, RLS policies)
3. Build core layout — sidebar navigation, header with user menu, responsive shell
4. Auth flow — signup, login, logout, password reset, route guards
5. HTTP interceptor for Supabase auth token
6. Dashboard page — summary widgets (total projects, active tasks, team members)
7. Projects feature — list, create, edit, delete projects with reactive forms
8. Global error handler and notification/toast service

**Key Angular concepts**: Standalone components, Signals, OnPush, lazy loading, route guards, interceptors, typed reactive forms, Signal-based inputs/outputs.

### Phase 2: Kanban Board & Task Management

**Goal**: Full task management with Kanban board, real-time updates.

1. Kanban board with columns (To Do, In Progress, Review, Done)
2. Drag-and-drop tasks between columns using CDK
3. Task detail panel (slide-in panel with animations)
4. Task comments and activity log
5. Real-time updates via Supabase Realtime subscriptions
6. Virtual scrolling for task lists
7. Debounced search/filter across tasks
8. Bulk task operations

**Key Angular concepts**: CDK drag-and-drop, virtual scrolling, RxJS streams, custom RxJS operators, Angular animations, content projection, dynamic components.

### Phase 3: AI Integration (Differentiator)

**Goal**: Claude API-powered features that add genuine value.

1. **AI Task Extractor**: Paste meeting notes or text → Claude extracts structured tasks with titles, descriptions, priorities, and assignees → User reviews and bulk-creates tasks
2. **Sprint Summary Generator**: Select a date range → Claude analyzes completed tasks and generates a sprint summary report
3. **Smart Search**: Natural language search across projects and tasks (e.g., "show me overdue tasks assigned to me about the payment feature")
4. **AI Chat Panel**: Contextual AI assistant that understands the current project/board state

**Implementation**:
- Create a dedicated Angular service in `libs/data-access/ai/` that wraps Claude API calls
- Use a lightweight backend proxy (Supabase Edge Function) to keep API key server-side
- Stream responses using RxJS Observables for real-time UI updates
- Store AI interactions in Supabase for history

### Phase 4: Polish & Production Readiness

**Goal**: Portfolio-ready quality.

1. Comprehensive unit tests (80%+ coverage for services and stores)
2. E2E tests for critical flows (auth, create project, move task, AI extraction)
3. Performance optimization — bundle analysis, tree-shaking verification, image optimization
4. Lighthouse audit — aim for 90+ on all scores
5. Custom preloading strategy for route modules
6. PWA setup with service worker
7. README with screenshots, architecture diagrams, feature walkthrough, live demo link
8. GitHub Actions CI/CD pipeline (lint → test → build → deploy)

---

## Coding Conventions

### File Naming
- Components: `task-card.component.ts`
- Services: `project.service.ts`
- Stores: `project.store.ts`
- Guards: `auth.guard.ts`
- Interceptors: `auth.interceptor.ts`
- Pipes: `relative-time.pipe.ts`
- Directives: `click-outside.directive.ts`
- Models: `project.model.ts`
- Utils: `rxjs-operators.util.ts`

### Component Structure
```typescript
@Component({
  selector: 'db-task-card',
  standalone: true,
  imports: [/* only what's needed */],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  // Signal-based inputs
  task = input.required<Task>();
  isDraggable = input(true);

  // Signal-based outputs
  taskClicked = output<Task>();
  statusChanged = output<{ taskId: string; status: TaskStatus }>();

  // Computed signals
  isOverdue = computed(() => isPast(this.task().dueDate));
  priorityColor = computed(() => getPriorityColor(this.task().priority));

  // Injected services
  private taskService = inject(TaskService);
}
```

### Component Prefix
- All components use prefix `db-` (DevBoard)

### State Management Pattern
```typescript
// Use NgRx SignalStore
export const ProjectStore = signalStore(
  { providedIn: 'root' },
  withState<ProjectState>(initialState),
  withComputed(({ projects, selectedProjectId }) => ({
    selectedProject: computed(() =>
      projects().find(p => p.id === selectedProjectId())
    ),
    projectCount: computed(() => projects().length),
  })),
  withMethods((store, projectService = inject(ProjectService)) => ({
    async loadProjects() {
      patchState(store, { loading: true });
      const projects = await firstValueFrom(projectService.getAll());
      patchState(store, { projects, loading: false });
    },
  })),
);
```

### Commit Messages
Follow Conventional Commits:
- `feat(board): add drag-and-drop task reordering`
- `fix(auth): handle token refresh on 401`
- `refactor(projects): migrate to signal-based inputs`
- `test(tasks): add unit tests for task store`
- `docs: update README with architecture diagram`
- `chore: update Angular to 20.x.x`

### Branch Strategy
- `main` — production, auto-deploys
- `develop` — integration branch
- `feat/*` — feature branches
- `fix/*` — bug fix branches

---

## Supabase Database Schema

```sql
-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users primary key,
  full_name text not null,
  avatar_url text,
  role text default 'member' check (role in ('admin', 'member', 'viewer')),
  created_at timestamptz default now()
);

-- Projects
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  owner_id uuid references public.profiles(id) not null,
  status text default 'active' check (status in ('active', 'archived', 'completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Board Columns
create table public.board_columns (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  name text not null,
  position integer not null,
  color text default '#6366f1'
);

-- Tasks
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  column_id uuid references public.board_columns(id) on delete set null,
  title text not null,
  description text,
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  assignee_id uuid references public.profiles(id),
  reporter_id uuid references public.profiles(id) not null,
  due_date timestamptz,
  position integer not null default 0,
  labels text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Task Comments
create table public.task_comments (
  id uuid default gen_random_uuid() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  author_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamptz default now()
);

-- Activity Log
create table public.activity_log (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  user_id uuid references public.profiles(id) not null,
  action text not null,
  details jsonb,
  created_at timestamptz default now()
);

-- AI Interactions (for history)
create table public.ai_interactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  project_id uuid references public.projects(id),
  interaction_type text not null check (interaction_type in ('task_extraction', 'sprint_summary', 'smart_search', 'chat')),
  input_text text not null,
  output_text text not null,
  created_at timestamptz default now()
);
```

---

## Environment Variables

```env
# .env (DO NOT commit)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
CLAUDE_API_KEY=your-claude-api-key  # Only used in Supabase Edge Functions, never in frontend
```

---

## Important Reminders for Claude Code

- ALWAYS use Angular 20 LTS APIs and patterns — do NOT use deprecated module-based patterns
- ALWAYS use standalone components — no NgModules
- ALWAYS use signal-based `input()`, `output()`, `model()` — NOT `@Input()`, `@Output()` decorators
- ALWAYS use new control flow (`@if`, `@for`, `@switch`, `@defer`) — NOT structural directives
- ALWAYS use `inject()` function — NOT constructor injection
- ALWAYS use `ChangeDetectionStrategy.OnPush`
- ALWAYS use `takeUntilDestroyed()` for RxJS subscription cleanup in components
- PREFER Signals over BehaviorSubject for component state
- PREFER computed signals over RxJS for derived state
- Keep components small and focused — extract logic into services
- Every new file must follow the naming conventions above
- Run `nx lint devboard` and `nx test devboard` before considering any feature complete
- Write meaningful commit messages following Conventional Commits
