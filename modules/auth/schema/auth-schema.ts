import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email("Bitte gültige E-Mail eingeben."),
    password: z.string().min(6, "Mindestens 6 Zeichen."),
});


export const RegisterSchema = z.object({
    name: z.string().min(2, "Mindestens 2 Zeichen"),
    email: z.string().email("Bitte gültige E-Mail eingeben."),
    password: z.string().min(6, "Mindestens 6 Zeichen."),
});