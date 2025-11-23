#!/bin/bash

# Build the frontend with Vite
npm run build

# Compile TypeScript server code
npx esbuild \
  server/index.ts \
  server/routes.ts \
  server/groq.ts \
  server/storage.ts \
  server/vite.ts \
  shared/schema.ts \
  --bundle \
  --platform=node \
  --target=node20 \
  --external:express \
  --external:multer \
  --external:dotenv \
  --external:openai \
  --outdir=dist/server \
  --tsconfig=tsconfig.json
