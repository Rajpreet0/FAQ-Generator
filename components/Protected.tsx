"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Protected = ({children} : {children: React.ReactNode}) => {
    const user = useAuthStore((s) => s.user);
    const authReady = useAuthStore((s) => s.authReady);
    const router = useRouter();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (!authReady) return;
        if (!user) router.replace("/auth"); 
    }, [authReady, user]);

    if (!authReady) return null;
    if (!user) return null;
  return (
    <>
        {children}
    </>
  )
}

export default Protected