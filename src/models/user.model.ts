export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
}

export interface UserSignIn {
  email: string;
  password: string;
}

export type UserSignUp = UserSignIn & Omit<User, 'id'>;
