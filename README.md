# DevBoard

A real-time team workspace and project tracker built with Angular 21, NgRx SignalStore, TailwindCSS 4, and Supabase.

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20.x or 22.x |
| pnpm | 10.x (`npm install -g pnpm`) |

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **SQL Editor**, run the schema below to create all required tables.
3. Go to **Settings → API** and copy your **Project URL** and **anon public** key.

<details>
<summary>Database schema SQL</summary>

```sql
create table public.profiles (
  id uuid references auth.users primary key,
  full_name text not null,
  avatar_url text,
  role text default 'member' check (role in ('admin', 'member', 'viewer')),
  created_at timestamptz default now()
);

create table public.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  owner_id uuid references public.profiles(id) not null,
  status text default 'active' check (status in ('active', 'archived', 'completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.board_columns (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  name text not null,
  position integer not null,
  color text default '#6366f1'
);

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

create table public.task_comments (
  id uuid default gen_random_uuid() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  author_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamptz default now()
);

create table public.activity_log (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  user_id uuid references public.profiles(id) not null,
  action text not null,
  details jsonb,
  created_at timestamptz default now()
);

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

</details>

### 3. Configure environment

Open `apps/devboard/src/environments/environment.ts` and fill in your credentials:

```ts
export const environment = {
  production: false,
  supabaseUrl: 'https://your-project-ref.supabase.co',
  supabaseAnonKey: 'your-anon-public-key',
};
```

> The anon key is safe to use in the frontend. Never put the Supabase **service role** key here.

### 4. Run the dev server

```bash
pnpm nx serve devboard
```

Open [http://localhost:4200](http://localhost:4200). You'll be taken to the login page — sign up for an account to get started.

## Common commands

```bash
# Serve
pnpm nx serve devboard

# Production build
pnpm nx build devboard

# Lint
pnpm nx lint devboard

# Unit tests
pnpm nx test devboard

# Run a single test file
pnpm nx test devboard --testFile=apps/devboard/src/app/app.spec.ts

# E2E tests
pnpm nx e2e devboard-e2e

# Generate a new library
pnpm nx g @nx/angular:library --name=<name> --directory=libs/<path>

# Generate a new component
pnpm nx g @nx/angular:component --name=<name> --project=devboard
```

## Project structure

```
apps/
  devboard/               # Main Angular application
libs/
  data-access/
    auth/                 # Supabase auth service, AuthService, SupabaseService
    projects/             # ProjectStore (NgRx SignalStore), ProjectService
  shared/
    models/               # Shared TypeScript interfaces (Project, Task, Profile)
```
