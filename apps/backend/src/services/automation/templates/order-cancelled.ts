import { AutomationTrigger } from '@vaquita/shared';

export const orderCancelledTemplate = {
  name: 'Order Cancelled',
  description: 'Notify customer when their order is cancelled',
  trigger: AutomationTrigger.ORDER_CANCELLED,
  flow: {
    startBlockId: 'send_cancellation',
    blocks: [
      {
        id: 'send_cancellation',
        type: 'ACTION',
        config: {
          actionType: 'send_whatsapp',
          params: {
            type: 'TEMPLATE',
            templateName: 'order_cancelled_v1',
            variables: { 1: '{{customer.firstName}}', 2: '{{order.orderNumber}}' }
          }
        },
        nextBlockId: 'end'
      },
      { id: 'end', type: 'END', config: {} }
    ]
  }
};
