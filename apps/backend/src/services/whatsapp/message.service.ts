import { prisma } from '@/lib/prisma';
import { logger } from '@/config/logger';
import { messageQueueService } from '../queue/message-queue.service';
import { MessageStatus } from '@vaquita/shared';

export class MessageService {
  async sendTemplateMessage(storeId: string, params: { customerId: string; phone: string; templateName: string; language: string; variables: any; mediaUrl?: string }) {
    logger.info({ templateName: params.templateName }, `Queueing template message for ${params.phone}`);
    
    const waMessage = await prisma.whatsAppMessage.create({
      data: {
        storeId,
        customerId: params.customerId,
        type: 'TEMPLATE',
        direction: 'OUTBOUND',
        status: 'QUEUED',
        templateName: params.templateName,
        templateLanguage: params.language,
        content: JSON.stringify(params.variables),
        mediaUrl: params.mediaUrl,
      }
    });

    await messageQueueService.enqueue({
      storeId,
      type: 'SEND_WHATSAPP_TEMPLATE',
      priority: 10,
      payload: {
        waMessageId: waMessage.id,
        templateName: params.templateName,
        language: params.language,
        variables: params.variables,
        mediaUrl: params.mediaUrl,
      }
    });

    return waMessage;
  }

  async sendTextMessage(storeId: string, params: { customerId: string; phone: string; text: string }) {
    const waMessage = await prisma.whatsAppMessage.create({
      data: {
        storeId,
        customerId: params.customerId,
        type: 'TEXT',
        direction: 'OUTBOUND',
        status: 'QUEUED',
        content: params.text
      }
    });

    await messageQueueService.enqueue({
      storeId,
      type: 'SEND_WHATSAPP_TEXT',
      priority: 5,
      payload: {
        waMessageId: waMessage.id,
        text: params.text,
      }
    });

    return waMessage;
  }

  async sendMediaMessage(storeId: string, params: { customerId: string; phone: string; type: 'image' | 'video' | 'document'; mediaUrl: string; caption?: string }) {
    const waMessage = await prisma.whatsAppMessage.create({
      data: {
        storeId,
        customerId: params.customerId,
        type: params.type === 'image' ? 'IMAGE' : params.type === 'video' ? 'VIDEO' : 'DOCUMENT',
        direction: 'OUTBOUND',
        status: 'QUEUED',
        mediaUrl: params.mediaUrl,
        content: params.caption,
        mediaType: params.type,
      }
    });

    await messageQueueService.enqueue({
      storeId,
      type: 'SEND_WHATSAPP_MEDIA',
      priority: 5,
      payload: {
        waMessageId: waMessage.id,
        type: params.type,
        mediaUrl: params.mediaUrl,
        caption: params.caption,
      }
    });

    return waMessage;
  }

  async sendButtonMessage(storeId: string, params: { customerId: string; phone: string; bodyText: string; buttons: { id: string; title: string }[] }) {
    const waMessage = await prisma.whatsAppMessage.create({
      data: {
        storeId,
        customerId: params.customerId,
        type: 'BUTTON',
        direction: 'OUTBOUND',
        status: 'QUEUED',
        content: params.bodyText,
        buttonPayload: JSON.stringify(params.buttons),
      }
    });

    await messageQueueService.enqueue({
      storeId,
      type: 'SEND_WHATSAPP_BUTTON',
      priority: 8,
      payload: {
        waMessageId: waMessage.id,
        bodyText: params.bodyText,
        buttons: params.buttons,
      }
    });

    return waMessage;
  }

  async sendListMessage(storeId: string, params: { customerId: string; phone: string; bodyText: string; buttonText: string; sections: any[] }) {
    const waMessage = await prisma.whatsAppMessage.create({
      data: {
        storeId,
        customerId: params.customerId,
        type: 'INTERACTIVE',
        direction: 'OUTBOUND',
        status: 'QUEUED',
        content: params.bodyText,
        buttonPayload: JSON.stringify({ buttonText: params.buttonText, sections: params.sections }),
      }
    });

    await messageQueueService.enqueue({
      storeId,
      type: 'SEND_WHATSAPP_LIST',
      priority: 8,
      payload: {
        waMessageId: waMessage.id,
        bodyText: params.bodyText,
        buttonText: params.buttonText,
        sections: params.sections,
      }
    });

    return waMessage;
  }

  async getMessages(storeId: string, filters: any) {
    const { skip = 0, take = 50, customerId } = filters;
    const where: any = { storeId };
    if (customerId) where.customerId = customerId;

    const [total, messages] = await prisma.$transaction([
      prisma.whatsAppMessage.count({ where }),
      prisma.whatsAppMessage.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, messages };
  }

  async getConversation(storeId: string, customerId: string) {
    return prisma.whatsAppMessage.findMany({
      where: { storeId, customerId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateMessageStatus(waMessageId: string, status: MessageStatus, timestamp: Date) {
    logger.info({ waMessageId, status }, `Updating message status`);
    return prisma.whatsAppMessage.update({
      where: { id: waMessageId },
      data: {
        status,
        updatedAt: timestamp,
      },
    });
  }

  async getMessageStats(storeId: string, dateRange: { start: Date; end: Date }) {
    const stats = await prisma.whatsAppMessage.groupBy({
      by: ['status'],
      where: {
        storeId,
        createdAt: {
          gte: dateRange.start,
          lte: dateRange.end,
        }
      },
      _count: true,
    });

    return stats.reduce((acc: Record<string, number>, curr: any) => {
      acc[curr.status.toLowerCase()] = curr._count;
      return acc;
    }, {} as Record<string, number>);
  }
}

export const messageService = new MessageService();
