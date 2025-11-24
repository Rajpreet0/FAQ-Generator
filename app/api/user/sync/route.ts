import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, email, name, avatarUrl } = body;

    if (!id || !email) {
      return NextResponse.json(
        { error: "User ID and email are required" },
        { status: 400 }
      );
    }

    // Upsert user - create if not exists, update if exists
    const user = await prisma.user.upsert({
      where: { id },
      update: {
        email,
        name: name || null,
        avatarUrl: avatarUrl || null,
      },
      create: {
        id,
        email,
        name: name || null,
        avatarUrl: avatarUrl || null,
      },
    });

    // Ensure user has default settings
    await prisma.userSettings.upsert({
      where: { userId: id },
      update: {},
      create: {
        userId: id,
        language: "de",
        faqCount: 6,
        tone: "professional",
        model: "gpt-4o-mini",
        exportFormat: "json",
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}
