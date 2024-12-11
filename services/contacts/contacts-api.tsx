import { baseAPI } from "@services/base-api";
import { CONTACTS } from "@services/tags";

const ContactsListAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    GetContactsList: builder.query({
      query: (payload) => ({
        url: "/contacts",
        method: "GET",
        params: payload.params,
      }),
      providesTags: [CONTACTS],
    }),
  }),
});

export const {useGetContactsListQuery}= ContactsListAPI

