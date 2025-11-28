"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import { useSettingsStore } from "@/store/useSettingsStore";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

const AccountCard = () => {

    const router = useRouter();

    const {
        email,
        name,
        setEmail,
        setName,
    } = useSettingsStore();

    const logout = useAuthStore((s) => s.logout);

    return (
    <Card className="backdrop-blur-md bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Name</Label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name" 
              className="mt-1" />
          </div>
          <div>
            <Label>E-Mail</Label>
            <Input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" 
              className="mt-1" />
          </div>
          <Button
           onClick={async () => {
              await logout();
              router.push("/");
           }}
           variant="destructive" className="w-full flex gap-2 cursor-pointer">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </CardContent>
    </Card>
  )
}

export default AccountCard