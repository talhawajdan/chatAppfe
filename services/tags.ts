export const USERS = "USERS";
export const Profile = "PROFILE";
export const SEARCH = "SEARCH";
export const REQUEST= "REQUEST";
export const CONTACTS= "CONTACTS";
export const CHATS = "CHATS";
export const TAGS = [USERS, Profile, SEARCH, REQUEST, CONTACTS, CHATS];

export const generateTags = (result: any, TAG: string) => {
  return result
    ? [
        ...result.map(({ _id }: any) => ({
          type: TAG,
          id: _id,
        })),
        { type: TAG, id: "LIST" },
      ]
    : [{ type: TAG, id: "LIST" }];
};

export const generateSingleTag = (result: any, TAG: string) => {
  return result
    ? [
        {
          type: TAG,
          id: result._id,
        },
      ]
    : [{ type: TAG, id: "LIST" }];
};
