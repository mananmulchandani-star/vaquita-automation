import { prisma } from '../../config/database';
import { logger } from '../../config/logger';

export class MediaService {
  async uploadMedia(storeId: string, file: Buffer, mimeType: string, filename: string) {
    logger.info(`Uploading media ${filename} for store ${storeId}`);
    
    // In production, we would upload to Supabase Storage or similar first
    // const publicUrl = await supabaseStorage.upload(file);
    const publicUrl = `https://storage.vaquita.com/${storeId}/${filename}`;

    // Then upload to WhatsApp Media API to get Media ID
    // const mediaId = await whatsappClient.uploadMedia(file, mimeType);
    const mediaId = `wa_media_${Date.now()}`;

    // We don't have type in schema, but purpose is required
    let purpose = 'MESSAGE';

    return prisma.media.create({
      data: {
        storeId,
        waMediaId: mediaId,
        url: publicUrl,
        mimeType,
        filename,
        originalFilename: filename,
        size: file.length,
        purpose,
      }
    });
  }

  async downloadMedia(mediaId: string): Promise<Buffer> {
    logger.info(`Downloading media ${mediaId} from WhatsApp`);
    // return whatsappClient.downloadMedia(mediaId);
    return Buffer.from('mock-media-content');
  }

  async getMedia(storeId: string, filters: { type?: string; skip?: number; take?: number } = {}) {
    const { skip = 0, take = 50, type } = filters;
    const where: any = { storeId };
    if (type) {
      if (type === 'IMAGE') where.mimeType = { startsWith: 'image/' };
      else if (type === 'VIDEO') where.mimeType = { startsWith: 'video/' };
      else if (type === 'DOCUMENT') where.mimeType = { not: { startsWith: 'image/' }, notIn: ['video/'] }; // rough
    }

    const [total, media] = await prisma.$transaction([
      prisma.media.count({ where }),
      prisma.media.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, media };
  }

  async deleteMedia(storeId: string, mediaId: string) {
    const media = await prisma.media.findUnique({ where: { id: mediaId } });
    if (!media) throw new Error('Media not found');

    // In production, delete from storage bucket and WhatsApp if possible
    // await supabaseStorage.delete(media.url);

    return prisma.media.delete({
      where: { id: mediaId }
    });
  }
}

export const mediaService = new MediaService();
