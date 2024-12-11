import { baseAPI } from "@services/base-api";
import { Profile } from "@services/tags";

const ProfileAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "user/get-profile",
        method: "GET",
      }),
      providesTags: [Profile],
    }),
    putUpdateProfile: builder.mutation({
      query: (payload) => ({
        url: "user/update-profile",
        method: "PUT",
        body: payload.body,
        params: payload.params,
      }),
      invalidatesTags: [Profile],
    }),
    postProfileImage: builder.mutation({
      query: (payload) => ({
        url: "/user/user-profile-img-upload",
        method: "POST",
        body: payload.body,
      }),
      invalidatesTags: [Profile],
    }),
    deleteProfileImage: builder.mutation({
      query: () => ({
        url: "/user/user-profile-img-delete",
        method: "DELETE",
      }),
      invalidatesTags: [Profile],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  usePutUpdateProfileMutation,
  useDeleteProfileImageMutation,
  usePostProfileImageMutation,
} = ProfileAPI;
