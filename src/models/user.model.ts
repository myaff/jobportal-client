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

export default class User implements UserDto {
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null | undefined;
  role: "USER" | "ADMIN" | "MANAGER";

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
  }

  toString() {
    return this.fullName;
  }

  toJSON() {
    return JSON.stringify({
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
    });
  }
}