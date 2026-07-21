export async function executeFilter(run: any, block: any): Promise<string | null> {
  const { filters } = block.config; // array of { field, operator, value }
  
  if (!filters || filters.length === 0) return block.nextBlockId || null;

  for (const filter of filters) {
    const { field, operator, value } = filter;
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

    let match = false;
    switch (operator) {
      case 'eq': match = actualValue === value; break;
      case 'neq': match = actualValue !== value; break;
      case 'gt': match = actualValue > value; break;
      case 'lt': match = actualValue < value; break;
      case 'contains': 
        if (Array.isArray(actualValue)) {
          match = actualValue.includes(value);
        } else if (typeof actualValue === 'string') {
          match = actualValue.includes(value);
        }
        break;
      case 'exists': match = actualValue !== null && actualValue !== undefined; break;
    }

    if (!match) {
      // Filter failed, end run
      return 'END_RUN';
    }
  }

  return block.nextBlockId || null;
}
