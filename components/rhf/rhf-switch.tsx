// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { Switch, FormControlLabel } from "@mui/material";

// ----------------------------------------------------------------------

export function RHFSwitch({ name, disabled, ...other }: any): JSX.Element {
  const { control } = useFormContext();
  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Switch sx={{ mr: 1 }} disabled={disabled} {...field} checked={field.value} />
          )}
          {...other}
        />
      }
      {...other}
    />
  );
}
