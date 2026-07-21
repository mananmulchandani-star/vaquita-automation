# Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- **Node.js**: v22.0.0 or higher
- **PostgreSQL**: v16.0 or higher
- **npm**: v10.0.0 or higher
- **Git**

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd vaquita-automation
```

## Step 2: Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Configure the `.env` file with your specific values:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | API server port | `3001` |
| `NODE_ENV` | Environment type | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://vaquita:password@localhost:5432/vaquita_dev` |
| `JWT_SECRET` | Secret key for JWT signing | `super-secret-key` |
| `SHOPIFY_API_KEY` | Shopify App API Key | `shpat_...` |
| `SHOPIFY_API_SECRET` | Shopify App API Secret | `shpss_...` |
| `SHOPIFY_WEBHOOK_SECRET` | Shopify Webhook signing secret | `whsec_...` |
| `WHATSAPP_API_TOKEN` | Meta WhatsApp Cloud API Token | `EAAB...` |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Phone Number ID | `1234567890` |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | WhatsApp Business Account ID | `0987654321` |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Token for webhook verification | `my-verify-token` |

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Database Setup

Ensure your PostgreSQL instance is running.

```bash
# Generate Prisma Client
npm run prisma:generate

# Run Migrations
npm run prisma:migrate

# (Optional) Seed the database with initial data
npm run prisma:seed
```

## Step 5: Run the Application

Start the development servers for both frontend and backend:

```bash
npm run dev
```

- **Backend API**: http://localhost:3001
- **Frontend App**: http://localhost:5173

## Troubleshooting Common Issues

**1. Prisma Client Errors**
If you encounter `PrismaClientInitializationError`, ensure your `DATABASE_URL` is correct and the PostgreSQL server is actively running. Run `npx prisma db pull` to ensure your schema matches the DB.

**2. Port in Use**
If port 3001 or 5173 is in use, either stop the conflicting service or change the `PORT` in `.env` (backend) or vite.config.ts (frontend).

**3. Webhook Delivery Failures Locally**
To test webhooks locally, you must use a tunneling service like [ngrok](https://ngrok.com/) to expose your local port 3001 to the internet, then configure that URL in Shopify/WhatsApp.
