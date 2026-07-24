import { prisma } from '../../../config/database';

export async function executeCondition(run: any, block: any): Promise<string | null> {
  const { field, operator, value, trueBranch, falseBranch } = block.config;
  
  let actualValue: any = null;

  // Resolve actual value from context
  if (field === 'customer_replied') {
    // Check if customer replied since the run started
    const customerId = run.context?.customerId;
    if (customerId) {
      const reply = await prisma.customerReply.findFirst({
        where: {
          customerId,
          createdAt: { gte: run.createdAt },
        }
      });
      actualValue = !!reply;
    } else {
      actualValue = false;
    }
  } else if (field.startsWith('order.')) {
    const orderField = field.split('.')[1];
    actualValue = run.context?.order ? run.context.order[orderField] : null;
  } else if (field.startsWith('customer.')) {
    const customerField = field.split('.')[1];
    actualValue = run.context?.customer ? run.context.customer[customerField] : null;
  } else {
    // Context variable
    actualValue = run.context ? run.context[field] : null;
  }

  let result = false;

  switch (operator) {
    case 'eq': result = actualValue === value; break;
    case 'neq': result = actualValue !== value; break;
    case 'gt': result = actualValue > value; break;
    case 'lt': result = actualValue < value; break;
    case 'contains': 
      if (Array.isArray(actualValue)) {
        result = actualValue.includes(value);
      } else if (typeof actualValue === 'string') {
        result = actualValue.includes(value);
      }
      break;
    case 'exists': result = actualValue !== null && actualValue !== undefined; break;
    default: throw new Error(`Unknown operator: ${operator}`);
  }

  return result ? (trueBranch || block.nextBlockId) : (falseBranch || null);
}
