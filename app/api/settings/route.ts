import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSupabaseUser } from "@/lib/supabase-server";

// GET user settings
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
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// POST/PUT update user settings
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
