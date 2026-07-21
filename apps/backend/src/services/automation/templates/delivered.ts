import { AutomationTrigger } from '@vaquita/shared';

export const deliveredTemplate = {
  name: 'Delivered + Review Request',
  description: 'Send delivery confirmation, wait 3 days, ask for review',
  trigger: AutomationTrigger.FULFILLMENT_UPDATED,
  flow: {
    startBlockId: 'filter_status',
    blocks: [
      {
        id: 'filter_status',
        type: 'FILTER',
        config: {
          filters: [
            { field: 'payload.status', operator: 'eq', value: 'DELIVERED' }
          ]
        },
        nextBlockId: 'send_delivered'
      },
      {
        id: 'send_delivered',
        type: 'ACTION',
        config: {
          actionType: 'send_whatsapp',
          params: {
            type: 'TEMPLATE',
            templateName: 'order_delivered_v1',
            variables: { 1: '{{customer.firstName}}', 2: '{{order.orderNumber}}' }
          }
        },
        nextBlockId: 'delay_3_days'
      },
      {
        id: 'delay_3_days',
        type: 'DELAY',
        config: { duration: 3, unit: 'days' },
        nextBlockId: 'send_review'
      },
      {
        id: 'send_review',
        type: 'ACTION',
        config: {
          actionType: 'send_whatsapp',
          params: {
            type: 'TEMPLATE',
            templateName: 'review_request_v1',
            variables: { 1: '{{customer.firstName}}', 2: '{{payload.reviewUrl}}' }
          }
        },
        nextBlockId: 'end'
      },
      { id: 'end', type: 'END', config: {} }
    ]
  }
};
