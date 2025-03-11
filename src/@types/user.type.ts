type Role = "Admin" | "User";

export interface User {
  id: string | undefined;
  username: string;
  roles: Role[];
  avatar?: string;
}
