import { logger } from '../../config/logger';

export class PhoneService {
  async getBusinessProfile(storeId: string) {
    logger.info(`Fetching business profile for store ${storeId}`);
    // await whatsappClient.getBusinessProfile(storeId);
    return {
      about: "Official WhatsApp account",
      address: "123 Commerce St",
      description: "We sell the best products.",
      email: "support@store.com",
      profile_picture_url: "https://example.com/logo.png",
      websites: ["https://store.com"]
    };
  }

  async updateBusinessProfile(storeId: string, params: any) {
    logger.info(`Updating business profile for store ${storeId}`);
    // await whatsappClient.updateBusinessProfile(storeId, params);
    return true;
  }

  async getPhoneNumbers(storeId: string) {
    logger.info(`Fetching registered phone numbers for store ${storeId}`);
    // await whatsappClient.getPhoneNumbers(storeId);
    return [
      {
        id: "phone_123",
        display_phone_number: "+1 555-1234",
        verified_name: "My Store",
        quality_rating: "GREEN",
        status: "CONNECTED"
      }
    ];
  }
}

export const phoneService = new PhoneService();
