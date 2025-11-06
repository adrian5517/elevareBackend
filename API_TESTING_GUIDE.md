# API ENDPOINTS TESTING GUIDE
## Elevare Intelligence - Complete API Testing Documentation

---

## 📋 TABLE OF CONTENTS
1. [Setup Instructions](#setup-instructions)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Dashboard Endpoints](#dashboard-endpoints)
4. [Leads Management](#leads-management)
5. [Calls Management](#calls-management)
6. [Mood Tracking](#mood-tracking)
7. [Properties Management](#properties-management)
8. [Tasks Management](#tasks-management)
9. [Payments Management](#payments-management)
10. [Documents Management](#documents-management)
11. [Testing Tools](#testing-tools)

---

## 🚀 SETUP INSTRUCTIONS

### Prerequisites
1. **Backend server running**: http://localhost:10000
2. **MongoDB connected**: Check health endpoint
3. **Testing tool**: Postman, Thunder Client, or curl

### Quick Health Check
```bash
# Test if backend is running
curl http://localhost:10000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-06T02:22:42.465Z"
}
```

---

## 🔐 AUTHENTICATION ENDPOINTS

Base URL: `http://localhost:10000/api/v1/auth`

### 1. Register User
**Endpoint:** `POST /auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "Juan Dela Cruz",
  "email": "juan@elevare.com",
  "password": "password123",
  "role": "agent"
}
```

**Available Roles:**
- `agent` - Sales agent
- `manager` - Team manager
- `landlord` - Property owner
- `property-manager` - Property manager
- `ceo` - Chief Executive Officer
- `admin` - System administrator

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "673a1234567890abcdef1234",
    "fullName": "Juan Dela Cruz",
    "email": "juan@elevare.com",
    "role": "agent",
    "createdAt": "2025-11-06T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

**Instructions:**
1. Copy the entire JSON from "Request Body"
2. In Postman: POST → Body → raw → JSON → Paste
3. Click "Send"
4. **IMPORTANT:** Copy the `token` from response - need mo ito sa ibang endpoints!

---

### 2. Login User
**Endpoint:** `POST /auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "juan@elevare.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "673a1234567890abcdef1234",
    "fullName": "Juan Dela Cruz",
    "email": "juan@elevare.com",
    "role": "agent",
    "lastLogin": "2025-11-06T10:35:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Instructions:**
1. Use the email and password from registration
2. POST → Body → raw → JSON
3. **SAVE THE TOKEN** - ilagay sa Authorization header ng next requests

---

### 3. Get Current User
**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "673a1234567890abcdef1234",
    "fullName": "Juan Dela Cruz",
    "email": "juan@elevare.com",
    "role": "agent",
    "createdAt": "2025-11-06T10:30:00.000Z"
  }
}
```

**Instructions:**
1. GET request
2. Headers → Add: `Authorization: Bearer <paste token here>`
3. Replace `<paste token here>` with actual token from login

---

### 4. Logout
**Endpoint:** `GET /auth/logout`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 5. Forgot Password
**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "juan@elevare.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Reset email sent"
}
```

---

### 6. Reset Password
**Endpoint:** `PUT /auth/reset-password/:resetToken`

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 📊 DASHBOARD ENDPOINTS

**IMPORTANT:** All dashboard endpoints require authentication!

Base URL: `http://localhost:10000/api/v1/dashboard`

**Headers for ALL requests:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### 1. Get Agent Dashboard
**Endpoint:** `GET /dashboard/agent`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "activeLeads": 0,
    "pendingTasks": 0,
    "todayCalls": 0,
    "progress": 0,
    "recentMoodEntry": null
  }
}
```

**Instructions:**
1. GET request
2. Make sure naka-login ka as **agent** role
3. Add Authorization header with token

---

### 2. Get Landlord Dashboard
**Endpoint:** `GET /dashboard/landlord`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalProperties": 0,
    "occupiedUnits": 0,
    "vacantUnits": 0,
    "monthlyIncome": 0,
    "pendingPayments": 0,
    "upcomingRenewals": 0,
    "maintenanceRequests": 0
  }
}
```

**Instructions:**
1. Register/login as **landlord** role
2. GET request with Authorization header

---

### 3. Get Manager Dashboard
**Endpoint:** `GET /dashboard/manager`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "teamAgents": 0,
    "totalLeads": 0,
    "conversionRate": 0,
    "pendingReviews": 0
  }
}
```

**Instructions:**
1. Register/login as **manager** role
2. GET request with Authorization header

---

## 👥 LEADS MANAGEMENT

Base URL: `http://localhost:10000/api/v1/leads`

**All requests require Authorization header!**

### 1. Get All Leads
**Endpoint:** `GET /leads`

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "673a1234567890abcdef1234",
      "fullName": "Maria Santos",
      "email": "maria@example.com",
      "phone": "09171234567",
      "status": "new",
      "source": "facebook",
      "agent": "673a1234567890abcdef1111",
      "createdAt": "2025-11-06T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Create New Lead
**Endpoint:** `POST /leads`

**Request Body:**
```json
{
  "fullName": "Maria Santos",
  "email": "maria@example.com",
  "phone": "09171234567",
  "source": "facebook",
  "propertyType": "house",
  "location": "Quezon City",
  "budget": 5000000,
  "urgency": "high",
  "notes": "Looking for 3-bedroom house near schools"
}
```

**Field Explanations:**
- `fullName` (required) - Full name ng lead
- `email` (required) - Email address
- `phone` (optional) - Contact number
- `source` (optional) - Saan galing: "facebook", "website", "referral", "cold-call"
- `propertyType` (optional) - "house", "condo", "lot", "apartment"
- `location` (optional) - Desired location
- `budget` (optional) - Budget in pesos
- `urgency` (optional) - "low", "medium", "high"
- `notes` (optional) - Additional notes

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "673a1234567890abcdef5678",
    "fullName": "Maria Santos",
    "email": "maria@example.com",
    "phone": "09171234567",
    "status": "new",
    "source": "facebook",
    "propertyType": "house",
    "location": "Quezon City",
    "budget": 5000000,
    "agent": "673a1234567890abcdef1111",
    "createdAt": "2025-11-06T11:00:00.000Z"
  }
}
```

**Instructions:**
1. POST request
2. Body → raw → JSON → Paste request body
3. Modify the values as needed
4. Add Authorization header

---

### 3. Get Single Lead
**Endpoint:** `GET /leads/:id`

**Example:** `GET /leads/673a1234567890abcdef5678`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "673a1234567890abcdef5678",
    "fullName": "Maria Santos",
    "email": "maria@example.com",
    "agent": {
      "_id": "673a1234567890abcdef1111",
      "fullName": "Juan Dela Cruz"
    }
  }
}
```

**Instructions:**
1. Get the `_id` from "Get All Leads" or "Create Lead" response
2. Replace `:id` in URL with actual ID
3. GET request with Authorization header

---

### 4. Update Lead
**Endpoint:** `PUT /leads/:id`

**Request Body:**
```json
{
  "status": "contacted",
  "notes": "Called client, scheduled viewing next week"
}
```

**Status Options:**
- `new` - Bagong lead
- `contacted` - Na-contact na
- `qualified` - Qualified buyer
- `negotiating` - Nag-negotiate
- `won` - Successfully closed
- `lost` - Hindi nag-push through

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "673a1234567890abcdef5678",
    "status": "contacted",
    "notes": "Called client, scheduled viewing next week"
  }
}
```

---

### 5. Delete Lead
**Endpoint:** `DELETE /leads/:id`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Lead deleted"
}
```

