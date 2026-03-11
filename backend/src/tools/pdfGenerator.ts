import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

export const pdfGenerator = async (content: string): Promise<string> => {
  console.log("PDF GENERATOR CALLED WITH:", content.slice(0, 50));

  try {
    const reportsDir = path.join(process.cwd(), "reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const fileName = `report_${Date.now()}.pdf`;
    const filePath = path.join(reportsDir, fileName);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    doc.fontSize(14).text(content);
    doc.end();

    await new Promise<void>((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    console.log("PDF WRITTEN, uploading to cloudinary...");

    let result;
    try {
      result = await cloudinary.uploader.upload(filePath, {
        resource_type: "auto", // ✅ not "raw"
        format: "pdf",
        folder: "autonomix-reports",
        access_mode: "public",
      });
    } finally {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    console.log("CLOUDINARY URL:", result.secure_url);
    return result.secure_url;
  } catch (err: any) {
    console.error("PDF GENERATOR ERROR:", err.message);
    throw err; // re-throw so agentExecutor catches it
  }
};
