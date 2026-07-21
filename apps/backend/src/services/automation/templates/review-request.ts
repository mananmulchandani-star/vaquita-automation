import { AutomationTrigger } from '@vaquita/shared';

export const reviewRequestTemplate = {
  name: 'Standalone Review Request',
  description: 'Send review request 3 days after delivery',
  trigger: AutomationTrigger.FULFILLMENT_UPDATED,
  flow: {
    startBlockId: 'filter_delivered',
    blocks: [
      {
        id: 'filter_delivered',
        type: 'FILTER',
        config: {
          filters: [
            { field: 'payload.status', operator: 'eq', value: 'DELIVERED' }
          ]
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
