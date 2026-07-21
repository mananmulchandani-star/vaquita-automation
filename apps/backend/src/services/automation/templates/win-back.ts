import { AutomationTrigger } from '@vaquita/shared';

export const winBackTemplate = {
  name: 'Win Back Campaign',
  description: 'Send special offer to customers who havent purchased in 60 days',
  trigger: AutomationTrigger.SCHEDULED,
  flow: {
    startBlockId: 'filter_idle',
    blocks: [
      {
        id: 'filter_idle',
        type: 'FILTER',
        config: {
          // This expects context to be passed by a scheduler that checks last purchase date
          filters: [
            { field: 'customer.daysSinceLastOrder', operator: 'gt', value: 60 }
          ]
        },
        nextBlockId: 'send_offer'
      },
      {
        id: 'send_offer',
        type: 'ACTION',
        config: {
          actionType: 'send_whatsapp',
          params: {
            type: 'TEMPLATE',
            templateName: 'win_back_offer_v1',
            variables: { 1: '{{customer.firstName}}', 2: 'MISSYOU20' }
          }
        },
        nextBlockId: 'end'
      },
      { id: 'end', type: 'END', config: {} }
    ]
  }
};
