import { StoreContext } from '@vaquita/shared';

declare global {
  namespace Express {
    interface Request {
      storeContext?: StoreContext;
    }
  }
}
