import { UserReply } from "@/models/reply.model";
import type { AuthFormData, UserCreateFormData, UserEditFormData } from "@/models/user.model";
import { User, UserRole } from "@/models/user.model";
import UserService from "@/services/user.service";
import { useLocalStorage } from "@vueuse/core";
import { isBefore } from "date-fns";
import { defineStore } from "pinia";
import { computed, ref, type Ref } from 'vue';

interface Token {
  token: string;
  expiresAt: string;
}

const defaultTokenData = {
  token: '',
  expiresAt: '',
};

export const useUserStore = defineStore('user', () => {
  const accessToken = useLocalStorage('jp-accessToken', {...defaultTokenData});
  const refreshToken = useLocalStorage('jp-refreshToken', {...defaultTokenData});
  const user = ref<User | null>(null);
  const token = computed(() => accessToken.value.token);
  const isAuthorized = computed(() => !!token.value);
  const userService = new UserService();
  const replies = ref<UserReply[]>([]);
  const userRole = computed(() => user.value?.role ?? UserRole.ANON);

  const login = (formData: AuthFormData) => {
    return userService.login(formData).then(data => {
      accessToken.value = data.accessToken;
      refreshToken.value = data.refreshToken;
      UserService.setAuthToken(accessToken.value.token);
      getProfile();
    })
  }

  const register = (formData: UserCreateFormData) => {
    return userService.register(formData).then(data => {
      accessToken.value = data.accessToken;
      refreshToken.value = data.refreshToken;
      UserService.setAuthToken(accessToken.value.token);
      getProfile();
    })
  }

  const refresh = () => {
    UserService.removeAuthToken();
    return userService.refresh(refreshToken.value.token).then(data => {
      accessToken.value = data.accessToken;
      refreshToken.value = data.refreshToken;
      UserService.setAuthToken(data.accessToken.token);
      return Promise.resolve();
    });
  }

  const logout = () => {
    return userService.logout().then(() => {
      accessToken.value = defaultTokenData;
      refreshToken.value = defaultTokenData;
      user.value = null;
      UserService.removeAuthToken();
    });
  }

  const getProfile = () => {
    return userService
      .getProfile()
      .then(data => {
        user.value = data;
        return data;
      })
  }

  const editProfile = (payload: Omit<UserEditFormData, 'email'>) => {
    const formData = { ...payload, email: user.value?.email };
    return userService
      .editProfile(formData)
      .then(data => {
        user.value = data;
        return data;
      });
  }

  const getReplies = () => {
    return userService
      .getReplies()
      .then(data => {
        replies.value = data;
        return data;
      });
  }

  const checkIfExpired = (tokenData: Token) => {
    const isExp = isBefore(new Date(tokenData.expiresAt), new Date());
    return isExp;
  }

  const actualizeToken = (token: Ref<Token>) => {
    if (token.value.token && checkIfExpired(token.value)) {
      token.value = defaultTokenData;
    }
  }

  const init = async () => {
    actualizeToken(accessToken);
    actualizeToken(refreshToken);
    if (!accessToken.value.token && refreshToken.value.token) await refresh();
    if (accessToken.value.token) {
      UserService.setAuthToken(accessToken.value.token);
      if (!user.value) await getProfile();
    }
  }

  return {
    token,
    isAuthorized,
    user,
    userRole,
    replies,
    login,
    register,
    logout,
    init,
    getProfile,
    editProfile,
    getReplies,
  };
});