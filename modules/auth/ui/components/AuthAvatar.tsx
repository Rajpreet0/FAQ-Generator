"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth-store";
import { LogOut, Save, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

const AuthAvatar = () => {

    const { user, logout } = useAuthStore();
    const router = useRouter();

    if (!user) return null;

    const name = user?.user_metadata?.name || user.email;
    const initials = name ? name[0].toUpperCase() : "?";

  return (
    <DropdownMenu>
        <DropdownMenuTrigger className="cusor-pointer">
            <Avatar className="h-10 w-10 bg-indigo-500 text-white cursor-pointer">
                <AvatarFallback className="bg-indigo-500 text-white">
                    {initials}
                </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-40 mr-2 mt-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl">
            <DropdownMenuItem 
                className="cursor-pointer flex gap-2"
                onClick={() => router.push("/settings")}
            >
                <Settings size={16}/> Einstellungen
            </DropdownMenuItem>

            <DropdownMenuItem 
                className="cursor-pointer flex gap-2"
                onClick={() => router.push("/saved")}
            >
                <Save size={16}/> Saved
            </DropdownMenuItem>            

            <DropdownMenuItem
                className="cursor-pointer flex gap-2 text-red-600 hover:text-red-700"
                onClick={async () => {
                    await logout();
                    router.push("/");
                }}
            >
                <LogOut size={16}/> Logout
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AuthAvatar