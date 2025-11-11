import * as cheerio from "cheerio";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const { url } = await req.json();

    if (!url) {
        return NextResponse.json({ error: "No URL detected" }, {status: 400});
    }

    try {
        const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0"  },
            cache: "no-store",
        });

        if (!res.ok) throw new Error("Error while loading the Site.");

        const html = await res.text();
        const $ = cheerio.load(html);

        const text = $("body").text().replace(/\s+/g, " ").trim();

        return Response.json({ content: text });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error while extracting Website Information" }, { status: 500 });
    }

}