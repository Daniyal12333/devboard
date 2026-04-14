export type UserRole = 'admin' | 'member' | 'viewer';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}
