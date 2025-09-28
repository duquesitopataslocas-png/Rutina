export type UserRole = 'coach' | 'client';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
}
