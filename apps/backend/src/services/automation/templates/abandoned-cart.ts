import { AutomationTrigger } from '@vaquita/shared';

export const abandonedCartTemplate = {
  name: 'Abandoned Cart Recovery',
  description: 'Recover abandoned checkouts with multi-step reminders',
  trigger: AutomationTrigger.ABANDONED_CART,
  flow: {
    startBlockId: 'delay_1_hour',
    blocks: [
      {
        id: 'delay_1_hour',
        type: 'DELAY',
        config: { duration: 1, unit: 'hours' },
        nextBlockId: 'send_reminder_1'
      },
      {
        id: 'send_reminder_1',
        type: 'ACTION',
        config: {
          actionType: 'send_whatsapp',
          params: {
            type: 'TEMPLATE',
            templateName: 'abandoned_cart_reminder_1',
            variables: {
              1: '{{customer.firstName}}',
              2: '{{payload.checkoutUrl}}'
            }
          }
        },
        nextBlockId: 'delay_24_hours'
      },
      {
        id: 'delay_24_hours',
        type: 'DELAY',
        config: { duration: 24, unit: 'hours' },
        nextBlockId: 'check_recovered'
      },
      {
        id: 'check_recovered',
        type: 'BRANCH',
        config: {
          // If a new order was created for this customer in last 24h, consider recovered
          condition: { field: 'payload.isRecovered', operator: 'eq', value: true },
          trueBranch: 'end_recovered',
          falseBranch: 'send_coupon'
        }
      },
      {
        id: 'send_coupon',
        type: 'ACTION',
        config: {
          actionType: 'send_whatsapp',
          params: {
            type: 'TEMPLATE',
            templateName: 'abandoned_cart_coupon',
            variables: {
              1: '{{customer.firstName}}',
              2: 'COMEBACK10',
              3: '{{payload.checkoutUrl}}'
            }
          }
        },
        nextBlockId: 'end_sent'
      },
      { id: 'end_recovered', type: 'END', config: {} },
      { id: 'end_sent', type: 'END', config: {} }
    ]
  }
};
