import type { NextApiRequest, NextApiResponse } from "next";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import MarkdownReportPDF from "../../components/PDFDocument/MarkdownReportPDF";

type ResponseData = {
  message: string;
  pdfBuffer?: string; // Base64 encoded PDF
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { markdown, theme = "default", reportName = "Preview", userName = "User" } = req.body;

    if (!markdown) {
      return res.status(400).json({ 
        message: "Bad request", 
        error: "Markdown content is required" 
      });
    }

    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(
      React.createElement(MarkdownReportPDF, { 
        markdown, 
        theme, 
        reportName,
        userName,
        location: "Sample Location",
        birthDate: "2000-01-01",
        birthTime: "12:00"
      }) as any
    );

    // Convert buffer to base64 for sending over API
    const base64Pdf = pdfBuffer.toString('base64');

    return res.status(200).json({
      message: "PDF preview generated successfully",
      pdfBuffer: base64Pdf,
    });
  } catch (error) {
    console.error("Error generating PDF preview:", error);
    return res.status(500).json({
      message: "Failed to generate PDF preview",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
