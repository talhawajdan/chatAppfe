// import PageNotFound from "@assets/common/page-not-found";
// import { Box, Typography } from "@mui/material";
// import { LogoSsoAdmin, SplashScreen } from "common";
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

function PermissionPageGuard(
  WrappedComponent: React.ComponentType,
  // permission: string
) {
  return function GuardedComponent(props: any): JSX.Element | null {
    // const userPermissions = useSelector(
    //   (state: any) => state.auth?.user?.userPermissions
    // );

    // const [loading, setLoading] = useState(true);
    // const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    // useEffect(() => {
    //   if (userPermissions) {
    //     setHasPermission(userPermissions.includes(permission));
    //     setLoading(false); // Done checking permissions
    //   }
    // }, [userPermissions]);

    // if (loading) {
    //   return (
    //     <SplashScreen>
    //       <LogoSsoAdmin />
    //     </SplashScreen>
    //   );
    // }

    // if (!hasPermission) {
    //   return (
    //     <Box
    //       mt={4}
    //       display="flex"
    //       flexDirection="column"
    //       gap={2}
    //       justifyContent="center"
    //       alignItems="center"
    //     >
    //       <PageNotFound sx={{ fontSize: 400 }} />
    //       <Typography variant="body1" fontWeight={500} color="neutral.600">
    //         {`It looks like you may have taken a wrong turn. Don't worry... It happens to the best of us.`}
    //       </Typography>
    //     </Box>
    //   );
    // }

    return <WrappedComponent {...props} />;
  };
}

export default PermissionPageGuard;
