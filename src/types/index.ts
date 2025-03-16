export interface DocumentData {
  title: string;
  author: string;
  content: string;
}

export interface GcpFileInfo {
  bucketName: string;
  filePath: string;
}

export interface 
ExportPdfRequest {
  documentData?: DocumentData;
  gcpFile?: GcpFileInfo;
}
