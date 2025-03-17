import type { NextApiRequest, NextApiResponse } from "next";
import { renderToFile } from "@react-pdf/renderer";
import path from "path";
import fs from "fs-extra";
import React from "react";
import { GcpStorageService } from "../../services/gcp-storage";
import MarkdownReportPDF from "../../components/PDFDocument/MarkdownReportPDF";
import { ExportPdfRequest } from "../../types";

type ResponseData = {
  message: string;
  filePath?: string;
  gcpStoragePath?: string;
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
    const request: ExportPdfRequest = req.body;
    let markdown: string;

    // Determine the content source and load it
    if (request.gcpFile) {
      const { bucketName, filePath } = request.gcpFile;
      const fileContent = await GcpStorageService.readTextFile(bucketName, filePath);

      markdown = fileContent; // Fix: assign to markdown variable
    } else if (request.sourceFilePath) {
      // Handle local file path
      try {
        const localFilePath = path.resolve(request.sourceFilePath);
        const fileContent = await fs.readFile(localFilePath, 'utf-8');
        markdown = fileContent; // Fix: assign to markdown variable
      } catch (error) {
        return res.status(400).json({
          message: "File access error",
          error: `Could not read file at ${request.sourceFilePath}: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    } else {
      return res.status(400).json({
        message: "Bad request",
        error: "Either gcpFile, or sourceFilePath must be provided"
      });
    }

    // Determine output path
    let outputDir: string;
    let filename: string;
    let filePath: string;

    if (request.outputPath) {
      // If custom output path is provided
      filePath = request.outputPath;
      outputDir = path.dirname(filePath);
      filename = path.basename(filePath);
    } else {
      outputDir = path.join(process.cwd(), "public", "exports");
      const timestamp = new Date().getTime();
      const userSlug = request.userName ?
        `${request.userName.replace(/\s+/g, '-').toLowerCase()}-` : '';
      filename = `${userSlug}document-${timestamp}.pdf`;
      filePath = path.join(outputDir, filename);
    }

    // Ensure output directory exists
    await fs.ensureDir(outputDir);

    // Define document data object to avoid potential undefined references
    const documentData = {
      title: '',
      author: ''
    };

    await renderToFile(
      // @ts-ignore
      React.createElement(MarkdownReportPDF, {
        markdown,
        theme: request.theme || 'astrology',
        documentName: request.documentName,
        userName: request.userName,
        birthDate: request.birthDate,
        birthTime: request.birthTime,
        location: request.location,
      }),
      filePath,
    );

    // Return public URL if inside public directory, otherwise just the path
    const isInPublic = filePath.includes(path.join(process.cwd(), "public"));
    const returnPath = isInPublic ?
      filePath.split('public')[1] :
      filePath;

    const response: ResponseData = {
      message: "PDF exported successfully",
      filePath: returnPath,
    };

    // Handle GCP storage if outputStorageFilePath is provided
    if (request.outputStorageFilePath) {
      try {
        const { bucketName, filePath: storagePath } = request.outputStorageFilePath;

        // Read the generated PDF file
        const pdfBuffer = await fs.readFile(filePath);

        // Upload to GCP
        await GcpStorageService.uploadFile(
          bucketName,
          storagePath,
          pdfBuffer,
          { contentType: 'application/pdf' }
        );

        response.gcpStoragePath = `gs://${bucketName}/${storagePath}`;
      } catch (gcpError) {
        console.error("Error uploading to GCP:", gcpError);
        response.message += " (but failed to upload to GCP storage)";
        response.error = gcpError instanceof Error ? gcpError.message : "Unknown GCP upload error";
      }
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({
      message: "Failed to generate PDF",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
