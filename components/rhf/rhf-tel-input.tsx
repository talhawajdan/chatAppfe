import { FormLabel, Stack } from "@mui/material";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { Controller, useFormContext } from "react-hook-form";

export function RHFTelInput({
  name,
  outerLabel,
  labelFontWeight = "500",
  variant = "outlined",
  readOnly = false,
  required= false,
  ...other
}: {
  name: string;
  outerLabel?: string;
  labelFontWeight?: string;
  readOnly?: boolean;
  variant?: "outlined" | "filled" | "standard";
  [key: string]: any;
}): JSX.Element {
  const { control, setError, clearErrors, setValue } = useFormContext();

  const handleChange = (newPhone: string): void => {
    setValue(name, newPhone);
    if ((other.isOptional && !newPhone) || matchIsValidTel(newPhone)) clearErrors(name);
  };

  const validate = (newPhone: string): void => {
    const phoneValue = String(newPhone);
    if (!other.isOptional && !matchIsValidTel(phoneValue))
      setError(name, { type: "error", message: "Invalid phone number." });
    else clearErrors(name);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack gap="0.6rem">
          {outerLabel && <FormLabel sx={{fontWeight: labelFontWeight}}>{outerLabel} {required && <span style={{ color: "red" }}>*</span>}</FormLabel>}
          <MuiTelInput
            {...field}
            error={Boolean(error)}
            helperText={error?.message}
            variant={variant}
            onChange={handleChange}
            onBlur={() => {
              validate(field.value);
            }}
            
            {...other}
          />
        </Stack>
      )}
    />
  );
}
