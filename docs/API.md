# API Documentation

**Base URL**: `/api/v1`

## Authentication

All protected endpoints require a JWT token provided in the `Authorization` header as a Bearer token.
```http
Authorization: Bearer <your-jwt-token>
```

## Common Responses

- **200 OK**: Request succeeded.
- **201 Created**: Resource successfully created.
- **400 Bad Request**: Validation failed.
- **401 Unauthorized**: Missing or invalid token.
- **403 Forbidden**: Token valid, but insufficient permissions (Roles).
- **404 Not Found**: Resource doesn't exist.
- **500 Internal Server Error**: Unexpected server error.

## Endpoints

### Auth
- `POST /auth/login`: Authenticate and receive JWT.
- `GET /auth/me`: Get current user profile.

### Dashboard Stats
- `GET /stats/overview`: Returns high-level metrics (Total Orders, COD RTO rate, Messages Sent).
- `GET /stats/automations`: Performance metrics per automation workflow.

### Orders
- `GET /orders`: Fetch paginated list of orders.
- `GET /orders/:id`: Fetch specific order details.
- `POST /orders/:id/confirm-cod`: Manually mark a COD order as confirmed.

### Automations
- `GET /automations`: List all workflows.
- `POST /automations`: Create new workflow.
- `PUT /automations/:id`: Update workflow structure.
- `DELETE /automations/:id`: Disable/delete workflow.

## Pagination

List endpoints support `page` and `limit` query parameters.
```http
GET /api/v1/orders?page=2&limit=50
```
Response includes a `meta` object with `total`, `page`, `limit`, and `totalPages`.
