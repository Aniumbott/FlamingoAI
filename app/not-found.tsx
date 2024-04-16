"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Modules

export default function NotFound() {
  // return <ErrorPage />;
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  });
}
