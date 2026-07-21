import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';
import { StoreContext } from '@vaquita/shared';

export const getStoreContext = async (storeId: string): Promise<StoreContext> => {
  const storeRecord = await prisma.store.findUnique({
    where: { id: storeId }
  });

  if (!storeRecord) {
    throw new Error(`Store ${storeId} not found`);
  }

  const decryptIfSet = (val: string | null) => {
    if (!val) return undefined;
    try { return decrypt(val); } catch (e) { return undefined; }
  };

  return {
    id: storeRecord.id,
    shopifyDomain: storeRecord.shopifyDomain,
    name: storeRecord.name,
    email: storeRecord.email,
    currency: storeRecord.currency,
    timezone: storeRecord.timezone,
    
    shopifyAccessToken: decryptIfSet(storeRecord.shopifyAccessToken),
    shopifyApiKey: decryptIfSet(storeRecord.shopifyApiKey),
    shopifyApiSecret: decryptIfSet(storeRecord.shopifyApiSecret),
    shopifyWebhookSecret: decryptIfSet(storeRecord.shopifyWebhookSecret),

    waAppId: storeRecord.waAppId || undefined,
    waAppSecret: decryptIfSet(storeRecord.waAppSecret),
    waAccessToken: decryptIfSet(storeRecord.waAccessToken),
    waPhoneNumberId: storeRecord.waPhoneNumberId || undefined,
    waWabaId: storeRecord.waWabaId || undefined,
    waVerifyToken: decryptIfSet(storeRecord.waVerifyToken),
    waWebhookSecret: decryptIfSet(storeRecord.waWebhookSecret),
    waApiVersion: storeRecord.waApiVersion || 'v21.0',

    brandName: storeRecord.brandName || undefined,
    supportNumber: storeRecord.supportNumber || undefined,
    defaultCountry: storeRecord.defaultCountry || undefined,
    defaultLanguage: storeRecord.defaultLanguage || undefined,

    isIntegrationComplete: storeRecord.isIntegrationComplete
  };
};
