"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Modules

export default function NotFound() {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, []);
}
