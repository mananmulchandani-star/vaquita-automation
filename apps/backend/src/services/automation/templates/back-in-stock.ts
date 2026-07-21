import { AutomationTrigger } from '@vaquita/shared';

export const backInStockTemplate = {
  name: 'Back In Stock Notification',
  description: 'Notify customers when a product is restocked',
  trigger: AutomationTrigger.BACK_IN_STOCK,
  flow: {
    startBlockId: 'send_notification',
    blocks: [
      {
        id: 'send_notification',
        type: 'ACTION',
        config: {
          actionType: 'send_whatsapp',
          params: {
            type: 'TEMPLATE',
            templateName: 'back_in_stock_v1',
            variables: { 
              1: '{{customer.firstName}}', 
              2: '{{payload.productTitle}}',
              3: '{{payload.productUrl}}'
            }
          }
        },
        nextBlockId: 'end'
      },
      { id: 'end', type: 'END', config: {} }
    ]
  }
};
