import { User, AuthFormData, AuthResponseData, TokenDTO, UserDto, UserEditFormData, } from "@/models/user.model";
import { ApiService } from "./api.service";
import { AxiosError } from "axios";
import { ReplyDto, UserReply } from "@/models/reply.model";

export default class UserService extends ApiService {
  resource = 'v1/user';
  login(formData: AuthFormData) {
    return UserService.api
      .post<AuthResponseData>(`auth/login`, formData)
      .then(res => {
        return {
          accessToken: this.transformToken(res.data.access_token),
          refreshToken: this.transformToken(res.data.refresh_token),
        }
      })
  }

  register(formData: AuthFormData) {
    return UserService.api
      .post<AuthResponseData>(`auth/register`, formData)
      .then(res => {
        return {
          accessToken: this.transformToken(res.data.access_token),
          refreshToken: this.transformToken(res.data.refresh_token),
        }
      })
  }

  refresh(token: string) {
    UserService.setAuthToken(token);
    return UserService.api
      .post<AuthResponseData>(`auth/refresh-token`)
      .then(res => {
        return {
          accessToken: this.transformToken(res.data.access_token),
          refreshToken: this.transformToken(res.data.refresh_token),
        }
      })
  }

  logout() {
    return UserService.api.post(`auth/logout`);
  }

  getProfile() {
    return UserService.api.get<UserDto>(`${this.resource}/profile`)
      .then(res => new User(res.data))
      .catch((error: AxiosError) => {
        throw { title: error.code, message: error.message };
      });
  }

  editProfile(formData: UserEditFormData) {
    return UserService.api
      .patch<UserDto>(`${this.resource}`, formData)
      .then(res => new User(res.data));
  }

  getReplies() {
    return UserService.api
      .get<ReplyDto[]>(`${this.resource}/replies`)
      .then(res => {
        return res.data
          .filter(item => UserReply.isValid(item))
          .map(item => new UserReply(item));
      });
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