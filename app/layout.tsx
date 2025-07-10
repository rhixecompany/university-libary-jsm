import "@/app/globals.css";
import { auth } from "@/auth";
// import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/toaster";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from '@/constants';
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";
import { type ReactNode } from "react";


const ibmPlexSans = localFont({
  src: [
    { path: "/fonts/IBMPlexSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "/fonts/IBMPlexSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "/fonts/IBMPlexSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "/fonts/IBMPlexSans-Bold.ttf", weight: "700", style: "normal" },
  ],
});

const bebasNeue = localFont({
  src: [
    { path: "/fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--bebas-neue",
});



export const metadata: Metadata = {
  title: {
    template: `%s | BookWise`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

const RootLayout = async ({
  children
}: {
  children: ReactNode
}) => {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider session={session}>
        <body className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}>
          {/* <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider> */}
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>

  );
}
export default RootLayout