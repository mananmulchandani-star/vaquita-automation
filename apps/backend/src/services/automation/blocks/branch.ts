export async function executeBranch(run: any, block: any): Promise<string | null> {
  const { condition, trueBranch, falseBranch } = block.config;
  
  if (!condition) {
    throw new Error('Branch block missing condition');
  }

  const { field, operator, value } = condition;
  let actualValue: any = null;

  if (field.startsWith('order.')) {
    const orderField = field.split('.')[1];
    actualValue = run.context?.order ? run.context.order[orderField] : null;
  } else if (field.startsWith('customer.')) {
    const customerField = field.split('.')[1];
    actualValue = run.context?.customer ? run.context.customer[customerField] : null;
  } else {
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
  }

  return result ? trueBranch : falseBranch;
}
