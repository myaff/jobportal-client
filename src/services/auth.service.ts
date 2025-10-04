import type { AuthFormData, AuthResponseData, TokenDTO } from "@/models/auth.model";
import { ApiService } from "./api.service";

export default class AuthService extends ApiService {
  resource = 'auth'

  login(formData: AuthFormData) {
    return AuthService.api
      .post<AuthResponseData>(`${this.resource}/login`, formData)
      .then(res => {
        return {
          accessToken: this.transformToken(res.data.access_token),
          refreshToken: this.transformToken(res.data.refresh_token),
        }
      })
  }

  register(formData: AuthFormData) {
    return AuthService.api
      .post<AuthResponseData>(`${this.resource}/register`, formData)
      .then(res => {
        return {
          accessToken: this.transformToken(res.data.access_token),
          refreshToken: this.transformToken(res.data.refresh_token),
        }
      })
  }

  refresh(token: string) {
    AuthService.setAuthToken(token);
    return AuthService.api
      .post<AuthResponseData>(`${this.resource}/refresh-token`)
      .then(res => {
        return {
          accessToken: this.transformToken(res.data.access_token),
          refreshToken: this.transformToken(res.data.refresh_token),
        }
      })
  }

  logout() {
    return AuthService.api.post(`${this.resource}/logout`);
  }

  transformToken(tokenData: TokenDTO) {
    const min = 60 * 1000;
    const expiresAt = Date.now() + tokenData.expiresIn - (10 * min);
    return {
      token: tokenData.token,
      expiresAt: new Date(expiresAt).toISOString(),
    }
  }
}