---

## 📞 CALLS MANAGEMENT

Base URL: `http://localhost:10000/api/v1/calls`

### 1. Get All Calls
**Endpoint:** `GET /calls`

**Success Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "673a1234567890abcdef9999",
      "lead": "673a1234567890abcdef5678",
      "agent": "673a1234567890abcdef1111",
      "duration": 300,
      "outcome": "successful",
      "callDate": "2025-11-06T14:00:00.000Z"
    }
  ]
}
```

---

### 2. Create Call Record
**Endpoint:** `POST /calls`

**Request Body:**
```json
{
  "lead": "673a1234567890abcdef5678",
  "duration": 300,
  "outcome": "successful",
  "recordingUrl": "https://example.com/recording.mp3",
  "transcription": "Hello, this is Juan from Elevare...",
  "notes": "Client is interested in Quezon City properties"
}
```

**Field Explanations:**
- `lead` (required) - Lead ID na tinawagan
- `duration` (optional) - Duration in seconds
- `outcome` (optional) - "successful", "no-answer", "busy", "follow-up-needed"
- `recordingUrl` (optional) - Link to call recording
- `transcription` (optional) - Text transcript ng call
- `notes` (optional) - Additional notes

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "673a1234567890abcdef9999",
    "lead": "673a1234567890abcdef5678",
    "agent": "673a1234567890abcdef1111",
    "duration": 300,
    "outcome": "successful",
    "callDate": "2025-11-06T14:00:00.000Z"
  }
}
```

