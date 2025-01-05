import { baseAPI } from "@services/base-api";

const ContactsListAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    GetContactsList: builder.query({
      query: (payload) => ({
        url: "/contacts",
        method: "GET",
        params: payload.params,
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetContactsListQuery, useLazyGetContactsListQuery } =
  ContactsListAPI;
