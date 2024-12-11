// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  FormControl,
  Typography,
} from "@mui/material";

// ----------------------------------------------------------------------

export function RHFCheckbox({ name, label, ...other }: any): JSX.Element {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormControl error={Boolean(error)}>
            <FormControlLabel
              label={
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary" }}
                >
                  {label}
                </Typography>
              }
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  disabled={other.disabled}
                  sx={(theme) => ({
                    stroke: theme.palette.background.default,
                    strokeWidth: 1,
                  })}
                  {...other}
                />
              }
            />
            {error && <FormHelperText>{error?.message}</FormHelperText>}
          </FormControl>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFMultiCheckbox({
  name,
  rowOrientation = false,
  options,
  ...other
}: any): JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }: any) => {
        const onSelected = (option: string): string[] => {
          if (field?.value?.includes(option))
            return field.value.filter(
              (selectedOption: string) => selectedOption !== option
            );
          return [...(field?.value?.length ? field?.value : []), option];
        };

        return (
          <FormControl error={Boolean(error)}>
            <FormGroup row={rowOrientation}>
              {options.map(({ label, value }: any) => (
                <FormControlLabel
                  key={value}
                  control={
                    <Checkbox
                      checked={field?.value?.includes(value)}
                      onChange={() => {
                        field.onChange(onSelected(value));
                      }}
                    />
                  }
                  label={label}
                  {...other}
                />
              ))}
            </FormGroup>
            {error && <FormHelperText>{error?.message}</FormHelperText>}
          </FormControl>
        );
      }}
    />
  );
}
