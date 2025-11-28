
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * FAQ Generation API Endpoint
 *
 * Generates structured FAQ items from website content using OpenAI's GPT models.
 * This endpoint accepts content extracted from a website and returns a JSON array
 * of question-answer pairs based on user-specified parameters.
 *
 * @param {Request} req - The HTTP request containing:
 *   - content: The website text content to generate FAQs from
 *   - language: Target language for the FAQs
 *   - faqCount: Number of FAQ items to generate
 *   - tone: Writing style (e.g., professional, casual)
 *   - model: OpenAI model to use for generation
 *
 * @returns {Response} JSON response containing:
 *   - Success: { faqs: Array<{ question: string, answer: string }> }
 *   - Error: { error: string } with appropriate status code
 */
export async function POST(req: Request) {
  const { content, language, faqCount, tone, model } = await req.json();

  if (!content) {
    return NextResponse.json(
      { error: "No content is provided" },
      { status: 400 },
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content:
            `Du bist ein hilfreiches Tool, das aus Website-Texten strukturierte FAQs auf ${language} erzeugt.`,
        },
        {
          role: "user",
          content: `Erstelle genau ${faqCount} häufig gestellte Fragen und Antworten basierend auf folgendem Website-Text:\n${content.slice(
            0,
            6000,
          )} in ${tone} Schreibstil`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "faq_schema",
          schema: {
            type: "object",
            properties: {
              faqs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    answer: { type: "string" },
                  },
                  required: ["question", "answer"],
                },
              },
            },
            required: ["faqs"],
          },
        },
      },
    });

    const structured = JSON.parse(
      completion.choices[0].message.content ?? "{}",
    );
    return Response.json(structured);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Error while Generating" }, { status: 500 });
  }
}
