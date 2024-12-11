import { Controller, useFormContext } from "react-hook-form";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  Box,
  FormLabel,
  //FormLabel,
  InputAdornment,
  Popover,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import { DateRangePickerIcon } from "@assets/common/date-icon";

export const DATE_FORMAT = {
  UI: "MM/DD/YYYY",
  API: "YYYY-MM-DD",
};
export function RHFDateRangePicker(props: any): JSX.Element {
  const theme = useTheme();
  const [anchorElDate, setAnchorElDate] = useState<HTMLButtonElement | null>(
    null
  );
  const handleClickDate = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElDate(event?.currentTarget);
  };

  const handleCloseDate = () => {
    setAnchorElDate(null);
  };

  const openDate = Boolean(anchorElDate);
  const idDate = openDate ? "simple-popover" : undefined;

  const { name, outerLabel, variant = "outlined", ...other } = props;
  const { control, setValue } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <>
            {outerLabel && <FormLabel>{outerLabel}</FormLabel>}
            <TextField
              fullWidth
              variant={variant}
              helperText={
                <Typography
                  component={"span"}
                  sx={{ display: "block", mt: -1, ml: -1 }}
                >
                  {error?.message}
                </Typography>
              }
              FormHelperTextProps={{
                classes: {
                  root: "",
                  color: "green",
                },
              }}
              value={`${dayjs(field?.value?.startDate)?.format(
                DATE_FORMAT?.UI
              )} - ${dayjs(field?.value?.endDate)?.format(DATE_FORMAT?.UI)} `}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Box
                      sx={{ cursor: "pointer", mt: 0.5 }}
                      onClick={(e: any) => {
                        handleClickDate?.(e);
                      }}
                    >
                      <DateRangePickerIcon />
                    </Box>
                  </InputAdornment>
                ),
              }}
              {...other}
            />
            <Popover
              id={idDate}
              open={openDate}
              anchorEl={anchorElDate}
              onClose={handleCloseDate}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <DateRange
                {...field}
                {...other}
                editableDateInputs
                moveRangeOnFirstSelection={false}
                ranges={[field?.value]}
                color={theme?.palette?.primary?.main}
                rangeColors={[theme?.palette?.primary?.main]}
                onChange={(item: any) => {
                  setValue(name, item?.selection);
                }}
              />
            </Popover>
          </>
        );
      }}
    />
  );
}
