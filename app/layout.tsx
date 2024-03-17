import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import "@mantine/core/styles.css";
// import "@mantine/spotlight/styles.css";
// import "@mantine/modals/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ClerkProvider } from "@clerk/nextjs";
import StoreProvider from "./lib/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <StoreProvider>
        <html lang="en">
          <head>
            <ColorSchemeScript />
            <title>Team GPT PRO !!!</title>
          </head>
          <body className={inter.className}>
            <MantineProvider defaultColorScheme="dark">
              {children}
            </MantineProvider>
          </body>
        </html>
      </StoreProvider>
    </ClerkProvider>
  );
}
