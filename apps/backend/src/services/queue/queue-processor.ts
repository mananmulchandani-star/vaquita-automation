import { messageQueueService } from './message-queue.service';
import { getWhatsAppClient } from '@/lib/whatsapp';
import { prisma } from '@/lib/prisma';
import { logger } from '@/config/logger';

class QueueProcessor {
  private isRunning = false;
  private processedCount = 0;
  private batchSize = 10;
  private intervalId: NodeJS.Timeout | null = null;
  private maxRatePerSecond = 80;

  async startProcessor() {
    if (this.isRunning) return;
    this.isRunning = true;
    logger.info('Queue processor started');

    this.intervalId = setInterval(async () => {
      if (!this.isRunning) return;
      await this.processBatch();
    }, 500); // Poll every 500ms
  }

  stopProcessor() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    logger.info('Queue processor stopped');
  }

  getProcessorStatus() {
    return {
      isRunning: this.isRunning,
      processedCount: this.processedCount,
      rateLimit: this.maxRatePerSecond,
    };
  }

  private async processBatch() {
    try {
      const messages = await messageQueueService.dequeue(this.batchSize);
      if (messages.length === 0) return;

      const promises = messages.map(async (msg: any) => {
        try {
          const client = await getWhatsAppClient(msg.storeId);
          let result: any;
          const payload = msg.payload as any;
          if (payload.type === 'SEND_WHATSAPP_TEMPLATE') {
            result = await client.sendTemplate(payload.phone, payload.templateName, payload.language, payload.variables);
          } else if (payload.type === 'SEND_WHATSAPP_TEXT') {
            result = await client.sendText(payload.phone, payload.text);
          } else if (payload.type === 'SEND_WHATSAPP_MEDIA') {
            if (payload.type === 'image') result = await client.sendImage(payload.phone, payload.mediaUrl, payload.caption);
            else if (payload.type === 'video') result = await client.sendVideo(payload.phone, payload.mediaUrl, payload.caption);
            else result = await client.sendDocument(payload.phone, payload.mediaUrl, payload.caption);
          } else if (payload.type === 'SEND_WHATSAPP_BUTTON') {
            result = await client.sendButtons(payload.phone, payload.bodyText, payload.buttons);
          } else if (payload.type === 'SEND_WHATSAPP_LIST') {
            result = await client.sendList(payload.phone, payload.bodyText, payload.buttonText, payload.sections);
          } else {
            throw new Error(`Unknown message type: ${payload.type}`);
          }
          await messageQueueService.complete(msg.id, result);
          
          if (msg.payload && typeof msg.payload === 'object' && 'waMessageId' in msg.payload) {
            await prisma.whatsAppMessage.update({
              where: { id: (msg.payload as any).waMessageId },
              data: { status: 'SENT' },
            });
          }
          
          this.processedCount++;
        } catch (error: any) {
          await messageQueueService.fail(msg.id, error.message);
        }
      });

      await Promise.all(promises);
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error in queue processor');
    }
  }
}

export const queueProcessor = new QueueProcessor();
