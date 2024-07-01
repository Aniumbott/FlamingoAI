// Modules
// "use client";
import { Inter } from "next/font/google";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/tiptap/styles.css";
// Componets
import "./globals.css";
import NewClerkProvider from "./NewClerkProvider";
import { Metadata } from "next";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flamingo.ai",
  description:
    "Flamingo.ai is a team collaboration tool to communicate with different LLMs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <Suspense>
          <MantineProvider
            defaultColorScheme="dark"
            theme={{
              primaryColor: "grape",
            }}
          >
            <NewClerkProvider>
              <Notifications />
              {children}
            </NewClerkProvider>
          </MantineProvider>
        </Suspense>
      </body>
    </html>
  );
}
