import { prisma } from '../../../config/database';

export async function executeTrigger(run: any, block: any): Promise<string | null> {
  // A trigger block usually just extracts context variables and passes them along.
  // We can validate if the trigger context is still valid.

  // In a real implementation, we might fetch the order or customer if they are not fully populated in context
  if (run.context?.orderId && !run.context.order) {
    const order = await prisma.order.findUnique({ where: { id: run.context.orderId }, include: { customer: true } });
    if (order) {
      run.context.order = order;
      if (order.customerId) {
        run.context.customerId = order.customerId;
        run.context.customer = order.customer;
      }
    }
  } else if (run.context?.customerId && !run.context.customer) {
    const customer = await prisma.customer.findUnique({ where: { id: run.context.customerId } });
    if (customer) {
      run.context.customer = customer;
    }
  }

  // Update run context in DB
  await prisma.automationRun.update({
    where: { id: run.id },
    data: { context: run.context },
  });

  return block.nextBlockId || null;
}
