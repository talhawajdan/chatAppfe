import Box from "@mui/material/Box";
import type { SplashScreenProps } from "./splash-screen.types";
import { styles } from "./splash-screen.styles";

export function SplashScreen({ children }: SplashScreenProps): JSX.Element {
  return <Box sx={styles.mainContainer}>{children}</Box>;
}
