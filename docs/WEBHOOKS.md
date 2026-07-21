# Webhooks Documentation

VAQUITA relies heavily on incoming webhooks to trigger automations and update system state.

## Shopify Webhooks

All Shopify webhooks are received at `/api/v1/webhooks/shopify`.

### Topics Handled

| Topic | Description | Action |
|-------|-------------|--------|
| `orders/create` | New order placed | Syncs order, triggers `ORDER_CREATED` automations. |
| `orders/updated` | Order status change | Updates order status, triggers `ORDER_UPDATED` automations. |
| `orders/cancelled` | Order cancelled | Cancels pending COD requests, updates status. |
| `customers/create` | New customer profile | Syncs customer, updates LTV metrics. |

### Security (HMAC Verification)

Every incoming Shopify webhook must have an `x-shopify-hmac-sha256` header.
Middleware intercepts the raw body, computes a SHA256 HMAC using `SHOPIFY_WEBHOOK_SECRET`, and compares it to the header. Rejects with 401 on failure.

## WhatsApp Webhooks

WhatsApp webhooks are received at `/api/v1/webhooks/whatsapp`.

### Verification

On initial setup, Meta sends a `GET` request with a `hub.verify_token`. The API checks this against `WHATSAPP_WEBHOOK_VERIFY_TOKEN` and echoes back the `hub.challenge`.

### Payload Handling

We listen for `messages` and `statuses` updates.
- **Messages**: Inbound messages from customers (for future conversational AI/bot flow).
- **Statuses**: Delivery reports (sent, delivered, read, failed). These update the `MessageLog` records to compute accurate delivery/read rate metrics for the dashboard.
