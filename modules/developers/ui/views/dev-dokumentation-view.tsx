"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { toast } from "sonner";

/**
 * Developer Documentation View Component
 *
 * Comprehensive API documentation for the FAQGen Public API.
 * Provides detailed information about endpoints, parameters, and usage examples.
 *
 * Sections:
 * - Authentication: API key usage via Bearer token
 * - Endpoint: POST endpoint URL for FAQ generation
 * - Body Parameters: Detailed parameter descriptions with types
 * - Example Requests: Code examples in cURL, JavaScript, and Python
 * - Example Response: Sample JSON response structure
 *
 * Features:
 * - Copy-to-clipboard functionality for code snippets
 * - Toast notifications on successful copy
 * - Responsive parameter table
 * - Syntax-highlighted code blocks
 * - Multiple language examples for accessibility
 * - Dynamic API URL from environment variables
 *
 * API Parameters:
 * - url: Website URL to extract content from
 * - content: Optional raw HTML/text
 * - language: Output language (default: "de")
 * - count: Number of FAQs (default: 6)
 * - tone: Writing style
 * - topics: Optional topic focus
 * - structured: JSON vs text response
 * - includeSeo: Include SEO analysis
 */
const DevDokumentationView = () => {

    const [copied, setCopied] = useState(false);

    const copy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied");
        setTimeout(() => setCopied(false), 1500);
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/public/generate`;

  return (
    <main className="min-h-screen bg-white px-6 py-20">
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-14"
            >
                <h1 className="text-5xl font-bold text-slate-900 mb-4">
                    FAQGen Public API
                </h1>
                <p className="text-slate-600 text-lg">
                    Generate structured FAQ sections from any website or raw content — fully automated, multilingual, and SEO-optimized.
                </p>
            </motion.div>

            <section className="mb-16">
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">
                    Authentication
                </h2>
                <p className="text-slate-600 mb-3">
                    Authenticate using your personal API key via the{" "}
                    <code className="bg-slate-100 px-1 rounded">Authorization</code>{" "}
                    header.
                </p>

                <div className="relative">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
                        {`Authorization: Bearer YOUR_PUBLIC_API_KEY`}
                    </pre>
                </div>
            </section>

            <section className="mb-16">
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">
                    Endpoint
                </h2>

                <div className="relative">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
                        POST {apiUrl}
                    </pre>
                    <button
                        className="absolute right-3 top-3 text-white"
                        onClick={() => copy(`POST ${apiUrl}`)}
                    >
                        <Copy size={18} />
                    </button>
                </div>
            </section>

            <section className="mb-16">
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">
                    Body Parameters
                </h2>

                <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                    <tr className="text-slate-700 font-semibold">
                        <th className="py-2">Parameter</th>
                        <th>Type</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody className="text-slate-600">
                    <tr>
                        <td className="py-2 font-medium">url</td>
                        <td>string</td>
                        <td>Website URL to extract text from</td>
                    </tr>

                    <tr>
                        <td className="py-2 font-medium">content</td>
                        <td>string</td>
                        <td>Optional raw HTML/text instead of a URL</td>
                    </tr>

                    <tr>
                        <td className="py-2 font-medium">language</td>
                        <td>string</td>
                        <td>FAQ output language (default: "de")</td>
                    </tr>

                    <tr>
                        <td className="py-2 font-medium">count</td>
                        <td>number</td>
                        <td>Number of FAQs (default: 6)</td>
                    </tr>

                    <tr>
                        <td className="py-2 font-medium">tone</td>
                        <td>string</td>
                        <td>"friendly", "formal", "neutral", "marketing"</td>
                    </tr>

                    <tr>
                        <td className="py-2 font-medium">topics</td>
                        <td>string[]</td>
                        <td>Optional topic focus (SEO, Shipping, Booking…)</td>
                    </tr>

                    <tr>
                        <td className="py-2 font-medium">structured</td>
                        <td>boolean</td>
                        <td>Return JSON (true) or text block (false)</td>
                    </tr>

                    <tr>
                        <td className="py-2 font-medium">includeSeo</td>
                        <td>boolean</td>
                        <td>Returns SEO analysis of the FAQ section</td>
                    </tr>
                    </tbody>
                </table>
            </section>

            <section className="mb-20">
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">
                    Example Request
                </h2>

                {/* CURL */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    cURL
                    </h3>
                    <div className="relative">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
                            {`curl -X POST "${apiUrl}" \\
                            -H "Authorization: Bearer YOUR_API_KEY" \\
                            -H "Content-Type: application/json" \\
                            -d '{
                                "url": "https://example.com",
                                "language": "de",
                                "count": 6,
                                "tone": "friendly",
                                "includeSeo": true
                            }'`}
                    </pre>

                    <button
                        className="absolute right-3 top-3 text-white"
                        onClick={() =>
                        copy(`curl -X POST "${apiUrl}" -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json" -d '{ "url": "https://example.com" }'`)
                        }
                    >
                        <Copy size={18} />
                    </button>
                    </div>
                </div>

                {/* JS */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    JavaScript (fetch)
                    </h3>
                    <div className="relative">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
                        {`const res = await fetch("${apiUrl}", {
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer YOUR_API_KEY",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            url: "https://example.com",
                            language: "de",
                            includeSeo: true
                        })
                        });

                        const data = await res.json();
                        console.log(data);`}
                    </pre>
                    <button
                        className="absolute right-3 top-3 text-white"
                        onClick={() =>
                        copy(`const res = await fetch("${apiUrl}", {...})`)
                        }
                    >
                        <Copy size={18} />
                    </button>
                    </div>
                </div>

                {/* PYTHON */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Python
                    </h3>
                    <div className="relative">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
                            {`import requests

                            res = requests.post(
                                "${apiUrl}",
                                headers={
                                    "Authorization": "Bearer YOUR_API_KEY"
                                },
                                json={
                                    "url": "https://example.com",
                                    "includeSeo": True
                                }
                            )

                            print(res.json())`}
                    </pre>

                    <button
                        className="absolute right-3 top-3 text-white"
                        onClick={() =>
                        copy(`import requests ...`)
                        }
                    >
                        <Copy size={18} />
                    </button>
                    </div>
                </div>
            </section>

            <section className="mb-20">
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">
                    Example Response
                </h2>

                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
                    {`{
                    "success": true,
                    "faqs": [
                        { "question": "Was ist ...?", "answer": "..." },
                        { "question": "Wie funktioniert ...?", "answer": "..." }
                    ],
                    "seo": {
                        "score": 82,
                        "summary": "Sehr gute semantische Deckung...",
                        "strengths": [...],
                        "weaknesses": [...],
                        "recommendations": [...]
                    },
                    "meta": {
                        "language": "de",
                        "count": 6,
                        "tone": "friendly",
                        "model": "gpt-5-mini",
                        "generatedAt": "2025-01-20T12:31:00Z"
                    }
                    }`}
                </pre>
            </section>

        </div>
    </main>
  )
}

export default DevDokumentationView
