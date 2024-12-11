// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { FormHelperText, FormLabel, Stack } from "@mui/material";
//
import { Editor } from "../editor";

// ----------------------------------------------------------------------

export function RHFEditor({ name, outerLabel, required, ...other }: any): JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack gap="0.6rem">
          {outerLabel && <FormLabel>{outerLabel} {required && <span style={{ color: 'red' }}>*</span>}</FormLabel>}
          <Editor
            id={name}
            value={field.value}
            onChange={field.onChange}
            error={Boolean(error)}
            helperText={
              <FormHelperText error sx={{ px: 2, textTransform: "capitalize" }}>
                {error?.message}
              </FormHelperText>
            }
            {...other}
          />
        </Stack>
      )}
    />
  );
}
