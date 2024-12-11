import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

import { SplashScreen } from "@components/splash-screen";
import { useDispatch, useSelector } from "@store/index";
import { authActions } from "@store/slice/auth/index";
import toast from "react-hot-toast";
import type { Settings } from "@types";
import LogoIcon from "@assets/icons/logo-icon";
import { useAuthMeMutation } from "@services/auth-api";

interface AuthProviderProps {
  children: ReactNode;
  handleTheme: (settings: Settings) => void;
}

export function AuthInitializer(props: AuthProviderProps): JSX.Element {
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    auth: {
      refreshToken,
      accessToken,
      user: { _id },
    },
  }: any = useSelector(
    (state: { auth: any; loginAs: { loginAs?: string } }) => state
  );
  const [mutation, { isLoading }] = useAuthMeMutation();
  const { children } = props;
  const dispatch = useDispatch();
  const initialize = useCallback(async (): Promise<void> => {
    if (accessToken && refreshToken) {
      try {
        await mutation({ userId: _id, refreshToken }).unwrap();
      } catch (error:any) {
        toast.error(
          error?.data?.errorMessage?.message ?? "Something Went Wrong"
        );
        dispatch(authActions.logout());
      }
    } else {
      dispatch(authActions.logout());
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    void initialize();
  }, [initialize]);

 

  if (isLoading || !isInitialized) {
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

  return <>{children}</>;
}
