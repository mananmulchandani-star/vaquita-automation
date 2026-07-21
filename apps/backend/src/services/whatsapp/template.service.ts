import { prisma } from '@/lib/prisma';
import { logger } from '@/config/logger';
import { getWhatsAppClient } from '@/lib/whatsapp';

export class TemplateService {
  async syncTemplates(storeId: string) {
    logger.info(`Syncing WhatsApp templates for store ${storeId}`);
    
    // const client = await getWhatsAppClient(storeId);
    // const templates = await client.getTemplates();
    
    // Mocking response for now
    const templates = [
      { name: 'cod_confirmation_v1', language: 'en', status: 'APPROVED', category: 'UTILITY', components: [] },
      { name: 'shipping_update_v1', language: 'en', status: 'APPROVED', category: 'UTILITY', components: [] }
    ];

    for (const t of templates) {
      await prisma.whatsAppTemplate.upsert({
        where: {
          storeId_name_language: {
            storeId,
            name: t.name,
            language: t.language,
          }
        },
        update: {
          status: t.status as any,
          category: t.category as any,
          components: t.components,
        },
        create: {
          storeId,
          name: t.name,
          language: t.language,
          status: t.status as any,
          category: t.category as any,
          components: t.components,
        }
      });
    }

    return templates.length;
  }

  async getTemplates(storeId: string, filters: { status?: string; category?: string } = {}) {
    return prisma.whatsAppTemplate.findMany({
      where: {
        storeId,
        ...(filters.status && { status: filters.status as any }),
        ...(filters.category && { category: filters.category as any }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTemplateById(storeId: string, templateId: string) {
    return prisma.whatsAppTemplate.findUnique({
      where: { id: templateId }
    });
  }

  async createTemplate(storeId: string, params: { name: string; language: string; category: string; components: any[] }) {
    logger.info(`Creating template ${params.name} for store ${storeId}`);
    
    // const client = await getWhatsAppClient(storeId);
    // await client.createTemplate(params);

    // Save to DB
    return prisma.whatsAppTemplate.create({
      data: {
        storeId,
        name: params.name,
        language: params.language,
        category: params.category as any,
        components: params.components,
        status: 'PENDING', // Will be updated via webhooks
      }
    });
  }

  async deleteTemplate(storeId: string, templateId: string) {
    const template = await prisma.whatsAppTemplate.findUnique({ where: { id: templateId } });
    if (!template) throw new Error('Template not found');

    // const client = await getWhatsAppClient(storeId);
    // await client.deleteTemplate(template.name);

    return prisma.whatsAppTemplate.delete({
      where: { id: templateId }
    });
  }

  getTemplatePreview(template: any, variables: Record<string, string>) {
    // Generate preview of template by replacing variables in text
    let text = template.components?.find((c: any) => c.type === 'BODY')?.text || '';
    
    Object.keys(variables).forEach(key => {
      text = text.replace(`{{${key}}}`, variables[key]);
    });

    return text;
  }
}

export const templateService = new TemplateService();
