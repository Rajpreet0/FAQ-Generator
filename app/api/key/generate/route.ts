import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSupabaseUser } from "@/lib/supabase-server";
import { generateAPIKey } from "@/utils/generateAPIKey";

/**
 * API Key Generation Endpoint
 *
 * Generates a new API key for the authenticated user.
 * The new key replaces any existing key and is valid for 30 days.
 *
 * Features:
 * - One-time generation per request (replaces old key)
 * - 30 days validity period
 * - Rate limit counter is NOT reset (prevents abuse by regenerating keys)
 */

/**
 * POST - Generate new API key
 *
 * Creates a new API key for the user, replacing any existing key.
 * Sets expiration to 30 days from generation.
 *
 * IMPORTANT: Rate limit counter is preserved to prevent users from
 * bypassing rate limits by regenerating keys.
 *
 * @returns {Response} Object containing the new API key and expiration date
 */
export async function POST() {
  try {
    const user = await getSupabaseUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate new API key
    const newApiKey = generateAPIKey(40);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    // Update or create user settings with new API key
    // NOTE: We do NOT reset apiRequestCount or apiLastRequest
    // This prevents users from bypassing rate limits by generating new keys
    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        apiKey: newApiKey,
        apiKeyCreatedAt: now,
        apiKeyExpiresAt: expiresAt,
        // apiRequestCount and apiLastRequest are intentionally NOT reset
      },
      create: {
        userId: user.id,
        apiKey: newApiKey,
        apiKeyCreatedAt: now,
        apiKeyExpiresAt: expiresAt,
        apiRequestCount: 0,
        apiLastRequest: null,
      },
    });

    return NextResponse.json({
      success: true,
      apiKey: settings.apiKey,
      expiresAt: settings.apiKeyExpiresAt,
      message: "API Key erfolgreich generiert. Dieser Key ersetzt den vorherigen Key.",
    });
  } catch (error) {
    console.error("Error generating API key:", error);
    return NextResponse.json(
      { error: "Failed to generate API key" },
      { status: 500 }
    );
  }
}
