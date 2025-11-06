# Backend Integration Guide - Elevare Intelligence Platform

## 📋 Overview
This document outlines the required API endpoints and data structures needed to integrate the Elevare Frontend with the backend. Replace all placeholder/mock data with real API calls.

---

## 🔧 Current Backend Configuration

**Backend Base URL**: `http://localhost:10000/api/v1`  
**Authentication**: Bearer token in Authorization headers  
**Database**: MongoDB Atlas (blkgrnapi cluster)  
**Real-time**: Socket.io on port 10000

```javascript
// Frontend Axios Configuration
baseURL: 'http://localhost:10000/api/v1'
headers: {
  Authorization: 'Bearer ${token}'
}
```

**CORS Allowed Origins:**
- http://localhost:5173
- http://localhost:5174
- http://localhost:3000
- Any localhost port

---

## 🔐 1. AUTHENTICATION APIs

### ✅ 1.1 Login (IMPLEMENTED)
**Endpoint**: `POST /api/v1/auth/login`

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "_id": "string",
    "fullName": "string",
    "email": "string",
    "role": "agent|manager|landlord|property-manager|ceo|admin"
  }
}
```

**Backend File**: `src/controllers/authController.js` (login method)  
**Status**: ✅ **WORKING** (tested successfully)

---

### ✅ 1.2 Register (IMPLEMENTED)
**Endpoint**: `POST /api/v1/auth/register`

**Request Body**:
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "role": "agent|manager|landlord|property-manager|ceo|admin"
}
```

**Response**: Same as login

**Backend File**: `src/controllers/authController.js` (register method)  
**Status**: ✅ **WORKING**

---

### ✅ 1.3 Get Current User (IMPLEMENTED)
**Endpoint**: `GET /api/v1/auth/me`

**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "fullName": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Backend File**: `src/controllers/authController.js` (getMe method)  
**Status**: ✅ **WORKING**

---

## 📊 2. DASHBOARD APIs

### ✅ 2.1 Agent Dashboard Data (IMPLEMENTED)
**Endpoint**: `GET /api/v1/dashboard/agent`

**Headers**: `Authorization: Bearer {token}`

**Backend File**: `src/controllers/dashboardController.js` (getAgentDashboard method)  
**Status**: ✅ **WORKING**

**Response**:
```json
{
  "success": true,
  "data": {
    "todayTasks": {
      "total": 5,
      "completed": 2,
      "pending": 3
    },
    "todayCalls": {
      "total": 8,
      "completed": 3,
      "scheduled": 5
    },
    "moodStatus": {
      "checkedToday": false,
      "lastMood": "confident|neutral|stressed|null"
    },
    "aiInsights": [
      {
        "id": "string",
        "message": "string",
        "type": "success|warning|info",
        "timestamp": "ISO8601"
      }
    ],
    "todayProgress": {
      "morning": "completed|in-progress|pending",
      "midday": "completed|in-progress|pending",
      "calls": "completed|in-progress|pending",
      "afternoon": "completed|in-progress|pending",
      "evening": "completed|in-progress|pending"
    }
  }
}
```

**Frontend File**: `src/pages/Dashboard.jsx` (AgentQuickDashboard component, lines 10-95)

---

### ✅ 2.2 Landlord Dashboard Data (IMPLEMENTED)
**Endpoint**: `GET /api/v1/dashboard/landlord`

**Headers**: `Authorization: Bearer {token}`

**Backend File**: `src/controllers/dashboardController.js` (getLandlordDashboard method)  
**Status**: ✅ **WORKING**

**Response**:
```json
{
  "success": true,
  "data": {
    "properties": {
      "total": 87,
      "occupied": 80,
      "vacant": 7
    },
    "revenue": {
      "thisMonth": 87340,
      "lastMonth": 82150,
      "percentChange": 6.3
    },
    "maintenance": {
      "urgent": 3,
      "pending": 8,
      "completed": 45
    },
    "agents": {
      "total": 42,
      "active": 38,
      "onLeave": 4
    },
    "priorityAlerts": [
      {
        "id": "string",
        "type": "urgent|warning|info",
        "message": "string",
        "timestamp": "ISO8601",
        "action": "string"
      }
    ]
  }
}
```

