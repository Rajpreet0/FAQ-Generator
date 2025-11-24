import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSupabaseUser } from "@/lib/supabase-server";

// GET all FAQs for current user
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

// POST save new FAQ set
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

// DELETE FAQ set
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
