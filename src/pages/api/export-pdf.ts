import type { NextApiRequest, NextApiResponse } from "next";
import { renderToFile } from "@react-pdf/renderer";
import path from "path";
import fs from "fs-extra";
import MyDocument from "../../components/MyDocument";
import { DocumentData } from "../../types";
import React from "react";

type ResponseData = {
  message: string;
  filePath?: string;
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
    const documentData: DocumentData = req.body;
    const outputDir = path.join(process.cwd(), "public", "exports");
    await fs.ensureDir(outputDir);

    const timestamp = new Date().getTime();
    const filename = `document-${timestamp}.pdf`;
    const filePath = path.join(outputDir, filename);

    // Solution 1: Use type assertion to tell TypeScript this is the correct type
    await renderToFile(
      React.createElement(MyDocument, { data: documentData }) as any,
      filePath,
    );

    return res.status(200).json({
      message: "PDF exported successfully",
      filePath: `/exports/${filename}`,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({
      message: "Failed to generate PDF",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
