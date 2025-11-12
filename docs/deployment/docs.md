# Application Deployment Guide (VitePress + Vercel)

## Overview

This guide provides step-by-step instructions for deploying a VitePress-based documentation site on Vercel. It covers setup, configuration, deployment, and maintenance.

## Prerequisites

Before deploying, ensure you have:

- A **Vercel account** (https://vercel.com/)
- A **GitHub, GitLab, or Bitbucket repository** containing your VitePress project
- **Vercel CLI** installed (optional for manual deployment)
- Node.js 16+ installed locally

## Initial Setup (One-Time Configuration)
###  Create a VitePress Project (If Not Already Set Up)
```sh
npm create vitepress@latest my-docs
cd my-docs
npm install
```
Commit and push the project to your Git repository:
```sh
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Connect Vercel to Your Repository
1. Go to **Vercel Dashboard** → Click **New Project**
2. Select your **Git repository**
3. Click **Import**

### Configure Vercel Build Settings
- **Framework Preset**: `Other` (VitePress is not listed, but it works)
- **Build Command**: `vitepress build`
- **Output Directory**: `.vitepress/dist`
- **Install Command**: `npm install`
- **Development Command** (optional): `vitepress dev`

Click **Deploy**.

## Deploying Updates
### Automatic Deployment (Recommended)
1. Push changes to the main branch:
   ```sh
   git add .
   git commit -m "Update docs"
   git push origin main
   ```
2. Vercel automatically detects the changes and deploys the latest version.
3. The live site URL is available in the Vercel dashboard.

### Manual Deployment (Using Vercel CLI)
1. Install Vercel CLI (if not installed):
   ```sh
   npm install -g vercel
   ```
2. Deploy manually:
   ```sh
   vercel --prod
   ```
   This deploys the site to production.

## Rollback Strategy
If a deployment fails or introduces issues:
- Go to the Vercel Dashboard
- Select the last working deployment and click **Revert**
- Alternatively, redeploy a previous version:
  ```sh
  vercel --prod --force
  ```

## Environment Variables (If Needed)
If your documentation requires environment variables:
1. Go to **Vercel Project Settings → Environment Variables**
2. Add variables as needed (e.g., `API_KEY`)
3. Re-deploy for changes to take effect

## Monitoring & Logs
- Use the **Vercel Dashboard** to view deployment logs and analytics
- Run locally for debugging:
  ```sh
  vitepress dev
  ```

## Post-Deployment Checklist
- ✅ Verify the deployment URL
- ✅ Check site functionality and broken links
- ✅ Ensure environment variables are correctly applied
