import { AutomationTrigger } from '@vaquita/shared';

export const shippingUpdateTemplate = {
  name: 'Shipping Update',
  description: 'Send tracking details when order is fulfilled',
  trigger: AutomationTrigger.FULFILLMENT_CREATED,
  flow: {
    startBlockId: 'send_shipping_update',
    blocks: [
      {
        id: 'send_shipping_update',
        type: 'ACTION',
        config: {
          actionType: 'send_whatsapp',
          params: {
            type: 'TEMPLATE',
            templateName: 'shipping_update_v1',
            variables: {
              1: '{{customer.firstName}}',
              2: '{{order.orderNumber}}',
              3: '{{payload.trackingCompany}}',
              4: '{{payload.trackingNumber}}',
              5: '{{payload.trackingUrl}}'
            }
          }
        },
        nextBlockId: 'end'
      },
      {
        id: 'end',
        type: 'END',
        config: {}
      }
    ]
  }
};
