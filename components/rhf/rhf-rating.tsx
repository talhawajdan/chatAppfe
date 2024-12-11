// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { Rating } from "@mui/material";

// ----------------------------------------------------------------------

export function RHFRating({ name, ...other }: any): JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <Rating {...field} {...other} />}
    />
  );
}
