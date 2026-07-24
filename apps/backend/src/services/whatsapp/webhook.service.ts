import { prisma } from '../../config/database';
import { logger } from '../../config/logger';
import { emitNewMessage } from '../../lib/socket';
import { AutomationTrigger } from '@vaquita/shared';
import { getStoreContext } from '../../utils/context';

export class WhatsAppWebhookService {
  async verifyWebhook(storeId: string, mode: string, token: string, challenge: string): Promise<string> {
    const storeContext = await getStoreContext(storeId);
    if (mode === 'subscribe' && token === storeContext.waVerifyToken) {
      logger.info(`WhatsApp webhook verified successfully for store ${storeId}`);
      return challenge;
    }
    throw new Error('Verification failed');
  }

  async processWebhook(body: any) {
    try {
      if (body.object !== 'whatsapp_business_account') return;

      for (const entry of body.entry) {
        const storeRecord = await prisma.store.findFirst({ where: { waWabaId: entry.id } });
        if (!storeRecord) {
          logger.warn(`No store found for WABA ID: ${entry.id}`);
          continue;
        }
        const storeId = storeRecord.id;

        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const value = change.value;
            
            // Handle message status updates (sent, delivered, read, failed)
            if (value.statuses) {
              for (const status of value.statuses) {
                await this.handleMessageStatus(status);
              }
            }

            // Handle incoming messages
            if (value.messages) {
              for (const message of value.messages) {
                const contact = value.contacts?.find((c: any) => c.wa_id === message.from);
                await this.handleIncomingMessage(storeId, message, contact);
              }
            }
          } else if (change.field === 'message_template_status_update') {
            // Handle template status changes
            await this.handleTemplateStatus(storeId, change.value);
          }
        }
      }
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error processing WhatsApp webhook');
      throw error;
    }
  }

  private async handleMessageStatus(statusUpdate: any) {
    const waMessageId = statusUpdate.id;
    const status = statusUpdate.status.toUpperCase(); // SENT, DELIVERED, READ, FAILED
    const timestamp = new Date(parseInt(statusUpdate.timestamp) * 1000);

    const message = await prisma.whatsAppMessage.findFirst({
      where: { waMessageId }
    });

    if (message) {
      await prisma.whatsAppMessage.update({
        where: { id: message.id },
        data: { status, updatedAt: timestamp }
      });
      logger.info({ messageId: message.id, status }, `Updated message status`);
    }
  }

  private async handleIncomingMessage(storeId: string, message: any, contact: any) {
    const phone = message.from;
    const timestamp = new Date(parseInt(message.timestamp) * 1000);
    const type = message.type;
    
    // Find customer by phone
    let customer = await prisma.customer.findFirst({
      where: { storeId, phone: { contains: phone } }
    });

    if (!customer && contact) {
      // Create shadow customer if none exists
      customer = await prisma.customer.create({
        data: {
          storeId,
          firstName: contact.profile?.name || 'Unknown',
          phone,
          whatsappOptIn: 'OPTED_IN',
          shopifyCustomerId: `shadow_${phone}`
        }
      });
    }

    if (!customer) return;

    // Build content
    let contentStr: string | undefined = undefined;
    let buttonPayload: string | undefined = undefined;
    if (type === 'text') {
      contentStr = message.text.body;
    } else if (type === 'button') {
      contentStr = message.button.text;
      buttonPayload = message.button.payload;
    } else if (type === 'interactive') {
      if (message.interactive.type === 'button_reply') {
        contentStr = message.interactive.button_reply.title;
        buttonPayload = message.interactive.button_reply.id;
      } else if (message.interactive.type === 'list_reply') {
        contentStr = message.interactive.list_reply.title;
        buttonPayload = message.interactive.list_reply.id;
      }
    }

    const waMsg = await prisma.whatsAppMessage.create({
      data: {
        storeId,
        customerId: customer.id,
        direction: 'INBOUND',
        status: 'DELIVERED',
        type: type === 'interactive' ? 'INTERACTIVE' : type.toUpperCase() as any,
        waMessageId: message.id,
        content: contentStr,
        buttonPayload,
        createdAt: timestamp,
      }
    });

    // Create CustomerReply record which is used by condition blocks
    await prisma.customerReply.create({
      data: {
        storeId,
        customerId: customer.id,
        messageId: waMsg.id,
        type: (type === 'interactive' ? 'INTERACTIVE' : type.toUpperCase()) as any,
        content: contentStr || buttonPayload || 'MEDIA',
      }
    });

    // Trigger any automations waiting on replies
    const { engine } = await import('../automation/engine.js');
    await engine.triggerAutomation(AutomationTrigger.CUSTOMER_REPLIED, storeId, {
      customerId: customer.id,
      payload: { message: contentStr || buttonPayload || type }
    });

    // Emit socket event to frontend
    emitNewMessage(storeId, waMsg);
  }

  private async handleTemplateStatus(storeId: string, value: any) {
    await prisma.whatsAppTemplate.updateMany({
      where: { storeId, name: value.message_template_name, language: value.message_template_language },
      data: { status: value.event.toUpperCase() } // APPROVED, REJECTED
    });
  }
}

export const whatsAppWebhookService = new WhatsAppWebhookService();
