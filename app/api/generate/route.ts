import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { content } = await req.json();

  if (!content) {
    return NextResponse.json(
      { error: "No content is provided" },
      { status: 400 },
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content:
            "Du bist ein hilfreiches Tool, das aus Website-Texten strukturierte FAQs erzeugt.",
        },
        {
          role: "user",
          content: `Erstelle 5–8 häufig gestellte Fragen und Antworten basierend auf folgendem Website-Text:\n${content.slice(
            0,
            6000,
          )}`,
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
