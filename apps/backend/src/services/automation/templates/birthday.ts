import { AutomationTrigger } from '@vaquita/shared';

export const birthdayTemplate = {
  name: 'Birthday Greeting',
  description: 'Send a birthday greeting and discount',
  trigger: AutomationTrigger.SCHEDULED,
  flow: {
    startBlockId: 'filter_birthday',
    blocks: [
      {
        id: 'filter_birthday',
        type: 'FILTER',
        config: {
          filters: [
            { field: 'customer.isBirthdayToday', operator: 'eq', value: true }
          ]
        },
        nextBlockId: 'send_greeting'
      },
      {
        id: 'send_greeting',
        type: 'ACTION',
        config: {
          actionType: 'send_whatsapp',
          params: {
            type: 'TEMPLATE',
            templateName: 'birthday_greeting_v1',
            variables: { 1: '{{customer.firstName}}', 2: 'BDAY15' }
          }
        },
        nextBlockId: 'end'
      },
      { id: 'end', type: 'END', config: {} }
    ]
  }
};
