import { Storage } from '@google-cloud/storage';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

// Initialize storage client
const storage = new Storage();

/**
 * Service for interacting with Google Cloud Storage
 */
export class GcpStorageService {
  /**
   * Read text content from a file in GCP Storage
   * 
   * @param bucketName - The name of the bucket
   * @param filePath - The path to the file within the bucket
   * @returns The content of the file as a string
   */
  static async readTextFile(bucketName: string, filePath: string): Promise<string> {
    try {
      // Get a reference to the bucket
      const bucket = storage.bucket(bucketName);
      
      // Get a reference to the file
      const file = bucket.file(filePath);
      
      // Download the file to a buffer
      const [buffer] = await file.download();
      
      // Convert the buffer to a string
      return buffer.toString('utf-8');
    } catch (error) {
      console.error('Error reading file from GCP Storage:', error);
      throw new Error(`Failed to read file from GCP Storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Download a file from GCP Storage to a local temporary path
   * 
   * @param bucketName - The name of the bucket
   * @param filePath - The path to the file within the bucket
   * @returns The local file path where the file was saved
   */
  static async downloadFile(bucketName: string, filePath: string): Promise<string> {
    try {
      // Create a temporary file path
      const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
      
      // Get a reference to the bucket and file
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(filePath);
      
      // Download the file to the local file system
      await file.download({ destination: tempFilePath });
      
      return tempFilePath;
    } catch (error) {
      console.error('Error downloading file from GCP Storage:', error);
      throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
