import prisma from "./prisma";
import type { User as SupabaseUser } from "@supabase/supabase-js";

/**
 * Syncs a Supabase Auth user with the Prisma database
 * Creates or updates the user record
 */
export async function syncUser(supabaseUser: SupabaseUser) {
  try {
    const user = await prisma.user.upsert({
      where: { id: supabaseUser.id },
      update: {
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.name || null,
        avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
      },
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.name || null,
        avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
      },
    });

    return user;
  } catch (error) {
    console.error("Error syncing user:", error);
    throw error;
  }
}

/**
 * Gets or creates user settings for a user
 */
export async function getOrCreateUserSettings(userId: string) {
  try {
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (settings) {
      return settings;
    }

    // Create default settings if they don't exist
    return await prisma.userSettings.create({
      data: {
        userId,
        language: "de",
        faqCount: 6,
        tone: "professional",
        model: "gpt-4o-mini",
        exportFormat: "json",
      },
    });
  } catch (error) {
    console.error("Error getting/creating user settings:", error);
    throw error;
  }
}
