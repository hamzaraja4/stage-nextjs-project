/**
 * Utility functions for Export (CSV/Text/Download) and Printing clean PDF/Sheets
 */

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","),
    ...rows.map((row) =>
      row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportToExcel(
  filename: string,
  sheetName: string,
  headers: string[],
  rows: (string | number)[][]
) {
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.aoa_to_sheet([
    ["GESTION DES DISTRIBUTIONS"],
    [`Export du ${new Date().toLocaleDateString("fr-FR")}`],
    [`Total : ${rows.length}`],
    [],
    headers,
    ...rows,
  ]);
  worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];
  worksheet["!freeze"] = { xSplit: 0, ySplit: 4 };
  worksheet["!cols"] = headers.map((header, index) => ({
    wch: Math.min(36, Math.max(header.length + 2, ...rows.map((row) => String(row[index] ?? "").length + 2))),
  }));
  for (let column = 0; column < headers.length; column += 1) {
    const cell = worksheet[XLSX.utils.encode_cell({ r: 4, c: column })];
    if (cell) cell.s = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "264DBF" } }, alignment: { horizontal: "center" } };
  }
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
}

export async function exportDistributionPdf(rows: string[][]) {
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  pdf.setFontSize(16);
  pdf.text("GESTION DES DISTRIBUTIONS", 14, 15);
  pdf.setFontSize(9);
  pdf.text(`Export du ${new Date().toLocaleDateString("fr-FR")} | Total : ${rows.length}`, 14, 22);
  autoTable(pdf, { startY: 28, head: [["Patient", "IPP", "Service", "Régime", "Token", "Statut"]], body: rows, styles: { fontSize: 8 }, headStyles: { fillColor: [38, 77, 191] } });
  pdf.save(`distribution_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function printHtmlDocument(title: string, htmlContent: string) {
  const printWindow = window.open("", "_blank", "width=850,height=900");
  if (!printWindow) {
    alert("Veuillez autoriser les fenêtres pop-up pour l'impression.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Montserrat', sans-serif; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body class="p-8 bg-white text-slate-800 text-xs">
      <div class="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 no-print">
        <h1 class="text-base font-bold text-slate-900">${title}</h1>
        <button onclick="window.print()" class="px-4 py-2 bg-[#264DBF] text-white font-bold rounded-lg cursor-pointer">
          <i class="fa-solid fa-print mr-1.5"></i> Imprimer Document
        </button>
      </div>
      <div>
        ${htmlContent}
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
}

export function downloadDataUrl(filename: string, dataUrl: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
