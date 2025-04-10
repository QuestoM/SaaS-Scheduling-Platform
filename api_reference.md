# API Reference Documentation

## Overview

This document provides comprehensive reference documentation for the Home Care Scheduling Platform API. The API allows developers to integrate with the platform, access data, and extend functionality.

## Base URL

All API endpoints are relative to the base URL:

```
https://api.homecare-platform.example.com/v1
```

## Authentication

### Authentication Methods

The API uses JSON Web Tokens (JWT) for authentication. To access protected endpoints, you must include a valid token in the Authorization header of your requests.

### Obtaining a Token

```
POST /auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "coordinator"
  }
}
```

### Using the Token

Include the token in the Authorization header of all subsequent requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration

Tokens expire after 24 hours. To get a new token, you must re-authenticate.

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests.

### Common Status Codes

- `200 OK`: The request was successful
- `201 Created`: A new resource was successfully created
- `400 Bad Request`: The request was invalid or malformed
- `401 Unauthorized`: Authentication failed or token is invalid
- `403 Forbidden`: The authenticated user does not have permission to access the requested resource
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An error occurred on the server

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "A human-readable error message",
    "details": {
      "field1": "Error details for field1",
      "field2": "Error details for field2"
    }
  }
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. The current limits are:

- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

Rate limit information is included in the response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000
```

## Endpoints

### Users

#### Get Current User

```
GET /users/me
```

Returns information about the currently authenticated user.

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "coordinator",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

#### Update Current User

```
PUT /users/me
```

Updates information for the currently authenticated user.

**Request Body:**

```json
{
  "first_name": "John",
  "last_name": "Smith",
  "phone": "555-123-4567"
}
```

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Smith",
  "phone": "555-123-4567",
  "role": "coordinator",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-02T00:00:00Z"
}
```

### Clients

#### List Clients

```
GET /clients
```

Returns a list of clients.

**Query Parameters:**

- `status` (optional): Filter by status (`active`, `inactive`, `pending`)
- `search` (optional): Search by name or other fields
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of results per page (default: 20, max: 100)

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Anna",
      "last_name": "Smith",
      "address": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip_code": "12345",
      "phone": "555-123-4567",
      "status": "active",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Doe",
      "address": "456 Oak Ave",
      "city": "Somewhere",
      "state": "NY",
      "zip_code": "67890",
      "phone": "555-987-6543",
      "status": "active",
      "created_at": "2023-01-02T00:00:00Z",
      "updated_at": "2023-01-02T00:00:00Z"
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

#### Get Client

```
GET /clients/{id}
```

Returns information about a specific client.

**Response:**

