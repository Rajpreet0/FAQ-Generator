import { FAQItem } from "@/store/faq-store";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

// -------------- EXPORT JSON --------------
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


// -------------- EXPORT HTML --------------
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


// -------------- EXPORT PDF --------------
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