**Frontend File**: `src/pages/Dashboard.jsx` (LandlordQuickDashboard component, lines 97-196)

---

### ✅ 2.3 Manager Dashboard Data (IMPLEMENTED)
**Endpoint**: `GET /api/v1/dashboard/manager`

**Headers**: `Authorization: Bearer {token}`

**Backend File**: `src/controllers/dashboardController.js` (getManagerDashboard method)  
**Status**: ✅ **WORKING**

**Response**:
```json
{
  "success": true,
  "data": {
    "kpis": {
      "totalRevenue": 487340,
      "activeAgents": 156,
      "totalProperties": 423,
      "occupancyRate": 92.5
    },
    "agentPerformance": {
      "topPerformers": [
        {
          "agentId": "string",
          "name": "string",
          "deals": 12,
          "revenue": 45000
        }
      ],
      "averageDeals": 6.5,
      "totalCalls": 1240
    },
    "propertyStats": {
      "newListings": 18,
      "soldThisMonth": 25,
      "avgPrice": 350000
    },
    "financials": {
      "monthlyRevenue": 487340,
      "expenses": 125000,
      "profit": 362340,
      "profitMargin": 74.3
    },
    "aiInsights": [
      {
        "id": "string",
        "title": "string",
        "message": "string",
        "priority": "high|medium|low",
        "timestamp": "ISO8601"
      }
    ]
  }
}
```

**Frontend File**: `src/pages/Dashboard.jsx` (ExecutiveDashboard component, lines 198-end)

---

## 👤 3. LEADS APIs

### ✅ 3.1 Get All Leads (IMPLEMENTED)
**Endpoint**: `GET /api/v1/leads`

**Headers**: `Authorization: Bearer {token}`

**Query Params**: `?status=new|contacted|qualified|negotiating|won|lost&page=1&limit=10`

**Backend File**: `src/controllers/leadController.js` (getLeads method)  
**Status**: ✅ **WORKING**

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "phone": "string",
      "email": "string",
      "status": "new|contacted|qualified|negotiating|won|lost",
      "source": "string",
      "assignedAgent": "string",
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  ]
}
```

---

### ✅ 3.2 Create Lead (IMPLEMENTED)
**Endpoint**: `POST /api/v1/leads`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "name": "string",
  "phone": "string",
  "email": "string",
  "source": "string",
  "notes": "string_optional"
}
```

**Backend File**: `src/controllers/leadController.js` (createLead method)  
**Status**: ✅ **WORKING**

---

### ✅ 3.3 Get Single Lead (IMPLEMENTED)
**Endpoint**: `GET /api/v1/leads/:id`

**Backend File**: `src/controllers/leadController.js` (getLead method)  
**Status**: ✅ **WORKING**

---

### ✅ 3.4 Update Lead (IMPLEMENTED)
**Endpoint**: `PUT /api/v1/leads/:id`

**Backend File**: `src/controllers/leadController.js` (updateLead method)  
**Status**: ✅ **WORKING**

---

### ✅ 3.5 Delete Lead (IMPLEMENTED)
**Endpoint**: `DELETE /api/v1/leads/:id`

**Backend File**: `src/controllers/leadController.js` (deleteLead method)  
**Status**: ✅ **WORKING**

---

## 📞 4. CALLS APIs

### ✅ 4.1 Get All Calls (IMPLEMENTED)
**Endpoint**: `GET /api/v1/calls`

**Headers**: `Authorization: Bearer {token}`

**Query Params**: `?status=scheduled|completed|missed&date=2025-11-06`