---

### 3. Add Coach Feedback (Manager Only)
**Endpoint:** `POST /calls/:id/feedback`

**Request Body:**
```json
{
  "feedback": "Great rapport building! Work on closing techniques.",
  "rating": 8,
  "strengths": ["Good listening", "Clear communication"],
  "improvements": ["Need to ask more qualifying questions"],
  "correctiveScripts": ["Try: 'What's your timeline for moving?'"]
}
```

**Instructions:**
1. Must be logged in as **manager** or **coach** role
2. POST request
3. Replace `:id` with call ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "673a1234567890abcdef9999",
    "coachFeedback": {
      "coachId": "673a1234567890abcdef2222",
      "feedback": "Great rapport building!",
      "rating": 8
    }
  }
}
```

---

## 😊 MOOD TRACKING

Base URL: `http://localhost:10000/api/v1/moods`

### 1. Get All Mood Entries
**Endpoint:** `GET /moods`

**Success Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "673a1234567890abcdef7777",
      "agent": "673a1234567890abcdef1111",
      "entryType": "daily-check-in",
      "mood": 8,
      "energy": 7,
      "focus": 9,
      "confidence": 8,
      "date": "2025-11-06T08:00:00.000Z"
    }
  ]
}
```

---

### 2. Create Mood Entry
**Endpoint:** `POST /moods`

**Request Body:**
```json
{
  "entryType": "daily-check-in",
  "mood": 8,
  "energy": 7,
  "focus": 9,
  "confidence": 8,
  "notes": "Feeling great today! Ready to close deals!"
}
```

**Field Explanations:**
- `entryType` (required) - "daily-check-in", "pre-call", "post-call", "weekly-review"
- `mood` (required) - Scale 1-10
- `energy` (required) - Scale 1-10
- `focus` (required) - Scale 1-10
- `confidence` (required) - Scale 1-10
- `notes` (optional) - Additional thoughts

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "673a1234567890abcdef7777",
    "entryType": "daily-check-in",
    "mood": 8,
    "energy": 7,
    "focus": 9,
    "confidence": 8,
    "date": "2025-11-06T08:00:00.000Z"
  }
}
```

---

### 3. Get Daily Analysis
**Endpoint:** `GET /moods/daily-analysis`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "entryType": "daily-check-in",
      "mood": 8,
      "energy": 7,
      "date": "2025-11-06T08:00:00.000Z"
    }
  ]
}
```

---

### 4. Get Weekly Trends
**Endpoint:** `GET /moods/weekly-trends`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-11-01",
      "mood": 7,
      "energy": 8
    },
    {
      "date": "2025-11-02",
      "mood": 8,
      "energy": 7
    }
  ]
}
```

---

## 🏠 PROPERTIES MANAGEMENT

Base URL: `http://localhost:10000/api/v1/properties`

### 1. Get All Properties
**Endpoint:** `GET /properties`

**Success Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "673a1234567890abcdef8888",
      "title": "3BR House in Quezon City",
      "type": "house",
      "status": "available",
      "price": 5000000,
      "landlord": "673a1234567890abcdef3333"
    }
  ]
}
```

---

### 2. Create Property
**Endpoint:** `POST /properties`

**Request Body:**
```json
{
  "title": "3BR House in Quezon City",
  "description": "Beautiful house with garden",
  "type": "house",
  "status": "available",
  "price": 5000000,
  "location": {
    "address": "123 Main St",
    "city": "Quezon City",
    "province": "Metro Manila",
    "zipCode": "1100"
  },
  "bedrooms": 3,
  "bathrooms": 2,
  "floorArea": 120,
  "lotArea": 200,
  "amenities": ["Garden", "Garage", "WiFi"]
}
```

**Instructions:**
1. Must be logged in as **landlord** or **property-manager**
2. POST request with Authorization header

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "673a1234567890abcdef8888",
    "title": "3BR House in Quezon City",
    "type": "house",
    "price": 5000000
  }
}
```

