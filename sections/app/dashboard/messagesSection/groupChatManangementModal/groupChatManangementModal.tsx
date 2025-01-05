import { CustomModal } from "@components/custom-modal";
import {
  FormProvider,
  RHFAutocompleteAsync,
  RHFTextField,
} from "@components/rhf";
import { yupResolver } from "@hookform/resolvers/yup";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import { LoadingButton } from "@mui/lab";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useUpdateGroupChatCreatorMutation, useUpdateGroupChatMembersMutation, useUpdateGroupChatNameMutation } from "@services/chats/chat-api";
import { useLazyGetContactsListQuery } from "@services/contacts/contacts-api";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as Yup from "yup";
const FormSchema = Yup.object().shape({
  name: Yup.string().required("FirstName is required"),
  members: Yup.mixed().required("LastName is required"),
});
function GroupChatManagementModal(props: any) {
  const [open, setOpen] = useState(false);
  const [openGroupName, setOpenGroupName] = useState(false);
  const [openGroupAdmin, setOpenGroupAdmin] = useState(false);
  const [openGroupMember, setOpenGroupMember] = useState(false);
  const { apiData, isCreator } = props;
  console.log(apiData);
  const methods = useForm<any>({
    defaultValues: {
      name: apiData?.name,
      creator: {
        ...apiData?.creator,
        fullName: `${apiData?.creator?.firstName} ${apiData?.creator?.lastName} `,
      },
      members: apiData?.members,
    },
    resolver: yupResolver(FormSchema),
  });
  const listOfContacts = useLazyGetContactsListQuery();

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        startIcon={<GroupsIcon />}
        variant="text"
        color="primary"
        fullWidth
      >
        Group Info
      </Button>
      <CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        rootSx={{
          width: { xs: "95%", sm: "90%", md: 800 }, // Responsive width
          maxWidth: "100%",
        }}
        headerLabel={"Group Info"}
        closeButtonProps={{ onClick: () => setOpen(false) }}
      >
        <FormProvider methods={methods}>
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
            width="100%"
            mt={1}
          >
            <Stack direction="row" gap={2} width="100%">
              <RHFTextField
                disabled
                type="text"
                label="Group Name"
                fullWidth
                name="name"
                placeholder="Enter Group Name Here"
              />
              <Tooltip title="Edit Group Name">
                <Button
                  startIcon={<EditOutlinedIcon />}
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenGroupName(true)}
                >
                  Edit
                </Button>
              </Tooltip>
            </Stack>
            <Stack direction="row" gap={2} width="100%">
              <RHFTextField
                disabled
                type="text"
                label="Group Admin Name"
                fullWidth
                name="creator.fullName"
                placeholder="Enter Group Name Here"
              />
              <Tooltip title="Edit Group Admin">
                <Button
                  startIcon={<EditOutlinedIcon />}
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenGroupAdmin(true)}
                  disabled={!isCreator}
                >
                  Edit
                </Button>
              </Tooltip>
            </Stack>
            <Stack direction="row" gap={2} width="100%">
              <RHFAutocompleteAsync
                disabled
                label="Members"
                name="members"
                apiQuery={listOfContacts}
                multiple
                getOptionLabel={(option: any) =>
                  `${option.firstName} ${option.lastName}`
                }
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
              <Tooltip title="Edit Members">
                <Button
                  startIcon={<EditOutlinedIcon />}
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenGroupMember(true)}
                  disabled={!isCreator}
                >
                  Edit
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
        </FormProvider>
        <UpdateGroupName
          apiData={apiData}
          openGroupName={openGroupName}
          setOpenGroupName={setOpenGroupName}
        />
        <UpdateGroupAdminName
          apiData={apiData}
          openGroupAdmin={openGroupAdmin}
          setOpenGroupAdmin={setOpenGroupAdmin}
        />
        <UpdateGroupMembers
          apiData={apiData}
          openGroupMember={openGroupMember}
          setOpenGroupMember={setOpenGroupMember}
        />
      </CustomModal>
    </>
  );
}

export default GroupChatManagementModal;

