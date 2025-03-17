import fs from 'fs-extra';
import path from 'path';
import fetch from 'node-fetch';
// Update import path to be relative to the project root
import { ExportPdfRequest } from '../../src/types';

interface ApiResponse {
  message: string;
  filePath?: string;
  gcpStoragePath?: string;
  error?: string;
}

async function generatePdf() {
  const args = process.argv.slice(2);

  if (args.length < 6) {
    console.error(`
Usage: yarn generate-pdf <source> <documentName> <userName> <birthDate> <location> <birthTime> [outputPath] [outputStorage]

Where <source> can be either:
  - A local file path (e.g., "./content/report.md")
  - A GCP bucket and file path separated by ":" (e.g., "my-bucket:reports/report.md")

And [outputStorage] (optional) is:
  - A GCP bucket and file path separated by ":" (e.g., "my-bucket:exports/report.pdf")

Required arguments:
  source        - Path to source file (local path or bucket:path format)
  documentName  - Name of the report document (e.g. "Interpretación Astrológica")
  userName      - Name of the person (e.g. "Jane Doe")
  birthDate     - Birth date in YYYY-MM-DD format (e.g. "1985-03-04")
  location      - Birth location (e.g. "Santiago, Chile")
  birthTime     - Birth time (e.g. "14:40")

Optional arguments:
  outputPath    - Path where the PDF will be saved locally (default: public/exports/username-timestamp.pdf)
  outputStorage - GCP bucket:path where the PDF will be stored in cloud storage
`);
    process.exit(1);
  }

  const sourceFilePath = args[0];
  const documentName = args[1];
  const userName = args[2];
  const birthDate = args[3];
  const location = args[4];
  const birthTime = args[5];
  const outputPath = args[6] || path.join(process.cwd(), 'public', 'exports', `${userName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`);
  const outputStoragePath = args[7] || '';

  // Create API request body
  const requestBody: ExportPdfRequest = {
    documentName,
    userName,
    birthDate,
    location,
    birthTime,
    theme: 'astrology',
    outputPath
  };

  // Add source file information
  if (sourceFilePath.includes(':')) {
    const [bucketName, filePath] = sourceFilePath.split(':');
    console.log(`📄 Using GCP bucket "${bucketName}" file at "${filePath}"...`);
    requestBody.gcpFile = {
      bucketName,
      filePath
    };
  } else {
    // Use local file path
    const localFilePath = path.resolve(sourceFilePath);
    console.log(`📄 Using local file at "${localFilePath}"...`);
    requestBody.sourceFilePath = localFilePath;
  }

  // Add output storage path if provided
  if (outputStoragePath && outputStoragePath.includes(':')) {
    const [bucketName, filePath] = outputStoragePath.split(':');
    console.log(`💾 Will store PDF in GCP bucket "${bucketName}" at "${filePath}"...`);
    requestBody.outputStorageFilePath = {
      bucketName,
      filePath
    };
  }

  try {
    console.log('🔄 Calling PDF generation API...');

    // Determine API URL (use environment variable or default to localhost)
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    const apiUrl = `${apiBaseUrl}/api/export-pdf`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json() as ApiResponse;
      throw new Error(`API responded with ${response.status}: ${errorData.error || errorData.message || 'Unknown error'}`);
    }

    const data = await response.json() as ApiResponse;
    console.log(`✅ PDF successfully generated at: ${data.filePath}`);
    if (data.gcpStoragePath) {
      console.log(`☁️ PDF also stored in GCP at: ${data.gcpStoragePath}`);
    }
    console.log(`   Document Name: ${documentName}`);
    console.log(`   User: ${userName}`);
    console.log(`   Birth: ${birthDate} at ${birthTime}, ${location}`);
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  }
}

generatePdf();

