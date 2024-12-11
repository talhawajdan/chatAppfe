import type { Theme } from "@mui/material";

export const styles = {
  tabRoot: (theme: Theme, MaxWidth: number, tabsRootSx:any) => ({
    background:
      theme.palette.mode === "light"
        ? theme.palette.neutral[200]
        : theme.palette.background.default,
    display: "flex",
    alignItems: "center",
    width: "fit-content",
    minHeight: 40,
    borderBottom: "unset",
    borderRadius: 0.75,
    border: `1px solid ${
      theme.palette.mode === "dark" ? "transparent" : theme.palette.neutral[200]
    }`,
    padding: "5px 7px",
    "& .MuiTabs-flexContainer": {
      gap: 0,
    },
    ...tabsRootSx,
  }),

  tab: (theme: Theme, tabRootSx:any) => ({
    fontSize: 16,
    fontWeight: 600,
    lineHeight: "20px",
    padding: "4px 20px",
    borderRadius: "4px",
    // width: 150,
    minHeight: 32,
    gap: 0,
    color: theme.palette.text.primary,

    "&.MuiButtonBase-root": {
      width: "fit-content",
      marginLeft: "0px !important",
      minWidth: { xs: 100, md: 170 },
    },

    "&.Mui-selected": {
      background:
        theme.palette.mode === "light"
          ? theme.palette.background.paper
          : theme.palette.neutral[200],
      color:
        theme.palette.mode === "light"
          ? theme.palette.text.primary
          : theme.palette.neutral[900],
      boxShadow: " 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
      marginLeft: "0px !important",
    },
    "& .MuiTabs-indicator": {
      display: "none",
    },
    ...tabRootSx,
  }),
};
