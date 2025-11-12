# Application Deployment Guide (Vue + Vercel Functions)

## Overview

This guide provides step-by-step instructions for deploying the Vue-based application on Vercel, including the API functions.

## Prerequisites

Before deploying, ensure you have:

- A Vercel account
- A GitHub repository containing the Vue project and API functions
- Vercel CLI installed (optional for manual deployment)
- Node.js 16+ installed locally
- Firebase configured

## Initial Setup (One-Time Configuration)

### Connect Vercel to the Repository

1. Go to Vercel Dashboard → Click New Project

2. Select your Git repository

3. Click Import

### Configure Vercel Build Settings

1. Framework Preset: `Vue.js`

2. Build Command: `npm run build`

3. Output Directory: `dist`

4. Install Command: `npm install`

5. Development Command (optional): `npm run dev`

### API Functions Setup

1. Ensure the API functions are inside the `api/` directory within the Vue app.

2. Vercel automatically detects and deploys functions from this directory.

3. Click Deploy.

## Deploying Updates

### Automatic Deployment (Recommended)

1. Push changes to the main branch. Vercel automatically detects changes and redeploys.

2. Manual Deployment (Using Vercel CLI)

  - Install Vercel CLI (if not installed):

```
npm install -g vercel
```

  - Deploy manually:

```
vercel --prod
```

## Rollback Strategy

If a deployment fails or introduces issues:

- Go to the Vercel Dashboard

- Select the last working deployment and click Revert

- Alternatively, redeploy a previous version:
```
vercel --prod --force
```

## Environment Variables

To configure environment variables:

1. Go to Vercel Project Settings → Environment Variables

2. Add [variables](./env-vars.md)

3. Re-deploy for changes to take effect

## Monitoring & Logs

- Use the Vercel Dashboard to view deployment logs and function execution logs

## Post-Deployment Checklist

✅ Verify the deployment URL

✅ Check API function responses

✅ Ensure environment variables are correctly applied