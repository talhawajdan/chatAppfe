import { useState } from "react";

import type { ReactNode, MouseEvent } from "react";
import { Box, IconButton, Menu } from "@mui/material";
import type { ButtonProps, MenuProps } from "@mui/material";

interface TableIconActionProps {
  children: ReactNode;
  selectButtonProps?: ButtonProps;
  menuProps?: MenuProps;
  icon?: ReactNode | JSX.Element;
  disabled?: boolean;
}

export function TableIconActions({
  children,
  menuProps,
  selectButtonProps,
  icon,
  disabled
}: TableIconActionProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <Box>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        variant="text"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(event: MouseEvent<HTMLButtonElement>) => { setAnchorEl(event.currentTarget) }}
        {...selectButtonProps}
        disabled={disabled}
      >
        {icon}
      </IconButton>
      <Menu
        sx={{ '& ._list > li': { fontSize: "14px", pr: "40px" } }}
        classes={{ list: '_list' }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        anchorOrigin={{
          horizontal:'right',
          vertical:'bottom'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        
        onClose={() => { setAnchorEl(null) }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        {...menuProps}
      >
        {children}
      </Menu>
    </Box>
  );
}
