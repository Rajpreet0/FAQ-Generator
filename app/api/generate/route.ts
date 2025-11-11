import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    const { content } = await req.json();

    if (!content) {
        return NextResponse.json({ error: "No content is provided" }, { status: 400 });
    }

    const prompt = `
        Erstelle eine FAQ-Sektion mit 5–10 relevanten Fragen und Antworten basierend auf folgendem Website-Text:
        "${content.slice(0, 6000)}"
    `

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        const faq = response.choices[0].message?.content;
        return Response.json({ faq });
    } catch (error) {
        console.log(error);
        return Response.json({ error: "Error while Generating" }, { status: 500 });
    }
}