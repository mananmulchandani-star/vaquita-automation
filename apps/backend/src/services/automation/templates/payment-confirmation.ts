import { AutomationTrigger } from '@vaquita/shared';

export const paymentConfirmationTemplate = {
  name: 'Prepaid Order Confirmation',
  description: 'Send payment success confirmation for prepaid orders',
  trigger: AutomationTrigger.ORDER_CREATED,
  flow: {
    startBlockId: 'filter_prepaid',
    blocks: [
      {
        id: 'filter_prepaid',
        type: 'FILTER',
        config: {
          filters: [
            { field: 'order.paymentMethod', operator: 'eq', value: 'PREPAID' }
          ]
        },
        nextBlockId: 'send_success'
      },
      {
        id: 'send_success',
        type: 'ACTION',
        config: {
          actionType: 'send_whatsapp',
          params: {
            type: 'TEMPLATE',
            templateName: 'payment_success_v1',
            variables: {
              1: '{{customer.firstName}}',
              2: '{{order.orderNumber}}',
              3: '{{order.totalPrice}}'
            }
          }
        },
        nextBlockId: 'end'
      },
      { id: 'end', type: 'END', config: {} }
    ]
  }
};
