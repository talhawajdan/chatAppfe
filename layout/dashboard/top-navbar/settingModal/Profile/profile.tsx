import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Avatar, Box, CircularProgress, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FormProvider,
  RHFDatePicker,
  RHFTelInput,
  RHFTextField,
} from "@components/rhf";
import { Grid2 as Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import EditProfileModal from "./editProfileModal/editProfileModal";
import {
  useDeleteProfileImageMutation,
  usePostProfileImageMutation,
} from "@services/profile/profile-api";
import toast from "react-hot-toast";

function Profile({ userData }: any) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [img, setImg] = useState<string | undefined>();
  const [profilePicture, setProfilePicture] = useState<string | null>("");
  const [PostProfileImage, { isLoading }] = usePostProfileImageMutation({});
  const [deleteProfileImage, { isLoading: deleteLoading }] =
    useDeleteProfileImageMutation();
  async function onSubmitProfileImage(formData: FormData): Promise<void> {
    try {
      const { successMessage }: any = await PostProfileImage({
        body: formData,
      }).unwrap();
      toast.success(successMessage ?? "success");
    } catch (error: any) {
      toast.error(
        error?.data?.errorMessage?.message ?? "Something went wrong!"
      );
    }
  }

  async function onProfileImageDelete(): Promise<void> {
    try {
      const { successMessage }: any = await deleteProfileImage({}).unwrap();
      toast.success(successMessage ?? "success");
    } catch (error: any) {
      toast.error(
        error?.data?.errorMessage?.message ?? "Something went wrong!"
      );
    }
  }


  function handleIconClick(event: React.MouseEvent<HTMLElement>): void {
    setAnchorEl(event.currentTarget);
  }

  function handleClose(): void {
    setAnchorEl(null);
  }

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result as string);
        setImg(reader.result as string);
        const formData = new FormData();
        formData.append("file", file);
        onSubmitProfileImage(formData);
      };
      reader.readAsDataURL(file);
    }
    setAnchorEl(null);
  }

  function handleRemove(): void {
     onProfileImageDelete();
     setProfilePicture(null);
    setAnchorEl(null);
  }

  function profileImg(): any {
    if (profilePicture === img) {
      return img;
    } else if (userData?.avatar) {
      return userData?.avatar;
    }
    return "";
  }

  // forms here

  const methods = useForm({
    defaultValues: {
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      email: userData?.email,
      phone: userData?.phone,
      dob: dayjs(userData?.dob),
    },
  });
  return (
    <Stack>
     
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Box sx={styles.mainWrapper}>
          {isLoading || deleteLoading ? (
            <CircularProgress size={90} sx={{}} />
          ) : userData?.avatar ? (
            <Avatar
              variant="circular"
              src={profileImg()}
              alt={"avatar"}
              sx={styles.avatarStyling}
            />
          ) : (
            <Avatar
              sx={styles.avatarStyling}
              variant="circular"
              src=""
              alt={"avatar"}
            >
              {userData.firstName?.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <IconButton
            aria-label="Avatar Actions"
            aria-controls="avatar-menu"
            aria-haspopup="true"
            onClick={handleIconClick}
            sx={styles.iconButtonStyling}
          >
            <CameraAltIcon />
          </IconButton>
        </Box>
      </Box>
      <Menu
        id="avatar-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={styles.menuStyling}
      >
        {!userData?.avatar && (
          <MenuItem sx={styles.menuItemStyling}>
            <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
              Upload Picture
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleUpload}
              style={{ display: "none" }}
            />
          </MenuItem>
        )}
        {userData?.avatar && (
          <>
            <MenuItem sx={styles.menuItemStyling}>
              <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
                Update Picture
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleUpload}
                style={{ display: "none" }}
              />
            </MenuItem>
            <MenuItem sx={styles.menuItemStyling} onClick={handleRemove}>
              Remove Picture
            </MenuItem>
          </>
        )}
      </Menu>
      {/* froms */}
      <FormProvider methods={methods}>
        <Grid mt={4} container>
          <Grid size={{ xs: 12, lg: 6 }} p={1}>
            <RHFTextField
              type="text"
              label="First Name"
              fullWidth
              name="firstName"
              placeholder="Enter First Name Here"
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }} p={1}>
            <RHFTextField
              type="text"
              label="Last Name"
              fullWidth
              name="lastName"
              placeholder="Enter Last Name Here"
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }} p={1}>
            <RHFTextField
              type="text"
              label="Email"
              fullWidth
              name="email"
              placeholder="Enter Email Here"
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }} p={1}>
            <RHFDatePicker
              label="Dob *"
              fullWidth
              name="dob"
              placeholder="Enter Email Here"
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }} p={1}>
            <RHFTelInput
              label="Phone"
              fullWidth
              name="phone"
              placeholder="+xx xxxx xxxx"
              disabled
            />
          </Grid>
        </Grid>
      </FormProvider>
      <Box ml="auto">
        <EditProfileModal userData={userData} />
      </Box>
    </Stack>
  );
}

export default Profile;
const styles = {
  mainWrapper: () => ({
    position: "relative",
    display: "inline-block",
    width: "auto",
  }),
  avatarStyling: () => ({
    width: 130,
    height: 130,
    fontSize: 30,
  }),
  iconButtonStyling: () => ({
    position: "absolute",
    bottom: "8px",
    right: "-5px",
    backgroundColor: "info.contrastText",
    borderRadius: "50%",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
    color: "gray",
    zIndex: 1,
    "&:hover": {
      backgroundColor: "neutral.100",
    },
  }),
  menuStyling: () => ({
    zIndex: 20000000,
    top: 5,
    p: 0,
    "& .MuiPaper-root": {
      borderRadius: "10px",
      minWidth: 190,
    },
  }),
  menuItemStyling: () => ({
    py: 0.8,
    fontSize: "16px",
  }),
};