const UpdateGroupName = (props: any) => {
  const { apiData, setOpenGroupName, openGroupName } = props;
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const methods = useForm<any>({
    defaultValues: {
      name: apiData?.name,
    },
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required("GroupName is required"),
      })
    ),
  });
  const { handleSubmit } = methods;
  const [UpdateGroupChatName, { isLoading }] = useUpdateGroupChatNameMutation();
  const onSubmit = async (data: any) => {
    const payload = {
      chatId,
      NewGroupName: data.name,
    };
     try {
       const { successMessage } = await UpdateGroupChatName({
         body: payload,
       }).unwrap();
       toast.success(successMessage ?? "success");
       setOpenGroupName(false);
     } catch (error: any) {
       toast.error(
         error?.data?.errorMessage?.message ?? "Something went wrong!"
       );
       setOpenGroupName(false);
     }
  };
  return (
    <CustomModal
      isOpen={openGroupName}
      onClose={() => setOpenGroupName(false)}
      rootSx={{
        width: { xs: "95%", sm: "90%", md: 800 }, // Responsive width
        maxWidth: "100%",
      }}
      headerLabel={"Update Group Name"}
      closeButtonProps={{ onClick: () => setOpenGroupName(false) }}
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
          <Box ml="auto">
            <Stack direction="row" gap={2}>
              <Button
                variant="text"
                color="primary"
                onClick={() => setOpenGroupName(false)}
              >
                Cancel
              </Button>
              <LoadingButton
                loading={isLoading}
                variant="contained"
                color="primary"
                type="submit"
              >
                Update
              </LoadingButton>
            </Stack>
          </Box>
        </Stack>
      </FormProvider>
    </CustomModal>
  );
};
const UpdateGroupAdminName = (props: any) => {
  const { apiData, openGroupAdmin, setOpenGroupAdmin } = props;
   const searchParams = useSearchParams();
   const chatId = searchParams.get("chatId");
  const methods = useForm<any>({
    defaultValues: {
      creator: apiData?.creator,
    },
    resolver: yupResolver(
      Yup.object().shape({
        creator: Yup.mixed().required("Admin is required"),
      })
    ),
  });
  const { handleSubmit } = methods;
  const [UpdateGroupChatAdmin, { isLoading }] =
    useUpdateGroupChatCreatorMutation();
  const onSubmit = async (data: any) => {
    console.log(data);
    const payload = {
      chatId,
      newCreatorId: data.creator._id,
    };
     try {
       const { successMessage } = await UpdateGroupChatAdmin({
         body: payload,
       }).unwrap();
       toast.success(successMessage ?? "success");
       setOpenGroupAdmin(false);
     } catch (error: any) {
       toast.error(
         error?.data?.errorMessage?.message ?? "Something went wrong!"
       );
       setOpenGroupAdmin(false);
     }
  };
  const listOfContacts = useLazyGetContactsListQuery();
  return (
    <CustomModal
      isOpen={openGroupAdmin}
      onClose={() => setOpenGroupAdmin(false)}
      rootSx={{
        width: { xs: "95%", sm: "90%", md: 800 }, // Responsive width
        maxWidth: "100%",
      }}
      headerLabel={"Update Group Admin"}
      closeButtonProps={{ onClick: () => setOpenGroupAdmin(false) }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          gap={2}
          width="100%"
          mt={1}
        >
          <RHFAutocompleteAsync
            label="Members"
            name="creator"
            apiQuery={listOfContacts}
            multiple={false}
            getOptionLabel={(option: any) =>
              `${option.firstName} ${option.lastName}`
            }
            transformResponse={(data: any) => {
              if (data?.data?.friends) {
                return [...data?.data?.friends, apiData?.creator];
              }
              return [];
            }}
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
          <Box ml="auto">
            <Stack direction="row" gap={2}>
              <Button
                variant="text"
                color="primary"
                onClick={() => setOpenGroupAdmin(false)}
              >
                Cancel
              </Button>
              <LoadingButton
                loading={isLoading}
                variant="contained"
                color="primary"
                type="submit"
              >
                Update
              </LoadingButton>
            </Stack>
          </Box>
        </Stack>
      </FormProvider>
    </CustomModal>
  );
};
const UpdateGroupMembers = (props: any) => {
  const { apiData, openGroupMember, setOpenGroupMember } = props;
   const searchParams = useSearchParams();
   const chatId = searchParams.get("chatId");
  const methods = useForm<any>({
    defaultValues: {
      members: apiData?.members,
    },
    resolver: yupResolver(
      Yup.object().shape({
        members: Yup.mixed().required("members is required"),
      })
    ),
  });
  const { handleSubmit } = methods;
   const [UpdateGroupChatMembers, { isLoading }] =
     useUpdateGroupChatMembersMutation();
  const onSubmit = async (data: any) => {
 
    const payload = {
      chatId,
      newMembers: data.members.map((member: any) => member._id),
    };
   
     try {
       const { successMessage } = await UpdateGroupChatMembers({
         body: payload,
       }).unwrap();
       toast.success(successMessage ?? "success");
       setOpenGroupMember(false);
     } catch (error: any) {
       toast.error(
         error?.data?.errorMessage ?? "Something went wrong!"
       );
       setOpenGroupMember(false);
     }
  };
  const listOfContacts = useLazyGetContactsListQuery();
  return (
    <CustomModal
      isOpen={openGroupMember}
      onClose={() => setOpenGroupMember(false)}
      rootSx={{
        width: { xs: "95%", sm: "90%", md: 800 }, // Responsive width
        maxWidth: "100%",
      }}
      headerLabel={"Update Group Admin"}
      closeButtonProps={{ onClick: () => setOpenGroupMember(false) }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          gap={2}
          width="100%"
          mt={1}
        >
          <RHFAutocompleteAsync
            label="Members"
            name="members"
            apiQuery={listOfContacts}
            multiple
            getOptionLabel={(option: any) =>
              `${option.firstName} ${option.lastName}`
            }
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
          <Box ml="auto">
            <Stack direction="row" gap={2}>
              <Button
                variant="text"
                color="primary"
                onClick={() => setOpenGroupMember(false)}
              >
                Cancel
              </Button>
              <LoadingButton
                loading={isLoading}
                variant="contained"
                color="primary"
                type="submit"
              >
                Update
              </LoadingButton>
            </Stack>
          </Box>
        </Stack>
      </FormProvider>
    </CustomModal>
  );
};
