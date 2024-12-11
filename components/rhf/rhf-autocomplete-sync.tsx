// react
import { useState } from "react";
// form
import { Controller, useFormContext } from "react-hook-form";
// @mui
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// mui icons
import { Chip, FormLabel, Stack } from "@mui/material";

// ----------------------------------------------------------------------
// const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
// const checkedIcon = <CheckBoxIcon fontSize="small" />;

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function RHFAutocompleteSync({
  name,
  options,
  variant = "outlined",
  multiple = false,
  getOptionLabel = (option: any) => option.name,
  outerLabel,
  StartIcon,
  EndIcon,
  placeholder,
  required= false,
  isOptionEqualToValue = (option: any, newValue: any) =>
    option.id === newValue.id,

  renderOption = (props:any, option: any) => {
    return (
      <li {...props} key={option.id}>
        {/* <Checkbox
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          checked={selected}
        /> */}
        {getOptionLabel(option)}
      </li>
    );
  },

  renderTags = (tagValue:any, getTagProps:any) => {
    return tagValue.map((option: any, index:any) => (
      <Chip
        {...getTagProps({ index })}
        key={option.id}
        label={getOptionLabel(option)}
      />
    ));
  },
  ...other
}: any): JSX.Element {
  // states
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  // constants
  const label = other.label;

  // on changes
  const onChanged = (e: any, newValue: any, onChange: any): void => {
    onChange(newValue);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={(form:any) => (
        <Stack gap="0.6rem">
          {outerLabel && <FormLabel>{outerLabel} {required && <span style={{ color: "red" }}>*</span>}</FormLabel>}
          <Autocomplete
            {...form.field}
            id={name}
            multiple={multiple}
            options={options}
            getOptionLabel={getOptionLabel}
            autoComplete
            open={open}
            noOptionsText="No option"
            disableCloseOnSelect
            {...other}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            isOptionEqualToValue={isOptionEqualToValue}
            onChange={(e: React.SyntheticEvent, newValue: any) => {
              form.field.onChange(newValue);
              onChanged(e, newValue, form.field.onChange);
            }}
            renderOption={renderOption}
            renderTags={renderTags}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                variant={variant}
                error={Boolean(form.fieldState.error)}
                // helperText={form.fieldState.error?.message}
                helperText={
                  form.fieldState.error?.message ??
                  form?.formState?.errors?.[name]?.[0]?.message
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>{EndIcon ?? params.InputProps.endAdornment}</>
                  ),
                  ...(StartIcon && { startAdornment: StartIcon }),
                }}
              />
            )}
          />
        </Stack>
      )}
    />
  );
}
