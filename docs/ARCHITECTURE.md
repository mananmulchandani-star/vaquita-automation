# System Architecture

The VAQUITA Automation platform uses a modern Node.js backend with a React frontend, orchestrated within a monorepo workspace.

## High-Level Architecture

```mermaid
graph TD
    Client[Web Client (React 19)] -->|REST API| API[API Gateway (Express)]
    Shopify[Shopify Admin] -->|Webhooks| API
    Meta[Meta WhatsApp API] <-->|Webhooks / API| API
    
    API --> Services[Business Logic Services]
    Services --> AutomationEngine[Automation Engine]
    Services --> MessageQueue[Message Queue System]
    
    Services --> ORM[Prisma ORM]
    ORM --> DB[(PostgreSQL 16)]
    MessageQueue --> DB
```

## Component Descriptions

1. **Frontend**: React 19 application providing the dashboard, visual automation builder, and reporting metrics.
2. **API Gateway**: Express server handling REST endpoints, authentication (JWT), and webhook ingestion.
3. **Services Layer**: Encapsulates core business logic (Orders, Customers, Automations, WhatsApp).
4. **Automation Engine**: Evaluates incoming webhook payloads against custom-defined logical triggers, executing sequential or branched block sequences.
5. **Message Queue**: Persistent job queue stored in PostgreSQL to handle rate-limited API calls to Meta, retry logic, and dead-lettering.
6. **Database**: PostgreSQL storing configuration, telemetry, orders, and queue data.

## Request Lifecycle (Webhook Example)

1. Shopify fires `orders/create` webhook.
2. Express Middleware verifies Shopify HMAC signature.
3. Request parsed and passed to `OrderService.syncOrder()`.
4. Order data saved to PostgreSQL.
5. `AutomationEngine.trigger('ORDER_CREATED', orderData)` is called.
6. Engine finds matching automations, evaluates condition blocks.
7. If conditions pass, `WhatsAppService.enqueueTemplate()` adds message jobs to Queue.
8. Queue Worker processes job, calls Meta API, records result.

## Automation Engine Architecture

The engine uses a Directed Acyclic Graph (DAG) approach. Automations consist of:
- **Trigger Block**: Entry point (e.g., Order Created).
- **Condition Blocks**: Branching logic (e.g., If Order Value > 100).
- **Action Blocks**: Execution logic (e.g., Send WhatsApp Template).
- **Delay Blocks**: Pauses execution for a specified duration.
