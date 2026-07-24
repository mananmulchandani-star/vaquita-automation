import { prisma } from '../../config/database';
import { logger } from '../../config/logger';
import { engine } from '../automation/engine'; // We will create this

export class SchedulerService {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  async scheduleDelayedAction(params: { storeId: string; automationRunId: string; executeAt: Date; action: any }) {
    logger.info(`Scheduling delayed action for run ${params.automationRunId} at ${params.executeAt}`);
    return prisma.notificationQueue.create({
      data: {
        storeId: params.storeId,
        type: 'DELAYED_ACTION',
        payload: { automationRunId: params.automationRunId, action: params.action },
        nextRetryAt: params.executeAt,
        status: 'PENDING',
      },
    });
  }

  async scheduleCampaign(campaignId: string, scheduledAt: Date) {
    logger.info(`Scheduling campaign ${campaignId} at ${scheduledAt}`);
    return prisma.campaign.update({
      where: { id: campaignId },
      data: {
        scheduledAt,
        status: 'SCHEDULED',
      },
    });
  }

  startScheduler() {
    if (this.isRunning) return;
    this.isRunning = true;
    logger.info('Scheduler service started');

    this.intervalId = setInterval(async () => {
      if (!this.isRunning) return;
      await this.processScheduledItems();
    }, 10000); // Check every 10 seconds
  }

  stopScheduler() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    logger.info('Scheduler service stopped');
  }

  async processScheduledItems() {
    try {
      // Find pending notification queue items whose time has come
      const items = await prisma.notificationQueue.findMany({
        where: {
          status: 'PENDING',
          nextRetryAt: { lte: new Date() },
          type: 'DELAYED_ACTION'
        },
        take: 50,
      });

      if (items.length > 0) {
        logger.info(`Processing ${items.length} scheduled items`);
        await prisma.notificationQueue.updateMany({
          where: { id: { in: items.map((i: any) => i.id) } },
          data: { status: 'PROCESSING' },
        });

        for (const item of items) {
          try {
            const payload = item.payload as any;
            await engine.resumeRun(payload.automationRunId, payload.action);
            
            await prisma.notificationQueue.update({
              where: { id: item.id },
              data: { status: 'COMPLETED' },
            });
          } catch (error: any) {
            logger.error(`Failed to process scheduled item ${item.id}: ${error.message}`);
            await prisma.notificationQueue.update({
              where: { id: item.id },
              data: { status: 'FAILED' },
            });
          }
        }
      }

      // Check for scheduled campaigns
      const campaigns = await prisma.campaign.findMany({
        where: {
          status: 'SCHEDULED',
          scheduledAt: { lte: new Date() },
        },
      });

      for (const campaign of campaigns) {
        // We'll process campaign here or delegate to a campaign processor
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: { status: 'RUNNING' },
        });
        logger.info(`Started scheduled campaign ${campaign.id}`);
      }

    } catch (error: any) {
      logger.error(`Error in scheduler service: ${error.message}`);
    }
  }

  async cancelScheduled(automationRunId: string) {
    const items = await prisma.notificationQueue.findMany({
      where: { status: 'PENDING' }
    });
    const toCancel = items.filter((item: any) => item.payload && item.payload.automationRunId === automationRunId);
    if (toCancel.length > 0) {
      return prisma.notificationQueue.updateMany({
        where: { id: { in: toCancel.map((i: any) => i.id) } },
        data: { status: 'FAILED' }, // 'FAILED' since 'CANCELLED' doesn't exist
      });
    }
    return { count: 0 };
  }
}

export const schedulerService = new SchedulerService();
