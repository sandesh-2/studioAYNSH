# API Documentation

## Base URL

```
https://studioaynsh.com/api
```

All requests use JSON format and require appropriate headers.

## Authentication

### Headers
```
Content-Type: application/json
Authorization: Bearer <session-token> (for protected endpoints)
```

### Session-Based Auth
Authentication is session-based using HTTP-only secure cookies. Simply authenticate via `/api/auth/signin` and subsequent requests automatically include the session cookie.

## Authentication Endpoints

### Sign In
```http
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "id": "session_abc",
    "expiresAt": "2025-01-15T12:00:00Z"
  }
}
```

**Errors (401):**
```json
{
  "error": "Invalid credentials"
}
```

### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "name": "Jane Smith"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "user_456",
    "email": "newuser@example.com",
    "name": "Jane Smith"
  }
}
```

**Errors (400):**
```json
{
  "error": "Email already exists"
}
```

### Sign Out
```http
POST /auth/signout
```

**Response (200):**
```json
{
  "success": true
}
```

### Get Session
```http
GET /auth/session
```

**Response (200):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "session": {
    "id": "session_abc",
    "expiresAt": "2025-01-15T12:00:00Z"
  }
}
```

**Response (401) - Not authenticated:**
```json
{
  "error": "Not authenticated"
}
```

## Booking Endpoints

