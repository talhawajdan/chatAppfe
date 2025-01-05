import { baseAPI } from "@services/base-api";
import { CHATS, CHATSSingle } from "@services/tags";

const chatAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    GetChatsList: builder.query({
      query: (payload) => ({
        url: "/chats",
        method: "GET",
        params: payload.params,
      }),
      providesTags: [CHATS],
    }),
    GetChatSingleList: builder.query({
      query: (payload) => ({
        url: "/chats/singleChat",
        method: "GET",
        params: payload.params,
      }),
      providesTags: [CHATS],
    }),
    postCreateChat: builder.mutation({
      query: (payload) => ({
        url: "/chats/create",
        method: "POST",
        body: payload.body,
        params: payload.params,
      }),
      invalidatesTags: [CHATS],
    }),
    deleteChat: builder.mutation({
      query: (payload) => ({
        url: "/chats/delete",
        method: "DELETE",
        body: payload.body,
        params: payload.params,
      }),
      invalidatesTags: [CHATS],
    }),
    CreateGroupChat: builder.mutation({
      query: (payload) => ({
        url: "/chats/groupChat",
        method: "POST",
        body: payload.body,
        params: payload.params,
      }),
      invalidatesTags: [CHATS],
    }),
    UpdateGroupChatName: builder.mutation({
      query: (payload) => ({
        url: "/chats/updateGroupChatName",
        method: "PATCH",
        body: payload.body,
        params: payload.params,
      }),
      invalidatesTags: [CHATSSingle, CHATS],
    }),
    UpdateGroupChatCreator: builder.mutation({
      query: (payload) => ({
        url: "/chats/updateGroupChatCreator",
        method: "PATCH",
        body: payload.body,
        params: payload.params,
      }),
      invalidatesTags: [CHATSSingle, CHATS],
    }),
    UpdateGroupChatMembers: builder.mutation({
      query: (payload) => ({
        url: "/chats/updateGroupChatMembers",
        method: "PATCH",
        body: payload.body,
        params: payload.params,
      }),
      invalidatesTags: [CHATSSingle, CHATS],
    }),
  }),
});

export const {
  useGetChatsListQuery,
  usePostCreateChatMutation,
  useDeleteChatMutation,
  useGetChatSingleListQuery,
  useCreateGroupChatMutation,
  useUpdateGroupChatNameMutation,
  useUpdateGroupChatCreatorMutation,
  useUpdateGroupChatMembersMutation,
} = chatAPI;
