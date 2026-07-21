# VAQUITA Automation

A production-grade, internal private Shopify application to manage high-volume customer communication and reduce Cash on Delivery (COD) Return to Origin (RTO) rates.

## Features

- **Automated WhatsApp Notifications**: Send automated messages for order updates, abandoned carts, and COD confirmations.
- **Visual Automation Builder**: Create custom workflows with a drag-and-drop visual editor.
- **Shopify Integration**: Seamlessly sync orders, customers, and products from Shopify.
- **Advanced Analytics**: Track message delivery, read rates, and conversion metrics.
- **Message Queuing**: Reliable message delivery with automatic retries and dead-letter queues.

## Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS (optional), Radix UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL 16, Prisma ORM
- **Infrastructure**: Docker, Railway, GitHub Actions

## Quick Start

### Prerequisites
- Node.js >= 22
- PostgreSQL >= 16
- npm >= 10

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd vaquita-automation

# Run setup script
./scripts/setup.sh

# Start development servers
npm run dev
```

## Available Scripts

- `npm run dev`: Start all development servers
- `npm run build`: Build all packages and apps
- `npm run test`: Run all tests
- `npm run lint`: Lint code

## License
Private and Confidential.
