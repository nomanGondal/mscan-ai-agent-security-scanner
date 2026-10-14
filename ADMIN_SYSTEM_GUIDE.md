# Admin System - Complete Implementation Guide

## Overview

This comprehensive admin system allows administrators to manage users, subscriptions, payments, and view detailed analytics about the vulnerability scanner platform.

## Key Features

### 1. **Admin Dashboard** (`/admin/dashboard`)
- Real-time statistics overview
- Active subscriptions count
- Total scans performed
- System admins count
- Vulnerability severity distribution pie chart
- 30-day scan trend analysis
- Top vulnerabilities list
- Scan completion/failure rates

### 2. **Users Management** (`/admin/users`)
- View all users with pagination
- Search users by username, email, or full name
- Filter by role and status
- View detailed user information:
  - Username, email, full name
  - Account plan and subscription status
  - Report limit and usage
  - Account creation date
- **Actions:**
  - Edit user details and report limits
  - Activate/deactivate user accounts
  - Delete users (with confirmation)
  - View per-user scan statistics

### 3. **Payments & Subscriptions** (`/admin/payments`)
- Monitor all subscription statuses
- View payment history
- Filter by subscription status (active, past due, cancelled)
- Plan breakdown analytics
- Stripe customer ID tracking
- Subscription end dates
- **Statistics:**
  - Total active subscriptions
  - Past due subscriptions
  - Cancelled subscriptions
  - Revenue by plan

### 4. **Analytics & Insights** (`/admin/analytics`)
- 30, 14, 7, and 90-day trend analysis
- **Charts:**
  - Scans trend (completed vs failed)
  - User growth over time
  - Daily breakdown table
- **Data:**
  - Most vulnerable files
  - Vulnerability severity distribution
  - Scan success rates
  - User engagement metrics

## API Endpoints

### Dashboard
- `GET /api/admin` - Get dashboard overview with stats

### Users Management
- `GET /api/admin/users?page=1&limit=10&search=query` - List users with pagination
- `GET /api/admin/users/:id` - Get detailed user information
- `PUT /api/admin/users` - Update user data and limits
- `PUT /api/admin/users/:id` - Update user limits or status
- `DELETE /api/admin/users?userId=:id` - Delete a user

### Payments
- `GET /api/admin/payments?page=1&limit=10&status=active` - List subscriptions

### Analytics
- `GET /api/admin/analytics` - Get comprehensive analytics data

### Charts
- `GET /api/admin/charts?type=scans-trend&days=30` - Scans trend data
- `GET /api/admin/charts?type=severity-distribution&days=30` - Severity breakdown
- `GET /api/admin/charts?type=user-growth&days=30` - User growth data
- `GET /api/admin/charts?type=scan-status&days=30` - Scan status breakdown

## Components

### UI Components
1. **AdminDashboard** - Main dashboard with stats and charts
2. **UsersManagement** - User list with search, filter, and actions
3. **PaymentsManager** - Subscription and payment management
4. **AnalyticsDashboard** - Advanced analytics with charts
5. **AdminNav** - Sidebar navigation for admin pages

### Services
- **admin.ts** - Centralized API client for all admin endpoints

## Security

✅ **Admin-Only Access**
- Middleware checks for admin role on all `/admin` routes
- All API endpoints verify admin authentication
- Cannot delete own account
- Password changes restricted to account owner

✅ **Data Protection**
- Passwords never returned in API responses
- Stripe IDs partially masked
- Secure session management via NextAuth

## Design System

### Colors (No Gradients)
- Primary: Blue (#2563EB)
- Success: Green (#16A34A)
- Warning: Orange (#EA580C)
- Danger: Red (#DC2626)
- Critical: Dark Red (#7F1D1D)
- Background: Gray (#F3F4F6)

### Typography
- Large Headings: 28-48px, semibold
- Section Titles: 20px, bold
- Body: 14-16px, regular
- Small Text: 12px, regular

### Spacing
- Container: max-w-7xl (1280px)
- Padding: 6px (24px), 8px (32px)
- Gap: 4px (16px), 6px (24px)

## Database Aggregations

### User Statistics
```javascript
// Count users by role, status
// Get recent scans per user
// Calculate usage percentages
```

### Payment Analytics
```javascript
// Group subscriptions by plan
// Count by subscription status
// Extract Stripe customer data
```

### Scan Analytics
```javascript
// Sum vulnerabilities by severity
// Group by scan source and status
// Calculate success rates
// Identify top vulnerable files
```

## Time Series Data

The analytics system provides 7, 14, 30, and 90-day trends:
- Daily new users count
- Cumulative user growth
- Scans completed/failed per day
- Vulnerability severity breakdown over time

## Usage Examples

### Creating Admin User (via script or manual)
```javascript
const user = await UserModel.create({
  username: "admin",
  email: "admin@example.com",
  password: "secure-password",
  fullName: "Admin User",
  role: "admin", // Set role to admin
  isUserVerified: true,
});
```

### Fetching User Statistics
```javascript
// API call
const response = await fetch("/api/admin/users/userId");
const { data } = await response.json();
// Returns user info, account details, and scan statistics
```

### Updating User Limits
```javascript
// API call
const response = await fetch("/api/admin/users", {
  method: "PUT",
  body: JSON.stringify({
    userId: "userId",
    accountData: {
      reportsLimit: 100, // New limit
    },
  }),
});
```

## Performance Optimizations

- ✅ Pagination on user and payment lists
- ✅ Lazy loading of chart data
- ✅ Aggregation pipelines for analytics
- ✅ Index suggestions:
  - User.role
  - Account.subscriptionStatus
  - Scan.createdAt
  - Scan.user

## Error Handling

- 401: Unauthorized (not logged in)
- 403: Forbidden (not an admin)
- 404: Resource not found
- 400: Bad request (invalid parameters)
- 500: Server error

## Future Enhancements

1. **User Management**
   - Bulk user operations
   - User import/export
   - Role assignment UI
   - Activity logs

2. **Analytics**
   - Custom date range selection
   - Export reports (PDF/CSV)
   - Email digest scheduling
   - Anomaly detection

3. **Payments**
   - Refund management
   - Invoice generation
   - Revenue forecasting
   - Coupon management

4. **System**
   - Admin audit logs
   - Settings/configuration page
   - Backup management
   - Integration webhooks

## Navigation Structure

```
/admin/
├── /dashboard     # Main overview
├── /users        # User management
├── /payments     # Subscription management
└── /analytics    # Advanced analytics
```

## Testing Checklist

- [ ] Admin can view all users
- [ ] Admin can search and filter users
- [ ] Admin can edit user limits
- [ ] Admin can deactivate user accounts
- [ ] Admin can view payment status
- [ ] Admin can filter payments by status
- [ ] Analytics charts load correctly
- [ ] Charts respond to date range changes
- [ ] User statistics are accurate
- [ ] Non-admin users cannot access /admin routes
- [ ] Deletion requires confirmation
- [ ] API responses paginate correctly
