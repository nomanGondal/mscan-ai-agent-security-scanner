# MCP Taint Analyzer - Complete Platform Setup & Feature Guide

## 📋 Table of Contents
1. [Platform Overview](#platform-overview)
2. [Installation & Setup](#installation--setup)
3. [Feature Guide](#feature-guide)
4. [API Integration](#api-integration)
5. [Database Schema](#database-schema)
6. [Stripe Payment Setup](#stripe-payment-setup)
7. [Troubleshooting](#troubleshooting)

---

## Platform Overview

The MCP Taint Analyzer is a modern SaaS platform built with Next.js 16, featuring:

### User Roles
- **Free Users**: 3 scans/month, basic features
- **Pro Users**: Unlimited scans, API access, priority support
- **Enterprise Users**: Custom limits, dedicated support

### Core Technology Stack
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with solid color palette (black/white/gray)
- **Components**: Radix UI primitives
- **Database**: MongoDB with Mongoose
- **Auth**: NextAuth.js v4
- **Payments**: Stripe
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

---

## Installation & Setup

### 1. Environment Variables

Create `.env.local` with:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-secret-key

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taint-analyzer

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Email (Resend)
RESEND_API_KEY=re_xxxxx

# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Install Dependencies

```bash
npm install
```

Key packages added:
- `@stripe/react-stripe-js` ^2.4.0
- `@stripe/stripe-js` ^3.0.0
- `recharts` ^2.15.4
- `next-auth` ^4.24.13

### 3. Database Setup

1. Create MongoDB Atlas cluster or use local MongoDB
2. Create database: `taint-analyzer`
3. Update `MONGODB_URI` in `.env.local`

### 4. Stripe Setup

1. Create Stripe account at https://stripe.com
2. Get API keys from Dashboard → API Keys
3. Add to `.env.local`:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (publishable key)
   - `STRIPE_SECRET_KEY` (secret key)
4. Set webhook endpoint for payment confirmations

### 5. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Feature Guide

### 🏠 Dashboard (`/user/user-dashboard`)

**Purpose**: Overview of scanning activity and metrics

**Key Components**:
- **Metric Cards** (4 cards):
  - Total Scans: 15
  - Avg Issues/Scan: 4.2
  - Critical Issues: 3
  - Scans Remaining: 2/3 (with progress bar)

- **Charts**:
  - Scans & Issues Trend (LineChart): Last 6 months
  - Issues by Severity (BarChart): Critical/High/Medium/Low

- **Recent Scans Table**:
  - Columns: Project, Issues Found, Critical, Date, Status
  - 3 sample scans shown
  - Clickable for details

**Data Source**: Mock data (replace with API calls to `/api/scans`)

**Code Location**: `src/ui/user-dashboard/components/section-one.tsx`

---

### 🔍 Scanner (`/scanner`)

**Purpose**: Upload files and run taint analysis

**Features**:
1. **File Upload Section**
   - Drag-and-drop area
   - File browser button
   - Selected file display
   - Clear button

2. **Scanning Progress** (3 stages)
   - MCP AST Analysis
   - Pyre Type Checking
   - Pysa Taint Analysis
   - Animated dots during scanning
   - Progress bar (0-100%)
   - Stage checkmarks

3. **Results Display**
   - Total Issues
   - Critical Issues
   - High Issues
   - Medium/Low Issues
   - "Scan Another Project" button

4. **Tool Info Cards**
   - MCP AST: "Parses code into abstract syntax trees"
   - Pyre: "Performs type checking and analysis"
   - Pysa: "Detects taint flows and vulnerabilities"

**State Management**:
```typescript
const [scanning, setScan] = useState(false)
const [selectedFile, setSelectedFile] = useState<File | null>(null)
const [progress, setProgress] = useState(0)
```

**Code Location**: `src/app/(web-app)/scanner/page.tsx`

---

### 📚 Documentation (`/docs`)

**Purpose**: Comprehensive guides for using all tools

**Structure**:
- Sidebar with fixed navigation (w-64)
- Main content area with prose formatting
- Active state tracking using `usePathname`

**Pages**:
1. **Main** (`/docs`)
   - Getting Started
   - Installation
   - Quick Start
   - Best Practices

2. **Scanner** (`/docs/scanner`)
   - How It Works
   - Supported Formats
   - Configuration
   - Limitations

3. **Pyre Testing** (`/docs/pyre-testing`)
   - What is Pyre
   - How It Works
   - Common Issues
   - Tips & Tricks

4. **Pysa Testing** (`/docs/pysa-testing`)
   - What is Pysa
   - Sources and Sinks
   - Vulnerabilities Detected
   - Custom Rules

5. **AST Testing** (`/docs/ast-testing`)
   - What is AST
   - MCP-Specific Patterns
   - Common Issues
   - Best Practices

**Code Location**: `src/app/(web-app)/docs/`

---

### ⚙️ Account Settings (`/account-settings`)

**Purpose**: User account management

**4 Tabs**:

#### 1. General Tab
- First Name, Last Name, Email
- Company Name
- Timezone dropdown
- Email Notifications checkboxes
- Save Changes button

#### 2. Security Tab
- **Change Password**:
  - Current Password (with Show/Hide toggle)
  - New Password (with Show/Hide toggle + validation message)
  - Confirm Password
  - Update Password button

- **Two-Factor Authentication**:
  - Enable 2FA button
  - Status display

- **Active Sessions**:
  - Current session info
  - Last active timestamp
  - Sign Out button

#### 3. Billing Tab
- **Current Plan**:
  - Plan name "Free Plan"
  - Description "3 scans per month"
  - Status badge (Active)
  - Scans Used progress bar (2/3)
  - "Upgrade to Pro" button

- **Payment Method**:
  - "No payment method on file"
  - "Add Payment Method" button

- **Billing History**:
  - Empty state: "No invoices yet"

#### 4. API Keys Tab
- "Generate New API Key" button
- Empty state: "No API keys yet"
- (Ready for listing and management)

**State Management**:
```typescript
const [activeTab, setActiveTab] = useState("general")
const [passwordVisible, setPasswordVisible] = useState(false)
const [newPasswordVisible, setNewPasswordVisible] = useState(false)
```

**Code Location**: `src/app/(web-app)/account-settings/page.tsx`

---

### 💰 Payments (`/payments`)

**Purpose**: Show pricing and conversion to premium plans

**Sections**:

#### Pricing Tiers
3 plans displayed as cards:

1. **Free** (Current)
   - $0 / Forever
   - 3 scans per month
   - Basic analysis
   - Community support
   - Email reports
   - 7 days scan history

2. **Pro** (Most Popular - highlighted)
   - $99 / per month
   - Unlimited scans
   - Advanced analysis
   - Priority support
   - API access
   - Unlimited history
   - Custom integrations
   - Slack notifications

3. **Enterprise**
   - Custom pricing
   - Everything in Pro
   - Dedicated manager
   - Custom rules
   - SLA guarantees
   - On-premise option
   - Team features
   - Advanced reporting

**Call-to-Action**:
- "Current Plan" (Free users)
- "Upgrade to Pro" (button)
- "Contact Sales" (Enterprise)

#### FAQ Section
6 common questions with answers:
- Plan changes
- Data on downgrade
- Refund policy
- Contract terms
- Annual discounts
- Payment methods

#### Bottom CTA
- "Ready to get started?" heading
- "Upgrade Now" button
- "Contact sales" link

**Code Location**: `src/app/(web-app)/payments/page.tsx`

---

### 🛒 Checkout (`/checkout`)

**Purpose**: Securely process Stripe payments

**Layout**: 3-column grid (summary + form)

#### Order Summary (Sidebar)
- **Plan Selection Radio**: Pro or Enterprise
- **Billing Cycle Toggle**: Monthly or Yearly
- **Price Calculation**:
  - Pro: $99 monthly, $990 yearly (save $99)
  - Enterprise: $299 monthly, $2990 yearly (save $299)
- **Price Breakdown**:
  - Subtotal
  - Discount (if annual)
  - Total

#### Payment Form (Main)
**Billing Information**:
- Full Name (required)
- Email Address (required)

**Payment Information**:
- Card Number (required, 16 digits)
  - Test card: 4242 4242 4242 4242
- Expiry Date (MM/YY)
- CVV (3-4 digits)

**Terms Agreement**:
- Checkbox for Terms/Privacy Policy acceptance

**Submit Button**:
- "Pay $XX" button
- Shows loading state during processing
- Security badge: "🔒 Processed securely by Stripe"

#### Success Page
Shown after successful payment:
- Green checkmark icon
- "Payment Successful!" heading
- Order summary
- Feature list
- "Go to Dashboard" button

**State Management**:
```typescript
const [selectedPlan, setSelectedPlan] = useState("pro")
const [billingCycle, setBillingCycle] = useState("monthly")
const [processing, setProcessing] = useState(false)
const [orderComplete, setOrderComplete] = useState(false)
const [cardInfo, setCardInfo] = useState({...})
```

**Code Location**: `src/app/(web-app)/checkout/page.tsx`

---

### 🧭 Navigation Header

**Location**: `src/components/dashboard-header.tsx`

**Components**:
- **Left**: Logo "MCP Taint Analyzer"
- **Center**: Navigation Links
  - Dashboard
  - Scanner
  - Docs
  - Pricing
- **Right**: User Avatar Dropdown
  - User name/email
  - Profile
  - Account Settings
  - Billing
  - Sign Out

**Styling**: White background, gray border, solid colors

---

## API Integration

### Current Status
Pages use **mock data**. To integrate with real API:

### Required Endpoints

#### 1. Scan Operations
```
POST /api/scans
- Upload file
- Run analysis
- Return scan ID

GET /api/scans/:id
- Retrieve scan results
- Return issues array

GET /api/scans
- List all scans
- With pagination
```

#### 2. User Endpoints
```
GET /api/user/profile
- Get user info

PUT /api/user/profile
- Update profile

GET /api/user/subscription
- Get subscription status

POST /api/user/password
- Update password
```

#### 3. Payment Endpoints
```
POST /api/payments/checkout
- Create Stripe checkout session

GET /api/payments/invoice
- Get billing history

POST /api/payments/cancel
- Cancel subscription
```

### Implementation Steps

1. Replace mock data in pages with API calls using `fetch` or `axios`
2. Add loading states with `useState`
3. Add error handling with try-catch
4. Cache responses with React Query (optional)
5. Handle authentication with NextAuth session

---

## Database Schema

### User Model
```typescript
{
  _id: ObjectId
  email: string (unique)
  firstName: string
  lastName: string
  passwordHash: string
  profileImage?: string
  createdAt: Date
  updatedAt: Date
}
```

### Subscription Model
```typescript
{
  _id: ObjectId
  userId: ObjectId (ref: User)
  plan: "free" | "pro" | "enterprise"
  status: "active" | "canceled" | "trialing"
  scanLimit: number
  scanUsed: number
  billingCycle: "monthly" | "yearly"
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  createdAt: Date
  updatedAt: Date
}
```

### Scan Model
```typescript
{
  _id: ObjectId
  userId: ObjectId (ref: User)
  fileName: string
  fileSize: number
  uploadedAt: Date
  analyzedAt?: Date
  issues: {
    severity: "critical" | "high" | "medium" | "low"
    type: string
    description: string
    line: number
    column: number
  }[]
  status: "uploaded" | "analyzing" | "completed" | "failed"
  duration: number (milliseconds)
}
```

---

## Stripe Payment Setup

### Webhook Integration

Create endpoint at `/api/webhooks/stripe`:

```typescript
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")!

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    // Update user subscription in database
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
```

### Testing Stripe Integration

1. Use Stripe CLI for local testing:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

2. Test with test card: `4242 4242 4242 4242`
3. Future date for expiry (e.g., 12/25)
4. Any CVC (e.g., 123)

---

## Troubleshooting

### Common Issues

#### 1. Password Visibility Toggle Not Working
**Solution**: Ensure `useState` for `passwordVisible` is properly managed:
```typescript
const [passwordVisible, setPasswordVisible] = useState(false)
```

#### 2. Charts Not Displaying
**Solution**: Verify Recharts installation:
```bash
npm install recharts
```

#### 3. Navigation Links Not Active
**Solution**: Check `usePathname()` hook in dashboard-header:
```typescript
import { usePathname } from "next/navigation"
const pathname = usePathname()
```

#### 4. Stripe Payment Failing
**Solution**:
- Verify API keys in `.env.local`
- Check webhook configuration
- Test with `4242 4242 4242 4242`

#### 5. Database Connection Error
**Solution**:
- Verify MongoDB URI format
- Check IP whitelist in MongoDB Atlas
- Test connection string

---

## Next Steps

1. ✅ Complete setup with environment variables
2. ✅ Test all pages locally
3. ⏳ Integrate with backend API endpoints
4. ⏳ Set up Stripe webhooks
5. ⏳ Deploy to production
6. ⏳ Monitor with analytics

---

## Support

For issues or questions:
- Check `/docs` section in app
- Review code comments
- Contact: support@example.com
