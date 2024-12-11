import { baseAPI } from "@services/base-api";
import { SEARCH } from "@services/tags";

const searchAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getSearchUserApi: builder.query({
      query: (payload) => ({
        url: "/user/search",
        method: "GET",
        params: payload?.params,
      }),
      providesTags: [SEARCH],
    }),
  }),
});

export const { useGetSearchUserApiQuery } = searchAPI;
