// form
"use client";
import { Controller, useFormContext } from "react-hook-form";
// @mui
import { FormLabel, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// ----------------------------------------------------------------------

export function RHFDatePicker({
  name,
  label,
  outerLabel,
  required = false,
  yearOnly = false,
  monthOnly = false,
  monthYearOnly = false,
  dateOnly = false,
  ...other
}: any): JSX.Element {
  const { control } = useFormContext();

  let views;

  if (yearOnly) {
    views = ["year"];
  } else if (monthOnly) {
    views = ["month"];
  } else if (monthYearOnly) {
    views = ["year", "month"];
  } else if (dateOnly) {
    views = ["day"];
  } else {
    views = ["year", "month", "day"];
  }

  let openTo;

  if (yearOnly) {
    openTo = "year";
  } else if (monthOnly) {
    openTo = "month";
  } else if (monthYearOnly) {
    openTo = "month";
  } else {
    openTo = "day";
  }

  let placeHolder;
  if (yearOnly) {
    placeHolder = "Select year";
  } else if (monthOnly) {
    placeHolder = "Select month";
  } else {
    placeHolder = "Select date";
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <Stack gap="0.6rem">
            {outerLabel && (
              <FormLabel>
                {outerLabel}{" "}
                {required && <span style={{ color: "red" }}>*</span>}
              </FormLabel>
            )}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                {...field}
                {...other}
                views={views}
                openTo={openTo}
                slotProps={{
                  textField: {
                    helperText: error ? error.message : "",
                    error: Boolean(error),
                    fullWidth: other.fullWidth,
                    size: other.size,
                    variant: "outlined",
                    // placeholder: "Select a date",
                    placeholder: placeHolder,
                  },
                }}
                label={label}
                onChange={(date) => {
                  // Allow the field to be empty if no date is selected
                  field.onChange(date ? date : null);
                }}
                value={field.value || null}
              />
            </LocalizationProvider>
          </Stack>
        );
      }}
    />
  );
}
