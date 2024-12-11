import type { Metadata } from "next";

import { NProgress } from "@components/nprogress";
import { Layout as RootLayout } from "@root/layout/root";
import type { Settings } from "@types";
import { Open_Sans as openSansFunc } from "next/font/google";
import { cookies } from "next/headers";
import { ReactNode } from "react";

const openSans = openSansFunc({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chatee",
  description: "Powered by Chatee",
  icons: {
    icon: [
      { rel: "icon", url: "/favicon.ico", type: "image/x-icon" },
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        type: "image/png",
        sizes: "16x16",
      },
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
  },
};
const SETTINGS_STORAGE_KEY = "app.settings";
const restoreSettings = async (): Promise<Settings | undefined> => {
  const cookieList = await cookies();

  let value: Settings | undefined;

  if (cookieList.get(SETTINGS_STORAGE_KEY)) {
    try {
      const restored = cookieList.get(SETTINGS_STORAGE_KEY);

      if (restored) {
        value = JSON.parse(restored.value) as Settings | undefined;
      }
    } catch (err) {
      console.error(err);
      // If stored data is not a stringified JSON this will fail,
      // that's why we catch the error
    }
  }

  return value;
};

interface LayoutProps {
  children: ReactNode;
}

async function Layout(props: LayoutProps): Promise<JSX.Element> {
  const { children } = props;

  // const settings = await restoreSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body  className={openSans.className}>
        <RootLayout>
          {children}
          <NProgress />
        </RootLayout>
      </body>
    </html>
  );
}

export default Layout;
