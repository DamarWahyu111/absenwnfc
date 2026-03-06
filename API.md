# API Documentation - NFC Attendance System

## Base URL

```
http://localhost:3000
```

Production:
```
https://your-domain.com
```

---

## Authentication Endpoints

### Register User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "programId": "uuid" (optional)
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Akun berhasil dibuat",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "nfc_uid": null,
      "role": "user",
      "created_at": "2026-03-05T10:00:00Z"
    }
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Nama, email, dan password diperlukan"
}
```

**Error (409):**
```json
{
  "success": false,
  "error": "Email sudah terdaftar"
}
```

---

### Login User
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "nfc_uid": "04B1C2D3E4F5",
      "role": "user",
      "created_at": "2026-03-05T10:00:00Z"
    }
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "error": "Email atau password salah"
}
```

---

### Logout User
```
POST /api/auth/logout
```

**Headers:**
```
Cookie: auth-token=eyJhbGc...
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

### Get Current User
```
GET /api/user/me
```

**Headers:**
```
Cookie: auth-token=eyJhbGc...
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "nfc_uid": "04B1C2D3E4F5",
    "role": "user",
    "program_id": "uuid",
    "created_at": "2026-03-05T10:00:00Z"
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

## NFC Endpoints

### Bind NFC Card
```
POST /api/nfc/bind
```

**Headers:**
```
Cookie: auth-token=eyJhbGc...
Content-Type: application/json
```

**Request Body:**
```json
{
  "nfc_uid": "04B1C2D3E4F5"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Kartu NFC berhasil terdaftar",
  "data": {
    "nfc_uid": "04B1C2D3E4F5"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "NFC UID diperlukan"
}
```

**Error (409):**
```json
{
  "success": false,
  "error": "Kartu NFC sudah terdaftar ke akun lain"
}
```

---

## Attendance Endpoints

### Tap NFC (Check-in/Check-out)
```
POST /api/attendance/tap
```

**Request Body:**
```json
{
  "nfc_uid": "04B1C2D3E4F5"
}
```

**Response (200) - Check-in:**
```json
{
  "success": true,
  "message": "Check-in berhasil",
  "data": {
    "status": "checked_in",
    "checkInTime": "2026-03-05T09:30:00Z",
    "checkOutTime": null
  }
}
```

**Response (200) - Check-out:**
```json
{
  "success": true,
  "message": "Check-out berhasil",
  "data": {
    "status": "checked_out",
    "checkInTime": "2026-03-05T09:30:00Z",
    "checkOutTime": "2026-03-05T17:30:00Z"
  }
}
```

**Error (429) - Double tap:**
```json
{
  "success": false,
  "error": "Tunggu 2 detik sebelum tap lagi"
}
```

**Error (404):**
```json
{
  "success": false,
  "error": "Kartu NFC tidak ditemukan"
}
```

---

### Get Attendance History
```
GET /api/attendance/history
```

**Headers:**
```
Cookie: auth-token=eyJhbGc...
```

**Query Parameters:**
- `limit` (default: 30) - Jumlah records
- `offset` (default: 0) - Pagination offset

**Example:**
```
GET /api/attendance/history?limit=10&offset=0
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "date": "2026-03-05",
      "check_in": "2026-03-05T09:30:00Z",
      "check_out": "2026-03-05T17:30:00Z",
      "created_at": "2026-03-05T09:30:00Z"
    },
    {
      "id": "uuid",
      "user_id": "uuid",
      "date": "2026-03-04",
      "check_in": "2026-03-04T09:15:00Z",
      "check_out": "2026-03-04T17:45:00Z",
      "created_at": "2026-03-04T09:15:00Z"
    }
  ]
}
```

**Error (401):**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

## Admin Endpoints

### List All Users
```
GET /api/admin/users
```

**Headers:**
```
Cookie: auth-token=eyJhbGc...
```

**Query Parameters:**
- `limit` (default: 50) - Jumlah users
- `offset` (default: 0) - Pagination offset
- `search` (optional) - Cari berdasarkan name atau email

**Example:**
```
GET /api/admin/users?limit=20&offset=0&search=john
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "nfc_uid": "04B1C2D3E4F5",
        "role": "user",
        "created_at": "2026-03-05T10:00:00Z"
      }
    ],
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

**Error (403):**
```json
{
  "success": false,
  "error": "Forbidden - admin access required"
}
```

---

### Get All Attendance Records
```
GET /api/admin/attendance
```

**Headers:**
```
Cookie: auth-token=eyJhbGc...
```

**Query Parameters:**
- `limit` (default: 50) - Jumlah records
- `offset` (default: 0) - Pagination offset
- `dateFrom` (optional) - Start date (YYYY-MM-DD)
- `dateTo` (optional) - End date (YYYY-MM-DD)
- `userId` (optional) - Filter by user ID

**Example:**
```
GET /api/admin/attendance?limit=30&dateFrom=2026-03-01&dateTo=2026-03-05
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "date": "2026-03-05",
        "check_in": "2026-03-05T09:30:00Z",
        "check_out": "2026-03-05T17:30:00Z",
        "created_at": "2026-03-05T09:30:00Z",
        "users": {
          "id": "uuid",
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "total": 250,
    "limit": 30,
    "offset": 0
  }
}
```

**Error (403):**
```json
{
  "success": false,
  "error": "Forbidden - admin access required"
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 500 | Server Error |

---

## Rate Limiting

Attendance tap endpoint memiliki rate limit:
- **Limit**: 1 tap per 3 seconds per NFC card
- **Headers**: Tidak ada custom rate limit headers
- **Response**: 429 dengan error message

---

## Authentication

Semua endpoint (kecuali `/api/auth/register` dan `/api/auth/login`) membutuhkan:

1. **Valid JWT Token** di cookie `auth-token`
2. **Token tidak expired** (expiry: 7 days)
3. **Correct user role** untuk admin endpoints

### Token Claims

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "user|admin",
  "iat": 1709619000,
  "exp": 1710223800
}
```

---

## Request Headers

```
Content-Type: application/json
Cookie: auth-token=<JWT_TOKEN>
```

---

## Response Format

Semua responses menggunakan format standar:

```json
{
  "success": boolean,
  "message": string (optional),
  "data": any (optional),
  "error": string (optional)
}
```

---

## Examples dengan cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get User Data
```bash
curl -X GET http://localhost:3000/api/user/me \
  -H "Cookie: auth-token=<TOKEN>"
```

### Attendance Tap
```bash
curl -X POST http://localhost:3000/api/attendance/tap \
  -H "Content-Type: application/json" \
  -d '{"nfc_uid": "04B1C2D3E4F5"}'
```

### Get Attendance History
```bash
curl -X GET "http://localhost:3000/api/attendance/history?limit=10" \
  -H "Cookie: auth-token=<TOKEN>"
```

### Get All Users (Admin)
```bash
curl -X GET "http://localhost:3000/api/admin/users?limit=20" \
  -H "Cookie: auth-token=<ADMIN_TOKEN>"
```

---

## Testing Tools

- **Postman** - Import dari collection.json
- **cURL** - Command line testing
- **REST Client** - VS Code extension
- **Thunder Client** - Browser extension

---

**API Version**: 1.0  
**Last Updated**: March 5, 2026
