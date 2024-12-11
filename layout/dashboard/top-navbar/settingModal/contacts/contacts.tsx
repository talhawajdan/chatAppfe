import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  Pagination,
  PaginationItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import { useState } from "react";
import { NoContent } from "@assets/common";
import {
  useDeleteContactMutation,
  useGetSettingsContactsQuery,
} from "@services/settings/constacts";
import { IsFetching } from "@components/table-components";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { WarningPrompt } from "@components/warning-prompt";

function Contacts() {
  const [params, setParams] = useState({
    search: "",
    page: 1,
    limit: 10,
  });
  const { data, isLoading, isFetching } = useGetSettingsContactsQuery({
    params,
  });

  const debouncedSetSearch = debounce(
    (value) => setParams((prv) => ({ ...prv, search: value })),
    500
  );
  const theme = useTheme();
  return (
    <Stack spacing={2}>
      <Typography variant="body1" fontWeight="bold" color="initial">
        Contacts
      </Typography>
      <TextField
        size="small"
        sx={{
          maxWidth: 300,
        }}
        onChange={(e) => debouncedSetSearch(e.target.value)}
        variant="outlined"
        placeholder="Search user"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
      <Stack
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
        width={"100%"}
        gap={1}
      >
        <Typography variant="subtitle1" color="neutral.400">
          {data?.data?.meta?.total} results
        </Typography>

        {isLoading || isFetching ? (
          <Box>
            <IsFetching isFetching />
          </Box>
        ) : data?.data?.friends && data?.data?.friends.length > 0 ? (
          <Box
            height={220}
            width={"100%"}
            sx={{
              overflowY: "scroll",
              "&::-webkit-scrollbar": {
                width: "0.4em",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: theme.palette.primary.main,
                borderRadius: 2,
              },
            }}
          >
            {data?.data?.friends?.map((item: any) => (
              <UserList key={item?._id} {...item} />
            ))}
          </Box>
        ) : (
          <Box display={"flex"} justifyContent={"center"} width={"100%"}>
            <NoContent sx={{ fontSize: 180, opacity: 0.6 }} />
          </Box>
        )}
        <Box ml={"auto"}>
          <Pagination
            sx={{
              ".Mui-selected": {
                backgroundColor: `${theme.palette.primary.main} !important`,
                color: "#FFFFFF !important",
              },
            }}
            renderItem={(item: any) => (
              <PaginationItem
                slots={{
                  previous: () => <>Previous</>,
                  next: () => <>Next</>,
                }}
                {...item}
              />
            )}
            size="small"
            variant="outlined"
            shape="rounded"
            count={Number(data?.data?.meta?.totalPages) ?? 1}
            page={Number(data?.data?.meta?.page) ?? 1}
            onChange={(e, page) => {
              setParams((prv) => ({ ...prv, page }));
            }}
            color="primary"
          />
        </Box>
      </Stack>
    </Stack>
  );
}

export default Contacts;

const UserList = ({ firstName, lastName, avatar, email, _id }: any) => {
  const [DeleteContact, { isLoading }] = useDeleteContactMutation();
  const deleteContact = async () => {
    try {
      const { successMessage } = await DeleteContact({
        params: {
          contactId: _id,
        },
      }).unwrap();
      toast.success(successMessage ?? "User removed successfully");
    } catch (error: any) {
      toast.error(
        error?.data?.errorMessage?.message ?? "Failed to remove user"
      );
    }
  };
  return (
    <Stack
      flexDirection={"row"}
      gap={1}
      justifyContent={"space-between"}
      alignItems={"center"}
      width={"100%"}
      mb={1}
    >
      {avatar ? (
        <Avatar
          src={avatar?.url}
          alt={firstName.charAt(0).toUpperCase()}
          variant="circular"
          sx={{ width: 40, height: 40 }}
        />
      ) : (
        <Avatar variant="circular" sx={{ width: 40, height: 40 }}>
          {firstName.charAt(0).toUpperCase()}
        </Avatar>
      )}

      <Stack mr={"auto"}>
        <Typography variant="body1" color="initial" mr={"auto"}>
          {firstName} {lastName}
        </Typography>
        <Typography variant="subtitle2" color="initial" mr={"auto"}>
          {email}
        </Typography>
      </Stack>
      <WarningPrompt
        mainColor="error.main"
        heading="Alert"
        subTitle="Are you sure you want to remove this user as friend?"
        modelOpenLabel={
          <Tooltip title={"Remove Friend "}>
            <LoadingButton loading={isLoading} variant="text">
              <PersonRemoveIcon sx={{ color: "error.main" }} />
            </LoadingButton>
          </Tooltip>
        }
        acceptButtonLabel="Yes,sure!"
        acceptButtonProps={{
          onClick: deleteContact,
        }}
      />
    </Stack>
  );
};
