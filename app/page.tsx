"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

function SignIn() {
  const router = useRouter();
   const pathname = usePathname();


  useEffect(() => {
    if (pathname === "/") {
      router.push("/sign-in");
    }
  }, [router]);
  return null;
}

export default SignIn;
