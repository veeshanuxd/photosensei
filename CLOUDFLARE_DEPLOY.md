# Cloudflare Pages Deployment Guide

This guide outlines how to build and deploy the PhotoSensei React application to Cloudflare Pages.

## Prerequisites
1.  **Cloudflare Account**: Ensure you have an active Cloudflare account.
2.  **Node.js**: Verify that Node.js and npm are accessible in your environment.

## Deployment Options

### Option A: Automated CLI Deployment (Wrangler)
You can deploy directly from your local terminal using Cloudflare's Wrangler CLI.

1.  **Install Wrangler**: Ensure Wrangler is installed locally by running `npm install -D wrangler`.
2.  **Authenticate CLI**: Login to your Cloudflare account with `npx wrangler login`.
3.  **Run Build**: Compile the production assets with `npm run build` to generate the `dist/` output folder.
4.  **Deploy Command**: Run `npx wrangler pages deploy dist` to push your assets to a live Cloudflare pages subdomain.

### Option B: Git-Integrated Continuous Deployment
To deploy automatically whenever you push code updates to a repository:

1.  **Push Code**: Commit your changes and push the project to a GitHub or GitLab repository.
2.  **Create Pages Project**: Navigate to the Cloudflare Dashboard, select **Workers & Pages**, and click **Create application**.
3.  **Connect Git**: Under the **Pages** tab, select **Connect to Git** and choose your PhotoSensei repository.
4.  **Configure Build Settings**: Use the following settings:
    *   **Framework preset**: `Vite`
    *   **Build command**: `npm run build`
    *   **Build output directory**: `dist`
5.  **Save & Deploy**: Click **Save and Deploy**. Cloudflare will compile and host your app on every git commit.
