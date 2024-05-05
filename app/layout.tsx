// Modules
// "use client";
import { Inter } from "next/font/google";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
// Componets
import "./globals.css";
import NewClerkProvider from "./NewClerkProvider";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TeamGPT",
  description:
    "Team-GPT is a team collaboration tool to communicate with different LLMs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <MantineProvider
          defaultColorScheme="dark"
          theme={{
            primaryColor: "teal",
          }}
        >
          <NewClerkProvider>
            <Notifications />
            {children}
          </NewClerkProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
