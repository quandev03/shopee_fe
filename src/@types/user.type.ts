type Role = 'Admin' | 'User';

export interface User {
  roles: Role[];
  _id: string;
  email: string;
  name?: string;
  date_of_birth?: string;
  address?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
