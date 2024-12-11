// form
import { Controller, useFormContext } from "react-hook-form";

// @mui
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { Box, Typography } from "@mui/material";

// ----------------------------------------------------------------------

export function RHFDateTimePicker({ name, label, outerLabel,required, ...other }: any): JSX.Element {
  const { control } = useFormContext();

  return (
    <Box>
      {outerLabel && (
        // <Typography variant="subtitle1" gutterBottom>
        //   {outerLabel}
        // </Typography>
        <Typography variant="subtitle2" color="neutral.700" fontWeight="500" mb="0.6rem">{outerLabel} {required && <span style={{ color: "red" }}>*</span>}</Typography>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DateTimePicker
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            {...field}
            {...other}
            slotProps={{
              textField: {
                helperText: error ? error.message : "",
                error: Boolean(error),
                fullWidth: other.fullWidth,
              },
            }}
            label={label}
          />
        )}
      />
    </Box>
  );
}
