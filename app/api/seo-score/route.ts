import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { faq } = await req.json();

  if (!faq || faq.length === 0) {
    return NextResponse.json(
      { error: "Keine FAQ-Daten übergeben." },
      { status: 400 }
    );
  }

  const faqText = faq
    .map(
      (f: any, i: number) =>
        `Frage ${i + 1}: ${f.question}\nAntwort ${i + 1}: ${f.answer}`
    )
    .join("\n\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Du bist ein erfahrener SEO-Analyst, der deutschsprachige Webseiten bewertet. Du analysierst, wie gut eine FAQ-Sektion das gesamte SEO einer Webseite stärkt – z. B. durch Keyword-Abdeckung, Featured Snippets, semantische Relevanz, Nutzerbindung und Vertrauen.",
        },
        {
          role: "user",
          content: `
Analysiere die folgende FAQ-Sektion im Kontext der gesamten Website-SEO.

Beurteile:
- Wie stark verbessert diese FAQ-Sektion das organische Ranking?
- Welche SEO-Signale (Keywords, semantische Tiefe, CTR, Verweildauer, E-E-A-T) werden positiv beeinflusst?
- Wo bestehen noch Schwächen oder Chancen zur Optimierung?

Erstelle eine strukturierte JSON-Ausgabe mit einem numerischen Score (0–100) und einer klaren Einschätzung, wie sehr die FAQ das Gesamt-SEO der Webseite verbessert.

FAQ-Inhalt:
${faqText}
          `,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "seo_impact_analysis",
          schema: {
            type: "object",
            properties: {
              score: {
                type: "number",
                description:
                  "Bewertung der SEO-Wirksamkeit der FAQ-Sektion auf das Gesamt-SEO der Webseite (0–100)",
              },
              summary: {
                type: "string",
                description:
                  "Kurze Zusammenfassung, wie die FAQ das SEO der Seite beeinflusst (z. B. verbesserte Sichtbarkeit, Keyword-Abdeckung, Nutzerbindung).",
              },
              strengths: {
                type: "array",
                items: { type: "string" },
                description:
                  "Positive SEO-Faktoren, die durch die FAQ-Sektion gestärkt werden.",
              },
              weaknesses: {
                type: "array",
                items: { type: "string" },
                description:
                  "Schwächen oder Risiken der FAQ in Bezug auf SEO-Wirkung.",
              },
              recommendations: {
                type: "array",
                items: { type: "string" },
                description:
                  "Empfehlungen zur Verbesserung der SEO-Wirkung der FAQ-Sektion.",
              },
              estimatedImpact: {
                type: "string",
                description:
                  "Geschätzte Auswirkung der FAQ auf das gesamte Webseiten-SEO ('hoch', 'mittel', 'gering').",
              },
            },
            required: ["score", "summary", "estimatedImpact"],
          },
        },
      },
    });

    const structured = JSON.parse(
      completion.choices[0].message?.content ?? "{}"
    );

    return NextResponse.json(structured);
  } catch (err) {
    console.error("Fehler bei der SEO-Analyse:", err);
    return NextResponse.json(
      { error: "Fehler bei der SEO-Analyse." },
      { status: 500 }
    );
  }
}
