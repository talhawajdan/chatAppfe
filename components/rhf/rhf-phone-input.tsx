// @mui
import { FormLabel, Stack, TextField } from "@mui/material";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

// form
import { Controller, useFormContext } from "react-hook-form";
// ----------------------------------------------------------------------

export function RHFPhoneInput({
  name,
  type = "text",
  variant = "outlined",
  readOnly = false,
  outerLabel,
  placeholder = "Enter phone number",
  ...other
}: any): JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, onChange, ...field },
        fieldState: { error },
      }) => (
        <Stack gap="0.6rem">
          {outerLabel && <FormLabel>{outerLabel}</FormLabel>}
          <TextField
            {...field}
            error={Boolean(error)}
            helperText={error ? error.message : ""}
            type={type}
            variant={variant}
            InputProps={{
              readOnly,
              inputComponent: PhoneInputComponent,
              inputProps: { value, onChange, placeholder },
            }}
            {...other}
            sx={{ ...other.sx, ...styles.root }}
          />
        </Stack>
      )}
    />
  );
}

function PhoneInputComponent({
  value,
  onChange,
  placeholder,
  ...other
}:any): JSX.Element {
  return (
    <PhoneInput
      {...other}
      value={value}
      onChange={onChange}
      defaultCountry="GB"
      countrySelectProps={{ unicodeFlags: true }}
      placeholder={placeholder}
    />
  );
}

const styles = {
  root: {
    "& .PhoneInput": {
      display: "flex",
      alignItems: "center",
      "&:hover .PhoneInputInput": {
        backgroundColor: "transparent",
      },
      "& .PhoneInputInput": {
        border: "none",
        backgroundColor: "transparent",
        "&:focus-visible": {
          outline: "none",
        },
      },
    },
  },
};
