# MCP Taint Analyzer - SaaS Platform

A professional-grade vulnerability scanner for AI agents and applications, powered by MCP (Model Context Protocol) with integrated Pyre type checking and Pysa taint analysis.

## 🎯 Platform Features

### Core Scanning Tools
- **MCP AST Analysis**: Parse and analyze Abstract Syntax Trees
- **Pyre Type Checking**: Advanced Python type safety verification
- **Pysa Taint Analysis**: Detect security vulnerabilities through data flow analysis

### User Features
- **Dashboard**: Real-time analytics with charts and metrics
- **Scanner**: Drag-and-drop file upload with progress tracking
- **Documentation**: Comprehensive guides for all tools
- **Account Settings**: Profile, security, billing, and API key management
- **Pricing & Plans**: Free (3 scans/month), Pro (unlimited), and Enterprise tiers
- **Payments**: Stripe integration for secure payment processing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB connection string
- NextAuth.js credentials
- Stripe API keys (for payments)

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd vulnerability_scanner_for_ai_agents
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (.env.local):
```
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Email Service (Resend)
RESEND_API_KEY=your-resend-key

# Stripe Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication pages (login, signup)
│   └── (web-app)/           # Main application pages
│       ├── user-dashboard/  # Dashboard with analytics
│       ├── scanner/         # File upload & scanning
│       ├── docs/            # Documentation pages
│       ├── payments/        # Pricing page
│       ├── checkout/        # Payment processing
│       └── account-settings/# User settings
├── components/              # Reusable React components
├── lib/                     # Utilities and helpers
├── constants/               # App constants and routes
├── models/                  # MongoDB schemas (User, Subscription, Scan)
├── hooks/                   # React hooks
└── styles/                  # Global styles
```

## 🎨 Design System

**Color Palette**: Professional solid colors only
- Primary: Black (#000000)
- Secondary: White (#ffffff)
- Neutral: Grays (#e5e7eb, #d1d5db, #666666)
- No gradients, no blue colors

**Components**:
- Built with Radix UI primitives
- Styled with Tailwind CSS v4
- Form handling with React Hook Form + Zod

## 📊 Key Pages

### Dashboard (`/user/user-dashboard`)
- 4 metric cards (Total Scans, Issues/Scan, Critical Issues, Scans Remaining)
- Line chart for trends
- Bar chart for severity distribution
- Recent scans table

### Scanner (`/scanner`)
- Drag-and-drop file upload
- Three-stage progress visualization:
  - MCP AST Analysis
  - Pyre Type Checking
  - Pysa Taint Analysis
- Results display with issue counts
- Animated progress indicator

### Documentation (`/docs`)
- Sidebar navigation
- Pages: Scanner, Pyre Testing, Pysa Testing, AST Analysis
- Getting Started guides
- Best practices

### Account Settings (`/account-settings`)
- General: Profile information, timezone, notifications
- Security: Password change with visibility toggle, 2FA, active sessions
- Billing: Plan info, payment method, billing history
- API Keys: API key generation and management

### Payments (`/payments`)
- Pricing comparison (Free, Pro, Enterprise)
- Feature lists for each tier
- FAQ section
- "Upgrade Now" call-to-action

### Checkout (`/checkout`)
- Plan and billing cycle selection
- Order summary with discounts
- Payment form with Stripe integration
- Success confirmation page

## 🔐 Authentication

Uses NextAuth.js v4 with:
- Session-based authentication
- Protected routes with `useUserGuard` hook
- Sign in/Sign up pages
- Password hashing with bcrypt

## 💳 Payment Integration

**Stripe Integration** for Pro and Enterprise plans:
- Test card: `4242 4242 4242 4242`
- Monthly and yearly billing cycles
- 10% discount for annual subscriptions
- Automatic subscription management

## 📈 Analytics & Visualizations

Uses Recharts for:
- Line charts (trends over time)
- Bar charts (distribution analysis)
- Responsive design
- Custom tooltips and legends

## 🛠️ Building & Deployment

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 📚 Documentation

For detailed guides and API documentation, visit the [Docs](/docs) section in the application.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
