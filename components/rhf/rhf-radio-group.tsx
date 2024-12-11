// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import {
  Radio,
  RadioGroup,
  FormHelperText,
  FormControlLabel,
  FormLabel,
} from "@mui/material";

// ----------------------------------------------------------------------

export function RHFRadioGroup({
  name,
  options,
  outerLabel,
  disabled = false,
  required = false,
  ...other
}: any): JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, field: { onChange }, fieldState: { error } }: any) => (
        <div>
          {outerLabel && (
            <FormLabel>
              {outerLabel} {required && <span style={{ color: "red" }}>*</span>}
            </FormLabel>
          )}
          <RadioGroup
            {...field}
            row
            {...other}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newValue = e.target.value;

              if (typeof newValue !== "string") return;
              if (newValue === "true") onChange(true);
              else if (newValue === "false") onChange(false);
              else onChange(newValue);
            }}
          >
            {options.map(({ value, label }: any) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio disabled={disabled} />}
                label={label}
              />
            ))}
          </RadioGroup>

          {Boolean(error) && (
            <FormHelperText error sx={{ px: 2 }}>
              {error?.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}
