import { AutomationTrigger } from '@vaquita/shared';

export const codConfirmationTemplate = {
  name: 'COD Order Confirmation',
  description: 'Automatically confirm COD orders via WhatsApp to reduce RTO',
  trigger: AutomationTrigger.ORDER_CREATED,
  flow: {
    startBlockId: 'filter_cod',
    blocks: [
      {
        id: 'filter_cod',
        type: 'FILTER',
        config: {
          filters: [
            { field: 'order.paymentMethod', operator: 'eq', value: 'COD' }
          ]
        },
        nextBlockId: 'delay_2_mins'
      },
      {
        id: 'delay_2_mins',
        type: 'DELAY',
        config: { duration: 2, unit: 'minutes' },
        nextBlockId: 'send_confirmation_msg'
      },
      {
        id: 'send_confirmation_msg',
        type: 'ACTION',
        config: {
          actionType: 'send_whatsapp',
          params: {
            type: 'TEMPLATE',
            templateName: 'cod_confirmation_v1',
            variables: {
              1: '{{customer.firstName}}',
              2: '{{order.orderNumber}}',
              3: '{{order.totalPrice}}'
            }
          }
        },
        nextBlockId: 'delay_6_hours'
      },
      {
        id: 'delay_6_hours',
        type: 'DELAY',
        config: { duration: 6, unit: 'hours' },
        nextBlockId: 'check_reply_1'
      },
      {
        id: 'check_reply_1',
        type: 'BRANCH',
        config: {
          condition: { field: 'customer_replied', operator: 'eq', value: true },
          trueBranch: 'confirm_order_1',
          falseBranch: 'send_reminder'
        }
      },
      {
        id: 'confirm_order_1',
        type: 'ACTION',
        config: { actionType: 'confirm_cod', params: {} },
        nextBlockId: 'end_success'
      },
      {
        id: 'send_reminder',
        type: 'ACTION',
        config: {
          actionType: 'send_whatsapp',
          params: {
            type: 'TEMPLATE',
            templateName: 'cod_reminder_v1',
            variables: {
              1: '{{customer.firstName}}',
              2: '{{order.orderNumber}}'
            }
          }
        },
        nextBlockId: 'delay_24_hours'
      },
      {
        id: 'delay_24_hours',
        type: 'DELAY',
        config: { duration: 24, unit: 'hours' },
        nextBlockId: 'check_reply_2'
      },
      {
        id: 'check_reply_2',
        type: 'BRANCH',
        config: {
          condition: { field: 'customer_replied', operator: 'eq', value: true },
          trueBranch: 'confirm_order_2',
          falseBranch: 'cancel_order'
        }
      },
      {
        id: 'confirm_order_2',
        type: 'ACTION',
        config: { actionType: 'confirm_cod', params: {} },
        nextBlockId: 'end_success'
      },
      {
        id: 'cancel_order',
        type: 'ACTION',
        config: { actionType: 'cancel_order', params: { reason: 'CUSTOMER' } },
        nextBlockId: 'notify_cancellation'
      },
      {
        id: 'notify_cancellation',
        type: 'ACTION',
        config: {
          actionType: 'send_whatsapp',
          params: {
            type: 'TEMPLATE',
            templateName: 'order_cancelled_cod',
            variables: { 1: '{{customer.firstName}}', 2: '{{order.orderNumber}}' }
          }
        },
        nextBlockId: 'end_cancelled'
      },
      { id: 'end_success', type: 'END', config: {} },
      { id: 'end_cancelled', type: 'END', config: {} }
    ]
  }
};
