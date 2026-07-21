import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date, format: string = 'en-IN'): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat(format, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}

export function formatPhone(phone: string, defaultCountry: any = 'IN'): string | null {
  const phoneNumber = parsePhoneNumberFromString(phone, defaultCountry);
  if (phoneNumber && phoneNumber.isValid()) {
    return phoneNumber.format('E.164');
  }
  return null;
}

export function generateOrderConfirmationMessage(order: any): string {
  return `Hi ${order.customerName}, your order ${order.orderNumber} for ${formatCurrency(order.totalPrice)} is confirmed. We will notify you once it ships.`;
}

export function calculateRetryDelay(attempt: number, initialDelay: number = 1000): number {
  return Math.min(initialDelay * Math.pow(2, attempt), 30000); // Max 30 seconds
}

export function sanitizeHtml(input: string): string {
  return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export function omitNullish<T extends Record<string, any>>(obj: T): Partial<T> {
  const result = { ...obj };
  Object.keys(result).forEach(key => {
    if (result[key] === null || result[key] === undefined) {
      delete result[key];
    }
  });
  return result;
}

export function generateCorrelationId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
