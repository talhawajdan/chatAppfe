// @mui
import {
  FormLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";

// form
import { Controller, useFormContext } from "react-hook-form";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// ----------------------------------------------------------------------

export function RHFTextField({
  name,
  type = "text",
  variant = "outlined",
  readOnly = false,
  StartIcon,
  EndIcon,
  outerLabel,
  fullWidth = true,
  rules,
  required = false,
  ...other
}: any): JSX.Element {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const endAdornment =
    type === "password" ? (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => {
            setShowPassword((prev) => !prev);
          }}
        >
          {showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    ) : (
      EndIcon
    );

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <Stack gap="0.6rem" width={fullWidth ? "100%" : "auto"}>
          {outerLabel && <FormLabel>{outerLabel} {required && <span style={{ color: "red" }}>*</span>}</FormLabel>}
          <TextField
            {...field}
            error={Boolean(error)}
            helperText={error?.message}
            type={showPassword ? "text" : type}
            variant={variant}
            

            fullWidth
            InputProps={{
              readOnly,
              endAdornment,
              startAdornment: StartIcon,
            }}
            {...other}
          />
        </Stack>
      )}
    />
  );
}
