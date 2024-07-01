"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useMantineColorScheme } from "@mantine/core";

export default function NewClerkProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { colorScheme } = useMantineColorScheme();
  return (
    <ClerkProvider
      appearance={{
        baseTheme: colorScheme === "dark" ? dark : undefined,
        variables: { colorPrimary: "#9c36b5" },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
