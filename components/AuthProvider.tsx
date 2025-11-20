"use client";

import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";

const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const initAuth = useAuthStore((s) => s.initAuth);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        initAuth();
    }, []);
  return (
    <>
        {children}
    </>
  )
}

export default AuthProvider