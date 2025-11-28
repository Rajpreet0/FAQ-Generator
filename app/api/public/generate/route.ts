import { NextResponse } from "next/server";
import OpenAI from "openai";
import { checkRateLimit } from "@/lib/rate-limit";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    // Extract API key from Authorization header
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
        return NextResponse.json(
            { error: "Unauthorized: Missing API key. Use 'Authorization: Bearer YOUR_API_KEY'" },
            { status: 401 }
        );
    }

    const apiKey = auth.split(" ")[1];

    // Validate API key and check rate limit
    const rateLimitCheck = await checkRateLimit(apiKey);

    if (!rateLimitCheck.isValid) {
        return NextResponse.json(
            { error: rateLimitCheck.error || "Unauthorized" },
            { status: rateLimitCheck.error?.includes("Rate limit") ? 429 : 401 }
        );
    }

    const {
        url,
        content,
        language = "de",
        count = 6,
        tone = "neutral",
        structured = true,
        model = "gpt-5-mini",
        includeSeo = false,
        topics = [],
    } = await req.json();

    if (!url && !content) {
        return NextResponse.json(
            { error: "You must provide either 'url' or 'content' "},
            { status: 404 }
        )
    }

    let websiteContent = content;

    if (url && !content) {
        try {
            const res = await fetch(url);
            const html = await res.text();
            websiteContent = html.replace(/<[^>]*>?/gm, " ");
        } catch (err) {
            console.log("Website Fetch Error: ", err);
            return NextResponse.json({ error: "Failed to fetch Website" }, { status: 500 });
        }
    }

    const prompt = `
        Erstelle eine strukturierte FAQ-Liste basierend auf folgendem Website-Inhalt.

        Anforderungen:
        - Anzahl: ${count} Fragen
        - Sprache: ${language}
        - Tonfall: ${tone}
        - Themenfokus: ${topics.length > 0 ? topics.join(", ") : "keiner"}
        - Formatiere sehr klar, verständlich und SEO-tauglich.

        Website-Inhalt:
        ${websiteContent.slice(0, 6000)}
    `;

    try {
        const completion = await openai.chat.completions.create({
            model,
            messages: [
                {
                    role: "system",
                    content: `Du bist ein Tool, das strukturierte und hochwertige FAQ-Listen erzeugt. Beantworte auf ${language}.`,
                },
                {
                    role: "user",
                    content: prompt,
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

        const structuredFaq = JSON.parse(
            completion.choices[0].message.content ?? "{}"
        );

        let seoData = null;

        if (includeSeo) {
            try {
                const seoRes = await openai.chat.completions.create({
                model,
                messages: [
                    {
                        role: "system",
                        content:
                            "Du analysierst, wie sehr eine FAQ-Sektion das SEO einer gesamten Website stärkt.",
                    },
                    {
                        role: "user",
                        content: `Analysiere diese FAQ-Liste für SEO relevanz, E-E-A-T, Keyword-Abdeckung, Featured-Snippet-Potential:

                        ${JSON.stringify(structuredFaq.faqs, null, 2)}

                        Gib ein JSON zurück mit:

                        - score (0–100)
                        - summary
                        - strengths[]
                        - weaknesses[]
                        - recommendations[]
                        - estimatedImpact ('hoch', 'mittel', 'gering')
                        `,
                    },
                ],
                response_format: {
                    type: "json_schema",
                    json_schema: {
                    name: "seo_analysis",
                    schema: {
                        type: "object",
                        properties: {
                        score: { type: "number" },
                        summary: { type: "string" },
                        strengths: { type: "array", items: { type: "string" } },
                        weaknesses: { type: "array", items: { type: "string" } },
                        recommendations: { type: "array", items: { type: "string" } },
                        estimatedImpact: { type: "string" },
                        },
                        required: ["score", "summary", "estimatedImpact"],
                    },
                    },
                },
                });

                seoData = JSON.parse(
                seoRes.choices[0].message.content ?? "{}"
                );
            } catch (err) {
                console.error("SEO Error:", err);
            }
        }

        if (!structured) {
            const textFaq = structuredFaq.faqs
                .map((f: any, i: number) => `Q${i + 1}: ${f.question}\nA: ${f.answer}`)
                .join("\n\n");

            return NextResponse.json(
                {
                    success: true,
                    faqText: textFaq,
                    seo: seoData,
                },
                { status: 200 }
            );
        }


        return NextResponse.json(
            {
                success: true,
                faqs: structuredFaq.faqs,
                seo: seoData,
                meta: {
                    language,
                    count,
                    model,
                    tone,
                    topics,
                    generatedAt: new Date().toISOString(),
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Public API Error", err);
        return NextResponse.json({ error: "Internal error while generating FAQ" }, { status: 500 })
    }

}