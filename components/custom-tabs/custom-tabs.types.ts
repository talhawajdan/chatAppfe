import type { BoxProps, TabProps, TabsProps } from "@mui/material";

export interface CustomTabsProps {
  children: React.ReactNode;
  tabsNameArray: string[];
  maxWidth?: number | undefined;
  tabsProps?: TabsProps;
  tabProps?: TabProps;
  tabsRootSx?:object;
  tabRootSx?:object;
  rootSx?:BoxProps;
  onTabChange?: (value: number) => void;
}
