"use client";

import { Children, useState } from "react";
import type { SyntheticEvent } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import type { Theme } from "@mui/material";
import { styles } from "./custom-tabs.styles";
import type { CustomTabsProps } from "./custom-tabs.types";

export function CustomTabs(props: CustomTabsProps): JSX.Element {
  const {
    tabsNameArray = [],
    children,
    tabsProps,
    tabProps,
    maxWidth = 300,
    tabsRootSx,
    tabRootSx,
    onTabChange,
    rootSx,
  } = props;

  const [value, setValue] = useState(0);

  const arrayChildren = Children.toArray(children);
  const handleChange = (event: SyntheticEvent, newValue: number): void => {
    setValue(newValue);
    if (onTabChange) {
      onTabChange(newValue); 
    }
  };

  return (
    <Box {...rootSx}>
      <Tabs
        selectionFollowsFocus
        orientation="horizontal"
        variant={tabsNameArray.length >= 2 ? "scrollable" : "standard"}
        sx={(theme: Theme) => styles.tabRoot(theme, maxWidth, tabsRootSx)}
        TabIndicatorProps={{ style: { display: "none" } }}
        value={value}
        onChange={handleChange}
        {...tabsProps}
      >
        {tabsNameArray.map((title: string) => (
          <Tab
            disableRipple
            key={title}
            sx={(theme: Theme) => styles.tab(theme, tabRootSx)}
            label={title}
            {...tabProps}
          />
        ))}
      </Tabs>
      <Box sx={{ py: 2 }}>
        {arrayChildren.map((child, index) => (
          <Box key={index}>{value === index && child}</Box>
        ))}
      </Box>
    </Box>
  );
}
