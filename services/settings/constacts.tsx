import { baseAPI } from "@services/base-api";
import { CONTACTS } from "@services/tags";

const ContactsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    GetSettingsContacts: builder.query({
      query: (payload) => ({
        url: "/settings/contacts",
        method: "GET",
        params: payload.params,
      }),
      providesTags: [CONTACTS],
    }),
    deleteContact: builder.mutation({
      query: (payload) => ({
        url: `/settings/contact`,
        method: "DELETE",
        params: payload.params,
      }),
      invalidatesTags: [CONTACTS],
    }),

  }),
});

export const { useGetSettingsContactsQuery, useDeleteContactMutation } = ContactsAPI