import { baseAPI } from "@services/base-api";
import { REQUEST, SEARCH, CONTACTS } from "@services/tags";

const RequestAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    GetNotification: builder.query({
      query: (payload) => ({
        url: "/notification/get-notifications",
        method: "GET",
        params: payload.params,
      }),
      providesTags: [REQUEST],
    }),
    postCreateRequest: builder.mutation({
      query: (payload) => ({
        url: "/request/create",
        method: "POST",
        body: payload.body,
        params: payload.params,
      }),
      invalidatesTags: [REQUEST, SEARCH, CONTACTS],
    }),
    postAcceptRequest: builder.mutation({
      query: (payload) => ({
        url: "/request/accept",
        method: "POST",
        body: payload.body,
        params: payload.params,
      }),
      invalidatesTags: [REQUEST, SEARCH, CONTACTS],
    }),
  }),
});
export const { usePostCreateRequestMutation, useGetNotificationQuery,usePostAcceptRequestMutation } = RequestAPI;