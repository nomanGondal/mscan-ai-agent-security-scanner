# Vulnerability Scanner for AI Agents

A web platform for analyzing AI-agent and application code for security issues. The Next.js application provides user accounts, scan workflows, findings, and administrative dashboards; analysis is performed by a separately hosted scanner API.

## Live:https://www.mscan.me/

## Features

- **Code scanning:** Submit ZIP archives, model/code input, or GitHub repository URLs to the scanner service.
- **Multiple analysis stages:** Display findings from AST checks, Pyre type analysis, and Pysa taint analysis.
- **Actionable results:** Review findings by severity, file, and analysis stage, including source locations and any available recommendations or code snippets.
- **Demo scans:** Explore the results interface without submitting a repository.
- **Scan history and dashboards:** Review completed scans, account usage, and scan metrics.
- **Accounts and access control:** Register and verify accounts, sign in with credentials or Google, and recover passwords. Admin pages provide user, payment-record, and analytics views.
- **Plans and usage limits:** Free accounts are provisioned with a three-ZIP-scan limit; GitHub scanning is available to accounts with GitHub access enabled.

> **Analysis service is separate:** This repository contains the web application, not the scanner API implementation. Scanning requires a compatible API reachable from the user's browser. The web app expects the routes documented in [Scanner service configuration](#scanner-service-configuration).

## Technology

- Next.js 16 App Router, React 19, and TypeScript
- Tailwind CSS, Radix UI, and Recharts
- MongoDB with Mongoose
- NextAuth.js for authentication
- Resend for email delivery
- Cloudinary for profile-image hosting

## Requirements

- Node.js 20.9 or newer
- pnpm
- A MongoDB database
- A running scanner API for scan operations

Google OAuth, email delivery, image hosting, and the optional AI-powered endpoints require their respective provider credentials.

## Getting started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env.local` file in the project root. At minimum, configure the database and NextAuth secret:

   ```dotenv
   MONGODB_URI=mongodb://127.0.0.1:27017/vulnerability_scanner
   NEXTAUTH_SECRET=replace-with-a-long-random-secret
   ```

   `MONGO_URI` is also accepted as an alternative to `MONGODB_URI`.

3. Configure integrations as needed:

   ```dotenv
   # Google sign-in
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=

   # Scanner API base URL. Defaults to http://localhost:8000
   NEXT_PUBLIC_SCANNER_API=http://localhost:8000

   # Email delivery (verification, recovery, and scan completion emails)
   RESEND_API_KEY=

   # Profile image uploads
   CLOUDINARY_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=

   # Optional AI-backed endpoints
   GROQ_API_KEY=

   # Optional contact form endpoint
   NEXT_PUBLIC_FORMSPREE=
   ```

   Keep secret values out of source control. `.env*` files are ignored by Git; use your deployment platform's secret manager in production. Google credentials are needed to use Google sign-in, while the scanner URL is needed for scan operations.

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Scanner service configuration

The web client uses `NEXT_PUBLIC_SCANNER_API` as the **base URL** of the scanner service. If it is not set, the application uses `http://localhost:8000`. The service is expected to provide:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/scan/health` | Scanner readiness check |
| `POST` | `/api/v1/scan/scan_zip` | Analyze a ZIP archive |
| `POST` | `/api/v1/scan/scan_model` | Analyze model or code input |
| `POST` | `/api/v1/scan/scan_github` | Analyze a GitHub repository |

Because the browser calls this service directly, it must be network-accessible to the browser and allow cross-origin requests from the web application's origin. A healthy web app does not imply that the scanner service is running; use the scanner health indicator to check its availability.

## Main application areas

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/auth`, `/registration`, `/verify-code`, `/forgot-password` | Authentication and account recovery |
| `/scanner` | ZIP, model/code, GitHub, and demo scan workflows |
| `/dashboard`, `/user/user-dashboard`, `/history` | Scan dashboards and history |
| `/docs` | Scanner, AST, Pyre, and Pysa guides |
| `/account-settings`, `/account-settings/subscription` | Account and subscription settings |
| `/pricing`, `/payments`, `/checkout` | Plans and checkout interface |
| `/admin/dashboard`, `/admin/users`, `/admin/analytics`, `/admin/payments` | Admin dashboards and management |

## Project structure

```text
src/
├── app/            # Next.js pages, layouts, and API route handlers
│   ├── (auth)/     # Registration, sign-in, verification, and recovery
│   ├── (web-app)/  # Scanner, dashboards, docs, settings, and admin pages
│   └── api/        # Authentication, scans, accounts, and analytics APIs
├── actions/        # Application and scanner API endpoint definitions
├── components/     # Shared UI components
├── config/         # Third-party service configuration
├── entities/       # Mongoose user, account, and scan models
├── services/       # Client-side service integrations
├── ui/             # Feature-level user interfaces
├── schemas/        # Form and request validation schemas
└── lib/            # Database and shared utilities
```

## Development commands

```bash
pnpm dev      # Start the local development server
pnpm lint     # Run ESLint
pnpm build    # Build the production application
pnpm start    # Serve the production build (run pnpm build first)
```

The repository does not currently define a test script.

## Troubleshooting

- **Database connection errors:** Check that MongoDB is running and `MONGODB_URI` (or `MONGO_URI`) is correct.
- **Authentication configuration errors:** Set `NEXTAUTH_SECRET`; configure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` when enabling Google sign-in.
- **Scanner unavailable:** Start the scanner API, set `NEXT_PUBLIC_SCANNER_API` to its reachable base URL, and ensure its CORS policy permits the frontend origin.
- **Email or upload features fail:** Check the corresponding Resend or Cloudinary credentials.

## Contributing

1. Create a feature branch.
2. Install dependencies with `pnpm install`.
3. Run `pnpm lint` and `pnpm build` before opening a pull request.
4. Describe the change and include relevant screenshots for UI updates.
