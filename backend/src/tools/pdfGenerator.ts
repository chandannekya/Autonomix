import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const pdfGenerator = async (content: string) => {
  const fileName = `report_${Date.now()}.pdf`;
  const filePath = path.join("reports", fileName);

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(14).text(content);
  doc.end();

  return `PDF generated at ${filePath}`;
};
