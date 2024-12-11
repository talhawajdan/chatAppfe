'use client'
import React, { useEffect } from "react";
import { FormLabel, InputAdornment, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { defaultCountries, FlagEmoji, parseCountry, usePhoneInput } from "react-international-phone";
import type { CountryIso2 } from "react-international-phone";
import { Controller, useFormContext } from "react-hook-form";

export function RHFPhoneField({
  name,
  readOnly = false,
  outerLabel,
  defaultCountry,
  ...other }:any): JSX.Element {

  const { control, setValue } = useFormContext();

  const {
    phone,
    handlePhoneValueChange,
    inputRef,
    country,
    setCountry
  } = usePhoneInput({
    defaultCountry,
    countries: defaultCountries,
  });

  useEffect(() => {
    setValue(name, phone)
  }, [name, phone, setValue])

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack gap="0.6rem">
          {outerLabel && <FormLabel>{outerLabel}</FormLabel>}
          <TextField
            {...field}
            variant='outlined'
            value={field?.value || phone}
            error={Boolean(error)}
            helperText={error?.message}
            onChange={handlePhoneValueChange}
            type="tel"
            inputRef={inputRef}
            InputProps={{
              readOnly,
              startAdornment: (
                <InputAdornment position="start" sx={styles.InputAdornment}>
                  <Select
                    MenuProps={{
                      sx: styles.MenuProps,
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left"
                      }
                    }}
                    sx={styles._select}
                    value={country}
                    onChange={(e) => { setCountry(e.target.value as CountryIso2) }}
                    renderValue={(val) => <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>{val}</Typography>}
                  >
                    {defaultCountries.map((c) => {
                      const _country = parseCountry(c);
                      return (
                        <MenuItem key={_country.iso2} value={_country.iso2}>
                          <FlagEmoji
                            iso2={_country.iso2}
                            style={{ marginRight: "8px" }}
                          />
                          <Typography marginRight="8px">{_country.name}</Typography>
                          <Typography color="gray">+{_country.dialCode}</Typography>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </InputAdornment>
              )
            }}
            {...other}
          />
        </Stack>
      )}
    />
  )
}



const styles = {
  MenuProps: {
    height: "300px",
    width: "380px",
    top: "10px",
    left: "-34px",
  },
  _select: {
    width: "max-content",
    '&:hover': { background: 'transparent' },
    fieldset: {
      display: "none"
    },
    ".MuiSelect-select": {
      padding: "8px",
      paddingRight: "24px !important"
    },
    svg: {
      right: 0
    }
  },
  InputAdornment: {
    marginRight: "2px", marginLeft: "-8px"
  }
}

