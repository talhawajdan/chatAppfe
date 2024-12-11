import type { ReactNode } from "react";
import LogoIcon from "@assets/icons/logo-icon";
import { SplashScreen } from "@components/splash-screen";
import { Path } from "@root/path";
import { useSelector } from "@store/index";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard(props: AuthGuardProps): JSX.Element | null {
  const { children } = props;
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [checked, setChecked] = useState<boolean>(false);

  const check = useCallback(() => {
    if (!isAuthenticated) {
      router.replace(Path.signIn);
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, router]);

  //Only check on mount, this allows us to redirect the user manually when auth state changes
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

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return <>{children}</>;
}
