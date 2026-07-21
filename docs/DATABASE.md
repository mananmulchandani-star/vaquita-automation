# Database Documentation

VAQUITA uses PostgreSQL 16 with Prisma ORM.

## Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Automation : creates
    Automation ||--|{ AutomationBlock : contains
    Order }|--|| Customer : belongs_to
    MessageQueue ||--o{ MessageLog : tracks
    Automation ||--o{ MessageQueue : triggers

    User {
        String id PK
        String email
        String passwordHash
        String role
    }
    
    Customer {
        String id PK
        String shopifyId
        String phone
        String email
        Int ltv
    }
    
    Order {
        String id PK
        String shopifyId
        String customerId FK
        String status
        Float totalValue
        Boolean isCOD
    }

    Automation {
        String id PK
        String name
        Boolean isActive
        String triggerType
    }
    
    MessageQueue {
        String id PK
        String type
        Json payload
        Int retries
        DateTime executeAt
        String status
    }
```

## Migration Strategy

Migrations are handled entirely via Prisma (`npx prisma migrate dev` locally, `npx prisma migrate deploy` in CI/CD).
We use a forward-only migration strategy. Rollbacks are achieved by creating a new migration that reverts the changes of the previous one.

## Backup Strategy

In Railway, automated daily backups are configured for the PostgreSQL volume.
For manual snapshots, utilize Railway's database snapshot feature before applying major schema migrations.
