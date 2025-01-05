import React, { useState } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { CustomModal } from "@components/custom-modal";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormProvider,
  RHFAutocompleteAsync,
  RHFTextField,
} from "@components/rhf";
import { useLazyGetContactsListQuery } from "@services/contacts/contacts-api";
import { LoadingButton } from "@mui/lab";
import { useCreateGroupChatMutation } from "@services/chats/chat-api";
import toast from "react-hot-toast";
const FormSchema = Yup.object().shape({
  name: Yup.string().required("FirstName is required"),
  members: Yup.mixed().required("LastName is required"),
});

function CreateGroupModal() {
  const [open, setOpen] = useState(false);
  const methods = useForm<any>({
    defaultValues: {
      name: "",
      members: [],
    },
    resolver: yupResolver(FormSchema),
  });
  const { handleSubmit } = methods;
  const listOfContacts = useLazyGetContactsListQuery();
  const [CreateGroupChat, { isLoading }] = useCreateGroupChatMutation();
  const onSubmit = async (data: any) => {
    const payload = {
      name: data.name,
      members: data.members.map((item: any) => item._id),
    };
    try {
      const { successMessage } = await CreateGroupChat({
        body: payload,
      }).unwrap();
      toast.success(successMessage ?? "success");
      setOpen(false);
    } catch (error: any) {
      toast.error(
        error?.data?.errorMessage?.message ?? "Something went wrong!"
      );
      setOpen(false);
    }
  };
  return (
    <>
      <Tooltip title="Create Group Chat">
        <IconButton sx={{ ml: "auto" }} onClick={() => setOpen(true)}>
          <GroupsIcon />
        </IconButton>
      </Tooltip>
      <CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        rootSx={{
          width: { xs: "95%", sm: "90%", md: 600 }, // Responsive width
          maxWidth: "100%",
        }}
        headerLabel="Create Group"
        closeButtonProps={{ onClick: () => setOpen(false) }}
      >
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
            width="100%"
            mt={1}
          >
            <RHFTextField
              type="text"
              label="Group Name"
              fullWidth
              name="name"
              placeholder="Enter Group Name Here"
            />
            <RHFAutocompleteAsync
              label="Members"
              name="members"
              placeholder="Select Group Members"
              apiQuery={listOfContacts}
              multiple
              getOptionLabel={(option: any) => option.email}
              transformResponse={(data: any) => data?.data?.friends}
              renderOption={(props: any, option: any) => {
                return (
                  <li {...props} key={option._id}>
                    <Box>
                      <Typography variant="subtitle1">
                        {option?.firstName ?? "-"} {option?.lastName ?? "-"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option?.email ?? "-"}
                      </Typography>
                    </Box>
                  </li>
                );
              }}
            />
            <Box mt={1} ml="auto">
              <LoadingButton
                loading={isLoading}
                variant="contained"
                type="submit"
              >
                Create Group
              </LoadingButton>
            </Box>
          </Stack>
        </FormProvider>
      </CustomModal>
    </>
  );
}

export default CreateGroupModal;
