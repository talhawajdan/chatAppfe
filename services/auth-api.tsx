import { baseAPI } from "./base-api";
import { USERS } from "@services/tags";

export const authAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation({
      query: (user: { id: string }) => ({
        url: "users/logout",
        method: "POST",
        body: user,
      }),
      invalidatesTags: [USERS],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/signin",
        method: "PUT",
        body: credentials,
      }),
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: "auth/change-password",
        method: "POST",
        body,
      }),
    }),
    authMe: builder.mutation({
      query: (body) => ({
        url: "auth/refresh-token",
        method: "PUT",
        body,
      }),
    }),
    signUp: builder.mutation({
      query: (payload) => ({
        url: "auth/signup",
        method: "POST",
        body: payload.body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    setNewPassword: builder.mutation({
      query: (body) => ({
        url: "auth/set-new-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "auth/confirm-forgot-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useAuthMeMutation,
  useLoginMutation,
  useSignUpMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation,
  useSetNewPasswordMutation,
  useResetPasswordMutation,
} = authAPI;
