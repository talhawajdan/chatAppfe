import { CustomModal } from "@components/custom-modal";
import {
  FormProvider,
  RHFDatePicker,
  RHFTelInput,
  RHFTextField,
} from "@components/rhf";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid2 as Grid, Stack } from "@mui/material";
import { usePutUpdateProfileMutation } from "@services/profile/profile-api";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import * as Yup from "yup";

const FormSchema = Yup.object().shape({
  firstName: Yup.string().required("FirstName is required"),
  lastName: Yup.string().required("LastName is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),
  phone: Yup.string().required("Phone number is required"),
});

function EditProfileModal({ userData }: any) {
  const [open, setOpen] = useState(false);
  const [PutUpdateProfile, { isLoading }] = usePutUpdateProfileMutation();
  const methods = useForm<any>({
    defaultValues: {
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      email: userData?.email,
      phone: userData?.phone,
      dob: dayjs(userData?.dob),
    },
    resolver: yupResolver(FormSchema),
  });
  const { handleSubmit } = methods;
  const onSubmit = async (data: any) => {
    try {
      const response = await PutUpdateProfile({
        params: {
          userId: userData?._id,
        },
        body: data,
      }).unwrap();
      toast.success(response?.successMessage ?? "Updated Successfully");
    } catch (error: any) {
      toast.error(
        error?.data?.errorMessage?.message ?? "Something went wrong!"
      );
    }
  };
  return (
    <Box mr={2}>
      <Button onClick={() => setOpen(true)} variant="contained" color="primary">
        Edit
      </Button>
      <CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        rootSx={{ width: 800 }}
        headerLabel={"Edit Profile"}
        closeButtonProps={{ onClick: () => setOpen(false) }}
      >
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid mt={4} container>
            <Grid size={{ xs: 12, lg: 6 }} p={1}>
              <RHFTextField
                type="text"
                label="First Name"
                fullWidth
                name="firstName"
                placeholder="Enter First Name Here"
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }} p={1}>
              <RHFTextField
                type="text"
                label="Last Name"
                fullWidth
                name="lastName"
                placeholder="Enter Last Name Here"
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }} p={1}>
              <RHFTextField
                type="text"
                label="Email"
                fullWidth
                name="email"
                placeholder="Enter Email Here"
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }} p={1}>
              <RHFDatePicker
                label="Dob *"
                fullWidth
                name="dob"
                placeholder="Enter Email Here"
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }} p={1}>
              <RHFTelInput
                label="Phone"
                fullWidth
                name="phone"
                placeholder="+xx xxxx xxxx"
              />
            </Grid>
            <Grid size={{ xs: 12 }} p={1}>
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => setOpen(false)}
                >
                  cancel
                </Button>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={isLoading}
                >
                  Save
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </FormProvider>
      </CustomModal>
    </Box>
  );
}

export default EditProfileModal;
