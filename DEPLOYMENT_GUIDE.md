# 🚀 Deployment Guide: CampusCompass AI

This guide provides step-by-step instructions for deploying **CampusCompass AI** to production using **Neon PostgreSQL** and **Vercel**, including setting up **Google OAuth**.

---

## 💎 Step 1: Set Up Neon Serverless PostgreSQL

1.  **Register/Log in**: Go to **[neon.tech](https://neon.tech)** and create a free account.
2.  **Create a New Project**:
    *   Name: `CampusCompass`
    *   Database Version: `PostgreSQL 16`
    *   Region: Choose the region closest to your target audience (e.g., `Singapore (ap-southeast-1)` or `N. Virginia (us-east-1)`).
3.  **Retrieve Connection Token**:
    *   In your Neon console dashboard, copy your **Connection String**.
    *   Make sure to select **pooled** connection options if using serverless environments.
    *   It will look like this:
        ```text
        postgresql://neondb_owner:PASSWORD@ep-glowing-snowflake-a1xyz.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
        ```
    *   Keep this string safe! You will paste this as the `DATABASE_URL` in Vercel and your `.env` file.

---

## 🔑 Step 2: Set Up Google OAuth Credentials

To enable Google sign-in:

1.  **Google Cloud Console**: Go to the **[Google Cloud Console](https://console.cloud.google.com/)**.
2.  **Create Project**: Select or create a project named `CampusCompass`.
3.  **OAuth Consent Screen**:
    *   Configure the OAuth Consent Screen. Select **External** user type.
    *   Fill in basic application metadata (App name: `CampusCompass AI`, Support email).
4.  **Create Credentials**:
    *   Go to the **Credentials** page.
    *   Click **+ Create Credentials** and select **OAuth client ID**.
    *   Application Type: **Web application**.
    *   **Authorized JavaScript origins**:
        *   Local development: `http://localhost:3000`
        *   Production: `https://<your-vercel-domain>.vercel.app`
    *   **Authorized redirect URIs**:
        *   Local development: `http://localhost:3000/api/auth/callback/google`
        *   Production: `https://<your-vercel-domain>.vercel.app/api/auth/callback/google`
5.  **Save Credentials**: Copy the **Client ID** and **Client Secret**. Paste these into your environment configuration.

---

## ⚙️ Step 3: Environment Variables Checklist

Ensure these variables are set in your local `.env` file and added under the **Vercel Project Settings > Environment Variables** tab:

```bash
# 1. Prisma Connection Target (from Neon DB dashboard)
DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-xxxxxx.neon.tech/neondb?sslmode=require"

# 2. NextAuth Secret (generate a strong random string)
# You can generate one via terminal: openssl rand -base64 32
NEXTAUTH_SECRET="your-super-strong-jwt-secret-key"

# 3. NextAuth Canonical Domain URL
# Local: http://localhost:3000
# Production: https://your-app-domain.vercel.app
NEXTAUTH_URL="http://localhost:3000"

# 4. Google OAuth Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
```

---

## 🛠️ Step 4: Host on Vercel

1.  **Sign in to Vercel**: Head to **[vercel.com](https://vercel.com/)** and link your GitHub account.
2.  **Add New Project**:
    *   Click **Add New > Project**.
    *   Find your **`CollegeCompass-AI`** repository and click **Import**.
3.  **Build Settings**:
    *   Framework Preset: **Next.js**.
    *   Root Directory: `./`.
    *   Build Command: `next build` (Next.js automatically handles server rendering bundling).
4.  **Add Environment Variables**:
    *   Expand the **Environment Variables** panel and add each item from the checklist above.
5.  **Click Deploy**: Wait 1-2 minutes for the compilation to complete.

---

## 🗃️ Step 5: Migrate and Seed Live Database

Once Vercel gives you your production domain, run the database migrations and populate the live PostgreSQL database from your local machine:

```bash
# 1. Temporarily replace local DATABASE_URL with the Neon live string in your local .env, then:

# 2. Push structural database tables up to the Neon DB
npx prisma db push

# 3. Run seeder script to populate universities, placement charts, and student reviews
npx tsx prisma/seed.ts
```

---

## 🩺 Step 6: Troubleshooting Deployment Errors

### 1. Prisma Client Initialization Mismatch
*   **Error**: `Prisma Client could not locate the system engine...` or `PrismaClient has not been generated yet.`
*   **Fix**: Vercel automatically detects Prisma during the build command, but to guarantee generation, you can update the build script in `package.json` to generate the client explicitly before compiling:
    `"build": "prisma generate && next build"`

### 2. Google OAuth Redirect URI Mismatch
*   **Error**: Google authentication shows a screen saying `Error 400: redirect_uri_mismatch`.
*   **Fix**: Double check that the redirect URL registered in your Google API Credentials page matches exactly with your Vercel address. Ensure there is no trailing slash:
    `https://your-domain.vercel.app/api/auth/callback/google`

### 3. Infinite Redirect Loops on Vercel Sign-In
*   **Error**: Authenticated users encounter redirection loops when logging in on Vercel.
*   **Fix**: Verify that you set the environment variable `NEXTAUTH_URL` on Vercel to match the **HTTPS production domain** instead of `http://localhost:3000`.
