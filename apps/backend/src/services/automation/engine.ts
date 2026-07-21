import { prisma } from '@/lib/prisma';
import { logger } from '@/config/logger';
import { executeTrigger } from './blocks/trigger';
import { executeDelay } from './blocks/delay';
import { executeCondition } from './blocks/condition';
import { executeFilter } from './blocks/filter';
import { executeAction } from './blocks/action';
import { executeBranch } from './blocks/branch';
import { executeEnd } from './blocks/end';
import { AutomationTrigger } from '@vaquita/shared';

export class AutomationEngine {
  async triggerAutomation(trigger: AutomationTrigger, storeId: string, context: { orderId?: string; customerId?: string; payload?: any }) {
    logger.info(`Triggering automations for event ${trigger} store ${storeId}`);

    // Find all active automations for this trigger
    const automations = await prisma.automation.findMany({
      where: {
        storeId,
        isActive: true,
        triggerType: trigger,
      },
    });

    if (automations.length === 0) {
      logger.info(`No active automations found for trigger ${trigger}`);
      return;
    }

    for (const automation of automations) {
      const flow = typeof automation.flowDefinition === 'string' ? JSON.parse(automation.flowDefinition) : automation.flowDefinition;
      
      const run = await prisma.automationRun.create({
        data: {
          storeId,
          automationId: automation.id,
          status: 'RUNNING',
          context: context as any,
          currentStep: flow.startBlockId,
        },
      });

      // Execute asynchronously to not block the caller
      this.processRun(run.id, flow).catch(err => {
        logger.error({ err }, `Error processing automation run ${run.id}`);
      });
    }
  }

  async processRun(runId: string, flow?: any) {
    let run = await prisma.automationRun.findUnique({ where: { id: runId }, include: { automation: true } });
    if (!run) throw new Error(`Run ${runId} not found`);
    if (run.status !== 'RUNNING') return; // Might be WAITING, COMPLETED, or FAILED

    if (!flow) {
      flow = typeof run.automation.flowDefinition === 'string' ? JSON.parse(run.automation.flowDefinition as string) : run.automation.flowDefinition;
    }

    let currentStep = run.currentStep;

    try {
      while (currentStep) {
        const block = flow.blocks.find((b: any) => b.id === currentStep);
        if (!block) throw new Error(`Block ${currentStep} not found in flow`);

        logger.info(`Executing block ${block.type} run ${runId} block ${block.id}`);
        
        let nextBlockId: string | null = null;
        let shouldWait = false;

        switch (block.type) {
          case 'TRIGGER':
            nextBlockId = await executeTrigger(run, block);
            break;
          case 'DELAY':
            shouldWait = await executeDelay(run, block);
            if (!shouldWait) nextBlockId = block.nextBlockId;
            break;
          case 'CONDITION':
            nextBlockId = await executeCondition(run, block);
            break;
          case 'FILTER':
            nextBlockId = await executeFilter(run, block);
            break;
          case 'ACTION':
            nextBlockId = await executeAction(run, block);
            break;
          case 'BRANCH':
            nextBlockId = await executeBranch(run, block);
            break;
          case 'END':
            nextBlockId = await executeEnd(run, block);
            break;
          default:
            throw new Error(`Unknown block type: ${block.type}`);
        }

        if (shouldWait) {
          logger.info(`Run ${runId} is now WAITING`);
          return; // Exit loop, will be resumed by scheduler
        }

        if (nextBlockId === 'END_RUN' || nextBlockId === null) {
          logger.info(`Run ${runId} finished normally (No next block)`);
          await prisma.automationRun.update({
            where: { id: run.id },
            data: { status: 'COMPLETED', completedAt: new Date(), currentStep: null },
          });
          break;
        }

        currentStep = nextBlockId;
        // Update DB so we can track progress
        run = await prisma.automationRun.update({
          where: { id: run.id },
          data: { currentStep },
          include: { automation: true }
        });
      }
    } catch (error: any) {
      logger.error(`Run ${runId} failed: ${error.message}`);
      await prisma.automationRun.update({
        where: { id: run.id },
        data: { status: 'FAILED', error: error.message },
      });
    }
  }

  async resumeRun(runId: string, action?: any) {
    logger.info(`Resuming run ${runId}`);
    const run = await prisma.automationRun.findUnique({ where: { id: runId } });
    if (!run) return;

    if (run.status === 'WAITING') {
      await prisma.automationRun.update({
        where: { id: runId },
        data: { status: 'RUNNING' },
      });
      // The delay block's next block is usually stored in the block config or we just find it
      const flow = typeof (run as any).automation?.flowDefinition === 'string' 
        ? JSON.parse((run as any).automation.flowDefinition) 
        : (run as any).automation?.flowDefinition;
      
      if (!flow) {
        // Fetch automation if not included
        const fullRun = await prisma.automationRun.findUnique({ where: { id: runId }, include: { automation: true } });
        if (fullRun) {
          this.processRun(runId).catch(console.error);
        }
      } else {
        this.processRun(runId, flow).catch(console.error);
      }
    }
  }

  async resumeWaitingRuns() {
    // Usually handled by scheduler, but this can be a fallback
  }

  async cancelRun(runId: string) {
    logger.info(`Cancelling run ${runId}`);
    return prisma.automationRun.update({
      where: { id: runId },
      data: { status: 'CANCELLED', currentStep: null },
    });
  }

  async retryFailedRun(runId: string) {
    logger.info(`Retrying failed run ${runId}`);
    const run = await prisma.automationRun.update({
      where: { id: runId },
      data: { status: 'RUNNING', error: null },
    });
    this.processRun(run.id).catch(console.error);
    return run;
  }

  async getRunStatus(runId: string) {
    return prisma.automationRun.findUnique({
      where: { id: runId },
      include: {
        automation: {
          select: { name: true }
        }
      }
    });
  }
}

export const engine = new AutomationEngine();
