import { prisma } from '@/lib/prisma';
import { logger } from '@/config/logger';

export async function executeEnd(run: any, block: any): Promise<string | null> {
  // Update automation stats if needed
  // For instance, increment successful runs counter on the automation itself
  await prisma.automation.update({
    where: { id: run.automationId },
    data: {
      // In a real app, you might have a stats JSON or specific fields
      // runsCount: { increment: 1 }
    }
  });

  logger.info(`Run ${run.id} ending at END block`);
  
  // Returning 'END_RUN' or null will signal engine to stop
  return 'END_RUN';
}