---

## ✅ TASKS MANAGEMENT

Base URL: `http://localhost:10000/api/v1/tasks`

### 1. Get All Tasks
**Endpoint:** `GET /tasks`

**Success Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "673a1234567890abcdef6666",
      "title": "Follow up with Maria Santos",
      "description": "Schedule property viewing",
      "priority": "high",
      "status": "pending",
      "dueDate": "2025-11-07T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Create Task
**Endpoint:** `POST /tasks`

**Request Body:**
```json
{
  "title": "Follow up with Maria Santos",
  "description": "Schedule property viewing for next week",
  "priority": "high",
  "dueDate": "2025-11-07T10:00:00.000Z",
  "assignedTo": "673a1234567890abcdef1111"
}
```

**Field Explanations:**
- `title` (required) - Task title
- `description` (optional) - Detailed description
- `priority` (optional) - "low", "medium", "high"
- `dueDate` (optional) - Deadline in ISO format
- `assignedTo` (optional) - User ID to assign

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "673a1234567890abcdef6666",
    "title": "Follow up with Maria Santos",
    "status": "pending"
  }
}
```

---

### 3. Update Task
**Endpoint:** `PUT /tasks/:id`

**Request Body:**
```json
{
  "status": "in-progress",
  "notes": "Called client, confirmed viewing tomorrow"
}
```

---

### 4. Resolve Task
**Endpoint:** `PUT /tasks/:id/resolve`

**Request Body:**
```json
{
  "response": "Successfully scheduled viewing for Nov 7 at 2pm"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "673a1234567890abcdef6666",
    "status": "completed",
    "resolvedAt": "2025-11-06T15:00:00.000Z"
  }
}
```

---

## 💰 PAYMENTS MANAGEMENT

Base URL: `http://localhost:10000/api/v1/payments`

### 1. Get All Payments
**Endpoint:** `GET /payments`

**Success Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "673a1234567890abcdef4444",
      "property": "673a1234567890abcdef8888",
      "amount": 25000,
      "status": "paid",
      "paymentDate": "2025-11-01T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Create Payment
**Endpoint:** `POST /payments`

**Request Body:**
```json
{
  "property": "673a1234567890abcdef8888",
  "tenant": "673a1234567890abcdef5555",
  "amount": 25000,
  "paymentType": "rent",
  "paymentMethod": "bank-transfer",
  "status": "paid",
  "paymentDate": "2025-11-01T10:00:00.000Z",
  "notes": "Monthly rent for November 2025"
}
```

**Field Explanations:**
- `property` (required) - Property ID
- `tenant` (optional) - Tenant user ID
- `amount` (required) - Amount in pesos
- `paymentType` (optional) - "rent", "deposit", "maintenance"
- `paymentMethod` (optional) - "cash", "bank-transfer", "gcash", "check"
- `status` (optional) - "pending", "paid", "overdue"

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "673a1234567890abcdef4444",
    "amount": 25000,
    "status": "paid"
  }
}
```

---

## 📁 DOCUMENTS MANAGEMENT

Base URL: `http://localhost:10000/api/v1/documents`

### 1. Get All Documents
**Endpoint:** `GET /documents`

**Success Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "673a1234567890abcdef3333",
      "fileName": "contract.pdf",
      "fileUrl": "/uploads/contract-123456789.pdf",
      "fileType": "contract",
      "owner": "673a1234567890abcdef1111"
    }
  ]
}
```

---

### 2. Upload Document
**Endpoint:** `POST /documents`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data
```

**Form Data:**
- `file` - (File) The actual file to upload
- `fileType` - (Text) "contract", "id", "financial", "property-doc"
- `property` - (Text) Property ID (optional)
- `expiryDate` - (Text) ISO date (optional)
- `notes` - (Text) Additional notes (optional)

**Instructions:**
1. In Postman: POST → Body → form-data
2. Add key `file` → Type: File → Select file
3. Add key `fileType` → Type: Text → Value: "contract"
4. Add Authorization header

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "673a1234567890abcdef3333",
    "fileName": "contract.pdf",
    "fileUrl": "/uploads/contract-123456789.pdf"
  }
}
```

---

## 🧪 TESTING WORKFLOW

### Step 1: Register & Login
```bash
1. POST /auth/register
   - Create agent account
   - Save the token

