import { messageService } from '../../whatsapp/message.service';
import { orderService } from '../../shopify/order.service';
import { customerService } from '../../shopify/customer.service';

export async function executeAction(run: any, block: any): Promise<string | null> {
  const { actionType, params } = block.config;
  const storeId = run.storeId;
  const context = run.context;

  switch (actionType) {
    case 'send_whatsapp':
      if (!context.customer?.phone) throw new Error('No customer phone number available');
      
      if (params.type === 'TEMPLATE') {
        await messageService.sendTemplateMessage(storeId, {
          customerId: context.customerId,
          phone: context.customer.phone,
          templateName: params.templateName,
          language: params.language || 'en',
          variables: resolveVariables(params.variables, context),
        });
      } else if (params.type === 'TEXT') {
        await messageService.sendTextMessage(storeId, {
          customerId: context.customerId,
          phone: context.customer.phone,
          text: resolveVariables(params.text, context),
        });
      }
      break;

    case 'add_tag':
      if (params.entity === 'order' && context.orderId) {
        await orderService.updateOrderTags(storeId, context.orderId, [params.tag]);
      }
      break;

    case 'remove_tag':
      // Requires fetch, filter, update - simplified here
      break;

    case 'cancel_order':
      if (context.orderId) {
        await orderService.cancelOrder(storeId, context.orderId, params.reason || 'CUSTOMER');
      }
      break;

    case 'confirm_cod':
      if (context.orderId) {
        await orderService.confirmCOD(storeId, context.orderId);
      }
      break;

    case 'update_order_note':
      if (context.orderId) {
        await orderService.addInternalNote(storeId, context.orderId, params.note, 'AUTOMATION_ENGINE');
      }
      break;

    default:
      throw new Error(`Unknown action type: ${actionType}`);
  }

  return block.nextBlockId || null;
}

function resolveVariables(variables: any, context: any): any {
  if (!variables) return variables;
  
  if (typeof variables === 'string') {
    // Simple interpolation {{order.orderNumber}}
    return variables.replace(/\{\{(.+?)\}\}/g, (match, path) => {
      const parts = path.trim().split('.');
      let current = context;
      for (const part of parts) {
        if (current === undefined || current === null) return '';
        current = current[part];
      }
      return current !== undefined ? current : '';
    });
  }
  
  if (Array.isArray(variables)) {
    return variables.map(v => resolveVariables(v, context));
  }
  
  if (typeof variables === 'object') {
    const resolved: any = {};
    for (const key in variables) {
      resolved[key] = resolveVariables(variables[key], context);
    }
    return resolved;
  }
  
  return variables;
}
