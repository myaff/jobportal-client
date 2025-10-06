export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}

export interface UserDto {
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  role: keyof typeof UserRole;
  description: string | null;
}

export interface PasswordCreate {
  password: string;
  repeatPassword: string;
}

export interface AuthFormData {
  email: string;
  password: string;
}

export interface TokenDTO {
  token: string;
  expiresIn: number;
}

export interface AuthResponseData {
  access_token: TokenDTO;
  refresh_token: TokenDTO;
}

export type UserCreateFormData = Pick<UserDto, 'email' | 'firstName' | 'middleName' | 'lastName'> & PasswordCreate;

export type UserEditFormData = Partial<Pick<UserDto, 'firstName' | 'middleName' | 'lastName' | 'email' | 'description'>>

export class User implements UserDto {
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null | undefined;
  role: "USER" | "ADMIN" | "MANAGER";
  description: string;

  get fullName() {
    const parts = [this.firstName];
    if (this.middleName) parts.push(this.middleName);
    parts.push(this.lastName);
    return parts.join(' ');
  }

  get abbreviation() {
    return (this.firstName.at(0) ?? '?') + (this.lastName.at(0) ?? '?');
  }

  constructor(data: UserDto) {
    this.email = data.email;
    this.firstName = data.firstName ?? '';
    this.lastName = data.lastName ?? '';
    this.middleName = data.middleName ?? '';
    this.role = data.role;
    this.description = data?.description ?? '';
  }

  toString() {
    return this.fullName;
  }

  toPlainObject() {
    return {
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
    }
  }

  toJSON() {
    return JSON.stringify(this.toPlainObject());
  }

  static isValid(data: UserDto): data is UserDto {
    return !!data?.email;
  }
}