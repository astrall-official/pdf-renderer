export interface GcpFileReference {
  bucketName: string;
  filePath: string;
}

export interface ExportPdfRequest {
  gcpFile?: GcpFileReference;
  sourceFilePath?: string;
  outputPath?: string;
  outputStorageFilePath?: GcpFileReference;
  theme?: string;
  documentName: string;
  userName: string;
  birthDate: string;
  birthTime: string;
  location: string;
}