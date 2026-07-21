import { AutomationTrigger } from '@vaquita/shared';

export const outForDeliveryTemplate = {
  name: 'Out For Delivery',
  description: 'Notify customer when order is out for delivery',
  trigger: AutomationTrigger.FULFILLMENT_UPDATED,
  flow: {
    startBlockId: 'filter_status',
    blocks: [
      {
        id: 'filter_status',
        type: 'FILTER',
        config: {
          filters: [
            { field: 'payload.status', operator: 'eq', value: 'OUT_FOR_DELIVERY' }
          ]
        },
        nextBlockId: 'send_msg'
      },
      {
        id: 'send_msg',
        type: 'ACTION',
        config: {
          actionType: 'send_whatsapp',
          params: {
            type: 'TEMPLATE',
            templateName: 'out_for_delivery_v1',
            variables: { 1: '{{customer.firstName}}', 2: '{{order.orderNumber}}' }
          }
        },
        nextBlockId: 'end'
      },
      { id: 'end', type: 'END', config: {} }
    ]
  }
};