2. POST /auth/login  
   - Login with created account
   - Save new token (use this for all requests)
```

### Step 2: Test Dashboard
```bash
3. GET /dashboard/agent
   - Should return empty stats initially
   - Verify authentication works
```

### Step 3: Create Test Data
```bash
4. POST /leads
   - Create 2-3 leads
   - Note the lead IDs

5. POST /calls
   - Create call records for leads
   - Use lead IDs from step 4

6. POST /moods
   - Create mood entry
   - Check dashboard updates

7. POST /tasks
   - Create tasks
   - Check dashboard stats
```

### Step 4: Verify Dashboard Updates
```bash
8. GET /dashboard/agent
   - Should show updated counts
   - activeLeads: 2-3
   - todayCalls: 1+
   - pendingTasks: 1+
```

### Step 5: Test Updates
```bash
9. PUT /leads/:id
   - Update lead status

10. PUT /tasks/:id/resolve
    - Mark task as complete

11. GET /dashboard/agent
    - Verify stats updated
```

---

## 🛠️ TESTING TOOLS

### Option 1: Postman (Recommended)
1. Download: https://www.postman.com/downloads/
2. Create new Collection: "Elevare API"
3. Add environment variable: `BASE_URL` = `http://localhost:10000/api/v1`
4. Add environment variable: `TOKEN` = (paste after login)
5. Use `{{BASE_URL}}` and `{{TOKEN}}` in requests

### Option 2: VS Code Thunder Client
1. Install: Thunder Client extension
2. Create new request
3. Set Authorization header automatically
4. Save requests in collections

### Option 3: cURL (Command Line)
```bash
# Register
curl -X POST http://localhost:10000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Juan Dela Cruz","email":"juan@elevare.com","password":"password123","role":"agent"}'

# Login
curl -X POST http://localhost:10000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@elevare.com","password":"password123"}'

# Get Dashboard (replace TOKEN)
curl -X GET http://localhost:10000/api/v1/dashboard/agent \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 COMMON ERRORS & SOLUTIONS

### Error: "jwt malformed"
**Solution:** Token format mali. Dapat: `Bearer <actual_token>`

### Error: "User not found"
**Solution:** Register muna before login

### Error: "Not authorized"
**Solution:** 
1. Check if naka-login ka
2. Check if token valid pa (not expired)
3. Check if Authorization header correct

### Error: "Validation error"
**Solution:** Check required fields sa request body

### Error: "CORS error"
**Solution:** Backend CORS already configured for localhost

---

## ✅ COMPLETE TEST CHECKLIST

### Authentication
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Token received and saved
- [ ] Can access protected routes with token
- [ ] Can get current user info
- [ ] Can logout

### Dashboard
- [ ] Agent dashboard returns data
- [ ] Stats show correct counts
- [ ] Dashboard updates when data changes

### Leads
- [ ] Can create new lead
- [ ] Can get all leads
- [ ] Can get single lead
- [ ] Can update lead status
- [ ] Can delete lead

### Calls
- [ ] Can create call record
- [ ] Can get all calls
- [ ] Manager can add feedback

### Moods
- [ ] Can create mood entry
- [ ] Can get all entries
- [ ] Can get daily analysis
- [ ] Can get weekly trends

### Properties
- [ ] Landlord can create property
- [ ] Can get all properties
- [ ] Can update property

### Tasks
- [ ] Can create task
- [ ] Can update task
- [ ] Can resolve task
- [ ] Can delete task

### Payments
- [ ] Can create payment record
- [ ] Can get all payments
- [ ] Can update payment status

### Documents
- [ ] Can upload document
- [ ] Can get all documents
- [ ] Can download document

---

## 🎯 QUICK START SCRIPT

Sundin ang order na ito para sa complete test:

```
1. POST /auth/register (agent)
2. POST /auth/login (save token)
3. GET /auth/me
4. GET /dashboard/agent
5. POST /leads (create 2 leads)
6. POST /calls (1 call record)
7. POST /moods (1 mood entry)
8. POST /tasks (1 task)
9. GET /dashboard/agent (verify updated stats)
10. PUT /leads/:id (update lead status)
11. GET /leads (verify changes)
```

---

**Testing guide complete! Follow step-by-step para ma-test lahat ng endpoints!** 🚀✅
