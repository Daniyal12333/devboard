import type { Project } from './project.model';
import type { Profile } from './profile.model';

export const MOCK_USER_ID = 'mock-user-001';

export const MOCK_PROFILE: Profile = {
  id: MOCK_USER_ID,
  full_name: 'Alex Morgan',
  avatar_url: null,
  role: 'admin',
  created_at: '2025-01-10T09:00:00.000Z',
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'DevBoard Platform',
    description: 'Real-time team workspace and project tracker. Flagship product.',
    owner_id: MOCK_USER_ID,
    status: 'active',
    created_at: '2025-01-15T10:00:00.000Z',
    updated_at: '2026-04-13T14:30:00.000Z',
  },
  {
    id: 'proj-002',
    name: 'Marketing Website Redesign',
    description: 'Full redesign of the public-facing marketing site with new brand guidelines.',
    owner_id: MOCK_USER_ID,
    status: 'active',
    created_at: '2025-02-01T08:00:00.000Z',
    updated_at: '2026-04-12T11:00:00.000Z',
  },
  {
    id: 'proj-003',
    name: 'Mobile App v2',
    description: 'Native mobile application for iOS and Android. Feature parity with web.',
    owner_id: MOCK_USER_ID,
    status: 'active',
    created_at: '2025-03-10T09:00:00.000Z',
    updated_at: '2026-04-10T16:45:00.000Z',
  },
  {
    id: 'proj-004',
    name: 'API Gateway Migration',
    description: 'Migrate from legacy REST endpoints to GraphQL federation.',
    owner_id: MOCK_USER_ID,
    status: 'completed',
    created_at: '2024-11-01T09:00:00.000Z',
    updated_at: '2026-03-28T12:00:00.000Z',
  },
  {
    id: 'proj-005',
    name: 'Design System',
    description: 'Shared component library and design tokens used across all products.',
    owner_id: MOCK_USER_ID,
    status: 'active',
    created_at: '2025-04-05T10:00:00.000Z',
    updated_at: '2026-04-11T09:20:00.000Z',
  },
  {
    id: 'proj-006',
    name: 'Legacy Dashboard Sunset',
    description: 'Decommission the old analytics dashboard after migration is complete.',
    owner_id: MOCK_USER_ID,
    status: 'archived',
    created_at: '2024-09-01T09:00:00.000Z',
    updated_at: '2026-02-14T10:00:00.000Z',
  },
];

export const MOCK_DASHBOARD_STATS = {
  totalProjects: MOCK_PROJECTS.length,
  activeTasks: 14,
  teamMembers: 6,
  completedTasks: 23,
};
