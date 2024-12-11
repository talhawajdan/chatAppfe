// form
import { Controller } from "react-hook-form";

// @mui
import { TimePicker } from "@mui/x-date-pickers";
import { FormLabel, Stack } from "@mui/material";

// ----------------------------------------------------------------------

export function RHFTimePicker({
  name,
  label,
  outerLabel,
  control,
  fullWidth,
  required = false,
  ...other
}: any): JSX.Element {
  return (
    // <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack gap="0.6rem">
          {outerLabel && <FormLabel>{outerLabel} {required && <span style={{ color: "red" }}>*</span>}</FormLabel>}
          <TimePicker
            {...field}
            {...other}
            slotProps={{
              textField: {
                helperText: error ? error.message : "",
                error: Boolean(error),
                fullWidth,
                variant: "outlined",
                size: other?.size,
              },
            }}
            label={label}
          />
        </Stack>
      )}
    />
    // </LocalizationProvider>
  );
}
