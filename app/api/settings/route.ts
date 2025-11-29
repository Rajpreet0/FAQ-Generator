import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSupabaseUser } from "@/lib/supabase-server";

/**
 * User Settings API Endpoint
 *
 * Manages user preferences for FAQ generation including language, count,
 * tone, AI model selection, and export format preferences.
 */

/**
 * GET - Retrieve user settings
 *
 * Fetches the authenticated user's settings from the database.
 * Returns default settings if none exist.
 *
 * @returns {Response} User settings object or default configuration
 */
export async function GET() {
  try {
    const user = await getSupabaseUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });

    if (!settings) {
      return NextResponse.json({
        language: "de",
        faqCount: 6,
        tone: "professional",
        model: "gpt-4o-mini",
        exportFormat: "json",
        apiKey: null,
        apiKeyExpiresAt: null,
        apiCount: 0,
      });
    }

    return NextResponse.json({
      ...settings,
      apiCount: settings.apiRequestCount,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

/**
 * POST - Update user settings
 *
 * Creates or updates user settings using upsert operation.
 * All settings are optional and will be merged with existing values.
 *
 * @param {Request} req - The HTTP request containing:
 *   - language: FAQ output language
 *   - faqCount: Number of FAQs to generate
 *   - tone: Writing style preference
 *   - model: OpenAI model selection
 *   - exportFormat: Preferred export format
 *
 * @returns {Response} Updated settings object or error
 */
export async function POST(req: Request) {
  try {
    const user = await getSupabaseUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { language, faqCount, tone, model, exportFormat } = body;

    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        language,
        faqCount,
        tone,
        model,
        exportFormat,
      },
      create: {
        userId: user.id,
        language,
        faqCount,
        tone,
        model,
        exportFormat,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
