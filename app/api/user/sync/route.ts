import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * User Synchronization API Endpoint
 *
 * Synchronizes user data from Supabase authentication to the application database.
 * Creates new user records or updates existing ones, and ensures default settings exist.
 * This endpoint is typically called after authentication to ensure database consistency.
 *
 * @param {Request} req - The HTTP request containing:
 *   - id: User ID from authentication provider
 *   - email: User email address
 *   - name: (optional) User display name
 *   - avatarUrl: (optional) User avatar URL
 *
 * @returns {Response} JSON response containing:
 *   - Success: { success: true, user: User }
 *   - Error: { error: string } with appropriate status code
 */
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
