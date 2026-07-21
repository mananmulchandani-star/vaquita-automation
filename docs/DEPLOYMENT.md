# Deployment Guide (Railway)

VAQUITA Automation is optimized for deployment on Railway, leveraging Docker containers for seamless scaling.

## 1. Create a Railway Project

1. Log in to [Railway](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select the `vaquita-automation` repository.
4. Railway will detect the `railway.toml` and `Dockerfile` automatically.

## 2. Add PostgreSQL Service

1. In your Railway project view, click **New** -> **Database** -> **Add PostgreSQL**.
2. Railway will provision a PostgreSQL 16 database automatically.
3. Once deployed, Railway automatically injects `DATABASE_URL` into your project environment.

## 3. Configure Environment Variables

Navigate to the **Variables** tab of your app service and add all necessary production secrets:

- `NODE_ENV=production`
- `PORT=3001`
- `JWT_SECRET`
- `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SHOPIFY_WEBHOOK_SECRET`
- `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`

## 4. Custom Domain Setup

1. In Railway, go to the **Settings** tab of your app service.
2. Under **Domains**, click **Generate Domain** or **Custom Domain**.
3. If using a custom domain, configure your DNS CNAME records as instructed by Railway.

## 5. Post-Deployment Steps

After your application is live, you must configure the third-party platforms to communicate with it.

### Register Shopify Webhooks
Register the following webhooks in your Shopify App setup pointing to `https://your-domain.com/api/v1/webhooks/shopify`:
- `orders/create`
- `orders/updated`
- `orders/cancelled`
- `customers/create`
- `customers/update`

### Configure WhatsApp Webhook
1. Go to the Meta App Dashboard -> WhatsApp -> Configuration.
2. Edit the Callback URL to `https://your-domain.com/api/v1/webhooks/whatsapp`.
3. Set the Verify Token to match your `WHATSAPP_WEBHOOK_VERIFY_TOKEN`.
4. Subscribe to the `messages` webhook field.

## 6. Monitoring and Logs

- **Logs**: View live application logs directly in the Railway dashboard under the **Deployments** tab.
- **Metrics**: Railway provides basic CPU/Memory metrics.
- **Rollbacks**: To rollback to a previous version, find the successful deployment in the list and click **Redeploy**.
