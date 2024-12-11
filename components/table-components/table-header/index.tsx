"use client";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SearchIcon from "@mui/icons-material/Search";
import { DateRangePickerIcon } from "@assets/common/date-icon";

import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Popover,
  TextField,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { useState } from "react";
import { DateRange } from "react-date-range";
import type { TableHeaderProps } from "./table-header.types";

function AsyncMultiselectRenderComponent(
  props: any,
  queryParams: any,
  setParams: any,
  onChangedMain: any,
  params: any
): JSX.Element {
  const {
    apiQuery,
    disabled = false,
    queryKey = "search",
    multiple = true,
    getOptionId = (option: any) => option._id,
    getOptionLabel = (option: any) => option.name,
    isOptionEqualToValue = (option: any, newValue: any) =>
      option._id === newValue._id,
    EndIcon,
    StartIcon,
    disableCloseOnSelect = Boolean(multiple),
    externalParams = {},
    transformResponse = (res: any) => res,
    renderTags = (tagValue:any, getTagProps:any) => {
      return tagValue?.map((option: any, index:any) => (
        <Chip
          {...getTagProps({ index })}
          key={getOptionId(option)}
          label={getOptionLabel(option)}
        />
      ));
    },
  } = queryParams;
  //async works
  const [open, setOpen] = useState(false);
  const [offset, setOffset] = useState(externalParams.offset);
  // api
  const [trigger, { data, isLoading, isFetching }]: any = apiQuery;
  const apiData = transformResponse(data);

  // debounce
  const triggerDebounce = debounce((newInputValue) => {
    trigger({ params: { [queryKey]: newInputValue, ...externalParams } });
  }, 600);

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    const bottom =
      event.currentTarget.scrollHeight - event.currentTarget.scrollTop ===
      event.currentTarget.clientHeight;
    if (bottom) {
      const newOffset = offset + 10; // Adjust this value based on the number of items to fetch per request
      setOffset(newOffset);
      trigger({ params: { ...externalParams, offset: newOffset } });
    }
  };

  const AsyncMultiselectChangeHandler = (name: any, newValue: any) => {
    setParams((oldParams: any) => {
      const updatedParams = { ...oldParams, [name]: newValue };
      onChangedMain(updatedParams);
      return updatedParams;
    });
  };

  return (
    <Autocomplete
      sx={{
        "& .MuiOutlinedInput-root.MuiInputBase-sizeSmall": {
          py: 0.85,
        },
      }}
      disabled={disabled}
      multiple={multiple}
      size="small"
      open={open}
      value={params[props.FieldProps.name]}
      limitTags={1}
      autoComplete
      includeInputInList
      filterSelectedOptions
      noOptionsText="No option"
      options={apiData ?? []}
      disableCloseOnSelect={disableCloseOnSelect}
      onOpen={() => {
        trigger({
          params: { ...externalParams },
        });
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={isOptionEqualToValue}
      getOptionLabel={getOptionLabel}
      loading={isLoading || isFetching}
      onChange={(e: React.SyntheticEvent, newValue: any) => {
        AsyncMultiselectChangeHandler(props.FieldProps.name, newValue);
      }}
      onInputChange={(event, newInputValue) => {
        triggerDebounce.cancel();
        if (newInputValue.trim()) triggerDebounce(newInputValue);
      }}
      filterOptions={(x) => x}
      renderOption={(renderOptions, option: any) => {
        return (
          <li {...renderOptions} key={getOptionId(option)}>
            {getOptionLabel(option)}
          </li>
        );
      }}
      renderTags={renderTags}
      renderInput={(renderInputparams) => (
        <TextField
          {...renderInputparams}
          variant="outlined"
          label={props.FieldProps.label}
          InputProps={{
            ...renderInputparams.InputProps,
            endAdornment: (
              <>
                {isLoading || isFetching ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {EndIcon ?? renderInputparams.InputProps.endAdornment}
              </>
            ),
            ...(StartIcon && { startAdornment: StartIcon }),
          }}
        />
      )}
      ListboxProps={{
        onScroll: handleScroll,
      }}
    />
  );
}

const getDefaultParams: any = ({ tableHeaderData, defaultValues }: any) => {
  const defaultParams: any = {};
  if (defaultValues) {
    return defaultValues;
  }
  tableHeaderData.forEach((data: any) => {
    if (data.type === "asyncMultiselect") {
      if (data.queryParams.multiple) {
        defaultParams[data.FieldProps.name] = [];
      } else {
        defaultParams[data.FieldProps.name] = null;
      }
    } else if (data.type === "checkbox") {
      defaultParams[data.FieldProps.name] = false;
    } else if (data.type === "dateRange") {
      defaultParams[data.FieldProps.name] = {
        startDate: undefined,
        endDate: undefined,
      };
    } else
      defaultParams[data.FieldProps.name] =
        data.type === "multiselect" ? [] : "";
  });
  return defaultParams;
};

// ----------------------------------------------------------------------
let timer: ReturnType<typeof setTimeout>;

export function TableHeader(props: TableHeaderProps): JSX.Element {
  const {
    tableHeaderData,
    onChanged = () => {
      return null;
    },
    debounceTimeout = 1000,
    filterButtonShow,
    filterButtonLabel,
    filterButtonProps,
    showClearFilterButton,
    defaultValues,
    gridProps,
  } = props;
  const [params, setParams] = useState<any>(
    getDefaultParams({ tableHeaderData, defaultValues })
  );
  const [show, setShow] = useState(!filterButtonShow);

  function changeHandler({ target: { name, value } }: any, type: string): any {
    setParams((oldParams: any) => {
      const updatedParams = { ...oldParams, [name]: value };

      // Use debounce if search is updated
      clearTimeout(timer);

      if (type === "search") {
        timer = setTimeout(() => {
          onChanged(updatedParams);
        }, debounceTimeout);
      } else {
        onChanged(updatedParams);
      }
      return updatedParams;
    });
  }

  function autoCompleteChangeHandler(value: any, name: any): void {
    setParams((oldParams: any) => {
      const updatedParams = { ...oldParams, [name]: value };
      onChanged(updatedParams);
      return updatedParams;
    });
  }

  function dateChangeHandler(value: any, name: any): void {
    setParams((oldParams: any) => {
      const updatedParams = { ...oldParams, [name]: value };
      onChanged(updatedParams);
      return updatedParams;
    });
  }
  function checkBoxChangeHandler({ target: { name, checked } }: any): void {
    setParams((oldParams: any) => {
      const updatedParams = { ...oldParams, [name]: checked };
      onChanged(updatedParams);
      return updatedParams;
    });
  }

  function onClear(): void {
    const defaultParams = getDefaultParams({ tableHeaderData });
    setParams(defaultParams);
    onChanged(defaultParams);
  }
  // Date range setup
  // Data Range setup
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
  function dateRangeChangeHandler(name: any, value: any): void {
    setParams((oldParams: any) => {
      const updatedParams = {
        ...oldParams,
        [name]: {
          startDate: value?.startDate,
          endDate: value?.endDate,
        },
      };
      onChanged(updatedParams);
      return updatedParams;
    });
  }
  return (
    <>
      {filterButtonShow && (
        <Button
          endIcon={
            show ? (
              <KeyboardArrowUpIcon
                sx={{
                  color: "text.primary",
                }}
              />
            ) : (
              <KeyboardArrowDownIcon
                sx={{
                  color: "text.primary",
                }}
              />
            )
          }
          onClick={() => {
            show ? setShow(false) : setShow(true);
          }}
          sx={{
            color: "text.primary",
            border: `1px solid`,
            borderColor: "neutral.300",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "7px 12px",
            mr: 1,
          }}
          {...filterButtonProps}
        >
          {filterButtonLabel}
        </Button>
      )}
      {show && (
        <Grid container gap={2} sx={{ my: 2 }}>
          {tableHeaderData.map((data: any) => {
            if (data.type === "search") {
              return (
                <Grid
                  key={data.FieldProps.name}
                  xs={12}
                  md={3.5}
                  lg={2}
                  flexWrap="wrap"
                  justifyContent="center"
                  item
                  {...gridProps}
                >
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={params[data.FieldProps.name]}
                    onChange={(e) => changeHandler(e, data.type)}
                    {...data.FieldProps}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              );
            } else if (data.type === "select") {
              return (
                <Grid
                  key={data.FieldProps.name}
                  xs={12}
                  md={3.5}
                  lg={2}
                  flexWrap="wrap"
                  justifyContent="center"
                  item
                  {...gridProps}
                >
                  <TextField
                    select
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={params[data.FieldProps.name]}
                    onChange={(e) => changeHandler(e, data.type)}
                    {...data.FieldProps}
                  >
                    {data?.options?.map(({ label, value }: any) => (
                      <MenuItem
                        key={value}
                        value={value}
                        sx={{ fontSize: "1.5rem", whiteSpace: "pre-line" }}
                      >
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              );
            } else if (data.type === "multiselect") {
              return (
                <Grid
                  key={data.FieldProps.name}
                  xs={12}
                  md={3.5}
                  lg={2}
                  flexWrap="wrap"
                  justifyContent="center"
                  item
                  {...gridProps}
                >
                  <Autocomplete
                    multiple
                    limitTags={1}
                    size="small"
                    fullWidth
                    value={params[data.FieldProps.name]}
                    options={data.options}
                    disableCloseOnSelect
                    isOptionEqualToValue={(option: any, newValue: any) =>
                      option._id === newValue._id
                    }
                    noOptionsText="No option"
                    renderTags={(tagValue, getTagProps) => {
                      return tagValue.map((option: any, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={`chip${option._id}`}
                          label={option.label}
                        />
                      ));
                    }}
                    onChange={(e, value) => {
                      autoCompleteChangeHandler(value, data.FieldProps.name);
                    }}
                    renderOption={(prop, option: any) => {
                      return (
                        <li {...prop} key={option.id}>
                          {option.label}
                        </li>
                      );
                    }}
                    renderInput={(param) => (
                      <TextField
                        {...param}
                        variant="outlined"
                        label={data.FieldProps.label}
                      />
                    )}
                    {...data?.FieldProps}
                  />
                </Grid>
              );
            } else if (data.type === "asyncMultiselect") {
              return (
                <Grid
                  key={data.FieldProps.name}
                  xs={12}
                  md={3.5}
                  lg={2}
                  flexWrap="wrap"
                  justifyContent="center"
                  item
                  {...gridProps}
                >
                  {AsyncMultiselectRenderComponent(
                    data,
                    data.queryParams,
                    setParams,
                    onChanged,
                    params
                  )}
                </Grid>
              );
            } else if (data.type === "date") {
              return (
                <Grid
                  key={data.FieldProps.name}
                  xs={12}
                  md={3.5}
                  lg={2}
                  flexWrap="wrap"
                  justifyContent="center"
                  item
                  {...gridProps}
                >
                  {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
                  <DatePicker
                    value={params[data.FieldProps.name]}
                    onChange={(value: any) => {
                      dateChangeHandler(
                        dayjs(value).toDate(),
                        data.FieldProps.name
                      );
                    }}
                    minDate={
                      data.FieldProps.minDateName
                        ? params[data.FieldProps.minDateName]
                        : undefined
                    }
                    maxDate={
                      data.FieldProps.maxDateName
                        ? params[data.FieldProps.maxDateName]
                        : undefined
                    }
                    slotProps={{
                      textField: {
                        size: "small",
                        variant: "outlined",
                        fullWidth: true,
                        error: false,
                        ...data.FieldProps,
                      },
                    }}
                  />
                  {/* </LocalizationProvider> */}
                </Grid>
              );
            } else if (data.type === "checkbox") {
              return (
                <Grid
                  key={data.FieldProps.name}
                  xs={12}
                  md={3.5}
                  lg={2}
                  flexWrap="wrap"
                  justifyContent="center"
                  item
                  {...gridProps}
                >
                  <FormControlLabel
                    control={
                      <Checkbox checked={params[data.FieldProps.name]} />
                    }
                    onChange={(e) => {
                      checkBoxChangeHandler(e);
                    }}
                    {...data.FieldProps}
                  />
                </Grid>
              );
            } else if (data.type === "dateRange") {
              return (
                <Grid
                  key={data.FieldProps.name}
                  xs={12}
                  md={3.5}
                  lg={2}
                  flexWrap="wrap"
                  justifyContent="center"
                  item
                  {...gridProps}
                >
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignContent="center"
                            onClick={(e: any) => {
                              handleClickDate?.(e);
                            }}
                          >
                            <DateRangePickerIcon />
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    {...(params[data.FieldProps.name].startDate !== undefined &&
                    params[data.FieldProps.name].endDate !== undefined
                      ? {
                          value: `${dayjs(params[data.FieldProps.name].startDate)?.format("MM/DD/YYYY")} - ${dayjs(params[data.FieldProps.name].endDate)?.format("MM/DD/YYYY")} `,
                        }
                      : { value: "" })}
                    {...data.FieldProps}
                  />

                  <Popover
                    id={idDate}
                    open={openDate}
                    anchorEl={anchorElDate}
                    onClose={handleCloseDate}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <DateRange
                      editableDateInputs
                      moveRangeOnFirstSelection={false}
                      ranges={[params[data.FieldProps.name]]}
                      color={theme?.palette?.primary?.main}
                      rangeColors={[theme?.palette?.primary?.main]}
                      onChange={(item: any) => {
                        dateRangeChangeHandler(
                          data.FieldProps.name,
                          item.range1
                        );

                        // setValue(name, item?.selection);
                      }}
                    />
                  </Popover>
                </Grid>
              );
            }
            return null;
          })}
          {showClearFilterButton && (
            <Grid
              xs={12}
              md={3.5}
              lg={2}
              display="flex"
              flexWrap="wrap"
              justifyContent={{ xs: "flex-start", sm: "flex-end" }}
              item
              ml="auto"
              mr={4}
              {...gridProps}
            >
              <Button
                onClick={onClear}
                sx={{ color: "primary.main" }}
                variant="text"
                disableFocusRipple
                disableRipple
                disableTouchRipple
              >
                Clear Filters
              </Button>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
}
