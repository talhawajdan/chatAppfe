"use client";
import { FormProvider, RHFTelInput, RHFTextField } from "@components/rhf";
import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Grid2 as Grid,
  IconButton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { Path } from "@root/path";
import { useSignUpMutation } from "@services/auth-api";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as Yup from "yup";

const RHFDatePicker = dynamic(
  () =>
    import("@components/rhf/rhf-date-picker").then((mod) => mod.RHFDatePicker),
  { ssr: false }
);

const signUpFormSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("FirstName is required"),
  lastName: Yup.string()
    .required("LastName is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),
  phone: Yup.string().required("Phone number is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  passwordConfirmation: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});
function SignUpForm() {
  const methods = useForm({
    defaultValues: {},
    resolver: yupResolver(signUpFormSchema),
  });
  const [signUp, { isLoading }] = useSignUpMutation();
  const {
    handleSubmit,
  } = methods;

  const Router = useRouter();
  const onSubmit = async (payload: any) => {
    try {
      const { successMessage } = await signUp({ body: { ...payload } }).unwrap();
      successMessage?.map((message:any) => toast.success(message??"success"));
      Router.push(Path.Dashboard);
    } catch (error: any) {
      toast.error(
        error?.data?.errorMessage?.message ?? "Something went wrong!"
      );
    }
  };
  return (
    <>
      <Stack spacing={0.5} px={2}>
        <Stack spacing={1} alignItems="center" direction="row" mt={1}>
          <IconButton onClick={() => Router.back()}>
            <ArrowBackOutlinedIcon
              sx={{ color: "primary.main", fontSize: 60 }}
            />
          </IconButton>
          <Typography variant="h2" color="primary.main">
            Sign up
          </Typography>
        </Stack>
        <Stack justifyContent={"center"}>
          <Typography variant="body1" color="primary.main">
            Let’s get you all set up so you can access your Chatee account.
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container>
              <Grid mt={2} size={{ xs: 12 }} p={1}>
                <RHFTextField
                  type="text"
                  label="First Name *"
                  fullWidth
                  name="firstName"
                  placeholder="Enter First Name Here"
                />
              </Grid>
              <Grid size={{ xs: 12 }} p={1}>
                <RHFTextField
                  type="text"
                  label="Last Name *"
                  fullWidth
                  name="lastName"
                  placeholder="Enter Last Name Here"
                />
              </Grid>
              <Grid size={{ xs: 12 }} p={1}>
                <RHFTextField
                  type="text"
                  label="Email *"
                  fullWidth
                  name="email"
                  placeholder="Enter Email Here"
                />
              </Grid>
              <Grid size={{ xs: 12 }} p={1}>
                <RHFDatePicker
                  label="Dob *"
                  fullWidth
                  name="dob"
                  placeholder="Enter Email Here"
                />
              </Grid>
              <Grid size={{ xs: 12 }} p={1}>
                <RHFTelInput
                  label="Phone *"
                  fullWidth
                  name="phone"
                  placeholder="+xx xxxx xxxx"
                />
              </Grid>

              <Grid size={{ xs: 12 }} p={1}>
                <RHFTextField
                  type="password"
                  fullWidth
                  label="Password *"
                  name="password"
                  placeholder="Enter Password Here"
                />
              </Grid>
              <Grid size={{ xs: 12 }} p={1}>
                <RHFTextField
                  type="password"
                  fullWidth
                  label="confirm Password *"
                  name="passwordConfirmation"
                  placeholder="Enter Password Here"
                />
              </Grid>
              <Grid size={{ xs: 12 }} p={1}>
                <Box
                  display={"flex"}
                  width={"100%"}
                  gap={1}
                  justifyContent={"center"}
                  alignContent="center"
                  mt={2}
                >
                  <LoadingButton
                    variant="outlined"
                    type="submit"
                    sx={{
                      borderRadius: 30,
                      minWidth: 200,
                      color: "primary.main",
                    }}
                    endIcon={<ArrowForwardIcon />}
                    loading={isLoading}
                  >
                    Sign up
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
          </FormProvider>
          <Typography
            variant="body2"
            component="span"
            textAlign="center"
            fontWeight={600}
            color="primary.main"
          >
            {`Already have an account?`}
            <StyledLink href="/sign-in"> Login</StyledLink>
          </Typography>
        </Stack>
      </Stack>
    </>
  );
}

export default SignUpForm;
const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
}));
