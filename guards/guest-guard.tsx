import LogoIcon from "@assets/icons/logo-icon";
import { SplashScreen } from "@components/splash-screen";
import { Path } from "@root/path";
import { useSelector } from "@store/index";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

interface GuestGuardProps {
  children: ReactNode;
}

export function GuestGuard(props: GuestGuardProps): JSX.Element | null {
  const { children } = props;
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [checked, setChecked] = useState<boolean>(false);
  const check = useCallback(() => {
    if (isAuthenticated) {
      router.replace(Path.Dashboard);
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    check();
  }, [check]);

  if (!checked) {
    return (
      <SplashScreen>
        <LogoIcon
          sx={{
            width: 800,
            height: 100,
          }}
        />
      </SplashScreen>
    );
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is authorized.

  return <>{children}</>;
}
