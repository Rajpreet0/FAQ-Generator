import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSupabaseUser } from "@/lib/supabase-server";

/**
 * FAQ Management API Endpoint
 *
 * Provides CRUD operations for managing user's FAQ sets and individual FAQ items.
 * All operations require authentication and are scoped to the current user.
 */

/**
 * GET - Retrieve all FAQ sets for the authenticated user
 *
 * Fetches all FAQ sets with their associated FAQ items, ordered by creation date.
 * Each FAQ set includes metadata like title, source URL, description, and SEO score.
 *
 * @returns {Response} JSON array of FAQ sets with nested FAQ items, or error
 */
export async function GET() {
  try {
    const user = await getSupabaseUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const faqSets = await prisma.faqSet.findMany({
      where: { userId: user.id },
      include: {
        faqs: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(faqSets);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new FAQ set
 *
 * Saves a new FAQ set with associated FAQ items to the database.
 * Implements duplicate detection to prevent accidental double-saves within 5 seconds.
 *
 * @param {Request} req - The HTTP request containing:
 *   - title: The FAQ set title
 *   - sourceUrl: (optional) The source website URL
 *   - description: (optional) FAQ set description
 *   - seoScore: (optional) SEO score data
 *   - faqs: Array of { question: string, answer: string } objects
 *
 * @returns {Response} The created FAQ set with all items, or error
 */
export async function POST(req: Request) {
  try {
    const user = await getSupabaseUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, sourceUrl, description, seoScore, faqs } = body;

    if (!title || !faqs || !Array.isArray(faqs)) {
      return NextResponse.json(
        { error: "Title and FAQs are required" },
        { status: 400 }
      );
    }

    // Check for duplicates based on sourceUrl and title to prevent double-saves
    if (sourceUrl) {
      const existingSet = await prisma.faqSet.findFirst({
        where: {
          userId: user.id,
          sourceUrl,
          title,
          createdAt: {
            // Only check for duplicates created in the last 5 seconds
            gte: new Date(Date.now() - 5000),
          },
        },
      });

      if (existingSet) {
        return NextResponse.json(existingSet, { status: 200 });
      }
    }

    // Create FAQ set with FAQs in a transaction
    const faqSet = await prisma.faqSet.create({
      data: {
        userId: user.id,
        title,
        sourceUrl,
        description,
        seoScore,
        faqs: {
          create: faqs.map((faq: { question: string; answer: string }, index: number) => ({
            userId: user.id,
            question: faq.question,
            answer: faq.answer,
            order: index,
          })),
        },
      },
      include: {
        faqs: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(faqSet);
  } catch (error) {
    console.error("Error saving FAQ set:", error);
    return NextResponse.json(
      { error: "Failed to save FAQ set" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Remove a FAQ set
 *
 * Deletes a FAQ set and all associated FAQ items.
 * Verifies ownership before deletion to ensure security.
 *
 * @param {Request} req - The HTTP request with query parameter:
 *   - id: The FAQ set ID to delete
 *
 * @returns {Response} { success: true } or error
 */
export async function DELETE(req: Request) {
  try {
    const user = await getSupabaseUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const faqSetId = searchParams.get("id");

    if (!faqSetId) {
      return NextResponse.json(
        { error: "FAQ set ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership before deleting
    const faqSet = await prisma.faqSet.findUnique({
      where: { id: faqSetId },
    });

    if (!faqSet || faqSet.userId !== user.id) {
      return NextResponse.json(
        { error: "FAQ set not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.faqSet.delete({
      where: { id: faqSetId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting FAQ set:", error);
    return NextResponse.json(
      { error: "Failed to delete FAQ set" },
      { status: 500 }
    );
  }
}
