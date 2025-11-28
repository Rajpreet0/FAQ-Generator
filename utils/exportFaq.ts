import { FAQItem } from "@/store/faq-store";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

/**
 * FAQ Export Utilities
 *
 * Provides functions to export FAQ data in multiple formats.
 * All exports trigger automatic browser downloads.
 */

/**
 * Export FAQs as JSON
 *
 * Creates a formatted JSON file with FAQ data and triggers download.
 * JSON is formatted with 2-space indentation for readability.
 *
 * @param {FAQItem[]} faqs - Array of FAQ items to export
 *
 * Output Format:
 * ```json
 * [
 *   {
 *     "question": "...",
 *     "answer": "..."
 *   }
 * ]
 * ```
 */
export function exportJSON(faqs: FAQItem[]) {
    const blob = new Blob([JSON.stringify(faqs, null, 2)],  {
        type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "faq.json";
    a.click();
    URL.revokeObjectURL(url);
}


/**
 * Export FAQs as HTML
 *
 * Creates a standalone HTML file with FAQ content and embedded CSS.
 * Ready to copy-paste into existing websites.
 *
 * @param {FAQItem[]} faqs - Array of FAQ items to export
 *
 * Features:
 * - Semantic HTML structure (div.faq-container, h3, p)
 * - Embedded CSS for immediate styling
 * - Responsive max-width container
 *
 * Output Structure:
 * - Container div with max-width: 800px
 * - Each FAQ: h3 (question) + p (answer)
 * - Sans-serif font family
 */
export function exportHTML(faqs: FAQItem[]) {

  const htmlString = `
    <!-- FAQ HTML Snippet (ready to paste) -->
    <div class="faq-container">
        ${faqs
            .map(
            (f) => `
            <div class="faq-item">
            <h3 class="faq-question">${f.question}</h3>
            <p class="faq-answer">${f.answer}</p>
            </div>
        `
            )
            .join("")}
    </div>

    <style>
        .faq-container { max-width: 800px; margin: 0 auto; font-family: sans-serif; }
        .faq-item { margin-bottom: 20px; }
        .faq-question { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        .faq-answer { font-size: 16px; color: #444; }
    </style>
  `;

   const blob = new Blob([htmlString], {type: "text/html"});
   const url = URL.createObjectURL(blob);

   const a = document.createElement("a");
   a.href = url;
   a.download = "faq.html";
   a.click();
   URL.revokeObjectURL(url);
}


/**
 * Export FAQs as PDF
 *
 * Generates a formatted PDF document with FAQ data in table format.
 * Uses jsPDF and autoTable for table layout.
 *
 * @param {FAQItem[]} faqs - Array of FAQ items to export
 *
 * Features:
 * - A4 format document
 * - Title: "FAQ Export"
 * - Two-column table (Frage/Question, Antwort/Answer)
 * - Indigo header background
 * - Optimized column widths for readability
 * - Top-aligned cell content
 *
 * Table Configuration:
 * - Question column: 180pt width
 * - Answer column: 340pt width
 * - Font size: 10pt
 * - Header color: Indigo (#4f46e5)
 */
export function exportPDF(faqs: FAQItem[]) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    doc.setFontSize(20);
    doc.text("FAQ Export", 40, 40);

    const tableData = faqs.map((f) => [f.question, f.answer]);

    autoTable(doc, {
        head: [["Frage", "Antwort"]],
        body: tableData,
        startY: 70,
        styles: {
        fontSize: 10,
        valign: "top",
        },
        columnStyles: {
        0: { cellWidth: 180 }, // Frage
        1: { cellWidth: 340 }, // Antwort
        },
        headStyles: { fillColor: [79, 70, 229] }, // Indigo
    });

    doc.save("faq.pdf");
}