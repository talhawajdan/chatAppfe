import { FormProvider, RHFCheckbox, RHFTextField } from "@components/rhf";
import { yupResolver } from "@hookform/resolvers/yup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { Path } from "@root/path";
import { useLoginMutation } from "@services/auth-api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as Yup from "yup";
// setup from
interface SignInFormTypes {
  email: string;
  password: string;
  loggedIn: boolean;
}

const signInFormSchema: any = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Please enter valid email"),
  password: Yup.string().required("Password is required"),
});

function SignInForm() {
  const router = useRouter();
  const methods = useForm({
    defaultValues: {},
    resolver: yupResolver(signInFormSchema),
  });
  const [mutation, { isLoading }] = useLoginMutation();
  const { handleSubmit } = methods;
  const onSubmit = async (payload: any) => {
    const { email, password } = payload;
    try {
     await toast.promise(
        mutation({ email, password }).unwrap(),
        {
          loading: "Logging in...",
          success:(data) => `${data.successMessage??"success"}`,
          error: "Failed to login!",
          
        }
      );

      router.push(Path.Dashboard);
    } catch (error: any) {
      toast.error(error?.data?.errorMessage?.message ?? "Something went wrong!");
    }
  };
  return (
    <Box px={4} mt={4}>
      <Stack spacing={1} direction="column" mb={1}>
        <Typography variant="h2" color="primary.main">
          Login
        </Typography>
        <Typography variant="body1" color="primary.main">
          Login to access your Chatee account
        </Typography>
      </Stack>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} direction="column" mt={2}>
          <RHFTextField
            type="text"
            label="Email *"
            fullWidth
            name="email"
            placeholder="Enter Email Here"
          />
          <RHFTextField
            type="password"
            fullWidth
            label="Password *"
            name="password"
            placeholder="Enter Password Here"
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
          
            <Typography variant="body2" component="span" textAlign="center">
              <StyledLink href="/forgot-password" sx={{ fontWeight: 600 }}>
                Forgot Password?
              </StyledLink>
            </Typography>
          </Box>
          <Box display={"flex"} justifyContent={"center"} width={"100%"}>
            <LoadingButton
              fullWidth
              variant="outlined"
              type="submit"
              sx={{ borderRadius: 30, maxWidth: 300, color: "primary.main" }}
              endIcon={<ArrowForwardIcon />}
              loading={isLoading}
            >
              Login
            </LoadingButton>
          </Box>

          <Typography
            variant="body2"
            component="span"
            textAlign="center"
            fontWeight={600}
            color="primary.main"
          >
            {`Don't have an account?`}
            <StyledLink href="/sign-up"> Sign up</StyledLink>
          </Typography>
        </Stack>
      </FormProvider>
    </Box>
  );
}

export default SignInForm;

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
}));