### List Bookings
```http
GET /bookings?status=pending&sort=date&search=wedding
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, confirmed, completed, cancelled)
- `sort` (optional): Sort by field (date, created, status)
- `search` (optional): Search by service type or location
- `limit` (optional): Results per page (default: 10, max: 100)
- `page` (optional): Page number (default: 1)

**Response (200):**
```json
{
  "bookings": [
    {
      "id": "booking_1",
      "userId": "user_123",
      "serviceType": "wedding",
      "status": "pending",
      "date": "2025-02-15",
      "location": "Gorakhpur",
      "budget": 50000,
      "notes": "Outdoor wedding shoot",
      "createdAt": "2024-12-10T10:30:00Z",
      "updatedAt": "2024-12-10T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

**Response (401) - Unauthorized:**
```json
{
  "error": "Authentication required"
}
```

### Create Booking
```http
POST /bookings
Content-Type: application/json

{
  "serviceType": "wedding",
  "date": "2025-02-15",
  "location": "Gorakhpur, Uttar Pradesh",
  "budget": 50000,
  "notes": "Outdoor wedding with pre-wedding shoot"
}
```

**Validation:**
- `serviceType`: One of [wedding, portrait, fashion, commercial]
- `date`: Future date in ISO format
- `location`: 1-200 characters
- `budget`: Positive number, max 1,000,000
- `notes`: Optional, max 5000 characters

**Response (201):**
```json
{
  "booking": {
    "id": "booking_1",
    "userId": "user_123",
    "serviceType": "wedding",
    "status": "pending",
    "date": "2025-02-15",
    "location": "Gorakhpur, Uttar Pradesh",
    "budget": 50000,
    "notes": "Outdoor wedding with pre-wedding shoot",
    "createdAt": "2024-12-10T10:30:00Z",
    "updatedAt": "2024-12-10T10:30:00Z"
  }
}
```

**Response (400) - Validation error:**
```json
{
  "error": "Validation failed",
  "details": {
    "date": "Date must be in the future",
    "budget": "Budget must be positive"
  }
}
```

**Response (401) - Unauthorized:**
```json
{
  "error": "Authentication required"
}
```

### Get Booking Details
```http
GET /bookings/booking_1
```

**Response (200):**
```json
{
  "booking": {
    "id": "booking_1",
    "userId": "user_123",
    "serviceType": "wedding",
    "status": "pending",
    "date": "2025-02-15",
    "location": "Gorakhpur, Uttar Pradesh",
    "budget": 50000,
    "notes": "Outdoor wedding with pre-wedding shoot",
    "createdAt": "2024-12-10T10:30:00Z",
    "updatedAt": "2024-12-10T10:30:00Z"
  },
  "sessions": [
    {
      "id": "session_1",
      "type": "shoot",
      "progress": 75,
      "notes": "Main shoot completed"
    }
  ]
}
```

**Response (404) - Not found:**
```json
{
  "error": "Booking not found"
}
```

**Response (403) - Forbidden:**
```json
{
  "error": "You don't have permission to access this booking"
}
```

### Update Booking
```http
PUT /bookings/booking_1
Content-Type: application/json

{
  "status": "confirmed",
  "notes": "Updated notes"
}
```

**Allowed Fields:**
- `status`: Only for admin (pending, confirmed, completed, cancelled)
- `notes`: Owner can update
- `date`: Owner can update if status is pending

**Response (200):**
```json
{
  "booking": {
    "id": "booking_1",
    "userId": "user_123",
    "serviceType": "wedding",
    "status": "confirmed",
    "date": "2025-02-15",
    "location": "Gorakhpur, Uttar Pradesh",
    "budget": 50000,
    "notes": "Updated notes",
    "createdAt": "2024-12-10T10:30:00Z",
    "updatedAt": "2024-12-10T11:45:00Z"
  }
}
```

**Response (400) - Invalid update:**
```json
{
  "error": "Cannot update completed bookings"
}
```

### Cancel Booking
```http
DELETE /bookings/booking_1
```

**Response (200):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

**Response (400) - Invalid state:**
```json
{
  "error": "Cannot cancel completed bookings"
}
```

## Admin Endpoints

### Get Dashboard Stats
```http
GET /admin/stats
```

Requires admin authentication.

**Response (200):**
```json
{
  "stats": {
    "total": 45,
    "pending": 12,
    "confirmed": 18,
    "completed": 15
  }
}
```

### List All Bookings (Admin)
```http
GET /admin/bookings?status=pending&sort=date
```

**Response (200):**
```json
{
  "bookings": [
    {
      "id": "booking_1",
      "userId": "user_123",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "serviceType": "wedding",
      "status": "pending",
      "date": "2025-02-15",
      "budget": 50000,
      "createdAt": "2024-12-10T10:30:00Z"
    }
  ]
}
```

### Update Booking Status (Admin)
```http
PUT /admin/bookings/booking_1
Content-Type: application/json

{
  "status": "confirmed"
}
```

**Response (200):**
```json
{
  "booking": {
    "id": "booking_1",
    "status": "confirmed",
    "updatedAt": "2024-12-10T11:45:00Z"
  }
}
```

## Error Responses

### Standard Error Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "additional error details"
  },
  "timestamp": "2024-12-10T10:30:00Z"
}
```

### Common Error Codes
- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input data
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_SERVER_ERROR` - Server error

## Rate Limiting

### Limits by Endpoint
- `POST /auth/signin`: 5 attempts per 15 minutes per IP
- `POST /auth/signup`: 3 attempts per 24 hours per IP
- `POST /bookings`: 100 requests per hour per user
- `GET /bookings`: 1000 requests per hour per user

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1702298400
```

### Rate Limit Exceeded (429)
```json
{
  "error": "Too many requests",
  "retryAfter": 300
}
```

## Pagination

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

### Response Format
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 250,
    "pages": 25
  }
}
```

## Webhooks (Future)

Webhooks will be available for:
- `booking.created`
- `booking.updated`
- `booking.completed`
- `payment.received`

Configure webhooks in account settings.

## Example Requests

### Using cURL
```bash
# Sign in
curl -X POST https://studioaynsh.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get bookings
curl -X GET https://studioaynsh.com/api/bookings \
  -H "Cookie: session=<session-token>"

# Create booking
curl -X POST https://studioaynsh.com/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType":"wedding",
    "date":"2025-02-15",
    "location":"Gorakhpur",
    "budget":50000
  }'
```

### Using JavaScript/Fetch
```javascript
// Sign in
const response = await fetch('https://studioaynsh.com/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})

const data = await response.json()
console.log(data.user)
```

---

**API Version:** 1.0.0  
**Last Updated:** December 2024  
**Status:** Production
