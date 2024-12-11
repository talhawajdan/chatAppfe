// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { FormLabel, MenuItem, Stack, TextField } from "@mui/material";

// ----------------------------------------------------------------------

export function RHFSelect({
  name,
  outerLabel,
  children,
  placeholder = "Select Option",
  startIcon,
  endIcon,
  ...other
}: any): JSX.Element {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack gap="0.6rem">
          {outerLabel && <FormLabel>{outerLabel}</FormLabel>}
          <TextField
            {...field}
            select
            fullWidth
            SelectProps={{ native: true }}
            error={Boolean(error)}
            helperText={error?.message}
            variant="outlined"
            InputProps={{
              endAdornment: endIcon ?? "",
              startAdornment: startIcon ?? "",
            }}
            {...other}
            value={field.value ? field.value : " "}
          >
            <option disabled value=" ">
              {placeholder}
            </option>
            <MenuItem disabled value=" ">
              {placeholder}
            </MenuItem>
            {children}
          </TextField>
        </Stack>
      )}
    />
  );
}