```json
{
  "id": 1,
  "first_name": "Anna",
  "last_name": "Smith",
  "address": "123 Main St",
  "city": "Anytown",
  "state": "CA",
  "zip_code": "12345",
  "phone": "555-123-4567",
  "emergency_contact": "John Smith, 555-111-2222",
  "notes": "Prefers morning appointments",
  "status": "active",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

#### Create Client

```
POST /clients
```

Creates a new client.

**Request Body:**

```json
{
  "first_name": "Robert",
  "last_name": "Brown",
  "address": "789 Pine St",
  "city": "Elsewhere",
  "state": "TX",
  "zip_code": "54321",
  "phone": "555-222-3333",
  "emergency_contact": "Mary Brown, 555-444-5555",
  "notes": "Has a cat",
  "status": "active"
}
```

**Response:**

```json
{
  "id": 3,
  "first_name": "Robert",
  "last_name": "Brown",
  "address": "789 Pine St",
  "city": "Elsewhere",
  "state": "TX",
  "zip_code": "54321",
  "phone": "555-222-3333",
  "emergency_contact": "Mary Brown, 555-444-5555",
  "notes": "Has a cat",
  "status": "active",
  "created_at": "2023-01-03T00:00:00Z",
  "updated_at": "2023-01-03T00:00:00Z"
}
```

#### Update Client

```
PUT /clients/{id}
```

Updates information for a specific client.

**Request Body:**

```json
{
  "phone": "555-666-7777",
  "notes": "Has a cat and a dog"
}
```

**Response:**

```json
{
  "id": 3,
  "first_name": "Robert",
  "last_name": "Brown",
  "address": "789 Pine St",
  "city": "Elsewhere",
  "state": "TX",
  "zip_code": "54321",
  "phone": "555-666-7777",
  "emergency_contact": "Mary Brown, 555-444-5555",
  "notes": "Has a cat and a dog",
  "status": "active",
  "created_at": "2023-01-03T00:00:00Z",
  "updated_at": "2023-01-04T00:00:00Z"
}
```

#### Delete Client

```
DELETE /clients/{id}
```

Deletes a specific client.

**Response:**

```json
{
  "success": true
}
```

#### Get Client Preferences

```
GET /clients/{id}/preferences
```

Returns preferences for a specific client.

**Response:**

```json
{
  "client_id": 1,
  "preferred_time_start": "09:00:00",
  "preferred_time_end": "12:00:00",
  "preferred_days": "mon,wed,fri",
  "preferred_staff_id": 101,
  "special_instructions": "Please knock loudly, client has hearing difficulties",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

#### Update Client Preferences

```
PUT /clients/{id}/preferences
```

Updates preferences for a specific client.

**Request Body:**

```json
{
  "preferred_time_start": "10:00:00",
  "preferred_time_end": "14:00:00",
  "preferred_days": "tue,thu",
  "preferred_staff_id": 102,
  "special_instructions": "Please call before arriving"
}
```

**Response:**

```json
{
  "client_id": 1,
  "preferred_time_start": "10:00:00",
  "preferred_time_end": "14:00:00",
  "preferred_days": "tue,thu",
  "preferred_staff_id": 102,
  "special_instructions": "Please call before arriving",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-04T00:00:00Z"
}
```

### Staff

#### List Staff

```
GET /staff
```

Returns a list of staff members.

**Query Parameters:**

- `status` (optional): Filter by status (`active`, `inactive`, `on_leave`)
- `search` (optional): Search by name or other fields
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of results per page (default: 20, max: 100)

**Response:**

```json
{
  "data": [
    {
      "id": 101,
      "first_name": "Sarah",
      "last_name": "Jones",
      "address": "123 Elm St",
      "city": "Anytown",
      "state": "CA",
      "zip_code": "12345",
      "phone": "555-111-2222",
      "status": "active",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    },
    {
      "id": 102,
      "first_name": "Mike",
      "last_name": "Brown",
      "address": "456 Maple Ave",
      "city": "Somewhere",
      "state": "NY",
      "zip_code": "67890",
      "phone": "555-333-4444",
      "status": "active",
      "created_at": "2023-01-02T00:00:00Z",
      "updated_at": "2023-01-02T00:00:00Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

#### Get Staff Member

```
GET /staff/{id}
```

Returns information about a specific staff member.

**Response:**

```json
{
  "id": 101,
  "first_name": "Sarah",
  "last_name": "Jones",
  "address": "123 Elm St",
  "city": "Anytown",
  "state": "CA",
  "zip_code": "12345",
  "phone": "555-111-2222",
  "hire_date": "2022-01-15",
  "status": "active",
  "hourly_rate": 25.00,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

#### Create Staff Member

```
POST /staff
```

Creates a new staff member.

**Request Body:**

```json
{
  "first_name": "Lisa",
  "last_name": "Thompson",
  "address": "789 Oak St",
  "city": "Elsewhere",
  "state": "TX",
  "zip_code": "54321",
  "phone": "555-555-6666",
  "hire_date": "2023-01-10",
  "status": "active",
  "hourly_rate": 27.50
}
```

**Response:**

```json
{
  "id": 103,
  "first_name": "Lisa",
  "last_name": "Thompson",
  "address": "789 Oak St",
  "city": "Elsewhere",
  "state": "TX",
  "zip_code": "54321",
  "phone": "555-555-6666",
  "hire_date": "2023-01-10",
  "status": "active",
  "hourly_rate": 27.50,
  "created_at": "2023-01-03T00:00:00Z",
  "updated_at": "2023-01-03T00:00:00Z"
}
```

#### Update Staff Member

```
PUT /staff/{id}
```

Updates information for a specific staff member.

**Request Body:**

```json
{
  "phone": "555-777-8888",
  "status": "on_leave"
}
```

**Response:**

```json
{
  "id": 103,
  "first_name": "Lisa",
  "last_name": "Thompson",
  "address": "789 Oak St",
  "city": "Elsewhere",
  "state": "TX",
  "zip_code": "54321",
  "phone": "555-777-8888",
  "hire_date": "2023-01-10",
  "status": "on_leave",
  "hourly_rate": 27.50,
  "created_at": "2023-01-03T00:00:00Z",
  "updated_at": "2023-01-04T00:00:00Z"
}
```

#### Delete Staff Member

```
DELETE /staff/{id}
```

Deletes a specific staff member.

**Response:**

```json
{
  "success": true
}
```

#### Get Staff Skills

```
GET /staff/{id}/skills
```

Returns skills for a specific staff member.

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "skill_id": 1,
      "staff_id": 101,
      "skill_name": "Bathing",
      "level": "expert",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "skill_id": 2,
      "staff_id": 101,
      "skill_name": "Medication",
      "level": "intermediate",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  ]
}
```

#### Add Staff Skill

```
POST /staff/{id}/skills
```

Adds a skill to a specific staff member.

**Request Body:**

```json
{
  "skill_id": 3,
  "level": "beginner"
}
```

**Response:**

```json
{
  "id": 3,
  "skill_id": 3,
  "staff_id": 101,
  "skill_name": "Therapy",
  "level": "beginner",
  "created_at": "2023-01-04T00:00:00Z",
  "updated_at": "2023-01-04T00:00:00Z"
}
```

#### Update Staff Skill

```
PUT /staff/{id}/skills/{skill_id}
```

Updates a skill for a specific staff member.

**Request Body:**

```json
{
  "level": "intermediate"
}
```

**Response:**

```json
{
  "id": 3,
  "skill_id": 3,
  "staff_id": 101,
  "skill_name": "Therapy",
  "level": "intermediate",
  "created_at": "2023-01-04T00:00:00Z",
  "updated_at": "2023-01-05T00:00:00Z"
}
```

#### Remove Staff Skill

```
DELETE /staff/{id}/skills/{skill_id}
```

Removes a skill from a specific staff member.

**Response:**

```json
{
  "success": true
}
```

### Schedules

#### List Schedules

```
GET /schedules
```

Returns a list of schedules.

**Query Parameters:**

- `status` (optional): Filter by status (`draft`, `published`, `archived`)
- `start_date` (optional): Filter by start date
- `end_date` (optional): Filter by end date
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of results per page (default: 20, max: 100)

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Week 18 Schedule",
      "start_date": "2023-05-01",
      "end_date": "2023-05-07",
      "status": "published",
      "created_by": 1,
      "created_at": "2023-04-24T00:00:00Z",
      "updated_at": "2023-04-25T00:00:00Z"
    },
    {
      "id": 2,
      "name": "Week 19 Schedule",
      "start_date": "2023-05-08",
      "end_date": "2023-05-14",
      "status": "draft",
      "created_by": 1,
      "created_at": "2023-05-01T00:00:00Z",
      "updated_at": "2023-05-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

#### Get Schedule

```
GET /schedules/{id}
```

Returns information about a specific schedule.

**Response:**

```json
{
  "id": 1,
  "name": "Week 18 Schedule",
  "start_date": "2023-05-01",
  "end_date": "2023-05-07",
  "status": "published",
  "created_by": 1,
  "created_at": "2023-04-24T00:00:00Z",
  "updated_at": "2023-04-25T00:00:00Z"
}
```

#### Generate Schedule

```
POST /schedules/generate
```

Generates a new schedule based on specified parameters.

**Request Body:**

```json
{
  "name": "Week 20 Schedule",
  "start_date": "2023-05-15",
  "end_date": "2023-05-21",
  "optimization_parameters": {
    "travel_weight": 0.6,
    "preference_weight": 0.3,
    "workload_weight": 0.1
  }
}
```

**Response:**

```json
{
  "id": 3,
  "name": "Week 20 Schedule",
  "start_date": "2023-05-15",
  "end_date": "2023-05-21",
  "status": "draft",
  "created_by": 1,
  "created_at": "2023-05-08T00:00:00Z",
  "updated_at": "2023-05-08T00:00:00Z"
}
```

#### Update Schedule

```
PUT /schedules/{id}
```

Updates information for a specific schedule.

**Request Body:**

```json
{
  "name": "Week 20 Schedule (Updated)",
  "status": "published"
}
```

**Response:**

```json
{
  "id": 3,
  "name": "Week 20 Schedule (Updated)",
  "start_date": "2023-05-15",
  "end_date": "2023-05-21",
  "status": "published",
  "created_by": 1,
  "created_at": "2023-05-08T00:00:00Z",
  "updated_at": "2023-05-09T00:00:00Z"
}
```

#### Delete Schedule

```
DELETE /schedules/{id}
```

Deletes a specific schedule.

**Response:**

```json
{
  "success": true
}
```

#### Get Schedule Appointments

```
GET /schedules/{id}/appointments
```

Returns appointments for a specific schedule.

**Query Parameters:**

- `date` (optional): Filter by date
- `staff_id` (optional): Filter by staff member
- `client_id` (optional): Filter by client
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of results per page (default: 100, max: 500)

**Response:**

```json
{
  "data": [
    {
      "id": 101,
      "schedule_id": 1,
      "client_id": 1,
      "client_name": "Anna Smith",
      "staff_id": 101,
      "staff_name": "Sarah Jones",
      "start_time": "2023-05-01T09:00:00Z",
      "end_time": "2023-05-01T10:00:00Z",
      "status": "scheduled",
      "notes": "",
      "created_at": "2023-04-24T00:00:00Z",
      "updated_at": "2023-04-24T00:00:00Z"
    },
    {
      "id": 102,
      "schedule_id": 1,
      "client_id": 2,
      "client_name": "Jane Doe",
      "staff_id": 102,
      "staff_name": "Mike Brown",
      "start_time": "2023-05-01T11:00:00Z",
      "end_time": "2023-05-01T12:00:00Z",
      "status": "scheduled",
      "notes": "",
      "created_at": "2023-04-24T00:00:00Z",
      "updated_at": "2023-04-24T00:00:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 100,
    "pages": 1
  }
}
```

#### Create Appointment

```
POST /schedules/{id}/appointments
```

Creates a new appointment for a sp
(Content truncated due to size limit. Use line ranges to read in chunks)