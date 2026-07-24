import axios, { AxiosInstance } from 'axios';
import { logger } from '../config/logger';
import { ExternalServiceError } from './errors';
import { StoreContext } from '@vaquita/shared';
import { getStoreContext } from '../utils/context';
import FormDataNode from 'form-data';

export class WhatsAppClient {
  private axios: AxiosInstance;
  private phoneNumberId: string;
  private wabaId: string;
  private accessToken: string;

  constructor(context: StoreContext) {
    if (!context.waAccessToken || !context.waPhoneNumberId || !context.waWabaId) {
      throw new Error('WhatsApp integration not complete for this store');
    }
    this.phoneNumberId = context.waPhoneNumberId;
    this.wabaId = context.waWabaId;
    this.accessToken = context.waAccessToken;
    
    this.axios = axios.create({
      baseURL: `https://graph.facebook.com/${context.waApiVersion || 'v21.0'}/${this.phoneNumberId}`,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Add response interceptor for retries
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        if (!config || !config.retry) {
          config.retry = 0;
        }

        // Retry logic for rate limiting or server errors
        if (config.retry < 3 && (error.response?.status === 429 || error.response?.status >= 500)) {
          config.retry += 1;
          const delay = Math.pow(2, config.retry) * 1000;
          logger.warn(`WhatsApp API retry ${config.retry} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.axios(config);
        }
        
        return Promise.reject(error);
      }
    );
  }

  async sendTemplate(to: string, templateName: string, languageCode: string, components: any[] = []) {
    try {
      const response = await this.axios.post('/messages', {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components
        }
      });
      return response.data;
    } catch (error: any) {
      logger.error({ err: error.response?.data || error.message }, 'WhatsApp sendTemplate error');
      throw new ExternalServiceError('WhatsApp API Error', error.response?.data);
    }
  }

  async sendText(to: string, text: string) {
    try {
      const response = await this.axios.post('/messages', {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text }
      });
      return response.data;
    } catch (error: any) {
      throw new ExternalServiceError('WhatsApp API Error', error.response?.data);
    }
  }

  async sendImage(to: string, imageIdOrUrl: string, caption?: string) {
    const isUrl = imageIdOrUrl.startsWith('http');
    const imagePayload = isUrl ? { link: imageIdOrUrl, caption } : { id: imageIdOrUrl, caption };
    
    try {
      const response = await this.axios.post('/messages', {
        messaging_product: 'whatsapp',
        to,
        type: 'image',
        image: imagePayload
      });
      return response.data;
    } catch (error: any) {
      throw new ExternalServiceError('WhatsApp API Error', error.response?.data);
    }
  }

  async sendVideo(to: string, videoIdOrUrl: string, caption?: string) {
    const isUrl = videoIdOrUrl.startsWith('http');
    const payload = isUrl ? { link: videoIdOrUrl, caption } : { id: videoIdOrUrl, caption };
    
    try {
      const response = await this.axios.post('/messages', {
        messaging_product: 'whatsapp',
        to,
        type: 'video',
        video: payload
      });
      return response.data;
    } catch (error: any) {
      throw new ExternalServiceError('WhatsApp API Error', error.response?.data);
    }
  }

  async sendDocument(to: string, docIdOrUrl: string, caption?: string, filename?: string) {
    const isUrl = docIdOrUrl.startsWith('http');
    const payload = isUrl ? { link: docIdOrUrl, caption, filename } : { id: docIdOrUrl, caption, filename };
    
    try {
      const response = await this.axios.post('/messages', {
        messaging_product: 'whatsapp',
        to,
        type: 'document',
        document: payload
      });
      return response.data;
    } catch (error: any) {
      throw new ExternalServiceError('WhatsApp API Error', error.response?.data);
    }
  }

  async sendButtons(to: string, bodyText: string, buttons: { id: string, title: string }[]) {
     try {
       const response = await this.axios.post('/messages', {
         messaging_product: 'whatsapp',
         to,
         type: 'interactive',
         interactive: {
           type: 'button',
           body: { text: bodyText },
           action: {
             buttons: buttons.map(b => ({
               type: 'reply',
               reply: { id: b.id, title: b.title }
             }))
           }
         }
       });
       return response.data;
     } catch (error: any) {
       throw new ExternalServiceError('WhatsApp API Error', error.response?.data);
     }
  }

  async sendList(to: string, bodyText: string, buttonText: string, sections: any[]) {
    try {
      const response = await this.axios.post('/messages', {
        messaging_product: 'whatsapp',
        to,
        type: 'interactive',
        interactive: {
          type: 'list',
          body: { text: bodyText },
          action: {
            button: buttonText,
            sections
          }
        }
      });
      return response.data;
    } catch (error: any) {
      throw new ExternalServiceError('WhatsApp API Error', error.response?.data);
    }
  }

  async getMessageStatus(messageId: string) {
    // Note: status is usually received via webhooks, but this is a placeholder if API supports polling
    return null;
  }

  async uploadMedia(file: Buffer, mimeType: string) {
    try {
      const formData = new FormDataNode();
      formData.append('messaging_product', 'whatsapp');
      formData.append('file', file, { contentType: mimeType });
      formData.append('type', mimeType);

      const res = await this.axios.post('/media', formData, {
        headers: { ...formData.getHeaders() }
      });
      return res.data;
    } catch (error: any) {
      throw new ExternalServiceError('WhatsApp Media Upload Error', error.response?.data);
    }
  }

  async downloadMedia(mediaId: string) {
    try {
       // First get media URL
       const mediaRes = await this.axios.get(`/${mediaId}`);
       const mediaUrl = mediaRes.data.url;
       
       // Download the actual file
       const dlRes = await axios.get(mediaUrl, {
         headers: { 'Authorization': `Bearer ${this.accessToken}` },
         responseType: 'arraybuffer'
       });
       return dlRes.data;
    } catch (error: any) {
       throw new ExternalServiceError('WhatsApp Media Download Error', error.response?.data);
    }
  }

  async getTemplates() {
    try {
      const res = await axios.get(`https://graph.facebook.com/v21.0/${this.wabaId}/message_templates`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });
      return res.data;
    } catch (error: any) {
      throw new ExternalServiceError('WhatsApp Template Fetch Error', error.response?.data);
    }
  }

  async getBusinessProfile() {
    try {
       const res = await this.axios.get('/whatsapp_business_profile', {
         params: { fields: 'about,address,description,email,profile_picture_url,websites,vertical' }
       });
       return res.data;
    } catch (error: any) {
       throw new ExternalServiceError('WhatsApp Profile Error', error.response?.data);
    }
  }
}

export const getWhatsAppClient = async (storeId: string) => {
  const context = await getStoreContext(storeId);
  return new WhatsAppClient(context);
};
