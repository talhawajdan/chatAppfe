import { CustomModal } from "@components/custom-modal";
import { IsFetching } from "@components/table-components";
import AddIcon from "@mui/icons-material/Add";
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
import { useGetSearchUserApiQuery } from "@services/search/search-api";
import { debounce } from "lodash";
import { useState } from "react";
import { NoContent } from "@assets/common";
import { usePostCreateRequestMutation } from "@services/request/requestApi";
import { LoadingButton } from "@mui/lab";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

function SearchUserModal() {
  const [open, setOpen] = useState(false);
  const [params, setParams] = useState({
    search: "",
    page: 1,
    limit: 10,
  });
  const { data, isLoading, isFetching } = useGetSearchUserApiQuery({
    params,
  });

  const debouncedSetSearch = debounce(
    (value) => setParams((prv) => ({ ...prv, search: value })),
    500
  );
  const theme = useTheme();
  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <SearchIcon
          sx={{
            fontSize: 30,
            color: "#9A9A9A",
          }}
        />
      </IconButton>
      <CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        rootSx={{
          width: { xs: "95%", sm: "90%", md: 600 }, // Responsive width
          maxWidth: "100%",
        }}
        headerLabel={"Search user"}
        closeButtonProps={{ onClick: () => setOpen(false) }}
      >
        <Stack justifyContent={"center"} alignItems={"center"} gap={2}>
          <TextField
            fullWidth
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
            ) : data?.data?.users.length > 0 ? (
              <Box
                height={400}
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
                {data?.data?.users?.map((item: any) => (
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
      </CustomModal>
    </>
  );
}

export default SearchUserModal;

const UserList = ({
  firstName,
  lastName,
  avatar,
  email,
  _id,
  hasRequest,
}: any) => {
  const [CreateRequest, { isLoading }] = usePostCreateRequestMutation();
  const handleSendRequest = async () => {
    try {
      const { successMessage } = await CreateRequest({
        body: { receiverId: _id },
      }).unwrap();
      toast.success(successMessage ?? "success");
    } catch (error: any) {
      toast.error(
        error?.data?.errorMessage?.message ?? "Something went wrong!"
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

      <Tooltip
        title={hasRequest ? "Request already sent" : "Send Friend Request"}
      >
        <LoadingButton
          loading={isLoading}
          variant="text"
          {...(hasRequest
            ? {}
            : {
                onClick: handleSendRequest,
              })}
        >
          <AddIcon
            sx={{ color: hasRequest ? "neutral.300" : "primary.main" }}
          />
        </LoadingButton>
      </Tooltip>
    </Stack>
  );
};
