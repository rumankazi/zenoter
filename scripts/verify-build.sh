#!/usr/bin/env bash
# Verify build artifacts are generated correctly
# This script checks if the build process produces all necessary files

set -e

COLOR_RED='\033[0;31m'
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_BLUE='\033[0;34m'
COLOR_RESET='\033[0m'

echo -e "${COLOR_BLUE}🔍 Verifying build artifacts...${COLOR_RESET}"

# Check if we should run this (only on release-related changes)
CHANGED_FILES=$(git diff --cached --name-only 2>/dev/null || echo "")

# Skip if no package.json, electron files, or workflow changes
if ! echo "$CHANGED_FILES" | grep -qE "(package\.json|electron/|\.github/workflows/release\.yml|src/)"; then
  echo -e "${COLOR_YELLOW}ℹ️  No build-related changes detected, skipping verification${COLOR_RESET}"
  exit 0
fi

echo -e "${COLOR_BLUE}📦 Running build to verify artifacts...${COLOR_RESET}"

# Clean previous build
rm -rf dist/ dist-electron/

# Run the build
if ! pnpm build > /dev/null 2>&1; then
  echo -e "${COLOR_RED}❌ Build failed!${COLOR_RESET}"
  echo "Run 'pnpm build' to see detailed error"
  exit 1
fi

echo -e "${COLOR_GREEN}✓ Build completed successfully${COLOR_RESET}"

# Verify dist-electron exists
if [ ! -d "dist-electron/main" ] || [ ! -d "dist-electron/preload" ]; then
  echo -e "${COLOR_RED}❌ dist-electron/ directory not created properly${COLOR_RESET}"
  exit 1
fi

echo -e "${COLOR_GREEN}✓ Electron files compiled${COLOR_RESET}"

# Verify main entry points exist
if [ ! -f "dist-electron/main/index.js" ]; then
  echo -e "${COLOR_RED}❌ Main process file not found: dist-electron/main/index.js${COLOR_RESET}"
  exit 1
fi

if [ ! -f "dist-electron/preload/index.js" ]; then
  echo -e "${COLOR_RED}❌ Preload file not found: dist-electron/preload/index.js${COLOR_RESET}"
  exit 1
fi

echo -e "${COLOR_GREEN}✓ Electron entry points verified${COLOR_RESET}"

# Verify dist/ (Vite output) exists
if [ ! -d "dist" ]; then
  echo -e "${COLOR_RED}❌ dist/ directory not created${COLOR_RESET}"
  exit 1
fi

if [ ! -f "dist/index.html" ]; then
  echo -e "${COLOR_RED}❌ index.html not found in dist/${COLOR_RESET}"
  exit 1
fi

echo -e "${COLOR_GREEN}✓ Frontend build verified${COLOR_RESET}"

# Check if we should test electron-builder (only for release workflow changes)
if echo "$CHANGED_FILES" | grep -q "\.github/workflows/release\.yml"; then
  echo -e "${COLOR_YELLOW}⚠️  Release workflow changed - you may want to test: pnpm dist:win${COLOR_RESET}"
fi

echo -e "${COLOR_GREEN}✅ All build artifacts verified successfully!${COLOR_RESET}"
