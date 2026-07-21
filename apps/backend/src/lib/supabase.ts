import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';
import { ExternalServiceError } from './errors';
import { logger } from '../config/logger';

export class SupabaseStorage {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: `${env.SUPABASE_URL}/storage/v1`,
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`
      }
    });
  }

  async uploadFile(bucket: string, path: string, file: Buffer, contentType: string): Promise<any> {
    try {
      const response = await this.axios.post(`/object/${bucket}/${path}`, file, {
        headers: {
          'Content-Type': contentType,
          'x-upsert': 'true'
        }
      });
      return response.data;
    } catch (error: any) {
       logger.error({ err: error.response?.data || error.message }, 'Supabase upload error');
       throw new ExternalServiceError('Failed to upload file to Supabase', error.response?.data);
    }
  }

  async downloadFile(bucket: string, path: string): Promise<Buffer> {
    try {
      const response = await this.axios.get(`/object/${bucket}/${path}`, {
        responseType: 'arraybuffer'
      });
      return Buffer.from(response.data);
    } catch (error: any) {
       throw new ExternalServiceError('Failed to download file from Supabase', error.response?.data);
    }
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    try {
      await this.axios.delete(`/object/${bucket}/${path}`);
    } catch (error: any) {
      throw new ExternalServiceError('Failed to delete file from Supabase', error.response?.data);
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    return `${env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
  }

  async listFiles(bucket: string, prefix: string = ''): Promise<any[]> {
    try {
      const response = await this.axios.post(`/object/list/${bucket}`, {
        prefix,
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });
      return response.data;
    } catch (error: any) {
      throw new ExternalServiceError('Failed to list files in Supabase', error.response?.data);
    }
  }
}

export const supabaseStorage = new SupabaseStorage();
