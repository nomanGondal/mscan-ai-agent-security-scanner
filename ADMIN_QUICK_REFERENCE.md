# Admin System - Quick Reference

## Access Admin Panel
1. Navigate to `/admin/dashboard` (requires admin role)
2. Use sidebar navigation to access:
   - **Dashboard**: Overview and statistics
   - **Users**: Manage users and limits
   - **Payments**: Track subscriptions
   - **Analytics**: View trends and insights

## Admin API Endpoints Summary

### Overview
```bash
GET /api/admin
# Returns: totalUsers, totalAdmins, totalScans, activeSubscriptions, recentScans
```

### Users
```bash
# List users (paginated, searchable)
GET /api/admin/users?page=1&limit=10&search=query&role=user

# Get user details with statistics
GET /api/admin/users/:id

# Update user data or limits
PUT /api/admin/users
# Body: { userId, userData, accountData }

# Update specific user limits
PUT /api/admin/users/:id
# Body: { reportsLimit, plan, subscriptionStatus, isActive }

# Delete user
DELETE /api/admin/users?userId=:id
```

### Payments
```bash
# List subscriptions (filterable by status)
GET /api/admin/payments?page=1&limit=10&status=active
# Returns: subscriptions with user info, stats breakdown
```

### Analytics
```bash
# Get comprehensive analytics
GET /api/admin/analytics
# Returns: totalScans, completedScans, failedScans, activeUsers, severitySummary, topFiles, topVulnerabilities

# Get chart data
GET /api/admin/charts?type=scans-trend&days=30
# Available types:
# - scans-trend: daily completed/failed counts
# - severity-distribution: pie chart data
# - user-growth: daily new users + cumulative
# - scan-status: scan status breakdown
```

## Component Usage

### In Pages
```typescript
// /admin/dashboard
import { AdminDashboard } from "@/ui"
export default () => <AdminDashboard />

// /admin/users
import { UsersManagement } from "@/ui"
export default () => <UsersManagement />

// /admin/payments
import { PaymentsManager } from "@/ui"
export default () => <PaymentsManager />

// /admin/analytics
import { AnalyticsDashboard } from "@/ui"
export default () => <AnalyticsDashboard />
```

### Service Usage
```typescript
import { getUsers, getUserDetails, updateUserLimits, getPayments, getAnalytics, getChartData } from "@/services/admin"

// Fetch users
const response = await getUsers(1, 10, "search term")

// Get user details
const user = await getUserDetails(userId)

// Update user limits
await updateUserLimits(userId, { reportsLimit: 100, isActive: true })

// Get payments
const payments = await getPayments(1, 10, "active")

// Get analytics
const analytics = await getAnalytics()

// Get chart data
const scansTrend = await getChartData("scans-trend", 30)
```

## Data Models

### User Response
```javascript
{
  _id: string,
  username: string,
  email: string,
  fullName: string,
  role: "admin" | "user",
  isActive: boolean,
  createdAt: date,
  account: {
    plan: "free" | "pro" | "enterprise",
    reportsLimit: number,
    reportsUsed: number,
    subscriptionStatus: "active" | "past_due" | "cancelled" | "none",
    stripeCustomerId?: string,
  }
}
```

### Analytics Response
```javascript
{
  overview: {
    totalScans: number,
    completedScans: number,
    failedScans: number,
    successRate: string, // percentage
    activeUsers: number,
  },
  severitySummary: {
    critical: number,
    high: number,
    medium: number,
    low: number,
  },
  topFiles: [{ _id: filename, count: number }],
  topVulnerabilities: [{ _id: type, count: number, severity: string }],
  scansBySource: [{ _id: source, count: number }],
}
```

### Chart Data Response
```javascript
// scans-trend
[{ date: "2026-01-01", total: 10, completed: 8, failed: 2 }]

// severity-distribution
[{ name: "Critical", value: 5, percentage: 10, color: "#7F1D1D" }]

// user-growth
[{ date: "2026-01-01", newUsers: 2, totalUsers: 100 }]

// scan-status
[{ status: "completed", count: 100 }]
```

## Common Tasks

### Search for a user
1. Go to `/admin/users`
2. Type in search box (searches username, email, fullName)
3. Results filter in real-time

### Edit user limits
1. Go to `/admin/users`
2. Click eye icon on user row
3. Click "Edit User" button
4. Change report limit
5. Toggle active status if needed
6. Click "Save Changes"

### View payment status
1. Go to `/admin/payments`
2. Filter by status if needed
3. View subscription details

### Export analytics
- 30/14/7/90-day trends available
- Charts export via browser (right-click save)
- Table data can be copied

## Middleware & Auth

The admin routes are protected by:
1. NextAuth session check
2. Admin role verification in middleware
3. Additional checks on API endpoints

Non-admin users trying to access `/admin/*` are redirected to `/unauthorized`

## Troubleshooting

### "Forbidden - Admin access required"
- Ensure user has `role: "admin"`
- Check NextAuth session
- Verify middleware configuration

### Charts not loading
- Check browser console for errors
- Ensure MongoDB aggregation pipelines are correct
- Verify date parameters in requests

### Pagination not working
- Check query parameters (page, limit)
- Ensure MongoDB count queries are working
- Verify skip/limit calculation

## Performance Tips

1. Use pagination - limit to 10-50 items per page
2. Search is case-insensitive and indexed
3. Analytics queries use aggregation pipelines
4. Charts data is fetched with 7/14/30/90 day ranges
5. Consider caching analytics for high traffic

## Security Notes

✅ Admin endpoints verify role on every request
✅ Passwords never returned in API responses
✅ Cannot delete your own admin account
✅ Stripe IDs are partially masked in UI
✅ All user data is protected by authentication
