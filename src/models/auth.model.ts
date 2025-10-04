export interface AuthFormData {
  username: string;
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