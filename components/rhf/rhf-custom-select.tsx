import {
  Select,
  FormLabel,
  FormHelperText,
  FormControl,
  MenuItem,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export function RHFCustomSelect({
  name,
  options,
  outerLabel,
  styleMenu,
  placeholder,
  fullWidth = true,
  required= false,
  ...others
}: any): JSX.Element {
  const { control } = useFormContext();

  const menuProps: any = {
    PaperProps: {
      sx: {
        marginTop: "10px",
        maxHeight: "200px", // Set maxHeight here
        overflow: "auto" // Enable scrolling
      },
    },
  };

  
  return (
    <>
    {outerLabel && (
      <FormLabel sx={{ pb: "0.6rem" }}>{outerLabel} {required && <span style={{ color: "red" }}>*</span>}</FormLabel>
    )}
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={Boolean(error)} fullWidth={fullWidth}>
          {/* {outerLabel && (
            <FormLabel sx={{ pb: "0.6rem" }}>{outerLabel}</FormLabel>
          )} */}
          <Select
            displayEmpty
            MenuProps={{
              ...menuProps,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
            }}
            inputRef={field.ref}
            {...field}
            {...others}
          >
            <MenuItem disabled value="" sx={{ display: "none" }}>
              <FormLabel sx={{ color: "text.secondary" }}>
                {placeholder ?? "Select"}
              </FormLabel>
            </MenuItem>
            {options?.map(({ id, label, value }: any) => (
              <MenuItem
                value={value}
                key={id}
                sx={{ fontSize: "1.5rem", ...styleMenu }}
              >
                {label}
              </MenuItem>
            ))}
          </Select>
          {Boolean(error) && <FormHelperText>{error?.message}</FormHelperText>}
        </FormControl>
      )}
    />
     </>
  );
}
