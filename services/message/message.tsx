import { baseAPI } from "@services/base-api";

const messageAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    GetMessagesList: builder.query({
      query: ({ params }) => ({
        url: `message?chatId=${params?.chatId}&page=${params?.page}&limit=${params?.limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetMessagesListQuery } = messageAPI;