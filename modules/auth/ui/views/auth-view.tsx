"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginSchema, RegisterSchema } from "../../schema/auth-schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

/**
 * Authentication View Component
 *
 * Provides user login and registration functionality using Supabase authentication.
 * Features a tabbed interface to switch between login and registration forms.
 *
 * Features:
 * - Login: Email and password authentication
 * - Registration: Name, email, and password account creation
 * - Form validation using Zod schemas
 * - React Hook Form for form state management
 * - Toast notifications for success/error feedback
 * - Loading states during authentication
 * - Auto-redirect to home page after successful auth
 * - User data synchronization with database
 *
 * Form Validation:
 * - Email: Valid email format required
 * - Password: Minimum length and complexity requirements
 * - Name: Required for registration
 */
const AuthView = () => {

    const router = useRouter();
    const login = useAuthStore((s) => s.login);
    const register = useAuthStore((s) => s.register);
    const loading = useAuthStore((s) => s.loading);

    const [tab, setTab] = useState("login");

    const {
        register: loginField,
        handleSubmit: handleLogin,
        formState: { errors: loginErrors },
    } = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
    });


    const {
        register: registerField,
        handleSubmit: handleRegister,
        formState: { errors: registerErrors },
    } = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
    });


    async function onLogin(values: z.infer<typeof LoginSchema>) {
        const { error } = await login(values.email, values.password);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Erfolgreich eingeloggt!");
            router.push("/");
        }
    }

    async function onRegister(values: z.infer<typeof RegisterSchema>) {
        const { error } = await register(values.name, values.email, values.password);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Account erstellt!");
            router.push("/");
        }
    }

  return (
    <main className="
      min-h-screen flex items-center justify-center 
      px-6 py-12
      bg-gradient-to-br from-slate-50 via-white to-slate-100
      dark:bg-gradient-to-br dark:from-[#0c0c14] dark:via-[#0b0b13] dark:to-[#0c0c17]
      transition-all
    ">

        <Card className="w-full max-w-md 
        rounded-2xl shadow-xl backdrop-blur-lg
        bg-white/80 dark:bg-slate-900/70
        border border-slate-200 dark:border-slate-700">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Willkommen 👋</CardTitle>
                <CardDescription>Login oder erstelle einen Account</CardDescription>
            </CardHeader>

            <CardContent>
                <Tabs value={tab} onValueChange={setTab} className="w-full">

                    {/* ---------- TABS HEADER ----------*/}
                    <TabsList className="grid grid-cols-2 w-full mb-6">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Registrieren</TabsTrigger>
                    </TabsList>

                    {/* ---------- LOGIN ----------*/}
                    <TabsContent value="login">
                        <form onSubmit={handleLogin(onLogin)} className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="text-sm">E-Mail</Label>
                                <Input id="email" type="email" placeholder="you@example.com" {...loginField("email")}></Input>
                                {loginErrors.email && (
                                    <p className="text-red-500 text-sm">{loginErrors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-sm">Passwort</Label>
                                <Input id="password" type="password" placeholder="••••••••" {...loginField("password")}></Input>
                                {loginErrors.password && (
                                    <p className="text-red-500 text-sm">{loginErrors.password.message}</p>
                                )}
                            </div>

                            <Button disabled={loading} type="submit" className="w-full py-3 cursor-pointer"> 
                                {loading ? "Lade..." : "Einloggen"}
                            </Button>
                        </form>
                    </TabsContent>


                    {/* ---------- REGISTER ----------*/}
                    <TabsContent value="register">
                        <form onSubmit={handleRegister(onRegister)} className="space-y-5">

                            <div className="space-y-1">
                                <Label>Name</Label>
                                <Input placeholder="Max Mustermann" {...registerField("name")} />
                                {registerErrors.name && (
                                    <p className="text-red-500 text-sm">{registerErrors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label>Email</Label>
                                <Input type="email" placeholder="you@example.com" {...registerField("email")} />
                                {registerErrors.email && (
                                    <p className="text-red-500 text-sm">{registerErrors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label>Passwort</Label>
                                <Input type="password" placeholder="•••••••" {...registerField("password")} />
                                {registerErrors.password && (
                                    <p className="text-red-500 text-sm">{registerErrors.password.message}</p>
                                )}
                            </div>

                            <Button className="w-full py-3 cursor-pointer" disabled={loading} type="submit">
                                {loading ? "Erstelle..." : "Account erstellen"}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </main>
  )
}

export default AuthView