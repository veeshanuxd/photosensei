#!/bin/bash

# Ensure local Node bin is in PATH
export PATH="$HOME/.local/node/bin:$PATH"

echo "=== PhotoSensei Cloudflare Pages Deployer ==="

# Step 1: Run production build
echo "Step 1: Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
  echo "ERROR: Build failed. Aborting deployment."
  exit 1
fi

echo "Build successful!"

npx wrangler pages deploy dist --project-name photosensei --force