**Backend File**: `src/controllers/callController.js` (getCalls method)  
**Status**: ✅ **WORKING**

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "agent": "string",
      "leadId": "string",
      "phoneNumber": "string",
      "scheduledTime": "ISO8601",
      "duration": 300,
      "status": "scheduled|in-progress|completed|missed",
      "transcription": "string",
      "aiAnalysis": {
        "sentiment": "string",
        "keyPoints": ["string"],
        "actionItems": ["string"]
      },
      "createdAt": "ISO8601"
    }
  ]
}
```

---

### ✅ 4.2 Create Call (IMPLEMENTED)
**Endpoint**: `POST /api/v1/calls`

**Headers**: `Authorization: Bearer {token}`

**Backend File**: `src/controllers/callController.js` (createCall method)  
**Status**: ✅ **WORKING**

---

### ✅ 4.3 Get Single Call (IMPLEMENTED)
**Endpoint**: `GET /api/v1/calls/:id`

**Backend File**: `src/controllers/callController.js` (getCall method)  
**Status**: ✅ **WORKING**

---

### ✅ 4.4 Update Call (IMPLEMENTED)
**Endpoint**: `PUT /api/v1/calls/:id`

**Backend File**: `src/controllers/callController.js` (updateCall method)  
**Status**: ✅ **WORKING**

---

### ✅ 4.5 Add Coach Feedback (IMPLEMENTED)
**Endpoint**: `POST /api/v1/calls/:id/feedback`

**Headers**: `Authorization: Bearer {token}` (Manager role required)

**Request Body**:
```json
{
  "feedback": "string",
  "rating": 1-5
}
```

**Backend File**: `src/controllers/callController.js` (addCoachFeedback method)  
**Status**: ✅ **WORKING**

---

### ✅ 4.6 Delete Call (IMPLEMENTED)
**Endpoint**: `DELETE /api/v1/calls/:id`

**Backend File**: `src/controllers/callController.js` (deleteCall method)  
**Status**: ✅ **WORKING**

### 4.1 Get Properties
**Endpoint**: `GET /landlord/properties`

**Query Params**: `?status=occupied|vacant|maintenance&page=1&limit=20`

**Response**:
```json
{
  "success": true,
  "properties": [
    {
      "id": "string",
      "address": "string",
      "type": "apartment|house|condo",
      "status": "occupied|vacant|maintenance",
      "rent": 2500,
      "tenant": {
        "id": "string",
        "name": "string",
        "phone": "string"
      },
      "lastPayment": "ISO8601",
      "nextPayment": "ISO8601"
    }
  ],
  "pagination": {
    "total": 87,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

**Frontend File**: `src/pages/LandlordPortal.jsx` (DashboardContent)

---

### ✅ 7.2 Create Property (IMPLEMENTED)
**Endpoint**: `POST /api/v1/properties`

**Backend File**: `src/controllers/propertyController.js` (createProperty method)  
**Status**: ✅ **WORKING**

---

### ✅ 7.3 Get Single Property (IMPLEMENTED)
**Endpoint**: `GET /api/v1/properties/:id`

**Backend File**: `src/controllers/propertyController.js` (getProperty method)  
**Status**: ✅ **WORKING**

---

### ✅ 7.4 Update Property (IMPLEMENTED)
**Endpoint**: `PUT /api/v1/properties/:id`

**Backend File**: `src/controllers/propertyController.js` (updateProperty method)  
**Status**: ✅ **WORKING**

---

### ✅ 7.5 Delete Property (IMPLEMENTED)
**Endpoint**: `DELETE /api/v1/properties/:id`

**Backend File**: `src/controllers/propertyController.js` (deleteProperty method)  
**Status**: ✅ **WORKING**

---

## 💰 8. PAYMENTS APIs

### ✅ 8.1 Get All Payments (IMPLEMENTED)
**Endpoint**: `GET /api/v1/payments`

**Headers**: `Authorization: Bearer {token}` (Landlord role required)

**Query Params**: `?month=2025-11&status=paid|pending|overdue`

**Backend File**: `src/controllers/paymentController.js` (getPayments method)  
**Status**: ✅ **WORKING**

**Response**:
```json
{
  "success": true,
  "rentData": {
    "totalExpected": 217500,
    "totalCollected": 198340,
    "totalPending": 19160,
    "totalOverdue": 5000
  },
  "payments": [
    {
      "id": "string",
      "propertyId": "string",
      "propertyAddress": "string",
      "tenantName": "string",
      "amount": 2500,
      "dueDate": "ISO8601",
      "paidDate": "ISO8601_or_null",
      "status": "paid|pending|overdue",
      "paymentMethod": "bank|cash|check"
    }
  ]
}
```

**Frontend File**: `src/pages/LandlordPortal.jsx` (RentContent)

---

### ✅ 8.2 Create Payment (IMPLEMENTED)
**Endpoint**: `POST /api/v1/payments`

**Backend File**: `src/controllers/paymentController.js` (createPayment method)  
**Status**: ✅ **WORKING**

---

### ✅ 8.3 Get Single Payment (IMPLEMENTED)
**Endpoint**: `GET /api/v1/payments/:id`

**Backend File**: `src/controllers/paymentController.js` (getPayment method)  
**Status**: ✅ **WORKING**

---

### ✅ 8.4 Update Payment (IMPLEMENTED)
**Endpoint**: `PUT /api/v1/payments/:id`

**Backend File**: `src/controllers/paymentController.js` (updatePayment method)  
**Status**: ✅ **WORKING**

---

### ✅ 8.5 Delete Payment (IMPLEMENTED)
**Endpoint**: `DELETE /api/v1/payments/:id`

**Backend File**: `src/controllers/paymentController.js` (deletePayment method)  
**Status**: ✅ **WORKING**

---

## 📄 9. DOCUMENTS APIs

### ✅ 9.1 Get All Documents (IMPLEMENTED)
**Endpoint**: `GET /api/v1/documents`

**Headers**: `Authorization: Bearer {token}`

**Query Params**: `?type=lease|contract|invoice|report&propertyId=optional`

**Backend File**: `src/controllers/documentController.js` (getDocuments method)  
**Status**: ✅ **WORKING**

**Response**:

**Response**:
```json
{
  "success": true,
  "agents": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "assignedProperties": 8,
      "activeDeals": 3,
      "performance": {
        "callsMade": 45,
        "dealsCompleted": 12,
        "rating": 4.5
      },
      "status": "active|on-leave|inactive"
    }
  ]
}
```

**Frontend File**: `src/pages/LandlordPortal.jsx` (AgentsContent)

---

### 4.4 Get Tenants
**Endpoint**: `GET /landlord/tenants`

**Query Params**: `?status=active|moving-out|applicant`

**Response**:
```json
{
  "success": true,
  "tenants": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "propertyId": "string",
      "propertyAddress": "string",
      "leaseStart": "ISO8601",
      "leaseEnd": "ISO8601",
      "rentAmount": 2500,
      "status": "active|moving-out|applicant",
      "paymentHistory": "good|fair|poor"
    }
  ]
}
```

**Frontend File**: `src/pages/LandlordPortal.jsx` (TenantsContent)

---

### 4.5 Get Maintenance Requests
**Endpoint**: `GET /landlord/maintenance`

**Query Params**: `?status=urgent|pending|in-progress|completed`

**Response**:
```json
{
  "success": true,
  "requests": [
    {
      "id": "string",
      "propertyId": "string",
      "propertyAddress": "string",
      "tenantName": "string",
      "issue": "string",
      "description": "string",
      "priority": "urgent|high|medium|low",
      "status": "pending|in-progress|completed",
      "requestedDate": "ISO8601",
      "completedDate": "ISO8601_or_null",
      "assignedTo": "string_optional",
      "cost": 150.00
    }
  ]
}
```

**Frontend File**: `src/pages/LandlordPortal.jsx` (MaintenanceContent)

---

### 4.6 Get Financial Reports
**Endpoint**: `GET /landlord/financials`

**Query Params**: `?startDate=2025-01-01&endDate=2025-11-06`

**Response**:
```json
{
  "success": true,
  "financials": {
    "income": {
      "rent": 217500,
      "lateFees": 1200,
      "other": 800,
      "total": 219500
    },
    "expenses": {
      "maintenance": 15000,
      "utilities": 3500,
      "insurance": 2400,
      "management": 8000,
      "total": 28900
    },
    "netIncome": 190600,
    "profitMargin": 86.8
  },
  "transactions": [
    {
      "id": "string",
      "date": "ISO8601",
      "type": "income|expense",
      "category": "string",
      "amount": 2500,
      "description": "string",
      "propertyId": "string"
    }
  ]
}
```

**Frontend File**: `src/pages/LandlordPortal.jsx` (FinancialsContent)

---

### 4.7 Get Documents
**Endpoint**: `GET /landlord/documents`

**Query Params**: `?type=lease|contract|invoice|report&propertyId=optional`

**Response**:
```json
{
  "success": true,
  "documents": [
    {
      "id": "string",
      "name": "string",
      "type": "lease|contract|invoice|report",
      "propertyId": "string_optional",
      "uploadedBy": "string",
      "uploadedDate": "ISO8601",
      "fileSize": 1024000,
      "fileUrl": "url"
    }
  ]
}
```

**Frontend File**: `src/pages/LandlordPortal.jsx` (DocumentsContent)

---

### ✅ 9.2 Create Document (IMPLEMENTED)
**Endpoint**: `POST /api/v1/documents`

**Backend File**: `src/controllers/documentController.js` (createDocument method)  
**Status**: ✅ **WORKING**

---

### ✅ 9.3 Upload Document (IMPLEMENTED)
**Endpoint**: `POST /api/v1/documents/upload`

**Headers**: `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`

**Request**: `multipart/form-data`

**Fields**:
```
file: File (max 10MB, types: jpeg, jpg, png, pdf, doc, docx, xls, xlsx)
documentType: lease|contract|invoice|report
propertyId: string (optional)
```

**Backend File**: `src/controllers/documentController.js` (uploadDocument method) + `src/middleware/upload.js`  
**Status**: ✅ **WORKING**

---

### ✅ 9.4 Get Single Document (IMPLEMENTED)
**Endpoint**: `GET /api/v1/documents/:id`

**Backend File**: `src/controllers/documentController.js` (getDocument method)  
**Status**: ✅ **WORKING**

---

### ✅ 9.5 Update Document (IMPLEMENTED)
**Endpoint**: `PUT /api/v1/documents/:id`

**Backend File**: `src/controllers/documentController.js` (updateDocument method)  
**Status**: ✅ **WORKING**

---

### ✅ 9.6 Delete Document (IMPLEMENTED)
**Endpoint**: `DELETE /api/v1/documents/:id`

**Backend File**: `src/controllers/documentController.js` (deleteDocument method)  
**Status**: ✅ **WORKING**

---

## 🔔 10. NOTIFICATIONS APIs

### ✅ 10.1 Get User Notifications (IMPLEMENTED)
**Endpoint**: `GET /api/v1/notifications`

**Headers**: `Authorization: Bearer {token}`

**Query Params**: `?read=true|false&limit=20`

**Backend File**: `src/services/notificationService.js` (getUserNotifications function)  
**Status**: ✅ **WORKING**

**Response**:
```json
{
  "success": true,
  "notifications": [
    {
      "id": "string",
      "type": "call|task|payment|maintenance|alert",
      "title": "string",
      "message": "string",
      "read": false,
      "timestamp": "ISO8601",
      "actionUrl": "string_optional"
    }
  ],
  "unreadCount": 5
}
```

**Frontend File**: `src/components/Topbar.jsx` (Bell icon, line 20-30)

---

### ✅ 10.2 Create Notification (IMPLEMENTED)
**Endpoint**: Internal service function

**Backend File**: `src/services/notificationService.js` (createNotification function)  
**Status**: ✅ **WORKING**

**Note**: This is typically called internally by the backend, not exposed as HTTP endpoint

---

### ✅ 10.3 Mark Notification as Read (IMPLEMENTED)
**Endpoint**: Internal service function

**Backend File**: `src/services/notificationService.js` (markAsRead function)  
**Status**: ✅ **WORKING**

**Note**: Can be exposed as PATCH /api/v1/notifications/:id/read if needed for frontend

---

## 🔌 11. WEBSOCKET EVENTS (Socket.io)

### ✅ 11.1 Connection (IMPLEMENTED)
**Namespace**: `/`  
**Port**: 10000  
**Authentication**: Send token on connection

```javascript
// Frontend: src/hooks/useSocket.js
socket.auth = { token: authStore.getState().token }
```

**Backend File**: `src/sockets/index.js`  
**Status**: ✅ **WORKING** (client connected successfully)

---

### ✅ 11.2 User Room Joining (IMPLEMENTED)
**Event**: `user:join`

**Backend File**: `src/sockets/index.js`  
**Status**: ✅ **WORKING**

**Usage**:
```javascript
// Server joins user to room: `user:${userId}`
// Allows targeted notification broadcasts
```

---

### ✅ 11.3 Notification Broadcasting (IMPLEMENTED)
**Event**: `notification`

**Payload**:
```json
{
  "id": "string",
  "type": "call|task|payment|maintenance|alert",
  "title": "string",
  "message": "string",
  "timestamp": "ISO8601"
}
```

**Backend File**: `src/sockets/index.js`  
**Status**: ✅ **WORKING**

**Usage**:
```javascript
// Server emits to specific user room
io.to(`user:${userId}`).emit('notification', notificationData)
```

---

## 👥 12. USERS APIs

### ✅ 12.1 Get All Users (IMPLEMENTED)
**Endpoint**: `GET /api/v1/users`

**Headers**: `Authorization: Bearer {token}` (Admin/Manager role required)

**Backend File**: `src/controllers/userController.js` (getUsers method)  
**Status**: ✅ **WORKING**

---

### ✅ 12.2 Create User (IMPLEMENTED)
**Endpoint**: `POST /api/v1/users`

**Headers**: `Authorization: Bearer {token}` (Admin role required)

**Backend File**: `src/controllers/userController.js` (createUser method)  
**Status**: ✅ **WORKING**

---

### ✅ 12.3 Get Single User (IMPLEMENTED)
**Endpoint**: `GET /api/v1/users/:id`

**Backend File**: `src/controllers/userController.js` (getUser method)  
**Status**: ✅ **WORKING**

---

### ✅ 12.4 Update User (IMPLEMENTED)
**Endpoint**: `PUT /api/v1/users/:id`

**Backend File**: `src/controllers/userController.js` (updateUser method)  
**Status**: ✅ **WORKING**

---

### ✅ 12.5 Delete User (IMPLEMENTED)
**Endpoint**: `DELETE /api/v1/users/:id`

**Backend File**: `src/controllers/userController.js` (deleteUser method)  
**Status**: ✅ **WORKING**

---

## 🔔 5. NOTIFICATIONS APIs

### 5.2 Mark Notification as Read
**Endpoint**: `PATCH /notifications/:id/read`

**Response**:
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## ⚠️ 13. ERROR HANDLING

### Backend Error Responses:
All errors follow this structure:
```json
{
  "success": false,
  "error": "Error message here"
}
```

**HTTP Status Codes**:
- 400: Bad Request (validation errors, invalid input)
- 401: Unauthorized (no token, invalid token, expired token)
- 403: Forbidden (insufficient permissions for role)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error (database errors, unhandled exceptions)

**Backend File**: `src/middleware/errorHandler.js`  
**Status**: ✅ **WORKING**

**Handled Error Types**:
- Mongoose CastError → 400
- Mongoose ValidationError → 400
- Mongoose Duplicate Key Error → 400
- JWT Errors → 401
- Default → 500

---

### Frontend Should Handle:
- 401 Unauthorized → Redirect to login, clear token
- 403 Forbidden → Show "No permission" message
- 404 Not Found → Show "Resource not found"
- 500 Server Error → Show "Server error, try again"
- Network Error → Show "Connection lost, check internet"

### Current Axios Interceptor:
**File**: `src/api/axios.js` (frontend - lines 15-30)
```javascript
// Already handles 401 → clears auth and redirects
// Already handles other errors with toast notifications
```

**Backend Interceptor**: Not needed, errorHandler middleware handles all errors

---

## 📝 14. BACKEND IMPLEMENTATION NOTES

### ✅ Response Format (IMPLEMENTED):
All responses follow this structure:
```json
{
  "success": true,
  "data": {},
  "message": "optional",
  "error": "optional"
}
```

**Backend File**: All controllers return this format consistently  
**Status**: ✅ **WORKING**

---

### ✅ Authentication (IMPLEMENTED):
- JWT token in header: `Authorization: Bearer {token}`
- Token includes: `userId`, `role`, `email`
- Token expiry: 30 days (configurable in `src/config/jwt.js`)
- Middleware: `src/middleware/auth.js` (protect method)

**Status**: ✅ **WORKING**

---

### ✅ Role-Based Authorization (IMPLEMENTED):
- Middleware: `src/middleware/roleCheck.js` (authorize function)
- Roles: agent, manager, landlord, property-manager, ceo, admin
- Usage: `authorize('admin', 'manager')` - allows multiple roles

**Status**: ✅ **WORKING**

---

### ✅ Validation (IMPLEMENTED):
- Middleware: `src/middleware/validation.js` (Joi validation)
- Validates request body, params, query
- Returns 400 with detailed error messages

**Status**: ✅ **WORKING**

---

### ✅ File Upload (IMPLEMENTED):
- Middleware: `src/middleware/upload.js` (Multer configuration)
- Max size: 10MB
- Allowed types: jpeg, jpg, png, pdf, doc, docx, xls, xlsx
- Storage: `uploads/` directory (diskStorage)

**Status**: ✅ **WORKING**

---

### ✅ CORS (IMPLEMENTED):
- All localhost origins allowed with dynamic checking
- Credentials: true
- Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS

**Backend File**: `src/app.js`  
**Status**: ✅ **WORKING**

---

### ✅ Security (IMPLEMENTED):
- Helmet.js: Security headers
- Express Rate Limit: 100 requests per 15 minutes per IP
- bcrypt: Password hashing (User model)
- JWT: Token-based authentication

**Status**: ✅ **WORKING**

---

### ✅ WebSocket (IMPLEMENTED):
- Namespace: `/`
- Port: 10000 (same as HTTP server)
- Room strategy: `user:${userId}` for targeted broadcasts
- Events: notification, user:join

**Backend File**: `src/sockets/index.js`, `server.js`  
**Status**: ✅ **WORKING** (client connected successfully)

---

### ✅ Database (IMPLEMENTED):
- MongoDB Atlas: blkgrnapi.q07j1.mongodb.net
- Database: ElevareDB
- Connection timeout: 10 seconds
- Connection checks: All controllers verify readyState

**Backend File**: `src/config/database.js`  
**Status**: ✅ **WORKING**

---

### Date Format:
Use ISO 8601: `2025-11-06T14:30:00.000Z` (Mongoose handles this automatically)

---

## 🎯 15. IMPLEMENTATION STATUS

### ✅ Phase 1 (Critical - COMPLETED):
1. ✅ Authentication APIs (login, register, me, logout, forgot/reset password)
2. ✅ Agent Dashboard API
3. ✅ Landlord Dashboard API
4. ✅ Manager Dashboard API

### ✅ Phase 2 (High - COMPLETED):
5. ✅ Leads APIs (full CRUD)
6. ✅ Calls APIs (full CRUD + feedback)
7. ✅ Properties APIs (full CRUD)
8. ✅ Payments APIs (full CRUD)

### ✅ Phase 3 (Medium - COMPLETED):
9. ✅ Mood Tracking APIs (CRUD + analysis)
10. ✅ Tasks APIs (CRUD + resolve)
11. ✅ Documents APIs (CRUD + upload)
12. ✅ Users APIs (full CRUD)
13. ✅ Notifications APIs (service functions)

### ✅ Phase 4 (Low - COMPLETED):
14. ✅ WebSocket implementation (Socket.io with user rooms)
15. ✅ Security middleware (auth, roleCheck, validation, errorHandler)
16. ✅ File upload middleware (Multer)
17. ✅ Services (email, AI, analytics, notifications)

---

## 📊 16. API ENDPOINT SUMMARY

**Total Endpoints**: 50+

**By Category**:
- Authentication: 6 endpoints (login, register, me, logout, forgot, reset)
- Dashboard: 3 endpoints (agent, landlord, manager)
- Leads: 5 endpoints (CRUD + list)
- Calls: 6 endpoints (CRUD + feedback + list)
- Moods: 4 endpoints (CRUD + daily + weekly)
- Tasks: 5 endpoints (CRUD + resolve)
- Properties: 5 endpoints (CRUD + list)
- Payments: 5 endpoints (CRUD + list)
- Documents: 6 endpoints (CRUD + upload + list)
- Users: 5 endpoints (CRUD + list)
- Notifications: Service functions (internal)

**All endpoints use**: `/api/v1` prefix

---

## 📞 CONTACT & QUESTIONS

Kung may tanong or clarification needed sa:
- Data structures
- API endpoints
- Response formats
- WebSocket events
- Backend implementation

**Just ask!** This document is the contract between frontend and backend. 🤝

---

**Last Updated**: January 15, 2025  
**Backend Version**: 1.0.0 (FULLY IMPLEMENTED)  
**Backend Status**: ✅ **WORKING** - Server running on port 10000, MongoDB connected  
**Frontend Target**: Integration ready
