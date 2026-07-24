import { prisma } from '../../../config/database';
import { schedulerService } from '../../queue/scheduler.service';

export async function executeDelay(run: any, block: any): Promise<boolean> {
  const { duration, unit } = block.config; // e.g., { duration: 2, unit: 'minutes' }
  
  if (!duration || !unit) {
    throw new Error('Invalid delay configuration');
  }

  let delayMs = 0;
  switch (unit) {
    case 'minutes': delayMs = duration * 60 * 1000; break;
    case 'hours': delayMs = duration * 60 * 60 * 1000; break;
    case 'days': delayMs = duration * 24 * 60 * 60 * 1000; break;
    default: throw new Error(`Unknown delay unit: ${unit}`);
  }

  const executeAt = new Date(Date.now() + delayMs);

  // Set run status to WAITING and advance currentStep to nextBlockId
  // so that when it resumes, it starts at nextBlockId
  await prisma.automationRun.update({
    where: { id: run.id },
    data: { 
      status: 'WAITING',
      currentStep: block.nextBlockId,
    },
  });

  await schedulerService.scheduleDelayedAction({
    storeId: run.storeId,
    automationRunId: run.id,
    executeAt,
    action: { resumeFrom: block.nextBlockId },
  });

  return true; // Indicates engine should stop processing this run for now
}
